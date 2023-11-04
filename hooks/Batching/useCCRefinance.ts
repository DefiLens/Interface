import { ethers } from "ethers";
import { toast } from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import { useUniswap } from "../useUniswap";
import { useApprove } from "../useApprove";
import { iBatchFlowData, iTrade, useTradeStore } from "../../store/TradeStore";
import { useCCSendTx } from "../useCCSendTx";

import { iBatchingTxn, useBatchingTxnStore } from "../../store/BatchingTxnStore";
import { iCrossChainDifi, useCrossChainDifiStore } from "../../store/CrossChainDifiStore";
import {
    abiFetcher,
    abiFetcherNum,
    buildParams,
    nativeTokenFetcher,
    nativeTokenNum,
    tokensByNetworkForCC,
} from "./batchingUtils";
import { _functionType, _nonce, StargateChainIdBychainId, uniswapSwapRouterByChainId } from "../../utils/constants";
import { useAddress } from "@thirdweb-dev/react";

export function useCCRefinance() {
    const address = useAddress(); // Detect the connected address
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: sendTxToChain } = useCCSendTx();
    // const { selectedChain, selectedChainId } = React.useContext(ChainContext);

    const { selectedFromNetwork, selectedToNetwork, selectedFromProtocol, selectedToProtocol, amountIn, tokensData }: iTrade =
        useTradeStore((state) => state);

    // const { setTxHash }: iCrossChainDifi = useCrossChainDifiStore((state) => state);
    const { setTxHash }: iBatchingTxn = useBatchingTxnStore((state) => state);

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
            setTxHash("");
            let tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];

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
                nativeTokenInSymbol,
                nativeTokenInDecimal,
                nativeTokenOut,
                nativeTokenOutSymbol,
                nativeTokenOutDecimal;

                console.log('1')
            if (fromProtocol == "erc20") {
                nativeTokenIn = tokensData?.filter((token) => token.symbol === tokenInName)[0].address;
                nativeTokenInSymbol = tokensData?.filter((token) => token.symbol === tokenInName)[0].symbol;
                nativeTokenInDecimal = tokensData?.filter((token) => token.symbol === tokenInName)[0].decimals;
            }
            console.log('2')
            // if (toProtocol == "erc20") {
            //     nativeTokenOut = tokensData?.filter((token) => token.symbol === tokenOutName)[0].address;
            // }

            if (toProtocol != "erc20") {
                const tokenOutNum = nativeTokenNum[selectedToNetwork.chainName][tokenOutName];
                nativeTokenOut = nativeTokenFetcher[selectedToNetwork.chainName][tokenOutNum].nativeToken;
                nativeTokenOutSymbol = nativeTokenFetcher[selectedToNetwork.chainName][tokenOutNum].symbol;
                nativeTokenOutDecimal = nativeTokenFetcher[selectedToNetwork.chainName][tokenOutNum].decimals;
            }
            console.log('3')
            if (fromProtocol != "erc20") {
                abiNum = abiFetcherNum[selectedFromNetwork.chainName][tokenInName];
                abi = abiFetcher[selectedFromNetwork.chainName][abiNum]["withdrawAbi"];
                methodName = abiFetcher[selectedFromNetwork.chainName][abiNum]["withdrawMethodName"];
                paramDetailsMethod = abiFetcher[selectedFromNetwork.chainName][abiNum]["withdrawParamDetailsMethod"];
                tokenInContractAddress = abiFetcher[selectedFromNetwork.chainName][abiNum]["contractAddress"];

                const tokenInNum = nativeTokenNum[selectedFromNetwork.chainName][tokenInName];
                nativeTokenIn = nativeTokenFetcher[selectedFromNetwork.chainName][tokenInNum].nativeToken;

                nativeTokenInSymbol = nativeTokenFetcher[selectedFromNetwork.chainName][tokenInNum].symbol;
                nativeTokenOutDecimal = nativeTokenFetcher[selectedFromNetwork.chainName][tokenInNum].decimals;

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
                    tokenOut: nativeTokenInSymbol,
                    amount: amountIn,
                    action: "Withdraw",
                };
                batchFlows.push(batchFlow);
            }
            console.log('4')
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
                });
                tempTxs.push(swapData.swapTx);
                let batchFlow: iBatchFlowData = {
                    network: selectedFromNetwork.chainName,
                    protocol: "Uniswap",
                    tokenIn: nativeTokenInSymbol,
                    tokenOut: nativeTokenOutSymbol,
                    amount: amountIn,
                    action: "Swap",
                };
                batchFlows.push(batchFlow);
            }
            console.log('5')

            if (selectedFromNetwork.chainName != selectedToNetwork.chainName) {
                abiNum = abiFetcherNum[selectedToNetwork.chainName][tokenOutName];
                const newTokenIn = isSwap ? tokensByNetworkForCC[selectedFromNetwork.chainId].usdc : nativeTokenIn;
                paramDetailsMethod = abiFetcher[selectedToNetwork.chainName][abiNum]["depositParamDetailsMethod"];

                params = await buildParams({
                    tokenIn,
                    tokenOut,
                    nativeTokenIn: newTokenIn,
                    nativeTokenOut,
                    amount,
                    address,
                    paramDetailsMethod,
                });
                abiNum = abiFetcherNum[selectedToNetwork.chainName][tokenOutName];
                abi = abiFetcher[selectedToNetwork.chainName][abiNum]["depositAbi"];
                methodName = abiFetcher[selectedToNetwork.chainName][abiNum]["depositMethodName"];
                paramDetailsMethod = abiFetcher[selectedToNetwork.chainName][abiNum]["depositParamDetailsMethod"];
                const tokenOutContractAddress = abiFetcher[selectedToNetwork.chainName][abiNum]["contractAddress"];
                let txs: any = await sendTxToChain({
                    tokenIn: nativeTokenIn,
                    address,
                    isSCW: true,
                    params,
                    isThisAmount: "1",
                    srcPoolId: "1",
                    destPoolId: "1",
                    fromChainId: StargateChainIdBychainId[selectedFromNetwork.chainId],
                    toChainId: StargateChainIdBychainId[selectedToNetwork.chainId],
                    currentFunc: methodName,
                    currentAbi: [abi],
                    contractAddress: tokenOutContractAddress,
                    extraOrShareToken: "0x0000000000000000000000000000000000000000",
                });
                tempTxs = [...tempTxs, ...txs];
                let batchFlow: iBatchFlowData = {
                    network: selectedFromNetwork.chainName,
                    toNetwork: selectedToNetwork.chainName,
                    protocol: "Stargate",
                    tokenIn: "USDC",
                    tokenOut: "USDC",
                    amount: amountIn,
                    action: `Bridge from ${selectedFromNetwork.chainName} to ${selectedToNetwork.chainName}`,
                };
                batchFlows.push(batchFlow);
                batchFlow = {
                    network: selectedToNetwork.chainName,
                    protocol: selectedToProtocol,
                    tokenIn: "USDC",
                    tokenOut: tokenOutName,
                    amount: amountIn,
                    action: "Deposit",
                };
                batchFlows.push(batchFlow);
            }

            console.log('6')
            // else if (toProtocol != "erc20") {
            //     const newTokenIn = isSwap ? nativeTokenOut : nativeTokenIn;
            //     const newAmount = isSwap ? swapData.amountOutprice : amount;

            //     abiNum = abiFetcherNum[selectedToNetwork.chainName][tokenOutName];
            //     abi = abiFetcher[selectedToNetwork.chainName][abiNum]["depositAbi"];
            //     methodName = abiFetcher[selectedToNetwork.chainName][abiNum]["depositMethodName"];
            //     paramDetailsMethod = abiFetcher[selectedToNetwork.chainName][abiNum]["depositParamDetailsMethod"];
            //     const tokenOutContractAddress = abiFetcher[selectedToNetwork.chainName][abiNum]["contractAddress"];

            //     const approveData = await approve({
            //         tokenIn: newTokenIn,
            //         spender: tokenOutContractAddress,
            //         amountIn: newAmount,
            //         address,
            //         web3JsonProvider: provider,
            //     });
            //     if (approveData) tempTxs.push(approveData);

            //     abiInterface = new ethers.utils.Interface([abi]);
            //     params = await buildParams({
            //         tokenIn,
            //         tokenOut,
            //         nativeTokenIn: newTokenIn,
            //         nativeTokenOut: "",
            //         amount: newAmount,
            //         address,
            //         paramDetailsMethod,
            //     });
            //     txData = abiInterface.encodeFunctionData(methodName, params);
            //     const tx2 = { to: tokenOutContractAddress, data: txData };
            //     tempTxs.push(tx2);
            // }
            return { txArray: tempTxs, batchFlow: batchFlows };
        } catch (error) {
            console.log("refinance-error", error);
        }
    }
    return useMutation(refinanceForCC);
}
