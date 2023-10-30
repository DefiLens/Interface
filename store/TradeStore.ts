import { create } from "zustand";
import { BigNumber } from "ethers";

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
    network: string;
    toNetwork?: string;
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
        fromProtocol: string;
        toProtocol: string;
        fromToken: string;
        toToken: string;
        amountIn: string;
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

export interface iTrade {
    maxBalance: string;
    ismaxBalanceLoading: boolean;
    showSelectNetworkList: boolean;

    selectedFromNetwork: iSelectedNetwork;
    selectedFromProtocol: string;
    selectedFromToken: string;

    selectedToNetwork: iSelectedNetwork;
    selectedToProtocol: string;
    selectedToToken: string;

    showFromSelectionMenu: boolean;
    showToSelectionMenu: boolean;
    showCrossChainSelectionMenu: boolean;

    tokensData: iTokenData[];
    amountIn: string;
    fromTokenDecimal: number;

    fromTokenBalanceForSCW: BigNumber;
    fromTokenBalanceForEOA: BigNumber;

    filterFromToken: string;
    filterToToken: string;
    filterFromAddress: string;
    filterToAddress: string;

    addToBatchLoading: boolean;
    showBatchList: boolean;

    txhash: string;
    sendTxLoading: boolean;
    sendTxLoadingForEoa: boolean;

    individualBatch: iIndividualBatch[];
    showIndividualBatchList: number | null;

    srcPoolId: number;
    destPoolId: number;

    tokenIn: string;
    tokenInDecimals: number;
    isThisAmount: string | number;

    contractIndex: string;
    selectedToContractAddress: string;
    allNetworkData: iApiResponse | null;
    currentAbi: string;
    currentFunc: string;
    currentFuncIndex: number;

    funcArray: iFuncArray[] | null;
    params: any[][];
    fixParams: any[][];

    showExecuteBatchModel: boolean;
    hasExecutionSuccess: string;
    hasExecutionError: string;

    setMaxBalance: (maxBalance: string) => void;
    setIsmaxBalanceLoading: (ismaxBalanceLoading: boolean) => void;
    setShowSelectNetworkList: (showSelectNetworkList: boolean) => void;

    setSelectedFromNetwork: (selectedFromNetwork: iSelectedNetwork) => void;
    setSelectedFromProtocol: (selectedFromProtocol: string) => void;
    setSelectedFromToken: (selectedFromToken: string) => void;

    setSelectedToNetwork: (selectedToNetwork: iSelectedNetwork) => void;
    setSelectedToProtocol: (selectedToProtocol: string) => void;
    setSelectedToToken: (selectedToToken: string) => void;

    setShowFromSelectionMenu: (showFromSelectionMenu: boolean) => void;
    setShowToSelectionMenu: (showToSelectionMenu: boolean) => void;
    setShowCrossChainSelectionMenu: (showCrossChainSelectionMenu: boolean) => void;

    setTokensData: (tokensData: iTokenData[]) => void;
    setAmountIn: (amountIn: string) => void;
    setFromTokenDecimal: (fromTokenDecimal: number) => void;

    setFromTokenBalanceForSCW: (fromTokenBalanceForSCW: BigNumber) => void;
    setFromTokenBalanceForEOA: (fromTokenBalanceForEOA: BigNumber) => void;

    setFilterFromToken: (filterFromToken: string) => void;
    setFilterToToken: (filterToToken: string) => void;
    setFilterFromAddress: (filterFromAddress: string) => void;
    setFilterToAddress: (filterToAddress: string) => void;

    setAddToBatchLoading: (addToBatchLoading: boolean) => void;
    setShowBatchList: (showBatchList: boolean) => void;

    setTxHash: (txhash: string) => void;
    setSendTxLoading: (sendTxLoading: boolean) => void;
    setSendTxLoadingForEoa: (sendTxLoadingForEoa: boolean) => void;

    setIndividualBatch: (individualBatch: iIndividualBatch[]) => void;
    setShowIndividualBatchList: (showIndividualBatchList: number | null) => void;

    setSrcPoolId: (srcPoolId: number) => void;
    setDestPoolId: (destPoolId: number) => void;

    setTokenIn: (tokenIn: string) => void;
    setTokenInDecimals: (tokenInDecimals: number) => void;
    setIsThisFieldAmount: (isThisAmount: string | number) => void;

    setContractIndex: (contractIndex: string) => void;
    setSelectedToContractAddress: (selectedToContractAddress: string) => void;
    setData: (allNetworkData: iApiResponse | null) => void;
    setAbi: (currentAbi: string) => void;
    setCurrentFunc: (currentFunc: string) => void;
    setCurrentFuncIndex: (currentFuncIndex: number) => void;

    setFunctionArray: (funcArray: iFuncArray[] | null) => void;
    setParams: (params: any[][]) => void;
    setFixParams: (fixParams: any[][]) => void;

    setShowExecuteBatchModel: (showExecuteBatchModel: boolean) => void;
    setHasExecutionSuccess: (hasExecutionSuccess: string) => void;
    setHasExecutionError: (hasExecutionError: string) => void;
}

export const useTradeStore = create<iTrade>((set) => ({
    maxBalance: "0",
    ismaxBalanceLoading: false,
    showSelectNetworkList: false,

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
    showCrossChainSelectionMenu: false,

    tokensData: [],
    amountIn: "",
    fromTokenDecimal: 0,

    fromTokenBalanceForSCW: BigNumber.from(0),
    fromTokenBalanceForEOA: BigNumber.from(0),

    filterFromToken: "",
    filterToToken: "",
    filterFromAddress: "",
    filterToAddress: "",

    addToBatchLoading: false,
    showBatchList: false,

    txhash: "",
    sendTxLoading: false,
    sendTxLoadingForEoa: false,

    individualBatch: [
        {
            id: 0,
            txArray: [],
            data: {
                fromNetwork: "",
                toNetwork: "",
                fromProtocol: "",
                toProtocol: "",
                fromToken: "",
                toToken: "",
                amountIn: "",
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

    tokenIn: "",
    tokenInDecimals: 6,
    isThisAmount: "",

    contractIndex: "",
    selectedToContractAddress: "",
    allNetworkData: null,
    currentAbi: "",
    currentFunc: "",
    currentFuncIndex: 0,

    funcArray: null,
    params: [[]],
    fixParams: [[]],

    showExecuteBatchModel: false,
    hasExecutionSuccess: "",
    hasExecutionError: "",

    setMaxBalance: (maxBalance) => set(() => ({ maxBalance })),
    setIsmaxBalanceLoading: (ismaxBalanceLoading) => set(() => ({ ismaxBalanceLoading })),
    setShowSelectNetworkList: (showSelectNetworkList) => set(() => ({ showSelectNetworkList })),

    setSelectedFromNetwork: (selectedFromNetwork) => set(() => ({ selectedFromNetwork })),
    setSelectedFromProtocol: (selectedFromProtocol) => set(() => ({ selectedFromProtocol })),
    setSelectedFromToken: (selectedFromToken) => set(() => ({ selectedFromToken })),

    setSelectedToNetwork: (selectedToNetwork) => set(() => ({ selectedToNetwork })),
    setSelectedToProtocol: (selectedToProtocol) => set(() => ({ selectedToProtocol })),
    setSelectedToToken: (selectedToToken) => set(() => ({ selectedToToken })),

    setShowFromSelectionMenu: (showFromSelectionMenu) => set(() => ({ showFromSelectionMenu })),
    setShowToSelectionMenu: (showToSelectionMenu) => set(() => ({ showToSelectionMenu })),
    setShowCrossChainSelectionMenu: (showCrossChainSelectionMenu) => set(() => ({ showCrossChainSelectionMenu })),

    setTokensData: (tokensData) => set(() => ({ tokensData })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setFromTokenDecimal: (fromTokenDecimal) => set(() => ({ fromTokenDecimal })),

    setFromTokenBalanceForSCW: (fromTokenBalanceForSCW) => set(() => ({ fromTokenBalanceForSCW })),
    setFromTokenBalanceForEOA: (fromTokenBalanceForEOA) => set(() => ({ fromTokenBalanceForEOA })),

    setFilterFromToken: (filterFromToken) => set(() => ({ filterFromToken })),
    setFilterToToken: (filterToToken) => set(() => ({ filterToToken })),
    setFilterFromAddress: (filterFromAddress) => set(() => ({ filterFromAddress })),
    setFilterToAddress: (filterToAddress) => set(() => ({ filterToAddress })),

    setAddToBatchLoading: (addToBatchLoading) => set(() => ({ addToBatchLoading })),
    setShowBatchList: (showBatchList) => set(() => ({ showBatchList })),

    setTxHash: (txhash) => set(() => ({ txhash })),
    setSendTxLoading: (sendTxLoading) => set(() => ({ sendTxLoading })),
    setSendTxLoadingForEoa: (sendTxLoadingForEoa) => set(() => ({ sendTxLoadingForEoa })),

    setIndividualBatch: (individualBatch) => set(() => ({ individualBatch })),
    setShowIndividualBatchList: (showIndividualBatchList) => set(() => ({ showIndividualBatchList })),

    setSrcPoolId: (srcPoolId) => set(() => ({ srcPoolId })),
    setDestPoolId: (destPoolId) => set(() => ({ destPoolId })),

    setTokenIn: (tokenIn) => set(() => ({ tokenIn })),
    setTokenInDecimals: (tokenInDecimals) => set(() => ({ tokenInDecimals })),
    setIsThisFieldAmount: (isThisAmount) => set(() => ({ isThisAmount })),

    setData: (allNetworkData) => set(() => ({ allNetworkData })),
    setContractIndex: (contractIndex) => set(() => ({ contractIndex })),
    setSelectedToContractAddress: (selectedToContractAddress) => set(() => ({ selectedToContractAddress })),
    setAbi: (currentAbi) => set(() => ({ currentAbi })),
    setCurrentFunc: (currentFunc) => set(() => ({ currentFunc })),
    setCurrentFuncIndex: (currentFuncIndex) => set(() => ({ currentFuncIndex })),

    setFunctionArray: (funcArray) => set(() => ({ funcArray })),
    setParams: (params) => set(() => ({ params })),
    setFixParams: (fixParams) => set(() => ({ fixParams })),

    setShowExecuteBatchModel: (showExecuteBatchModel) => set(() => ({ showExecuteBatchModel })),
    setHasExecutionSuccess: (hasExecutionSuccess) => set(() => ({ hasExecutionSuccess })),
    setHasExecutionError: (hasExecutionError) => set(() => ({ hasExecutionError })),
}));
