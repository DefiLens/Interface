import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

import { useMutation } from "@tanstack/react-query";

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
    OneInchRouter,
    uniswapSwapRouterByChainId,
} from "../../utils/data/protocols";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useOneInch } from "../swaphooks/useOneInch";
export function useRefinance() {
    const { mutateAsync: oneInchSwap } = useOneInch();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: calculategasCost } = useCalculateGasCost();
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const { selectedFromNetwork, selectedFromProtocol, selectedToProtocol, amountIn, fromTokensData, toTokensData }: iTrading =
        useTradingStore((state) => state);

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
            const tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];

            let abiNum,
                abi,
                methodName,
                isContractSet,
                paramDetailsMethod,
                tokenInContractAddress,
                abiInterface,
                params,
                txData,
                swapData,
                isSwap,
                nativeTokenIn,
                nativeTokenInSymbol,
                nativeTokenInDecimal,
                nativeTokenOut,
                nativeTokenOutSymbol,
                nativeTokenOutDecimal;

            if (fromProtocol == "erc20") {
                nativeTokenIn = fromTokensData?.filter((token) => token.symbol === tokenInName)[0].address;
                nativeTokenInSymbol = fromTokensData?.filter((token) => token.symbol === tokenInName)[0].symbol;
                nativeTokenInDecimal = fromTokensData?.filter((token) => token.symbol === tokenInName)[0].decimals;
            }

            if (toProtocol == "erc20") {
                nativeTokenOut = toTokensData?.filter((token) => token.symbol === tokenOutName)[0].address;
                nativeTokenOutSymbol = toTokensData?.filter((token) => token.symbol === tokenOutName)[0].symbol;
                nativeTokenOutDecimal = toTokensData?.filter((token) => token.symbol === tokenOutName)[0].decimals;
            }

            if (toProtocol != "erc20") {
                const tokenOutNum = nativeTokenNum[selectedFromNetwork.chainId][tokenOutName];
                nativeTokenOut = nativeTokenFetcher[selectedFromNetwork.chainId][tokenOutNum].nativeToken;
                nativeTokenOutSymbol = nativeTokenFetcher[selectedFromNetwork.chainId][tokenOutNum].symbol;
                nativeTokenOutDecimal = nativeTokenFetcher[selectedFromNetwork.chainId][tokenOutNum].decimals;
            }

            if (fromProtocol != "erc20") {
                abiNum = abiFetcherNum[selectedFromNetwork.chainId][tokenInName];
                abi = abiFetcher[selectedFromNetwork.chainId][abiNum]["withdrawAbi"];
                methodName = abiFetcher[selectedFromNetwork.chainId][abiNum]["withdrawMethodName"];
                paramDetailsMethod = abiFetcher[selectedFromNetwork.chainId][abiNum]["withdrawParamDetailsMethod"];
                isContractSet = abiFetcher[selectedFromNetwork.chainId][abiNum]["isContractSet"];
                if (isContractSet) {
                    tokenInContractAddress = abiFetcher[selectedFromNetwork.chainId][abiNum]["contractSet"][tokenInName];
                } else {
                    tokenInContractAddress = abiFetcher[selectedFromNetwork.chainId][abiNum]["contractAddress"];
                }
                const tokenInNum = nativeTokenNum[selectedFromNetwork.chainId][tokenInName];
                nativeTokenIn = nativeTokenFetcher[selectedFromNetwork.chainId][tokenInNum].nativeToken;
                nativeTokenInSymbol = nativeTokenFetcher[selectedFromNetwork.chainId][tokenInNum].symbol;
                nativeTokenOutDecimal = nativeTokenFetcher[selectedFromNetwork.chainId][tokenInNum].decimals;

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
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedFromNetwork.chainId,
                    protocol: selectedFromProtocol,
                    tokenIn: tokenInName,
                    tokenOut: nativeTokenInSymbol,
                    amount: amountIn,
                    action: "Withdraw",
                };
                batchFlows.push(batchFlow);
            }

            isSwap = nativeTokenIn != nativeTokenOut ? true : false;
            if (isSwap) {
                if (selectedFromNetwork.chainId == "43114") {
                    alert("Avalanche Swap is not available");
                    toast.error("Avalanche Swap is not available");
                    return;
                }

                const approveData = await approve({
                    tokenIn: nativeTokenIn,
                    // spender: uniswapSwapRouterByChainId[selectedFromNetwork.chainId],
                    spender: OneInchRouter,
                    amountIn: amount,
                    address,
                    web3JsonProvider: provider,
                });
                if (approveData) tempTxs.push(approveData);
                swapData = await oneInchSwap({
                    tokenIn: nativeTokenIn,
                    tokenOut: nativeTokenOut,
                    amountIn: amount,
                    address,
                    type: "exactIn",
                    chainId: selectedNetwork.chainId
                });
                console.log('swapData: ', swapData, swapData.amountOutprice.toString())
                tempTxs.push(swapData.swapTx);

                let batchFlow: iBatchFlowData = {
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedFromNetwork.chainId,
                    protocol: "Uniswap",
                    tokenIn: nativeTokenInSymbol,
                    tokenOut: nativeTokenOutSymbol,
                    amount: amountIn,
                    action: "Swap",
                };
                batchFlows.push(batchFlow);
            }

            if (toProtocol != "erc20") {
                const newTokenIn = isSwap ? nativeTokenOut : nativeTokenIn;
                const newTokenInSymbol = isSwap ? nativeTokenOutSymbol : nativeTokenInSymbol;
                const newAmount = isSwap ? swapData.amountOutprice : amount;

                abiNum = abiFetcherNum[selectedFromNetwork.chainId][tokenOutName];
                abi = abiFetcher[selectedFromNetwork.chainId][abiNum]["depositAbi"];
                methodName = abiFetcher[selectedFromNetwork.chainId][abiNum]["depositMethodName"];
                paramDetailsMethod = abiFetcher[selectedFromNetwork.chainId][abiNum]["depositParamDetailsMethod"];
                // const tokenOutContractAddress = abiFetcher[selectedFromNetwork.chainId][abiNum]["contractAddress"];

                let tokenOutContractAddress;
                isContractSet = abiFetcher[selectedFromNetwork.chainId][abiNum]["isContractSet"];
                if (isContractSet) {
                    tokenOutContractAddress = abiFetcher[selectedFromNetwork.chainId][abiNum]["contractSet"][tokenOutName];
                } else {
                    tokenOutContractAddress = abiFetcher[selectedFromNetwork.chainId][abiNum]["contractAddress"];
                }

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
                    amount: BigNumber.from(newAmount),
                    address,
                    paramDetailsMethod,
                });
                console.log('params', params)
                txData = abiInterface.encodeFunctionData(methodName, params);
                const tx2 = { to: tokenOutContractAddress, data: txData };
                tempTxs.push(tx2);

                let batchFlow: iBatchFlowData = {
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedFromNetwork.chainId,
                    protocol: selectedToProtocol,
                    tokenIn: newTokenInSymbol,
                    tokenOut: tokenOutName,
                    amount: isSwap
                        ? await decreasePowerByDecimals(newAmount.toString(), swapData.tokenOutDecimals)
                        : await decreasePowerByDecimals(amount.toString(), nativeTokenOutDecimal),
                    action: "Deposit",
                };
                batchFlows.push(batchFlow);
            }
            // const gasCost: number | undefined = await calculategasCost(selectedFromNetwork.chainId)
            // alert(gasCost?.toString())

            return { txArray: tempTxs, batchFlow: batchFlows, value: 0 };
        } catch (error: any) {
            if (error.message) {
                console.log("refinance: Error", error.message);
            } else {
                console.log("refinance: Error", error);
            }
            return;
        }
    }
    return useMutation(refinance);
}
