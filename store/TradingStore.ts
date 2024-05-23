import { create } from "zustand";
import { BigNumber as bg } from "bignumber.js";
import { Indexed } from "ethers/lib/utils";
import { iGlobal, useGlobalStore } from "./GlobalStore";

export interface iSelectedNetwork {
    key: string;
    chainName: string;
    chainId: string;
    icon: any;
}

export interface iTokenData {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
}

export interface iBatchFlowData {
    fromChainId: string;
    toChainId?: string;
    protocol: string;
    tokenIn: string;
    tokenOut: string;
    amount: string | any;
    action: string;
}

export interface iIndividualBatch {
    id: number;
    txArray: string[];
    batchesFlow?: iBatchFlowData[];
    data: {
        fromNetwork: string;
        toNetwork: string;
        fromChainId: string;
        toChainId: string;
        fromProtocol: string;
        toProtocol: string;
        fromToken: string;
        toToken: string;
        amountIn: string;
        amountOut: string;
        fees: string;
        extraValue: string;
    };
    simulation?: {
        isSuccess: boolean;
        isError: boolean;
    };
    simulationHash?: string;
}

export interface iContract {
    contractName: string;
    contractAddress: string;
    extraOrShareToken?: string;
}

export interface iContractMetaData {
    methodNames: string[];
    amountFieldIndex: number[];
}

export interface iTokens {
    [tokenName: string]: string;
}

export interface iChainPing {
    [network: string]: string;
}

export interface iStarGateRouter {
    [network: string]: string;
}

export interface iApiResponse {
    contracts: iContract[];
    contractMetaData: Record<string, iContractMetaData>;
    tokens: iTokens;
    chainPing: iChainPing;
    starGateRouter: iStarGateRouter;
}

export interface iFuncArray {
    name: string;
    inputs: any[];
    outputs: any[];
    stateMutability: string;
    type: string;
}

interface iBalanceStore {
    tokenBalances: {
        [key: string]: string;
    };
    setTokenBalances: (balance: {
        [key: string]: string;
    }) => void;
}

export const useBalanceStore = create<iBalanceStore>((set) => ({
    tokenBalances: {},
    setTokenBalances: (item) =>
        set((state) => ({
            tokenBalances: {
                ...state.tokenBalances,
                ...item,
            },
        })),
}));

export interface iTrading {
    totalfees: bg;
    maxBalance: string;
    ismaxBalanceLoading: boolean;

    selectedFromNetwork: iSelectedNetwork;
    selectedFromProtocol: string;
    selectedFromToken: string;

    selectedToNetwork: iSelectedNetwork;
    selectedToProtocol: string;
    selectedToToken: string;

    showFromSelectionMenu: boolean;
    showToSelectionMenu: boolean;

    fromTokensData: iTokenData[];
    toTokensData: iTokenData[];
    amountIn: string | any;
    fromTokenDecimal: number;

    filterFromToken: string;
    filterToToken: string;
    filterFromAddress: string;
    filterToAddress: string;

    addToBatchLoading: boolean;
    showBatchList: boolean;

    txhash: string;
    sendTxLoading: boolean;

    showIndividualBatchList: number | null;

    srcPoolId: number;
    destPoolId: number;

    showExecuteBatchModel: boolean;
    hasExecutionSuccess: string;
    hasExecutionError: string;
    showExecuteMethodModel: boolean;

    simulationHashes: string[];

    setTotalFees: (totalfees: bg) => void;
    setMaxBalance: (maxBalance: string) => void;
    setIsmaxBalanceLoading: (ismaxBalanceLoading: boolean) => void;

    setSelectedFromNetwork: (selectedFromNetwork: iSelectedNetwork) => void;
    setSelectedFromProtocol: (selectedFromProtocol: string) => void;
    setSelectedFromToken: (selectedFromToken: string) => void;

    setSelectedToNetwork: (selectedToNetwork: iSelectedNetwork) => void;
    setSelectedToProtocol: (selectedToProtocol: string) => void;
    setSelectedToToken: (selectedToToken: string) => void;

    setShowFromSelectionMenu: (showFromSelectionMenu: boolean) => void;
    setShowToSelectionMenu: (showToSelectionMenu: boolean) => void;

    setFromTokensData: (fromTokensData: iTokenData[]) => void;
    setToTokensData: (toTokensData: iTokenData[]) => void;
    setAmountIn: (amountIn: string) => void;
    setFromTokenDecimal: (fromTokenDecimal: number) => void;

    setFilterFromToken: (filterFromToken: string) => void;
    setFilterToToken: (filterToToken: string) => void;
    setFilterFromAddress: (filterFromAddress: string) => void;
    setFilterToAddress: (filterToAddress: string) => void;

    setAddToBatchLoading: (addToBatchLoading: boolean) => void;
    setShowBatchList: (showBatchList: boolean) => void;

    setTxHash: (txhash: string) => void;
    setSendTxLoading: (sendTxLoading: boolean) => void;

    setShowIndividualBatchList: (showIndividualBatchList: number | null) => void;

    setSrcPoolId: (srcPoolId: number) => void;
    setDestPoolId: (destPoolId: number) => void;

    setShowExecuteBatchModel: (showExecuteBatchModel: boolean) => void;
    setHasExecutionSuccess: (hasExecutionSuccess: string) => void;
    setHasExecutionError: (hasExecutionError: string) => void;
    setShowExecuteMethodModel: (showExecuteMethodModel: boolean) => void;

    individualBatch: iIndividualBatch[];
    addBatchItem: (item: iIndividualBatch) => void;
    removeBatchItem: (id: number) => void;
    setSimulationsHashes: (simulationHashes: string[]) => void;

    oraclePrice: number;
    setOraclePrice: (oraclePrice: number) => void;

    oraclePriceLoading: boolean;
    setOraclePriceLoading: (oraclePriceLoading: boolean) => void;

    simulationSmartAddress: string | null | any;
    setSimulationSmartAddress: (simulationSmartAddress: string | null) => void;

    selectedFromTokenAddress: string;
    setSelectedFromTokenAddress: (selectedFromTokenAddress: string) => void;

    showReviewModal: boolean;
    setShowReviewModal: (showReviewModal: boolean) => void;

    selectedExecuteMethod: string;
    setSelectedExecuteMethod: (selectedExecuteMethod: string) => void;
}

export const useTradingStore = create<iTrading>((set) => ({
    individualBatch: [],
    addBatchItem: (item) =>
        set((state) => ({
            individualBatch: [...state.individualBatch, item],
        })),
    removeBatchItem: (index) =>
        set((state) => ({
            individualBatch: state.individualBatch.filter((_, i) => i !== index),
        })),

    totalfees: bg(0),
    maxBalance: "",
    ismaxBalanceLoading: false,

    selectedFromNetwork: {
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    },
    selectedFromProtocol: "",
    selectedFromToken: "",

    selectedToNetwork: {
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    },
    selectedToProtocol: "",
    selectedToToken: "",

    showFromSelectionMenu: false,
    showToSelectionMenu: false,

    fromTokensData: [],
    toTokensData: [],
    amountIn: "",
    fromTokenDecimal: 0,

    filterFromToken: "",
    filterToToken: "",
    filterFromAddress: "",
    filterToAddress: "",

    addToBatchLoading: false,
    showBatchList: false,

    txhash: "",
    sendTxLoading: false,

    showIndividualBatchList: null,

    srcPoolId: 1,
    destPoolId: 1,

    showExecuteBatchModel: false,
    hasExecutionSuccess: "",
    hasExecutionError: "",
    showExecuteMethodModel: false,

    simulationHashes: [],

    setTotalFees: (totalfees) => set(() => ({ totalfees })),
    setMaxBalance: (maxBalance) => set(() => ({ maxBalance })),
    setIsmaxBalanceLoading: (ismaxBalanceLoading) => set(() => ({ ismaxBalanceLoading })),

    setSelectedFromNetwork: (selectedFromNetwork) => set(() => ({ selectedFromNetwork })),
    setSelectedFromProtocol: (selectedFromProtocol) => set(() => ({ selectedFromProtocol })),
    setSelectedFromToken: (selectedFromToken) => set(() => ({ selectedFromToken })),

    setSelectedToNetwork: (selectedToNetwork) => set(() => ({ selectedToNetwork })),
    setSelectedToProtocol: (selectedToProtocol) => set(() => ({ selectedToProtocol })),
    setSelectedToToken: (selectedToToken) => set(() => ({ selectedToToken })),

    setShowFromSelectionMenu: (showFromSelectionMenu) => set(() => ({ showFromSelectionMenu })),
    setShowToSelectionMenu: (showToSelectionMenu) => set(() => ({ showToSelectionMenu })),

    setFromTokensData: (fromTokensData) => set(() => ({ fromTokensData })),
    setToTokensData: (toTokensData) => set(() => ({ toTokensData })),

    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setFromTokenDecimal: (fromTokenDecimal) => set(() => ({ fromTokenDecimal })),

    setFilterFromToken: (filterFromToken) => set(() => ({ filterFromToken })),
    setFilterToToken: (filterToToken) => set(() => ({ filterToToken })),
    setFilterFromAddress: (filterFromAddress) => set(() => ({ filterFromAddress })),
    setFilterToAddress: (filterToAddress) => set(() => ({ filterToAddress })),

    setAddToBatchLoading: (addToBatchLoading) => set(() => ({ addToBatchLoading })),
    setShowBatchList: (showBatchList) => set(() => ({ showBatchList })),

    setTxHash: (txhash) => set(() => ({ txhash })),
    setSendTxLoading: (sendTxLoading) => set(() => ({ sendTxLoading })),

    setShowIndividualBatchList: (showIndividualBatchList) => set(() => ({ showIndividualBatchList })),

    setSrcPoolId: (srcPoolId) => set(() => ({ srcPoolId })),
    setDestPoolId: (destPoolId) => set(() => ({ destPoolId })),

    setShowExecuteBatchModel: (showExecuteBatchModel) => set(() => ({ showExecuteBatchModel })),
    setHasExecutionSuccess: (hasExecutionSuccess) => set(() => ({ hasExecutionSuccess })),
    setHasExecutionError: (hasExecutionError) => set(() => ({ hasExecutionError })),
    setShowExecuteMethodModel: (showExecuteMethodModel) => set(() => ({ showExecuteMethodModel })),
    setSimulationsHashes: (simulationHashes) => set(() => ({ simulationHashes })),

    oraclePrice: 0,
    setOraclePrice: (oraclePrice) => set(() => ({ oraclePrice })),

    oraclePriceLoading: false,
    setOraclePriceLoading: (oraclePriceLoading) => set(() => ({ oraclePriceLoading })),

    simulationSmartAddress: "",
    setSimulationSmartAddress: (simulationSmartAddress) => set(() => ({ simulationSmartAddress })),

    selectedFromTokenAddress: "",
    setSelectedFromTokenAddress: (selectedFromTokenAddress) => set(() => ({ selectedFromTokenAddress })),

    showReviewModal: false,
    setShowReviewModal: (showReviewModal) => set(() => ({ showReviewModal })),

    selectedExecuteMethod: "",
    setSelectedExecuteMethod: (selectedExecuteMethod) => set(() => ({ selectedExecuteMethod })),
}));

//Rebalance Store
export interface iRebalanceData {
    network: iSelectedNetwork;
    protocol: string;
    token: string;
    percentage: number;
    amount: number;
}

export interface iRebalance {
    isRebalance: boolean;
    setIsRebalance: (isRebalance: boolean) => void;

    clearRebalanceData: boolean;
    setClearRebalanceData: (clearRebalanceData: boolean) => void;

    splitEqually: boolean;
    setSplitEqually: (splitEqually: boolean) => void;

    percentages: number[];
    setPercentages: (percentages: number[]) => void;

    isModalOpen: number | null;
    setIsModalOpen: (isOpen: number | null) => void;

    rebalanceData: iRebalanceData[];
    setRebalanceData: (index: number | null, newData?: iRebalanceData, remove?: boolean) => void;
    addNewEmptyData: () => void;
    removeDataAtIndex: (index: number) => void;
    removeAllData: () => void;
}
// Create global state
export const useRebalanceStore = create<iRebalance>((set) => ({
    isRebalance: false,
    setIsRebalance: (isRebalance) => set(() => ({ isRebalance })),

    clearRebalanceData: false,
    setClearRebalanceData: (clearRebalanceData) => set(() => ({ clearRebalanceData })),

    splitEqually: true,
    setSplitEqually: (splitEqually) => set(() => ({ splitEqually })),

    percentages: [],
    setPercentages: (percentages) => set(() => ({ percentages })),

    isModalOpen: null,
    setIsModalOpen: (isOpen) => set(() => ({ isModalOpen: isOpen })),

    rebalanceData: [
        {
            network: { key: "", chainName: "", chainId: "", icon: "" },
            protocol: "",
            token: "",
            percentage: 0,
            amount: 0,
        },
    ],
    setRebalanceData: (index, newData) => {
        set((state) => {
            let updatedData: iRebalanceData[];
            if (newData) {
                // Add or update the data
                if (index !== null && index >= 0 && index < state.rebalanceData.length) {
                    // Update existing data if index is provided
                    updatedData = [...state.rebalanceData];
                    updatedData[index] = newData;
                } else {
                    // Add new data at the end of the array
                    updatedData = [...state.rebalanceData, newData];
                }
            } else {
                updatedData = state.rebalanceData;
            }

            return { rebalanceData: updatedData };
        });
    },

    addNewEmptyData: () => {
        set((state) => ({ rebalanceData: [...state.rebalanceData, createEmptyData()] }));
    },

    removeDataAtIndex: (index) => {
        set((state) => ({
            rebalanceData: state.rebalanceData.filter((_, i) => i !== index),
        }));
    },

    removeAllData: () => {
        set(() => ({ rebalanceData: [] }));
    },
}));

const createEmptyData = (): iRebalanceData => ({
    network: { key: "", chainName: "", chainId: "", icon: "" },
    protocol: "",
    token: "",
    percentage: 100,
    amount: 0,
});
