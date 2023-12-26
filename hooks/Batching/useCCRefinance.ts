import { ethers } from "ethers";
import { toast } from "react-hot-toast";

import { useAddress } from "@thirdweb-dev/react";
import { useMutation } from "@tanstack/react-query";

import { useCCSendTx } from "./useCCSendTx";
import { useUniswap } from "../swaphooks/useUniswap";
import { useApprove } from "../utilsHooks/useApprove";
import { ChainIdDetails } from "../../utils/data/network";
import { iBatchFlowData, iTrading, useTradingStore } from "../../store/TradingStore";
import {
    abiFetcher,
    abiFetcherNum,
    buildParams,
    nativeTokenFetcher,
    nativeTokenNum,
    tokensByNetworkForCC,
    uniswapSwapRouterByChainId,
} from "../../utils/data/protocols";
import { useCCSendTx2 } from "./useCCSendTx2";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";

export function useCCRefinance() {
    const address = useAddress(); // Detect the connected address
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: sendTxToChain } = useCCSendTx();
    const { mutateAsync: sendTxToChain2 } = useCCSendTx2();
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
        selectedToNetwork,
        selectedFromProtocol,
        selectedToProtocol,
        amountIn,
        tokensData,
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
    }: any) {
        try {
            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
            }
            let tempTxs: any = [];
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
                nativeTokenIn = tokensData?.filter((token) => token.symbol === tokenInName)[0].address;
                nativeTokenInSymbol = tokensData?.filter((token) => token.symbol === tokenInName)[0].symbol;
                nativeTokenInDecimal = tokensData?.filter((token) => token.symbol === tokenInName)[0].decimals;
            }
            // if (toProtocol == "erc20") {
            //     nativeTokenOut = tokensData?.filter((token) => token.symbol === tokenOutName)[0].address;
            // }

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
            isSwap = nativeTokenIn != tokensByNetworkForCC[selectedFromNetwork.chainId].usdc ? true : false;
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
                    tokenIn: nativeTokenIn, //: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    tokenOut: tokensByNetworkForCC[selectedFromNetwork.chainId].usdc, // nativeTokenOut, //: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    amountIn: amount, //: BigNumber.from('1000000'),
                    address,
                    type: "exactIn",
                    chainId: selectedNetwork.chainId
                });
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

            if (selectedFromNetwork.chainName != selectedToNetwork.chainName) {
                const tokenOutNum = nativeTokenNum[selectedToNetwork.chainId][tokenOutName];
                const nativeTokenOutTemp = nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].symbol;
                const nativeTokenOutAddress = nativeTokenFetcher[selectedToNetwork.chainId][tokenOutNum].nativeToken;
                // if (nativeTokenOutTemp != "usdc") {
                //     toast(
                //         `Cross-chain Error: Select Usdc Based ToToken on ToNetwork Side like aUSDC, cUSDC.
                //     As of now only Usdc Based trade is possible for cross-chain.
                //     Will update soon...`,
                //         {
                //             duration: 20000,
                //         }
                //     );
                //     return;
                // }

                abiNum = abiFetcherNum[selectedToNetwork.chainId][tokenOutName];
                // const newTokenIn = isSwap ? tokensByNetworkForCC[selectedToNetwork.chainId].usdc : nativeTokenIn;
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
                let tokenOutContractAddress
                isContractSet = abiFetcher[selectedToNetwork.chainId][abiNum]["isContractSet"];
                if (isContractSet) {
                    tokenOutContractAddress = abiFetcher[selectedToNetwork.chainId][abiNum]["contractSet"][tokenOutName];
                } else {
                    tokenOutContractAddress = abiFetcher[selectedToNetwork.chainId][abiNum]["contractAddress"];
                }
                let txs: any = await sendTxToChain2({
                    tokenIn: nativeTokenIn,
                    address,
                    isSCW: true,
                    params,
                    isThisAmount: "1",
                    srcPoolId: "1",
                    destPoolId: "1",
                    fromChainId: ChainIdDetails[selectedFromNetwork.chainId].stargateChainId,
                    toChainId: ChainIdDetails[selectedToNetwork.chainId].stargateChainId,
                    currentFunc: methodName,
                    currentAbi: [abi],
                    contractAddress: tokenOutContractAddress,
                    extraOrShareToken: "0x0000000000000000000000000000000000000000",
                    tokenOutNum: tokenOutNum
                });

                if (!txs) return;

                tempTxs = [...tempTxs, ...txs];

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
                    protocol: selectedToProtocol,
                    tokenIn: "USDC",
                    tokenOut: tokenOutName,
                    amount: amountIn,
                    action: "Deposit",
                };
                batchFlows.push(batchFlow);
            }
            return { txArray: tempTxs, batchFlow: batchFlows };
        } catch (error: any) {
            if (error.message) {
                console.log("refinanceForCC: Error", error.message);
            } else {
                console.log("refinanceForCC: Error", error);
            }
            return;
        }
    }
    return useMutation(refinanceForCC);
}
