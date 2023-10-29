import { useContext } from "react";

import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { parseEther } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";

import IERC20 from "../abis/IERC20.json";
import ChainPing from "../abis/ChainPing.json";
import ChainContext from "../Context/ChainContext";
import IStarGateRouter from "../abis/IStarGateRouter.json";
import { iTrade, useTradeStore } from "../store/TradeStore";
import { useEoaProvider } from "./aaProvider/useEoaProvider";
import { iGlobal, useGlobalStore } from "../store/GlobalStore";
import { batch, calculateFees, chooseChianId } from "../utils/helper";
import { useBiconomyProvider } from "./aaProvider/useBiconomyProvider";
import { _functionType, _nonce, gasFeesNames } from "../utils/constants";
import { iCrossChainDifi, useCrossChainDifiStore } from "../store/CrossChainDifiStore";
import { getContractInstance, getErc20Allownace, getErc20Balanceof } from "../utils/web3Libs/ethers";

export function useSendTx() {
    const { smartAccount, currentProvider }: iGlobal = useGlobalStore((state) => state);

    const {
        fromChainId,
        toChainId,
        srcPoolId,
        destPoolId,
        tokenIn,
        amountIn,
        tokenInDecimals,
        isThisAmount,
        contractIndex,
        allNetworkData,
        currentAbi,
        currentFunc,
        params,
        simulation,
        setSendtxLoading,
        setSendtxLoadingForEoa,
        // setTxHash,
    }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

    // const { selectedChain } = useContext(ChainContext);

    const {
        selectedFromNetwork,
        setTxHash,
    }: iTrade = useTradeStore((state) => state);

    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();

    async function sendTxToChain({ funcIndex, address, isSCW }) {
        try {
            if (isSCW) {
                setSendtxLoading(true);
            } else {
                setSendtxLoadingForEoa(true);
            }
            if (!address) {
                toast.error("Connect a wallet or refresh it");
                return;
            };
            if (!smartAccount) {
                toast.error("You need to login");
                return;
            };
            if (!simulation) {
                toast.error("First simulate then send Tx");
                return;
            };
            if (contractIndex == "") {
                toast.error("Enter contractIndex field");
                return;
            };
            if (!amountIn) {
                toast.error("Enter amountIn field");
                return;
            };
            if (!isThisAmount) {
                toast.error("Select amount field");
                return;
            };
            if (!allNetworkData) {
                toast.error("a need to fetch");
                return;
            };

            const _tempAmount = BigNumber.from(bg(amountIn).multipliedBy(bg(10).pow(tokenInDecimals)).toString());

            let _currentAddress;
            let _currentProvider;
            if (isSCW) {
                _currentAddress = smartAccount.address;
                _currentProvider = smartAccount.provider;
            } else {
                _currentAddress = address;
                _currentProvider = smartAccount.provider;
            }

            const fromStarGateRouter: any = allNetworkData.starGateRouter;
            const toUsdc = allNetworkData.tokens.usdc;
            const toChainPing = allNetworkData.chainPing;

            setTxHash("");
            const abi = ethers.utils.defaultAbiCoder;

            const USDT = await getContractInstance(tokenIn, IERC20, _currentProvider);
            if (!USDT) return;
            const balance = await getErc20Balanceof(USDT, _currentAddress);

            if (isSCW) {
                if (BigNumber.from(balance).lt(BigNumber.from(_tempAmount))) {
                    toast.error("You don't have enough balance in SmartAccount");
                    return;
                };
            } else {
                if (BigNumber.from(balance).lt(BigNumber.from(_tempAmount))) {
                    toast.error("You don't have enough balance in EOA");
                    return;
                };
            }

            let approveTx;
            const allowance = await getErc20Allownace(USDT, _currentAddress, fromStarGateRouter);
            if (!BigNumber.from(allowance).gte(BigNumber.from(_tempAmount))) {
                const approveData = await USDT.populateTransaction.approve(fromStarGateRouter, _tempAmount);
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
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString();

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi);
            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                params[funcIndex]
            );

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
            const extraOrShareToken = allNetworkData?.contracts[contractIndex].extraOrShareToken;
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
                toast.error(`Not Enough Balance, You should have at least ${minimumBalanceRequired.toString()} ${
                    gasFeesNames[selectedFromNetwork.chainName]
                } in your SmartAccount wallet`);
                return;
            }

            const sendTx = { to: stargateTx.to, data: stargateTx.data, value: stargateTx.value };
            let tempTxhash = "";
            if (approveTx) {
                if (isSCW) {
                    tempTxhash = await sendToBiconomy([approveTx, sendTx]);
                } else {
                    tempTxhash = await sendTxTrditionally([approveTx, sendTx]);
                }
            } else {
                if (isSCW) {
                    tempTxhash = await sendToBiconomy([sendTx]);
                } else {
                    tempTxhash = await sendTxTrditionally([sendTx]);
                }
            }
            if (tempTxhash) {
                setTxHash(tempTxhash);
            }
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
        } catch (error: any) {
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
            console.log("sendTx-error: ", error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error(error);
            }
            return;
        }
    }
    return useMutation(sendTxToChain);
}
