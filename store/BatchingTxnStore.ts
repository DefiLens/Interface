import { create } from "zustand";

interface iIndividualBatch  {
    id: number;
    txHash: string[];
    data: { fromProtocol: string; toProtocol: string; fromToken: string; toToken: string; amountIn: string };
};

interface iTokenData {
    symbol: string;
    address: string;
    chainId: number;
    decimals: number;
    name: string;
};
export interface iBatchingTxn {
    tokensData: iTokenData[];
    fromProtocol: string;
    toProtocol: string;
    fromToken: string;
    toToken: string;
    amountIn: number;
    fromTokenBalanceForSCW: number;
    fromTokenBalanceForEOA: number;
    fromTokenDecimal: number;
    addToBatchLoading: boolean;

    individualBatch : iIndividualBatch[];
    showIndividualBatchList: number | null;

    apys: any[];
    apysTo: any[];
    sendTxLoadingForEoa: boolean
    sendTxLoading: boolean;
    txhash: string;
    allTxs: any[];

    setTokensData: (tokensData: iTokenData[]) => void;
    setFromProtocol: (fromProtocol: string) => void;
    setToProtocol: (toProtocol: string) => void;
    setFromToken: (fromToken: string) => void;
    setToToken: (toToken: string) => void;
    setAmountIn: (amountIn: number) => void;
    setFromTokenBalanceForSCW: (fromTokenBalanceForSCW: number) => void;
    setFromTokenBalanceForEOA: (fromTokenBalanceForEOA: number) => void;
    setFromTokenDecimal: (fromTokenDecimal: number) => void;
    setAddToBatchLoading: (addToBatchLoading: boolean) => void;

    setIndividualBatch: (individualBatch: iIndividualBatch[]) => void;
    setShowIndividualBatchList: (showIndividualBatchList: number | null) => void;

    setApys: (apys: any[]) => void;
    setApysForTo: (apysTo: any[]) => void;
    setSendtxLoadingForEoa: (sendTxLoadingForEoa: boolean) => void;
    setSendtxLoading: (sendTxLoading: boolean) => void;
    setTxHash: (txhash: string) => void;
    setCollectedValues: (allTxs: any[]) => void;

}

export const useBatchingTxnStore = create<iBatchingTxn>((set) => ({
    tokensData: [],
    fromProtocol: "",
    toProtocol: "",
    fromToken: "",
    toToken: "",
    amountIn: 0,
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

    apys: [],
    apysTo: [],
    sendTxLoadingForEoa: false,
    sendTxLoading: false,
    txhash: "",
    allTxs: [],


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

    setApys: (apys) => set(() => ({ apys })),
    setApysForTo: (apysTo) => set(() => ({ apysTo })),
    setSendtxLoadingForEoa: (sendTxLoadingForEoa) => set(() => ({ sendTxLoadingForEoa })),
    setSendtxLoading: (sendTxLoading) => set(() => ({ sendTxLoading })),
    setTxHash: (txhash) => set(() => ({ txhash })),
    setCollectedValues: (allTxs) => set(() => ({ allTxs })),
}));