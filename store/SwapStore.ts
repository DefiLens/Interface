import { create } from "zustand";

export interface iSwap {
    tokenInDecimals: object | number | any;
    tokenOutDecimals: object | number | any;
    amountOutAfterSlippage: object | number | any;

    tokenIn: string;
    tokenOut: string;
    amountIn: string | number;
    amountOut: string;
    slippage: number;

    setTokenInDecimals: (tokenInDecimals: object | number | any) => void;
    setTokenOutDecimals: (tokenOutDecimals: object | number | any) => void;
    setAmountOutAfterSlippage: (amountOutAfterSlippage: object | number) => void;

    setTokenIn: (tokenIn: string) => void;
    setTokenOut: (tokenOut: string) => void;
    setAmountIn: (amountIn: string | number) => void;
    setAmountOut: (amountOut: string) => void;
    setSlippage: (slippage: number) => void;

}

export const useSwapStore = create<iSwap>((set) => ({
    tokenInDecimals: 6,
    tokenOutDecimals: 6,
    amountOutAfterSlippage: 0,

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