import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { Permit2Address } from "../../utils/constants";
import { toast } from "react-toastify";
import { usePriceHook } from "./usePriceHook";
import { useErc20Data } from "../useErc20Hooks";

type Props = {
  tokenIn: any;
  tokenOut: any;
  amountIn: any;
  isWrapEth: any;
  isUnWrapEth: any;
  address: any;
};

export function useParseData() {
  const { mutateAsync: generateRoute } = usePriceHook();
  const { mutateAsync: getErc20Data } = useErc20Data();

  async function checkSpenderAllowance({
    tokenIn,
    tokenOut,
    amountIn,
    isWrapEth,
    isUnWrapEth,
    address,
  }: Props): Promise<any> {
    let id: any;
    try {
      const erc20tokenIndata = await getErc20Data({
        token: tokenIn,
        address: address,
        spender: Permit2Address,
      });
      const erc20tokenOutdata = await getErc20Data({
        token: tokenOut,
        address: address,
        spender: Permit2Address,
      });

      const tokenInBalance = erc20tokenIndata?.balance;
      const tokenInDecimals = erc20tokenIndata?.decimals;
      const tokenOutDecimals = erc20tokenOutdata?.decimals;
      console.log("tokenInBalance: ", tokenInBalance?.toString());
      console.log("tokenInDecimals: ", tokenInDecimals.toString());
      console.log("tokenOutDecimals: ", tokenOutDecimals.toString());

      const route: any = await generateRoute({
        tokenIn,
        tokenOut,
        value: amountIn.toString(),
        type: "exactIn",
        address,
      });

      const amountOutprice: any = route?.quote.toExact().toString();
      console.log("amountOutprice", amountOutprice.toString());
      let tempAmountOutprice = ethers.utils.parseUnits(
        amountOutprice,
        tokenOutDecimals
      );

      return { route, tempAmountOutprice };
    } catch (error) {
      toast.update(id, {
        render: "Approve Error",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.log("chackBalanceAndAllwance-error-", error);
      return undefined;
    }
  }
  return useMutation(checkSpenderAllowance);
}
