import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

import { useMutation } from "@tanstack/react-query";

import { useCCSendTx } from "./useCCSendTx";
import { tApprove, tCCSendTx, tOneInch, tOneInchSwapResponse, tRefinance, tRefinanceResponse, tStargateData } from "../types";
import { useOneInch } from "../swaphooks/useOneInch";
import { useApprove } from "../utilsHooks/useApprove";
import { ChainIdDetails } from "../../utils/data/network";
import { getTokenListByChainId, incresePowerByDecimals } from "../../utils/helper";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iBatchFlowData, iSelectedNetwork, iTokenData, iTrading, useTradingStore } from "../../store/TradingStore";
import { abiFetcher, abiFetcherNum, amountIndexInParams, buildParams, nativeTokenFetcher, nativeTokenNum, OneInchRouter, tokensByNetworkForCC, uniswapSwapRouterByChainId } from "../../utils/data/protocols";
import { useState } from "react";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { ETH_ADDRESS } from "../../utils/data/constants";
import { ZERO_ADDRESS } from "../../utils/data/constants";

export function useCCRefinance() {
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: sendTxToChain } = useCCSendTx();
    const { mutateAsync: oneInchSwap } = useOneInch();
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const [toTokensData, setToTokensData] = useState<iTokenData[]>();


    async function onChangeselectedToProtocol(network: iSelectedNetwork) {
        const tokens = getTokenListByChainId(network.chainId, UNISWAP_TOKENS);
        setToTokensData(tokens);
    }

    const {
        selectedFromNetwork,
        selectedFromProtocol,
        fromTokensData,
    }: iTrading = useTradingStore((state) => state);

    async function refinanceForCC({
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
        amountIn
    }: tRefinance): Promise<tRefinanceResponse | undefined> {

        // console.log(">>>>>>>>>>", selectedFromNetwork.chainName, "- To -", selectedToNetwork.chainName);
        await onChangeselectedToProtocol(selectedToNetwork)
        // console.log("--------------useCCRefinance", toTokensData)


        try {
            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
            }
            let tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];
            let simulationHash: string | undefined;
            let amountOut: string = "0"

            let swapData: tOneInchSwapResponse | undefined
            let abiNum,
                abi,
                methodName,
                isContractSet,
                paramDetailsMethod,
                tokenInContractAddress,
                abiInterface,
                params,
                txData,
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
            }

            if (toProtocol != "erc20") {
                const tokenOutNum = nativeTokenNum[selectedToNetwork.chainId][tokenOutName];
                nativeTokenOut = nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].nativeToken;
                nativeTokenOutSymbol = nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].symbol;
                nativeTokenOutDecimal = nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].decimals;
            }

            if (fromProtocol != "erc20") {
                abiNum = abiFetcherNum[selectedFromNetwork.chainId][tokenInName];
                abi = abiFetcher[selectedFromNetwork.chainId][abiNum]["withdrawAbi"];
                methodName = abiFetcher[selectedFromNetwork.chainId][abiNum]["withdrawMethodName"];
                paramDetailsMethod = abiFetcher[selectedFromNetwork.chainId][abiNum]["withdrawParamDetailsMethod"];
                // tokenInContractAddress = abiFetcher[selectedFromNetwork.chainId][abiNum]["contractAddress"];
                isContractSet = abiFetcher[selectedFromNetwork.chainId][abiNum]["isContractSet"];
                if (isContractSet) {
                    tokenInContractAddress =
                        abiFetcher[selectedFromNetwork.chainId][abiNum]["contractSet"][tokenInName];
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

            isSwap = nativeTokenIn != tokensByNetworkForCC[selectedFromNetwork.chainId].usdc ? true : false;
            if (isSwap) {
                let approveData
                if (nativeTokenIn != ETH_ADDRESS) {
                    approveData = await approve({
                        tokenIn: nativeTokenIn,
                        spender: OneInchRouter,
                        amountIn: amount,
                        address,
                        web3JsonProvider: provider,
                    } as tApprove);
                    if (approveData) tempTxs.push(approveData);
                }
                // console.log("nativeTokenIn", nativeTokenIn)
                swapData = await oneInchSwap({
                    tokenIn: nativeTokenIn,
                    tokenOut: tokensByNetworkForCC[selectedFromNetwork.chainId].usdc,
                    amountIn: amount,
                    address,
                    type: "exactIn",
                    chainId: Number(selectedNetwork.chainId),
                    selectedToken: selectedToToken
                } as tOneInch);
                if (!swapData) return
                tempTxs.push(swapData.swapTx);

                let batchFlow: iBatchFlowData = {
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedFromNetwork.chainId,
                    protocol: "1inch",
                    tokenIn: nativeTokenInSymbol,
                    tokenOut: nativeTokenOutSymbol,
                    amount: amountIn,
                    action: "Swap",
                };
                batchFlows.push(batchFlow);
            }

            let extraValue;
            if (selectedFromNetwork.chainName != selectedToNetwork.chainName) {
                if (toProtocol == "erc20") {
                    const _amountIndex = await amountIndexInParams(paramDetailsMethod)
                    const _tempAmount = BigNumber.from(await incresePowerByDecimals(amountIn, 6).toString());
                    let data: tStargateData | undefined = await sendTxToChain({
                        tokenIn: tokensByNetworkForCC[selectedFromNetwork.chainId].usdc,
                        _amountIn: isSwap && swapData ? swapData.amountOutprice : _tempAmount,
                        address,
                        isSCW: true,
                        params,
                        isThisAmount: _amountIndex,
                        srcPoolId: "1",
                        destPoolId: "1",
                        fromChainId: ChainIdDetails[selectedFromNetwork.chainId].stargateChainId,
                        toChainId: ChainIdDetails[selectedToNetwork.chainId].stargateChainId,
                        currentFunc: "",
                        currentAbi: [],
                        contractAddress: "",
                        extraOrShareToken: "0x0000000000000000000000000000000000000000",
                        tokenOutNum: "",
                        selectedToNetwork: selectedToNetwork,
                        selectedToProtocol: selectedToProtocol,
                        selectedToToken: selectedToToken,
                        toTokensData: toTokensData
                    } as tCCSendTx);

                    simulationHash = data?.simulationHash;

                    if (!data) return;
                    extraValue = data.value;

                    tempTxs = [...tempTxs, ...data.txArray];

                    let batchFlow: iBatchFlowData = {
                        fromChainId: selectedFromNetwork.chainId,
                        toChainId: selectedToNetwork.chainId,
                        protocol: "Stargate",
                        tokenIn: "USDC",
                        tokenOut: "USDC",
                        amount: amountIn,
                        action: `Bridge from ${selectedFromNetwork.chainName} to ${selectedToNetwork.chainName}`,
                    };
                    batchFlows.push(batchFlow);
                    batchFlow = {
                        fromChainId: selectedToNetwork.chainId,
                        toChainId: selectedToNetwork.chainId,
                        protocol: tokenOutName == "USDC" ? "erc20" : "Uniswap",
                        tokenIn: "USDC",
                        tokenOut: tokenOutName == "USDC" ? "" : tokenOutName,
                        amount: amountIn,
                        action: tokenOutName == "USDC" ? "Send USDC" : "Swap",
                    };
                    batchFlows.push(batchFlow);
                } else {
                    const tokenOutNum = nativeTokenNum[selectedToNetwork.chainId][tokenOutName];
                    const nativeTokenOutTemp = nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].symbol;
                    const nativeTokenOutAddress =
                        nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].nativeToken;

                    abiNum = abiFetcherNum[selectedToNetwork.chainId][tokenOutName];
                    const newTokenIn = tokensByNetworkForCC[selectedToNetwork.chainId].usdc;
                    paramDetailsMethod = abiFetcher[selectedToNetwork.chainId][abiNum]["depositParamDetailsMethod"];

                    params = await buildParams({
                        tokenIn,
                        tokenOut,
                        nativeTokenIn: nativeTokenOutTemp != "usdc" ? nativeTokenOutAddress : newTokenIn, // if bothe network different
                        nativeTokenOut,
                        amount,
                        address,
                        paramDetailsMethod,
                    });
                    abiNum = abiFetcherNum[selectedToNetwork.chainId][tokenOutName];
                    abi = abiFetcher[selectedToNetwork.chainId][abiNum]["depositAbi"];
                    methodName = abiFetcher[selectedToNetwork.chainId][abiNum]["depositMethodName"];
                    paramDetailsMethod = abiFetcher[selectedToNetwork.chainId][abiNum]["depositParamDetailsMethod"];
                    // const tokenOutContractAddress = abiFetcher[selectedToNetwork.chainId][abiNum]["contractAddress"];
                    let tokenOutContractAddress;
                    isContractSet = abiFetcher[selectedToNetwork.chainId][abiNum]["isContractSet"];
                    if (isContractSet) {
                        tokenOutContractAddress =
                            abiFetcher[selectedToNetwork.chainId][abiNum]["contractSet"][tokenOutName];
                    } else {
                        tokenOutContractAddress = abiFetcher[selectedToNetwork.chainId][abiNum]["contractAddress"];
                    }
                    let isShareToken = abiFetcher[selectedToNetwork.chainId][abiNum]["isShareToken"];

                    const _amountIndex = await amountIndexInParams(paramDetailsMethod)

                    const _tempAmount = BigNumber.from(await incresePowerByDecimals(amountIn, 6).toString());
                    // console.log("_tempAmount.", _tempAmount);
                    let data: tStargateData | undefined = await sendTxToChain({
                        tokenIn: tokensByNetworkForCC[selectedFromNetwork.chainId].usdc,
                        _amountIn: isSwap && swapData ? swapData.amountOutprice : _tempAmount,
                        address,
                        isSCW: true,
                        params,
                        isThisAmount: _amountIndex,
                        srcPoolId: "1",
                        destPoolId: "1",
                        fromChainId: ChainIdDetails[selectedFromNetwork.chainId].stargateChainId,
                        toChainId: ChainIdDetails[selectedToNetwork.chainId].stargateChainId,
                        currentFunc: methodName,
                        currentAbi: [abi],
                        contractAddress: tokenOutContractAddress,
                        extraOrShareToken: isShareToken ? tokenOutContractAddress : ZERO_ADDRESS,
                        tokenOutNum: tokenOutNum,
                        selectedToNetwork: selectedToNetwork,
                        selectedToProtocol: selectedToProtocol,
                        selectedToToken: selectedToToken,
                        toTokensData: toTokensData
                    } as tCCSendTx);
                    simulationHash = data?.simulationHash;

                    if (!data) return;
                    extraValue = data.value;

                    tempTxs = [...tempTxs, ...data.txArray];

                    let batchFlow: iBatchFlowData = {
                        fromChainId: selectedFromNetwork.chainId,
                        toChainId: selectedToNetwork.chainId,
                        protocol: "Stargate",
                        tokenIn: "USDC",
                        tokenOut: "USDC",
                        amount: amountIn,
                        action: `Bridge from ${selectedFromNetwork.chainName} to ${selectedToNetwork.chainName}`,
                    };
                    batchFlows.push(batchFlow);

                    amountOut = data.amountOutWithoutDecimal
                    batchFlow = {
                        fromChainId: selectedToNetwork.chainId,
                        toChainId: selectedToNetwork.chainId,
                        protocol: selectedToProtocol,
                        tokenIn: "USDC",
                        tokenOut: tokenOutName,
                        amount: amountOut,
                        action: "Deposit",
                    };
                    batchFlows.push(batchFlow);
                }
            }
            return { txArray: tempTxs, batchFlow: batchFlows, value: extraValue, simulationHash: simulationHash, amountOut: amountOut };
        } catch (error: any) {
            if (error.message) {
                // console.log("refinanceForCC: Error", error.message);
            } else {
                // console.log("refinanceForCC: Error", error);
            }
            return;
        }
    }
    return useMutation(refinanceForCC);
}
