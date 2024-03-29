import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

import { parseEther } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";

import IERC20 from "../../abis/IERC20.json";
import ChainPing from "../../abis/ChainPing.json";
import { useOneInch } from "../swaphooks/useOneInch";
import { ChainIdDetails } from "../../utils/data/network";
import { decreasePowerByDecimals } from "../../utils/helper";
import IStarGateRouter from "../../abis/IStarGateRouter.json";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { findGasUsedBySimulation, calculateFees, chooseChianId } from "../../utils/helper";
import { getContractInstance, getErc20Allownace } from "../../utils/web3Libs/ethers";
import { _functionType, _nonce, BYTES_ZERO, ZERO_ADDRESS } from "../../utils/data/constants";
import { nativeTokenFetcher, newChainPingByNetwork, starGateRouterByNetwork, tokensByNetworkForCC } from "../../utils/data/protocols";

export function useCCSendTx() {
    const { mutateAsync: oneInchSwap } = useOneInch();
    const { smartAccount, smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
        selectedToNetwork,
        setTxHash,
        selectedToProtocol,
        toTokensData,
        selectedToToken,
    }: iTrading = useTradingStore((state) => state);

    async function sendTxToChain({
        tokenIn,
        _amountIn,
        address,
        isSCW,
        params,
        isThisAmount,
        srcPoolId,
        destPoolId,
        fromChainId,
        toChainId,
        currentFunc,
        currentAbi,
        contractAddress,
        extraOrShareToken,
        tokenOutNum,
    }) {
        try {
            if (selectedToProtocol == "erc20") {
                const tokenOutName = selectedToToken;
                const nativeTokenOutAddress = toTokensData?.filter((token) => token.symbol === tokenOutName)[0].address;

                const _tempAmount = _amountIn;
                let _currentAddress;
                let _currentProvider;
                if (isSCW) {
                    _currentAddress = smartAccountAddress;
                    _currentProvider = smartAccount.provider;
                } else {
                    _currentAddress = address;
                    _currentProvider = smartAccount.provider;
                }

                const fromStarGateRouter = starGateRouterByNetwork[selectedFromNetwork.chainId];
                const toUsdc = tokensByNetworkForCC[selectedToNetwork.chainId].usdc;
                const toChainPing = newChainPingByNetwork[selectedToNetwork.chainId];

                setTxHash("");
                const abi = ethers.utils.defaultAbiCoder;

                const erc20TokenInInstance = await getContractInstance(tokenIn, IERC20, _currentProvider);
                if (!erc20TokenInInstance) return;

                let approveTx;
                const allowance = await getErc20Allownace(erc20TokenInInstance, _currentAddress, fromStarGateRouter);
                if (!BigNumber.from(allowance).gte(BigNumber.from(_tempAmount))) {
                    const approveData = await erc20TokenInInstance.populateTransaction.approve(
                        fromStarGateRouter,
                        _tempAmount
                    );
                    approveTx = { to: approveData.to, data: approveData.data };
                }
                const amountAfterSlippage = await calculateFees(
                    address,
                    _tempAmount,
                    srcPoolId,
                    destPoolId,
                    toChainId,
                    fromStarGateRouter,
                    _currentProvider
                );

                const isSwap =
                    tokensByNetworkForCC[selectedToNetwork.chainId].usdc === nativeTokenOutAddress ? false : true;

                let swapData;
                let amountOutAfterSlippage;
                if (isSwap) {
                    swapData = await oneInchSwap({
                        tokenIn: tokensByNetworkForCC[selectedToNetwork.chainId].usdc, //: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                        tokenOut: nativeTokenOutAddress, // nativeTokenOut, //: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                        amountIn: amountAfterSlippage, //: BigNumber.from('1000000'),
                        address: toChainPing, // recipient
                        type: "exactIn",
                        chainId: selectedToNetwork.chainId,
                    });
                    console.log("swapData?.amountOutprice", swapData?.amountOutprice.toString(), swapData);
                    amountOutAfterSlippage = BigNumber.from(swapData?.amountOutprice).sub(
                        BigNumber.from(swapData?.amountOutprice).mul("1000").div("1000000")
                    );
                }

                let data;
                if (toChainId == "106" || toChainId == "111" || toChainId == "184" || toChainId == "109") {
                    data = abi.encode(
                        ["bool", "address", "bytes", "uint256", "uint256", "address", "address", "address", "bytes"],
                        [
                            isSwap ? true : false,
                            isSwap ? nativeTokenOutAddress : ZERO_ADDRESS, // dai polygon
                            isSwap ? swapData?.swapTx.data : BYTES_ZERO,
                            BigNumber.from("0"),
                            isSwap ? amountOutAfterSlippage : amountAfterSlippage, //swapData?.amountOutprice,
                            ZERO_ADDRESS,
                            address,
                            ZERO_ADDRESS, // extraOrShareToken,
                            "0x",
                        ]
                    );
                } else {
                    data = abi.encode(
                        ["uint256", "uint256", "address", "address", "bytes"],
                        [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, ""]
                    );
                }

                const srcAddress = ethers.utils.solidityPack(["address"], [_currentAddress]);
                let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing);
                const stargateParams = [fromChainId, srcAddress, _nonce, toUsdc, amountAfterSlippage, data];
                const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData(
                    "sgReceive",
                    stargateParams
                );
                const erc20Interface = new ethers.utils.Interface([
                    "function transfer(address _account, uint256 _value)",
                ]);
                const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [
                    toChainPing,
                    amountAfterSlippage,
                ]);
                const gasUsed = await findGasUsedBySimulation(
                    toUsdc,
                    toChainPing,
                    dummmyTranferToCheckData,
                    encodedDataForChainPing,
                    false,
                    chooseChianId(toChainId)
                );

                const stargateRouter = await getContractInstance(fromStarGateRouter, IStarGateRouter, _currentProvider);
                if (!stargateRouter) return;

                console.log("gasUsed: ", gasUsed.toString());

                const lzParams = {
                    dstGasForCall: BigNumber.from(gasUsed).add(BigNumber.from("30000")),
                    dstNativeAmount: 0,
                    dstNativeAddr: "0x",
                };

                const packedToAddress = ethers.utils.solidityPack(["address"], [toChainPing]);
                let quoteData = await stargateRouter.quoteLayerZeroFee(
                    toChainId,
                    _functionType,
                    packedToAddress,
                    data,
                    lzParams
                );

                let stargateTx = await stargateRouter.populateTransaction.swap(
                    toChainId,
                    srcPoolId,
                    destPoolId,
                    _currentAddress,
                    _tempAmount,
                    0,
                    lzParams,
                    packedToAddress,
                    data,
                    { value: quoteData[0] }
                );

                const scwOrEoaNativeBalance = await _currentProvider.getBalance(_currentAddress);
                const currentBalance = BigNumber.from(scwOrEoaNativeBalance);
                const minimumBalanceRequired = await decreasePowerByDecimals(quoteData[0].toString(), 18);

                // Extra 1e18 should more as of now
                if (!currentBalance.gt(quoteData[0].add(parseEther("0")))) {
                    toast.error(
                        `${minimumBalanceRequired.toString()} ${
                            ChainIdDetails[selectedFromNetwork.chainId].gasFeesName
                        } in your SmartAccount wallet`
                    );
                    return;
                }

                const sendTx = { to: stargateTx.to, data: stargateTx.data, value: stargateTx.value };
                if (approveTx) {
                    return { txArray: [approveTx, sendTx], value: stargateTx.value };
                } else {
                    return { txArray: [sendTx], value: stargateTx.value };
                }
            } else {
                const nativeTokenOutAddress = nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].nativeToken;
                const _tempAmount = _amountIn;
                let _currentAddress;
                let _currentProvider;
                if (isSCW) {
                    _currentAddress = smartAccountAddress;
                    _currentProvider = smartAccount.provider;
                } else {
                    _currentAddress = address;
                    _currentProvider = smartAccount.provider;
                }

                const fromStarGateRouter = starGateRouterByNetwork[selectedFromNetwork.chainId];
                const toUsdc = tokensByNetworkForCC[selectedToNetwork.chainId].usdc;
                // const toChainPing = chainPingByNetwork[selectedToNetwork.chainId];
                const toChainPing = newChainPingByNetwork[selectedToNetwork.chainId];

                setTxHash("");
                const abi = ethers.utils.defaultAbiCoder;

                const erc20TokenInInstance = await getContractInstance(tokenIn, IERC20, _currentProvider);
                if (!erc20TokenInInstance) return;

                let approveTx;
                const allowance = await getErc20Allownace(erc20TokenInInstance, _currentAddress, fromStarGateRouter);
                if (!BigNumber.from(allowance).gte(BigNumber.from(_tempAmount))) {
                    const approveData = await erc20TokenInInstance.populateTransaction.approve(
                        fromStarGateRouter,
                        _tempAmount
                    );
                    approveTx = { to: approveData.to, data: approveData.data };
                }
                const amountAfterSlippage = await calculateFees(
                    address,
                    _tempAmount,
                    srcPoolId,
                    destPoolId,
                    toChainId,
                    fromStarGateRouter,
                    _currentProvider
                );

                const isSwap =
                    tokensByNetworkForCC[selectedToNetwork.chainId].usdc === nativeTokenOutAddress ? false : true;

                let swapData;
                let amountOutAfterSlippage;
                if (isSwap) {
                    swapData = await oneInchSwap({
                        tokenIn: tokensByNetworkForCC[selectedToNetwork.chainId].usdc, //: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                        tokenOut: nativeTokenOutAddress, // nativeTokenOut, //: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                        amountIn: amountAfterSlippage, //: BigNumber.from('1000000'),
                        address: toChainPing, // recipient
                        type: "exactIn",
                        chainId: selectedToNetwork.chainId,
                    });
                    amountOutAfterSlippage = BigNumber.from(swapData?.amountOutprice).sub(
                        BigNumber.from(swapData?.amountOutprice).mul("1000").div("1000000")
                    );
                    params[isThisAmount] = amountOutAfterSlippage.toString();
                } else {
                    params[isThisAmount] = amountAfterSlippage.toString();
                }

                let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi);
                const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params);

                // const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
                // const extraOrShareToken = allNetworkData?.contracts[contractIndex].extraOrShareToken;
                const destChainExecTx = { to: contractAddress, data: destChainExecData };

                let data;
                if (toChainId == "106" || toChainId == "111" || toChainId == "184" || toChainId == "109") {
                    data = abi.encode(
                        ["bool", "address", "bytes", "uint256", "uint256", "address", "address", "address", "bytes"],
                        [
                            isSwap ? true : false,
                            isSwap ? nativeTokenOutAddress : ZERO_ADDRESS, // dai polygon
                            isSwap ? swapData?.swapTx.data : BYTES_ZERO,
                            BigNumber.from("0"),
                            isSwap ? amountOutAfterSlippage : amountAfterSlippage, //swapData?.amountOutprice,
                            contractAddress,
                            address,
                            extraOrShareToken,
                            destChainExecTx.data,
                        ]
                    );
                } else {
                    data = abi.encode(
                        ["uint256", "uint256", "address", "address", "bytes"],
                        [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, destChainExecTx.data]
                    );
                }

                const srcAddress = ethers.utils.solidityPack(["address"], [_currentAddress]);
                let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing);
                const stargateParams = [fromChainId, srcAddress, _nonce, toUsdc, amountAfterSlippage, data];
                const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData(
                    "sgReceive",
                    stargateParams
                );
                const erc20Interface = new ethers.utils.Interface([
                    "function transfer(address _account, uint256 _value)",
                ]);
                const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [
                    toChainPing,
                    amountAfterSlippage,
                ]);
                const gasUsed = await findGasUsedBySimulation(
                    toUsdc,
                    toChainPing,
                    dummmyTranferToCheckData,
                    encodedDataForChainPing,
                    false,
                    chooseChianId(toChainId)
                );

                const stargateRouter = await getContractInstance(fromStarGateRouter, IStarGateRouter, _currentProvider);
                if (!stargateRouter) return;

                console.log("gasUsed: ", gasUsed.toString());

                const lzParams = {
                    dstGasForCall: BigNumber.from(gasUsed).add(BigNumber.from("30000")),
                    dstNativeAmount: 0,
                    dstNativeAddr: "0x",
                };

                const packedToAddress = ethers.utils.solidityPack(["address"], [toChainPing]);
                let quoteData = await stargateRouter.quoteLayerZeroFee(
                    toChainId,
                    _functionType,
                    packedToAddress,
                    data,
                    lzParams
                );

                let stargateTx = await stargateRouter.populateTransaction.swap(
                    toChainId,
                    srcPoolId,
                    destPoolId,
                    _currentAddress,
                    _tempAmount,
                    0,
                    lzParams,
                    packedToAddress,
                    data,
                    { value: quoteData[0] }
                );

                const scwOrEoaNativeBalance = await _currentProvider.getBalance(_currentAddress);
                const currentBalance = BigNumber.from(scwOrEoaNativeBalance);
                const minimumBalanceRequired = await decreasePowerByDecimals(quoteData[0].toString(), 18);

                // Extra 1e18 should more as of now
                if (!currentBalance.gt(quoteData[0].add(parseEther("0")))) {
                    toast.error(
                        `${minimumBalanceRequired.toString()} ${
                            ChainIdDetails[selectedFromNetwork.chainId].gasFeesName
                        } in your SmartAccount wallet`
                    );
                    return;
                }

                const sendTx = { to: stargateTx.to, data: stargateTx.data, value: stargateTx.value };
                if (approveTx) {
                    return { txArray: [approveTx, sendTx], value: stargateTx.value };
                } else {
                    return { txArray: [sendTx], value: stargateTx.value };
                }
            }
        } catch (error: unknown) {
            console.log("sendTx: Error: ", error);
            return;
        }
    }
    return useMutation(sendTxToChain);
}
