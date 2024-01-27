import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

import { useMutation } from "@tanstack/react-query";

import { useUniswap } from "../swaphooks/useUniswap";
import { useApprove } from "../utilsHooks/useApprove";
import { decreasePowerByDecimals } from "../../utils/helper";
import { useCalculateGasCost } from "../utilsHooks/useCalculateGasCost";
import { iBatchFlowData, iTrading, useTradingStore } from "../../store/TradingStore";
import {
    abiFetcher,
    abiFetcherNum,
    buildParams,
    nativeTokenFetcher,
    nativeTokenNum,
    uniswapSwapRouterByChainId,
} from "../../utils/data/protocols";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { getContractInstance } from "../../utils/web3Libs/ethers";
import poolv3 from "../../abis/aave/poolv3.json";

export function useLendingRoutes() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: calculategasCost } = useCalculateGasCost();
    const { selectedNetwork, smartAccount }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
        selectedFromProtocol,
        selectedToProtocol,
        amountIn,
        fromTokensData,
        toTokensData,
        fromTokenDecimal,
    }: iTrading = useTradingStore((state) => state);

    async function routes({
        tokenObject,
        // fromProtocol,
        // toProtocol,
        tokenIn,
        tokenInName,
        // tokenOut,
        // tokenOutName,
        amount,
        address,
        provider,
    }: any) {
        try {
            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
            }
            const tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];
            let txData;
            let to;

            if (tokenObject.type == "Lending") {
                to = tokenObject.abiDetails.contractAddress;
                let abiInterface = new ethers.utils.Interface([tokenObject.abiDetails.depositAbi]);
                txData = abiInterface.encodeFunctionData("supply", [tokenIn, amount, address, 0]);
                const tx = { to: to, data: txData };
                tempTxs.push(tx);
            } else if (tokenObject.type == "Withdraw") {
                to = tokenObject.abiDetails.contractAddress;
                let abiInterface = new ethers.utils.Interface([tokenObject.abiDetails.withdrawAbi]);
                txData = abiInterface.encodeFunctionData("withdraw", [tokenIn, amount, address]);
                const tx = { to: to, data: txData };
                tempTxs.push(tx);
            } else if (tokenObject.type == "Borrow") {
                to = tokenObject.abiDetails.contractAddress;
                let abiInterface = new ethers.utils.Interface(tokenObject.abiDetails.borrowAbi);
                txData = abiInterface.encodeFunctionData("borrow", [tokenIn, amount, 2, 0, address]);
                const tx = { to: to, data: txData };
                tempTxs.push(tx);
            } else if (tokenObject.type == "Repay") {
                to = tokenObject.abiDetails.contractAddress;
                let abiInterface = new ethers.utils.Interface([tokenObject.abiDetails.repayAbi]);
                txData = abiInterface.encodeFunctionData("repay", [tokenIn, amount, 2, address]);
                const tx = { to: to, data: txData };
                tempTxs.push(tx);
            }

            let batchFlow: iBatchFlowData = {
                fromChainId: selectedFromNetwork.chainId,
                toChainId: selectedFromNetwork.chainId,
                protocol: selectedToProtocol,
                tokenIn: tokenInName,
                tokenOut: tokenInName,
                amount: await decreasePowerByDecimals(amount.toString(), fromTokenDecimal),
                action: tokenObject.type,
            };
            batchFlows.push(batchFlow);

            return { txArray: tempTxs, batchFlow: batchFlows, value: 0 };
        } catch (error: any) {
            if (error.message) {
                console.log("borrow: Error", error.message);
            } else {
                console.log("borrow: Error", error);
            }
            return;
        }
    }
    return useMutation(routes);
}
