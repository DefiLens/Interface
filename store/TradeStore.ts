import { create } from "zustand";
import { BigNumber } from "ethers";

export interface iSelectedNetwork {
    key: string,
    chainName: string,
    chainId: string,
    icon: any,
};

export interface iTokenData {
    chainId: number,
    address: string,
    name: string,
    symbol: string,
    decimals: number,
}

export interface iIndividualBatch {
    id: number,
    txHash: string[],
    data: {
        fromNetwork: string,
        toNetwork: string,
        fromProtocol: string,
        toProtocol: string,
        fromToken: string,
        toToken: string,
        amountIn: string,
    },
}

export interface iTrade {
    showSelectNetworkList: boolean;

    selectedFromNetwork: iSelectedNetwork;
    selectedFromProtocol: string;
    selectedFromToken: string;

    selectedToNetwork: iSelectedNetwork;
    selectedToProtocol: string;
    selectedToToken: string;

    showFromSelectionMenu: boolean;
    showToSelectionMenu: boolean;

    tokensData: iTokenData[];
    amountIn: string;
    fromTokenDecimal: number;

    fromTokenBalanceForSCW: BigNumber;
    fromTokenBalanceForEOA: BigNumber;

    filterFromToken: string;
    filterToToken: string;

    addToBatchLoading: boolean;
    showBatchList: boolean;

    txhash: string;
    sendTxLoading: boolean;
    sendTxLoadingForEoa: boolean;

    individualBatch: iIndividualBatch[];
    showIndividualBatchList: number | null;


    setShowSelectNetworkList: (showSelectNetworkList: boolean) => void;
    
    setSelectedFromNetwork: (selectedFromNetwork: iSelectedNetwork) => void;
    setSelectedFromProtocol: (selectedFromProtocol: string) => void;
    setSelectedFromToken: (selectedFromToken: string) => void;

    setSelectedToNetwork: (selectedToNetwork: iSelectedNetwork) => void;
    setSelectedToProtocol: (selectedToProtocol: string) => void;
    setSelectedToToken: (selectedToToken: string) => void;

    setShowFromSelectionMenu: (showFromSelectionMenu: boolean) => void;
    setShowToSelectionMenu: (showToSelectionMenu: boolean) => void;

    setTokensData: (tokensData: iTokenData[]) => void;
    setAmountIn: (amountIn: string) => void;
    setFromTokenDecimal: (fromTokenDecimal: number) => void;

    setFromTokenBalanceForSCW: (fromTokenBalanceForSCW: BigNumber) => void;
    setFromTokenBalanceForEOA: (fromTokenBalanceForEOA: BigNumber) => void;

    setFilterFromToken: (filterFromToken: string) => void;
    setFilterToToken: (filterToToken: string) => void;

    setAddToBatchLoading: (addToBatchLoading: boolean) => void;
    setShowBatchList: (showBatchList: boolean) => void;

    setTxHash: (txhash: string) => void;
    setSendTxLoading: (sendTxLoading: boolean) => void;
    setSendTxLoadingForEoa: (sendTxLoadingForEoa: boolean) => void;

    setIndividualBatch: (individualBatch: iIndividualBatch[]) => void;
    setShowIndividualBatchList: (showIndividualBatchList: number | null) => void;
}

export const useTradeStore = create<iTrade>((set) => ({
    showSelectNetworkList: false,
    
    selectedFromNetwork:  {
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    },
    selectedFromProtocol: "",
    selectedFromToken: "",

    selectedToNetwork:  {
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    },
    selectedToProtocol: "",
    selectedToToken: "",

    showFromSelectionMenu: false,
    showToSelectionMenu: false,

    tokensData: [],
    amountIn: "",
    fromTokenDecimal: 0,

    fromTokenBalanceForSCW: BigNumber.from(0),
    fromTokenBalanceForEOA: BigNumber.from(0),

    filterFromToken: "",
    filterToToken: "",

    addToBatchLoading: false,
    showBatchList: false,

    txhash: "",
    sendTxLoading: false,
    sendTxLoadingForEoa: false,

    individualBatch: [
        {
            id: 0,
            txHash: [],
            data: {
                fromNetwork: "",
                toNetwork: "",
                fromProtocol: "",
                toProtocol: "",
                fromToken: "",
                toToken: "",
                amountIn: "",
            },
        },
    ],
    showIndividualBatchList: null,

   
    setShowSelectNetworkList: (showSelectNetworkList) => set(() => ({ showSelectNetworkList })),
    
    setSelectedFromNetwork: (selectedFromNetwork) => set(() => ({ selectedFromNetwork })),
    setSelectedFromProtocol: (selectedFromProtocol) => set(() => ({ selectedFromProtocol })),
    setSelectedFromToken: (selectedFromToken) => set(() => ({ selectedFromToken })),

    setSelectedToNetwork: (selectedToNetwork) => set(() => ({ selectedToNetwork })),
    setSelectedToProtocol: (selectedToProtocol) => set(() => ({ selectedToProtocol })),
    setSelectedToToken: (selectedToToken) => set(() => ({ selectedToToken })),

    setShowFromSelectionMenu: (showFromSelectionMenu) => set(() => ({ showFromSelectionMenu })),
    setShowToSelectionMenu: (showToSelectionMenu) => set(() => ({ showToSelectionMenu })),

    setTokensData: (tokensData) => set(() => ({ tokensData })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setFromTokenDecimal: (fromTokenDecimal) => set(() => ({ fromTokenDecimal })),

    setFromTokenBalanceForSCW: (fromTokenBalanceForSCW) => set(() => ({ fromTokenBalanceForSCW })),
    setFromTokenBalanceForEOA: (fromTokenBalanceForEOA) => set(() => ({ fromTokenBalanceForEOA })),

    setFilterFromToken: (filterFromToken) => set(() => ({ filterFromToken })),
    setFilterToToken: (filterToToken) => set(() => ({ filterToToken })),

    setAddToBatchLoading: (addToBatchLoading) => set(() => ({ addToBatchLoading })),
    setShowBatchList: (showBatchList) => set(() => ({ showBatchList })),

    setTxHash: (txhash) => set(() => ({ txhash })),
    setSendTxLoading: (sendTxLoading) => set(() => ({ sendTxLoading })),
    setSendTxLoadingForEoa: (sendTxLoadingForEoa) => set(() => ({ sendTxLoadingForEoa })),
    
    setIndividualBatch: (individualBatch) => set(() => ({ individualBatch })),
    setShowIndividualBatchList: (showIndividualBatchList) => set(() => ({ showIndividualBatchList })),
}));