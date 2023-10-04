import { create } from "zustand";

interface iSelectedNetwork {
    key: string,
    chainName: string,
    chainId: string,
    icon: any,
};

interface iTokenData {
    chainId: number,
    address: string,
    name: string,
    symbol: string,
    decimals: number,
}

interface iIndividualBatch {
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

    filterFromToken: string;
    filterToToken: string;

    addToBatchLoading: boolean;
    showBatchList: boolean;

    showIndividualBatchList: number | null;
    txhash: string;
    sendtxLoading: boolean;
    sendtxLoadingForEoa: boolean;

    individualBatch: iIndividualBatch[];


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

    setFilterFromToken: (filterFromToken: string) => void;
    setFilterToToken: (filterToToken: string) => void;

    setAddToBatchLoading: (addToBatchLoading: boolean) => void;
    setShowBatchList: (showBatchList: boolean) => void;

    setShowIndividualBatchList: (showIndividualBatchList: number | null) => void;
    setTxHash: (txhash: string) => void;
    setSendtxLoading: (sendtxLoading: boolean) => void;
    setSendtxLoadingForEoa: (sendtxLoadingForEoa: boolean) => void;

    setIndividualBatch: (individualBatch: iIndividualBatch[]) => void;
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

    filterFromToken: "",
    filterToToken: "",

    addToBatchLoading: false,
    showBatchList: false,

    showIndividualBatchList: null,
    txhash: "",
    sendtxLoading: false,
    sendtxLoadingForEoa: false,

    individualBatch: [
        {
            id: 0,
            txHash: [""],
            data: {
                fromNetwork: "Base",
                toNetwork: "Polygon",
                fromProtocol: "aavev2",
                toProtocol: "aaev3",
                fromToken: "aUSDC",
                toToken: "aDAI",
                amountIn: "0.5",
            },
        },
        {
            id: 1,
            txHash: [""],
            data: {
                fromNetwork: "Polygon",
                toNetwork: "Etherum",
                fromProtocol: "dForce",
                toProtocol: "compoundv3",
                fromToken: "dForceUSDC",
                toToken: "cUSDC",
                amountIn: "1.2",
            },
        },
    ],
   
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

    setFilterFromToken: (filterFromToken) => set(() => ({ filterFromToken })),
    setFilterToToken: (filterToToken) => set(() => ({ filterToToken })),

    setAddToBatchLoading: (addToBatchLoading) => set(() => ({ addToBatchLoading })),
    setShowBatchList: (showBatchList) => set(() => ({ showBatchList })),

    setShowIndividualBatchList: (showIndividualBatchList) => set(() => ({ showIndividualBatchList })),
    setTxHash: (txhash) => set(() => ({ txhash })),
    setSendtxLoading: (sendtxLoading) => set(() => ({ sendtxLoading })),
    setSendtxLoadingForEoa: (sendtxLoadingForEoa) => set(() => ({ sendtxLoadingForEoa })),

    setIndividualBatch: (individualBatch) => set(() => ({ individualBatch })),
}));