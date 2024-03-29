import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { decreasePowerByDecimals } from "../../utils/helper";
import { NODE_JWT_TOKEN, NODE_ONEINCH_URL } from "../../utils/keys";
import { getAuthToken } from "../../utils/jwtutils";

export function useOneInch() {
    async function oneInchSwap({ tokenIn, tokenOut, amountIn, address, type, chainId }: any) {
        try {
            // await getAuthToken()
            console.log("NODE_JWT_TOKEN", NODE_JWT_TOKEN)
            axios.defaults.headers.common['Authorization'] = `Bearer ${NODE_JWT_TOKEN}`;
            const params = {
                chainId: chainId,
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                amountIn: amountIn,
                from: address,
                slippage: "1",
            }
            const paramswithUrl = new URLSearchParams(params).toString()
            const url = `${NODE_ONEINCH_URL}?${paramswithUrl}`;
            const swapData: any = await axios.get(url);
            const amountOutprice = swapData.data.response.dstAmount;
            const amountOutpriceWithoutDecimal = await decreasePowerByDecimals(
                amountOutprice,
                swapData.data.response.dstToken.decimals
            );
            const swapTx = {
                to: swapData.data.response.tx.to,
                data: swapData.data.response.tx.data,
                value: swapData.data.response.tx.value
            };
            console.log('OnInchSwapTx: ', swapTx)
            return {
                swapTx,
                tokenIn,
                tokenOut,
                amountOutprice,
                amountOutpriceWithoutDecimal,
                tokenInDecimals: swapData.data.response.srcToken.decimals,
                tokenOutDecimals: swapData.data.response.dstToken.decimals,
            };
        } catch (error) {
            console.log("oneInchSwap-error", error);
        }
    }
    return useMutation(oneInchSwap);
}
