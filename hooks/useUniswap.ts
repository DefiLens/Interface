import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../store/appStore';
import { fetchContractDetails } from '../utils/helper';
import { V3_SWAP_ROUTER_ADDRESS, _functionType, _nonce } from '../utils/constants';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';
import { TradeType, Percent, Token, CurrencyAmount } from '@uniswap/sdk-core';
import { getContractInstance, getErc20Data, getProvider } from '../utils/web3Libs/ethers';
import { parseUnits } from 'ethers/lib/utils';

export function useUniswap() {
    async function swap({tokenIn, tokenOut, amountIn, address, type}: any) {
        try {
            const web3JsonProvider = await getProvider('109')
            if (!web3JsonProvider) throw("No provider")
            const router = new AlphaRouter({
              chainId: 137,
              provider: web3JsonProvider,
            });

            const erc20tokenIndata: any = await getErc20Data(
                tokenIn,
                address,
                V3_SWAP_ROUTER_ADDRESS,
                web3JsonProvider
            );
            const erc20tokenOutdata: any = await getErc20Data(
                tokenOut,
                address,
                V3_SWAP_ROUTER_ADDRESS,
                web3JsonProvider
            );

            const options = {
              recipient: address,
              slippageTolerance: new Percent(50, 10_000),
              deadline: Math.floor(Date.now() / 1000 + 1800),
              type: SwapType.SWAP_ROUTER_02,
            };

            const currencyIn = new Token(137, tokenIn, erc20tokenIndata?.decimals);
            const currencyOut = new Token(137, tokenOut, erc20tokenOutdata?.decimals);

            const baseCurrency = type === 'exactIn' ? currencyIn : currencyOut;
            const quoteCurrency = type === 'exactIn' ? currencyOut : currencyIn;

            const amount = await CurrencyAmount.fromRawAmount(baseCurrency, amountIn);

            const route: any = await router?.route(
              amount,
              quoteCurrency,
              type === 'exactIn' ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
              options
            );
            let amountOutprice: any = route?.quote.toExact().toString();
            // amountOutprice = parseUnits(amountOutprice, erc20tokenOutdata.decimals);
            // console.log('amountOutprice', amountOutprice.toString());

            const swapTx = {
              to: V3_SWAP_ROUTER_ADDRESS,
              data: route.methodParameters?.calldata,
            };
            return { swapTx, tokenIn, tokenOut, amountOutprice };
          } catch (error) {
            console.log('swapUniV3-error', error);
          }
    }
    return useMutation(swap);
}
