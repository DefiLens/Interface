import { BigNumber } from "ethers";
import toast from "react-hot-toast";

import { parseUnits } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";

import IERC20 from "../../abis/IERC20.json";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { getContractInstance, getErc20Decimals, getProvider } from "../../utils/web3Libs/ethers";
import { uniswapSwapRouterByChainId } from "../../utils/data/protocols";

export function useUniswap() {
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    async function swap({ tokenIn, tokenOut, amountIn, address, type }: any) {
        try {
            const web3JsonProvider = await getProvider(selectedNetwork.chainId);
            if (!web3JsonProvider) {
                toast.error("No provider");
                return;
            }
            const router = new AlphaRouter({
                chainId: BigNumber.from(selectedNetwork.chainId).toNumber(),
                provider: web3JsonProvider,
            });

            const erc20In: any = await getContractInstance(tokenIn, IERC20, web3JsonProvider);
            const erc20Out: any = await getContractInstance(tokenOut, IERC20, web3JsonProvider);

            const tokenInDecimals: any = await getErc20Decimals(erc20In);
            const tokenOutDecimals: any = await getErc20Decimals(erc20Out);

            const options = {
                recipient: address,
                slippageTolerance: new Percent(50, 10_000),
                deadline: Math.floor(Date.now() / 1000 + 1800),
                type: SwapType.SWAP_ROUTER_02,
            };

            const currencyIn = new Token(BigNumber.from(selectedNetwork.chainId).toNumber(), tokenIn, tokenInDecimals);
            const currencyOut = new Token(
                BigNumber.from(selectedNetwork.chainId).toNumber(),
                tokenOut,
                tokenOutDecimals
            );

            const baseCurrency = type === "exactIn" ? currencyIn : currencyOut;
            const quoteCurrency = type === "exactIn" ? currencyOut : currencyIn;

            const amount = await CurrencyAmount.fromRawAmount(baseCurrency, amountIn);
            const route: any = await router?.route(
                amount,
                quoteCurrency,
                type === "exactIn" ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
                options
            );
            let amountOutprice: any = route?.quote.toExact().toString();
            amountOutprice = parseUnits(amountOutprice, tokenOutDecimals);
            const swapTx = {
                to: uniswapSwapRouterByChainId[selectedNetwork.chainId],
                data: route.methodParameters?.calldata,
            };
            return { swapTx, tokenIn, tokenOut, amountOutprice, tokenInDecimals, tokenOutDecimals };
        } catch (error) {
            console.log("swapUniV3-error", error);
        }
    }
    return useMutation(swap);
}
