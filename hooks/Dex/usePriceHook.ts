import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import {
  AlphaRouter,
  ChainId,
  SwapOptionsSwapRouter02,
  SwapType,
} from "@uniswap/smart-order-router";
import { TradeType, CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import { useErc20Data } from "../useErc20Hooks";
import { V3_SWAP_ROUTER_ADDRESS } from "../../utils/constants";

type Props = {
  tokenIn: any;
  tokenOut: any;
  value: any;
  type: any;
  address: any;
};

export function usePriceHook() {
  const { mutateAsync: getErc20Data } = useErc20Data();

  async function generateRoute({
    tokenIn,
    tokenOut,
    value,
    type,
    address,
  }: Props): Promise<any> {
    try {
      const polygon = `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_POLYGON_INFURA_API_KEY}`;
      const provider = new ethers.providers.JsonRpcProvider(polygon);
      const router = new AlphaRouter({
        chainId: ChainId.POLYGON,
        provider: provider,
      });
      console.log("routerin", router);

      const erc20tokenIndata = await getErc20Data({
        token: tokenIn,
        address: address,
        spender: V3_SWAP_ROUTER_ADDRESS,
      });
      const erc20tokenOutdata = await getErc20Data({
        token: tokenOut,
        address: address,
        spender: V3_SWAP_ROUTER_ADDRESS,
      });

      const options: SwapOptionsSwapRouter02 = {
        recipient: address,
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
      };

      const currencyIn = new Token(137, tokenIn, erc20tokenIndata?.decimals);
      const currencyOut = new Token(137, tokenOut, erc20tokenOutdata?.decimals);

      const baseCurrency = type === "exactIn" ? currencyIn : currencyOut;
      const quoteCurrency = type === "exactIn" ? currencyOut : currencyIn;
      const amount = await CurrencyAmount.fromRawAmount(baseCurrency, value);

      const route = await router?.route(
        amount,
        quoteCurrency,
        type === "exactIn" ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
        options
      );
      return route;
    } catch (error) {
      console.log("route-error", error);
    }
  }
  return useMutation(generateRoute);
}
