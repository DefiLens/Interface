import { create } from "zustand";

interface iIndividualBatch  {
    id: number;
    txHash: string[];
    data: { fromProtocol: string; toProtocol: string; fromToken: string; toToken: string; amountIn: string };
};

export interface iBatchingTxn {
    tokensData: object[];
    fromProtocol: string;
    toProtocol: string;
    fromToken: string;
    toToken: string;
    amountIn: number | string;
    fromTokenBalanceForSCW: number | undefined;
    fromTokenBalanceForEOA: number | undefined;
    fromTokenDecimal: number;
    addToBatchLoading: boolean;

    individualBatch : iIndividualBatch[];
    showIndividualBatchList: number | null;


    setTokensData: (tokensData: object[]) => void;
    setFromProtocol: (fromProtocol: string) => void;
    setToProtocol: (toProtocol: string) => void;
    setFromToken: (fromToken: string) => void;
    setToToken: (toToken: string) => void;
    setAmountIn: (amountIn: number | string) => void;
    setFromTokenBalanceForSCW: (fromTokenBalanceForSCW: number | undefined) => void;
    setFromTokenBalanceForEOA: (fromTokenBalanceForEOA: number | undefined) => void;
    setFromTokenDecimal: (fromTokenDecimal: number) => void;
    setAddToBatchLoading: (addToBatchLoading: boolean) => void;

    setIndividualBatch: (individualBatch: iIndividualBatch[]) => void;
    setShowIndividualBatchList: (showIndividualBatchList: number | null) => void;

}

export const useBatchingTxnStore = create<iBatchingTxn>((set) => ({
    tokensData: [],
    fromProtocol: "",
    toProtocol: "",
    fromToken: "",
    toToken: "",
    amountIn: "",
    fromTokenBalanceForSCW: 0,
    fromTokenBalanceForEOA: 0,
    fromTokenDecimal: 0,
    addToBatchLoading: false,

    individualBatch : [
        {
            id: 0,
            txHash: [],
            data: {
                fromProtocol: "",
                toProtocol: "",
                fromToken: "",
                toToken: "",
                amountIn: "",
            },
        },
    ],
    showIndividualBatchList: null,


    setTokensData: (tokensData) => set(() => ({ tokensData })),
    setFromProtocol: (fromProtocol) => set(() => ({ fromProtocol })),
    setToProtocol: (toProtocol) => set(() => ({ toProtocol })),
    setFromToken: (fromToken) => set(() => ({ fromToken })),
    setToToken: (toToken) => set(() => ({ toToken })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setFromTokenBalanceForSCW: (fromTokenBalanceForSCW) => set(() => ({ fromTokenBalanceForSCW })),
    setFromTokenBalanceForEOA: (fromTokenBalanceForEOA) => set(() => ({ fromTokenBalanceForEOA })),
    setFromTokenDecimal: (fromTokenDecimal) => set(() => ({ fromTokenDecimal })),
    setAddToBatchLoading: (addToBatchLoading) => set(() => ({ addToBatchLoading })),

    setIndividualBatch: (individualBatch) => set(() => ({ individualBatch })),
    setShowIndividualBatchList: (showIndividualBatchList) => set(() => ({ showIndividualBatchList })),
}));