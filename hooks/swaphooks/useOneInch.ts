import axios from "axios";

import { useMutation } from "@tanstack/react-query";

import { tOneInchSwapResponseFromApi, tOneInch, tOneInchParams, tOneInchSwapResponse } from "../types";
import { decreasePowerByDecimals } from "../../utils/helper";
import { NODE_JWT_TOKEN, NODE_ONEINCH_URL } from "../../utils/keys";
import toast from "react-hot-toast";

export function useOneInch() {
    async function oneInchSwap({ tokenIn, tokenOut, amountIn, address, type, chainId }: tOneInch): Promise<tOneInchSwapResponse | undefined> {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${NODE_JWT_TOKEN}`;
            const params: tOneInchParams = {
                chainId: chainId.toString(),
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                amountIn: amountIn.toString(),
                from: address,
                slippage: "1",
            }
            const paramswithUrl = new URLSearchParams(params).toString()
            const url = `${NODE_ONEINCH_URL}?${paramswithUrl}`;
            const swapData = await axios.get(url);
            const parseSwapData: tOneInchSwapResponseFromApi = swapData.data.response;
            const amountOutprice = parseSwapData.dstAmount;
            const amountOutpriceWithoutDecimal = await decreasePowerByDecimals(
                amountOutprice,
                parseSwapData.dstToken.decimals
            );
            const swapTx = {
                to: parseSwapData.tx.to,
                data: parseSwapData.tx.data,
                value: parseSwapData.tx.value
            };
            // console.log('OnInchSwapTx: ', swapTx)
            return {
                swapTx,
                tokenIn,
                tokenOut,
                amountOutprice,
                amountOutpriceWithoutDecimal,
                tokenInDecimals: parseSwapData.srcToken.decimals,
                tokenOutDecimals: parseSwapData.dstToken.decimals,
            };
        } catch (error) {
            console.log("oneInchSwap-error", error);
            toast.error("Swap failed, This token is not supported by 1inch. Please try another token.");
        }
    }
    return useMutation(oneInchSwap);
}
