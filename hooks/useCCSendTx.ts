import { toast } from "react-hot-toast";
import { ethers, BigNumber } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { parseEther } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";

import IERC20 from "../abis/IERC20.json";
import ChainPing from "../abis/ChainPing.json";
import IStarGateRouter from "../abis/IStarGateRouter.json";
import { useTradeStore, iTrade } from "../store/TradeStore";
import { useGlobalStore, iGlobal } from "../store/GlobalStore";
import { chooseChianId, calculateFees, batch } from "../utils/helper";
import { gasFeesNames, _nonce, _functionType, tokensByNetwork } from "../utils/constants";
import { getErc20Balanceof, getErc20Allownace, getContractInstance, getProvider } from "../utils/web3Libs/ethers";
import { chainPingByNetwork, starGateRouterByNetwork, tokensByNetworkForCC } from "./Batching/batchingUtils";

export function useCCSendTx() {
    const { smartAccount, currentProvider }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
        selectedToNetwork,
        amountIn,
        fromTokenDecimal,
        setTxHash,
    }: iTrade = useTradeStore((state) => state);

    async function sendTxToChain({
        tokenIn,
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
        extraOrShareToken
    }) {
        try {
            // if (isSCW) {
            //     setSendtxLoading(true);
            // } else {
            //     setSendtxLoadingForEoa(true);
            // }
            // if (!address) throw "Connect a wallet or refresh it";
            // if (!smartAccount) throw "You need to login";
            // if (!simulation) throw "First simulate then send Tx";
            // if (contractIndex == "") throw "Enter contractIndex field";
            // if (!amountIn) throw "Enter amountIn field";
            // if (!isThisAmount) throw "Select amount field";
            // if (!allNetworkData) throw "a need to fetch";

            const _tempAmount = BigNumber.from(bg(amountIn).multipliedBy(bg(10).pow(fromTokenDecimal)).toString());

            let _currentAddress;
            let _currentProvider;
            if (isSCW) {
                _currentAddress = smartAccount.address;
                _currentProvider = smartAccount.provider;
            } else {
                _currentAddress = address;
                _currentProvider = smartAccount.provider;
            }

            const fromStarGateRouter: any = starGateRouterByNetwork[selectedFromNetwork.chainId];
            const toUsdc = tokensByNetworkForCC[selectedToNetwork.chainId].usdc;
            const toChainPing: any = chainPingByNetwork[selectedToNetwork.chainId];

            setTxHash("");
            const abi = ethers.utils.defaultAbiCoder;

            const erc20TokenInInstance = await getContractInstance(tokenIn, IERC20, _currentProvider);
            if (!erc20TokenInInstance) return;
            const balance = await getErc20Balanceof(erc20TokenInInstance, _currentAddress);

            if (isSCW) {
                if (BigNumber.from(balance).lt(BigNumber.from(_tempAmount))) {
                    toast.error("You don't have enough balance in SmartAccount")
                    return;
                }
            } else {
                if (BigNumber.from(balance).lt(BigNumber.from(_tempAmount))) {
                    toast.error("You don't have enough balance in EOA")
                    return;
                }
            }

            let approveTx;
            const allowance = await getErc20Allownace(erc20TokenInInstance, _currentAddress, fromStarGateRouter);
            if (!BigNumber.from(allowance).gte(BigNumber.from(_tempAmount))) {
                const approveData = await erc20TokenInInstance.populateTransaction.approve(fromStarGateRouter, _tempAmount);
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
            params[isThisAmount] = amountAfterSlippage.toString();

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi);
            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                params
            );

            // const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
            // const extraOrShareToken = allNetworkData?.contracts[contractIndex].extraOrShareToken;
            const destChainExecTx = { to: contractAddress, data: destChainExecData };
            let data;
            if (toChainId == "106" || toChainId == "111" || toChainId == "184" || toChainId == "109") {
                data = abi.encode(
                    ["uint256", "uint256", "address", "address", "address", "bytes"],
                    [
                        BigNumber.from("0"),
                        amountAfterSlippage,
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
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams);
            const erc20Interface = new ethers.utils.Interface(["function transfer(address _account, uint256 _value)"]);
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [
                toChainPing,
                amountAfterSlippage,
            ]);
            const gasUsed = await batch(
                toUsdc,
                toChainPing,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                false,
                chooseChianId(toChainId)
            );

            const stargateRouter = await getContractInstance(fromStarGateRouter, IStarGateRouter, _currentProvider);
            if (!stargateRouter) return;
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
            // const minimumBalanceRequired = bg(currentBalance.toString()).plus(parseEther('1').toString()).dividedBy(bg(10).pow(18)).toString()

            const minimumBalanceRequired = bg(quoteData[0].toString()).dividedBy(bg(10).pow(18)).toString();

            // Extra 1e18 should more as of now
            if (!currentBalance.gt(quoteData[0].add(parseEther("0")))) {
                toast.error(`${minimumBalanceRequired.toString()} ${
                    gasFeesNames[selectedFromNetwork.chainName]
                } in your SmartAccount wallet`)
                return;
            }

            const sendTx = { to: stargateTx.to, data: stargateTx.data, value: stargateTx.value };
            if (approveTx) {
                return [approveTx, sendTx];
            } else {
                return [sendTx];
            }
        } catch (error: any) {
            if (error.message) {
                console.log("sendTx: Error: ", error);
            } else {
                console.log("sendTx: Error: ", error);
            }
            return;
        }
    }
    return useMutation(sendTxToChain);
}
