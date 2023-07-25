import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { V3_SWAP_ROUTER_ADDRESS } from "../../utils/constants";
import { useParseData } from "./useParseData";

type SwapTx = {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  address: string;
};

export function useSwapTx() {
  const { mutateAsync: checkSpenderAllowance } = useParseData();
  const swapTx = async ({ tokenIn, tokenOut, amountIn, address }: SwapTx) => {
    const routesData: any = await checkSpenderAllowance({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      amountIn: BigNumber.from(amountIn),
      isWrapEth: false,
      isUnWrapEth: false,
      address: address,
    });
    console.log("amountOutprice: ", routesData.tempAmountOutprice);
    const swapTx = {
      to: V3_SWAP_ROUTER_ADDRESS,
      data: routesData.route.methodParameters?.calldata,
    };
    return swapTx;
  };

  return useMutation(swapTx);
}
