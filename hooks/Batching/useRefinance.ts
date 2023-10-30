import { ethers } from "ethers";
import { toast } from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import { useUniswap } from "../useUniswap";
import { useApprove } from "../useApprove";
import { iBatchFlowData, iTrade, useTradeStore } from "../../store/TradeStore";
import { iBatchingTxn, useBatchingTxnStore } from "../../store/BatchingTxnStore";
import { iCrossChainDifi, useCrossChainDifiStore } from "../../store/CrossChainDifiStore";
import { abiFetcher, abiFetcherNum, buildParams, nativeTokenFetcher, nativeTokenNum } from "./batchingUtils";
import { _functionType, _nonce, uniswapSwapRouterByChainId, V3_SWAP_ROUTER_ADDRESS } from "../../utils/constants";
import { useCalculateGasCost } from "../useCalculateGasCost";

export function useRefinance() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: calculategasCost } = useCalculateGasCost();

    const { selectedFromNetwork, selectedFromProtocol, selectedToProtocol, amountIn }: iTrade = useTradeStore(
        (state) => state
    );

    // const { setTxHash }: iCrossChainDifi = useCrossChainDifiStore((state) => state);
    // const { tokensData }: iBatchingTxn = useBatchingTxnStore((state) => state);
    const { tokensData, setTxHash }: iTrade = useTradeStore((state) => state);

    async function refinance({
        isSCW,
        fromProtocol,
        toProtocol,
        tokenIn,
        tokenInName,
        tokenOut,
        tokenOutName,
        amount,
        address,
        provider,
    }: any) {
        try {
            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
            }
            setTxHash("");
            const tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];
            // let batchFlow: iBatchFlowData = {}
            let abiNum,
                abi,
                methodName,
                paramDetailsMethod,
                tokenInContractAddress,
                abiInterface,
                params,
                txData,
                swapData,
                isSwap,
                nativeTokenIn,
                nativeTokenOut;

            if (fromProtocol == "erc20") {
                nativeTokenIn = tokensData?.filter((token) => token.symbol === tokenInName)[0].address;
            }

            if (toProtocol == "erc20") {
                nativeTokenOut = tokensData?.filter((token) => token.symbol === tokenOutName)[0].address;
            }

            if (toProtocol != "erc20") {
                const tokenOutNum = nativeTokenNum[selectedFromNetwork.chainName][tokenOutName];
                nativeTokenOut = nativeTokenFetcher[selectedFromNetwork.chainName][tokenOutNum].nativeToken;
            }

            if (fromProtocol != "erc20") {
                abiNum = abiFetcherNum[selectedFromNetwork.chainName][tokenInName];
                abi = abiFetcher[selectedFromNetwork.chainName][abiNum]["withdrawAbi"];
                methodName = abiFetcher[selectedFromNetwork.chainName][abiNum]["withdrawMethodName"];
                paramDetailsMethod = abiFetcher[selectedFromNetwork.chainName][abiNum]["withdrawParamDetailsMethod"];
                tokenInContractAddress = abiFetcher[selectedFromNetwork.chainName][abiNum]["contractAddress"];
                const tokenInNum = nativeTokenNum[selectedFromNetwork.chainName][tokenInName];
                nativeTokenIn = nativeTokenFetcher[selectedFromNetwork.chainName][tokenInNum].nativeToken;

                abiInterface = new ethers.utils.Interface([abi]);
                params = await buildParams({
                    tokenIn,
                    tokenOut,
                    nativeTokenIn,
                    nativeTokenOut,
                    amount,
                    address,
                    paramDetailsMethod,
                });
                txData = abiInterface.encodeFunctionData(methodName, params);
                const tx1 = { to: tokenInContractAddress, data: txData };
                tempTxs.push(tx1);

                let batchFlow: iBatchFlowData = {
                    network: selectedFromNetwork.chainName,
                    protocol: selectedFromProtocol,
                    tokenIn: tokenInName,
                    tokenOut: nativeTokenIn,
                    amount: amountIn,
                    action: "Withdraw",
                };
                batchFlows.push(batchFlow);
            }

            isSwap = nativeTokenIn != nativeTokenOut ? true : false;
            if (isSwap) {
                const approveData = await approve({
                    tokenIn: nativeTokenIn,
                    spender: uniswapSwapRouterByChainId[selectedFromNetwork.chainId],
                    amountIn: amount,
                    address,
                    web3JsonProvider: provider,
                });
                if (approveData) tempTxs.push(approveData);
                swapData = await swap({
                    tokenIn: nativeTokenIn,
                    tokenOut: nativeTokenOut,
                    amountIn: amount,
                    address,
                    type: "exactIn",
                });
                tempTxs.push(swapData.swapTx);
                let batchFlow: iBatchFlowData = {
                    network: selectedFromNetwork.chainName,
                    protocol: "Uniswap",
                    tokenIn: nativeTokenIn,
                    tokenOut: nativeTokenOut,
                    amount: amount,
                    action: "Swap",
                };
                batchFlows.push(batchFlow);
            }

            if (toProtocol != "erc20") {
                const newTokenIn = isSwap ? nativeTokenOut : nativeTokenIn;
                const newAmount = isSwap ? swapData.amountOutprice : amount;

                abiNum = abiFetcherNum[selectedFromNetwork.chainName][tokenOutName];
                abi = abiFetcher[selectedFromNetwork.chainName][abiNum]["depositAbi"];
                methodName = abiFetcher[selectedFromNetwork.chainName][abiNum]["depositMethodName"];
                paramDetailsMethod = abiFetcher[selectedFromNetwork.chainName][abiNum]["depositParamDetailsMethod"];
                const tokenOutContractAddress = abiFetcher[selectedFromNetwork.chainName][abiNum]["contractAddress"];

                const approveData = await approve({
                    tokenIn: newTokenIn,
                    spender: tokenOutContractAddress,
                    amountIn: newAmount,
                    address,
                    web3JsonProvider: provider,
                });
                if (approveData) tempTxs.push(approveData);

                abiInterface = new ethers.utils.Interface([abi]);
                params = await buildParams({
                    tokenIn,
                    tokenOut,
                    nativeTokenIn: newTokenIn,
                    nativeTokenOut: "",
                    amount: newAmount,
                    address,
                    paramDetailsMethod,
                });
                txData = abiInterface.encodeFunctionData(methodName, params);
                const tx2 = { to: tokenOutContractAddress, data: txData };
                tempTxs.push(tx2);
                let batchFlow: iBatchFlowData = {
                    network: selectedFromNetwork.chainName,
                    protocol: "Uniswap",
                    tokenIn: newTokenIn,
                    tokenOut: tokenOutName,
                    amount: newAmount,
                    action: "Deposit",
                };
                batchFlows.push(batchFlow);
            }
            // const gasCost: number | undefined = await calculategasCost(selectedFromNetwork.chainId)
            // alert(gasCost?.toString())

            return { txArray: tempTxs, batchFlow: batchFlows };
        } catch (error) {
            console.log("refinance-error", error);
        }
    }
    return useMutation(refinance);
}
