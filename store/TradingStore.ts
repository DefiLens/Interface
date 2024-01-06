import { create } from "zustand";
import { BigNumber as bg } from "bignumber.js";

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
    amount: string;
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
        fees: string;
        extraValue: string;
    };
    simulation: {
        isSuccess: boolean;
        isError: boolean;
    };
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

    tokensData: iTokenData[];
    amountIn: string;
    fromTokenDecimal: number;

    filterFromToken: string;
    filterToToken: string;
    filterFromAddress: string;
    filterToAddress: string;

    addToBatchLoading: boolean;
    showBatchList: boolean;

    txhash: string;
    sendTxLoading: boolean;

    individualBatch: iIndividualBatch[];
    showIndividualBatchList: number | null;

    srcPoolId: number;
    destPoolId: number;

    showExecuteBatchModel: boolean;
    hasExecutionSuccess: string;
    hasExecutionError: string;
    showExecuteMethodModel: boolean;

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

    setTokensData: (tokensData: iTokenData[]) => void;
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

    setIndividualBatch: (individualBatch: iIndividualBatch[]) => void;
    setShowIndividualBatchList: (showIndividualBatchList: number | null) => void;

    setSrcPoolId: (srcPoolId: number) => void;
    setDestPoolId: (destPoolId: number) => void;

    setShowExecuteBatchModel: (showExecuteBatchModel: boolean) => void;
    setHasExecutionSuccess: (hasExecutionSuccess: string) => void;
    setHasExecutionError: (hasExecutionError: string) => void;
    setShowExecuteMethodModel: (showExecuteMethodModel: boolean) => void;
}

export const useTradingStore = create<iTrading>((set) => ({
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

    tokensData: [],
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

    individualBatch: [
        {
            id: 0,
            txArray: [],
            data: {
                fromNetwork: "",
                toNetwork: "",
                fromChainId: "",
                toChainId: "",
                fromProtocol: "",
                toProtocol: "",
                fromToken: "",
                toToken: "",
                amountIn: "",
                fees: "",
                extraValue: ""
            },
            simulation: {
                isSuccess: false,
                isError: false,
            },
        },
    ],
    showIndividualBatchList: null,

    srcPoolId: 1,
    destPoolId: 1,

    showExecuteBatchModel: false,
    hasExecutionSuccess: "",
    hasExecutionError: "",
    showExecuteMethodModel: false,


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

    setTokensData: (tokensData) => set(() => ({ tokensData })),
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

    setIndividualBatch: (individualBatch) => set(() => ({ individualBatch })),
    setShowIndividualBatchList: (showIndividualBatchList) => set(() => ({ showIndividualBatchList })),

    setSrcPoolId: (srcPoolId) => set(() => ({ srcPoolId })),
    setDestPoolId: (destPoolId) => set(() => ({ destPoolId })),

    setShowExecuteBatchModel: (showExecuteBatchModel) => set(() => ({ showExecuteBatchModel })),
    setHasExecutionSuccess: (hasExecutionSuccess) => set(() => ({ hasExecutionSuccess })),
    setHasExecutionError: (hasExecutionError) => set(() => ({ hasExecutionError })),
    setShowExecuteMethodModel: (showExecuteMethodModel) => set(() => ({ showExecuteMethodModel })),
}));
