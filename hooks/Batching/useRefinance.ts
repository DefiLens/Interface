import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../store/appStore";
import { fetchContractDetails } from "../../utils/helper";
import { V3_SWAP_ROUTER_ADDRESS, _functionType, _nonce } from "../../utils/constants";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import { TradeType, Percent, Token, CurrencyAmount } from "@uniswap/sdk-core";
import { getContractInstance, getErc20Data, getProvider } from "../../utils/web3Libs/ethers";
import { parseUnits } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useUniswap } from "../useUniswap";
import { useApprove } from "../useApprove";
import { useBiconomyProvider } from "../aaProvider/useBiconomyProvider";
import { useEoaProvider } from "../aaProvider/useEoaProvider";
import { abiFetcher, abiFetcherNum, buildParams, nativeTokenFetcher, nativeTokenNum } from "./batchingUtils";

export function useRefinance() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { setTxHash, setSendtxLoading, setSendtxLoadingForEoa }: any = useAppStore((state) => state);

    async function refinance({ isSCW, tokenIn, tokenInName, tokenOut, tokenOutName, amount, address, provider }: any) {
        try {
            setTxHash("");
            // if (isSCW) {
            //     setSendtxLoading(true);
            // } else {
            //     setSendtxLoadingForEoa(true);
            // }
            const tempTxs: any = [];
            let abiNum = abiFetcherNum[tokenInName];
            let abi = abiFetcher[abiNum]["withdrawAbi"];
            let methodName = abiFetcher[abiNum]["withdrawMethodName"];
            let paramDetailsMethod = abiFetcher[abiNum]["withdrawParamDetailsMethod"];
            let tokenInContractAddress = abiFetcher[abiNum]["contractAddress"];

            console.log("tokenInName", tokenInName, tokenInContractAddress);

            const tokenInNum = nativeTokenNum[tokenInName];
            console.log("tokenInNum", tokenInNum);
            const nativeTokenIn = nativeTokenFetcher[tokenInNum].nativeToken;
            console.log("nativeTokenIn", nativeTokenIn);

            const tokenOutNum = nativeTokenNum[tokenOutName];
            const nativeTokenOut = nativeTokenFetcher[tokenOutNum].nativeToken;
            console.log("nativeTokenOut", nativeTokenOut);

            const isSwap = nativeTokenIn != nativeTokenOut ? true : false;

            let abiInterface = new ethers.utils.Interface([abi]);
            let params = await buildParams({
                tokenIn,
                tokenOut,
                nativeTokenIn,
                nativeTokenOut,
                amount,
                address,
                paramDetailsMethod,
            });
            let txData = abiInterface.encodeFunctionData(methodName, params);
            const tx1 = { to: tokenInContractAddress, data: txData };
            console.log("tx1", tx1);
            tempTxs.push(tx1);

            let swapData;
            if (isSwap) {
                console.log("isSwap", isSwap);
                const approveData = await approve({
                    tokenIn: nativeTokenIn,
                    spender: V3_SWAP_ROUTER_ADDRESS,
                    amountIn: amount,
                    address,
                    web3JsonProvider: provider,
                });
                if (approveData) tempTxs.push(approveData);
                swapData = await swap({
                    tokenIn: nativeTokenIn, //: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    tokenOut: nativeTokenOut, // nativeTokenOut, //: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    amountIn: amount, //: BigNumber.from('1000000'),
                    address,
                    type: "exactIn",
                });
                tempTxs.push(swapData.swapTx);
            }

            const newTokenIn = isSwap ? nativeTokenOut : nativeTokenIn;
            const newAmount = isSwap ? swapData.amountOutprice : amount;

            abiNum = abiFetcherNum[tokenOutName];
            abi = abiFetcher[abiNum]["depositAbi"];
            methodName = abiFetcher[abiNum]["depositMethodName"];
            paramDetailsMethod = abiFetcher[abiNum]["depositParamDetailsMethod"];
            const tokenOutContractAddress = abiFetcher[abiNum]["contractAddress"];
            console.log(
                "tokenOutContractAddress",
                tokenOutContractAddress,
                paramDetailsMethod,
                methodName,
                abi,
                provider
            );

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

            // if (isSCW) {
            //     await sendToBiconomy(tempTxs);
            // } else {
            //     await sendTxTrditionally(tempTxs);
            // }
            // setSendtxLoading(false);
            // setSendtxLoadingForEoa(false);
            return tempTxs;
        } catch (error) {
            // setSendtxLoading(false);
            // setSendtxLoadingForEoa(false);
            console.log("refinance-error", error);
        }
    }
    return useMutation(refinance);
}

// tokenIn -> aUSDC -> withdraw
