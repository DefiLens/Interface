import { useMutation } from "@tanstack/react-query";
import { useAaveWithdrawTx } from "../aave/useAave";
import { useSwapTx } from "../Dex/useSwap";
import { useCompoundDepositTx } from "../compound/useCompound";
import { useApprove } from "../useErc20Hooks";
import {
  V3_SWAP_ROUTER_ADDRESS,
  aaveContractAddress,
  compoundContractAddress,
} from "../../utils/constants";
import { BigNumber } from "ethers";

type otherParams = {
  tokenIn?: any;
  tokenOut?: any;
  amountIn?: any;
  address?: any;
};

type props = {
  params: otherParams;
  action: any;
};

export function useCallBatch() {
  const { mutateAsync: aaveWithdrawTx } = useAaveWithdrawTx();
  const { mutateAsync: swapTx } = useSwapTx();
  const { mutateAsync: compoundDepositTx } = useCompoundDepositTx();
  const { mutateAsync: approve } = useApprove();

  const callBatches = async ({ params, action }: props) => {
    try {
      const tempTxs: any = [];
      let approvetx;
      let tx;
      if (action == "withdraw") {
        if (!params.tokenIn || !params.amountIn)
          return alert("fill the fields of withdraw");
        approvetx = await approve({
          token: params.tokenIn,
          spender: aaveContractAddress,
          value: BigNumber.from(params.amountIn),
        });
        tx = await aaveWithdrawTx({
          token: params.tokenIn,
          value: params.amountIn,
          address: params.address,
        });
        tempTxs.push(approvetx);
        tempTxs.push(tx);
      } else if (action == "deposit") {
        if (!params.tokenIn || !params.amountIn)
          return alert("fill the fields of deposit");
        approvetx = await approve({
          token: params.tokenIn,
          spender: compoundContractAddress,
          value: BigNumber.from(params.amountIn),
        });
        tx = await compoundDepositTx({
          token: params.tokenIn,
          value: params.amountIn,
        });
        tempTxs.push(approvetx);
        tempTxs.push(tx);
      } else if (action == "swap") {
        if ((!params.tokenIn && !params.tokenOut) || !params.amountIn)
          return alert("fill the fields of swap");
        approvetx = await approve({
          token: params.tokenIn,
          spender: V3_SWAP_ROUTER_ADDRESS,
          value: BigNumber.from(params.amountIn),
        });
        tx = await swapTx({
          tokenIn: params.tokenIn,
          tokenOut: params.tokenOut,
          amountIn: params.amountIn,
          address: params.address,
        });
        tempTxs.push(approvetx);
        tempTxs.push(tx);
      } else {
        alert("Invalid Trade");
        return;
      }
      console.log("Lock tx", tempTxs);
      return tempTxs;
    } catch (error) {
      console.log("callBatches-error", error);
    }
  };

  return useMutation(callBatches);
}
