import { create } from "zustand";
import { BigNumber } from "ethers";

export interface iSwap {
    tokenInDecimals: number;
    tokenOutDecimals: number;
    amountOutAfterSlippage: BigNumber;

    tokenIn: string;
    tokenOut: string;
    amountIn: string | number;
    amountOut: string;
    slippage: number;

    setTokenInDecimals: (tokenInDecimals: number) => void;
    setTokenOutDecimals: (tokenOutDecimals: number) => void;
    setAmountOutAfterSlippage: (amountOutAfterSlippage: BigNumber) => void;

    setTokenIn: (tokenIn: string) => void;
    setTokenOut: (tokenOut: string) => void;
    setAmountIn: (amountIn: string | number) => void;
    setAmountOut: (amountOut: string) => void;
    setSlippage: (slippage: number) => void;
}

export const useSwapStore = create<iSwap>((set) => ({
    tokenInDecimals: 6,
    tokenOutDecimals: 6,
    amountOutAfterSlippage: BigNumber.from(0),

    tokenIn: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    tokenOut: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    amountIn: "",
    amountOut: "",
    slippage: 0,

    setTokenInDecimals: (tokenInDecimals) => set(() => ({ tokenInDecimals })),
    setTokenOutDecimals: (tokenOutDecimals) => set(() => ({ tokenOutDecimals })),
    setAmountOutAfterSlippage: (amountOutAfterSlippage) => set(() => ({ amountOutAfterSlippage })),

    setTokenIn: (tokenIn) => set(() => ({ tokenIn })),
    setTokenOut: (tokenOut) => set(() => ({ tokenOut })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setAmountOut: (amountOut) => set(() => ({ amountOut })),
    setSlippage: (slippage) => set(() => ({ slippage })),
}));