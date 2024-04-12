import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

import { useMutation } from "@tanstack/react-query";

import { tApprove, tOneInch, tOneInchSwapResponse, tRefinance, tRefinanceResponse } from "../types";
import { useOneInch } from "../swaphooks/useOneInch";
import { useApprove } from "../utilsHooks/useApprove";
import { decreasePowerByDecimals, getTokenListByChainId } from "../../utils/helper";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useCalculateGasCost } from "../utilsHooks/useCalculateGasCost";
import { iBatchFlowData, iSelectedNetwork, iTokenData, iTrading, useTradingStore } from "../../store/TradingStore";
import { abiFetcher, abiFetcherNum, buildParams, nativeTokenFetcher, nativeTokenNum, OneInchRouter, uniswapSwapRouterByChainId } from "../../utils/data/protocols";
import { useState } from "react";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";


export function useRefinance() {
    const { mutateAsync: oneInchSwap } = useOneInch();
    const { mutateAsync: approve } = useApprove();
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const [toTokensData, setToTokensData] = useState<iTokenData[]>();


    async function onChangeselectedToProtocol(network: iSelectedNetwork) {
        const tokens = getTokenListByChainId(network.chainId, UNISWAP_TOKENS);
        setToTokensData(tokens);
    }

    const { selectedFromNetwork, selectedFromProtocol, amountIn, fromTokensData }: iTrading =
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
        selectedToNetwork,
        selectedToProtocol,
        selectedToToken,
    }: tRefinance): Promise<tRefinanceResponse | undefined> {

        console.log(">>>>>>>>>>", selectedFromNetwork.chainName, "- To -", selectedToNetwork.chainName);
        await onChangeselectedToProtocol(selectedToNetwork);
        // console.log("--------------useRefinance", toTokensData)

        try {
            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
            }
            const tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];

            let swapData: tOneInchSwapResponse | undefined
            let abiNum: any,
                abi: any,
                methodName: any,
                isContractSet: any,
                paramDetailsMethod: any,
                tokenInContractAddress: any,
                abiInterface: any,
                params: any,
                txData: any,
                isSwap: any,
                nativeTokenIn: any,
                nativeTokenInSymbol: any,
                nativeTokenInDecimal: any,
                nativeTokenOut: any,
                nativeTokenOutSymbol: any,
                nativeTokenOutDecimal: any;

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
                    spender: OneInchRouter,
                    amountIn: amount,
                    address,
                    web3JsonProvider: provider,
                } as tApprove);

                if (approveData) tempTxs.push(approveData);
                swapData = await oneInchSwap({
                    tokenIn: nativeTokenIn,
                    tokenOut: nativeTokenOut,
                    amountIn: amount,
                    address,
                    type: "exactIn",
                    chainId: Number(selectedNetwork.chainId),
                    selectedToken: selectedToToken
                } as tOneInch);

                if (!swapData) return
                // console.log('swapData: ', swapData, swapData.amountOutprice.toString())
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
                const newAmount = isSwap && swapData ? swapData.amountOutprice : amount;

                abiNum = abiFetcherNum[selectedFromNetwork.chainId][tokenOutName];
                abi = abiFetcher[selectedFromNetwork.chainId][abiNum]["depositAbi"];
                methodName = abiFetcher[selectedFromNetwork.chainId][abiNum]["depositMethodName"];
                paramDetailsMethod = abiFetcher[selectedFromNetwork.chainId][abiNum]["depositParamDetailsMethod"];

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
                } as tApprove);
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
                // console.log('params', params)
                txData = abiInterface.encodeFunctionData(methodName, params);
                const tx2 = { to: tokenOutContractAddress, data: txData };
                tempTxs.push(tx2);

                let batchFlow: iBatchFlowData = {
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedFromNetwork.chainId,
                    protocol: selectedToProtocol,
                    tokenIn: newTokenInSymbol,
                    tokenOut: tokenOutName,
                    amount: isSwap && swapData
                        ? await decreasePowerByDecimals(newAmount, swapData.tokenOutDecimals)
                        : await decreasePowerByDecimals(amount, nativeTokenOutDecimal),
                    action: "Deposit",
                };
                batchFlows.push(batchFlow);
            }

            return { txArray: tempTxs, batchFlow: batchFlows, value: BigNumber.from("0") };
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
