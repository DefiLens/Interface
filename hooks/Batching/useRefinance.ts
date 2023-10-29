import { ethers } from "ethers";
import { toast } from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import { useUniswap } from "../useUniswap";
import { useApprove } from "../useApprove";
import { iTrade, useTradeStore } from "../../store/TradeStore";
import { iBatchingTxn, useBatchingTxnStore } from "../../store/BatchingTxnStore";
import { iCrossChainDifi, useCrossChainDifiStore } from "../../store/CrossChainDifiStore";
import { abiFetcher, abiFetcherNum, buildParams, nativeTokenFetcher, nativeTokenNum } from "./batchingUtils";
import { _functionType, _nonce, uniswapSwapRouterByChainId, V3_SWAP_ROUTER_ADDRESS } from "../../utils/constants";
import { useCalculateGasCost } from "../useCalculateGasCost";

export function useRefinance() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: calculategasCost } = useCalculateGasCost();

    const { selectedFromNetwork }: iTrade = useTradeStore((state) => state);

    const { setTxHash }: iCrossChainDifi = useCrossChainDifiStore((state) => state);
    // const { tokensData }: iBatchingTxn = useBatchingTxnStore((state) => state);
    const { tokensData }: iTrade = useTradeStore((state) => state);

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
            console.log("tokenInName: ", tokenInName, tokensData)

            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!")
            }
            setTxHash("");
            const tempTxs: any = [];
            console.log("1")
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
            console.log("2")

            if (toProtocol == "erc20") {
                nativeTokenOut = tokensData?.filter((token) => token.symbol === tokenOutName)[0].address;
                console.log("nativeTokenOut", nativeTokenOut);
            }
            console.log("3")

            if (toProtocol != "erc20") {
                const tokenOutNum = nativeTokenNum[selectedFromNetwork.chainName][tokenOutName];
                nativeTokenOut = nativeTokenFetcher[selectedFromNetwork.chainName][tokenOutNum].nativeToken;
                console.log("nativeTokenOut", nativeTokenOut);
            }
            console.log("4")

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
                console.log("tx1", tx1);
                tempTxs.push(tx1);
            }
            console.log("5")

            isSwap = nativeTokenIn != nativeTokenOut ? true : false;
            if (isSwap) {
                console.log("isSwap", isSwap);
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
            }
            console.log("6")

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
                console.log("tempTxs", tempTxs);
            }
            const gasCost: number | undefined = await calculategasCost(selectedFromNetwork.chainId)
            console.log('gasCost: ',  gasCost?.toString())
            // alert(gasCost?.toString())

            return tempTxs;
        } catch (error) {
            console.log("refinance-error", error);
        }
    }
    return useMutation(refinance);
}
