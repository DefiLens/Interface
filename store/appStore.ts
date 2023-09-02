import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BiconomySmartAccount } from "@biconomy/account";
import { tokensByNetwork } from "../utils/constants";

interface Token {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}

interface Contract {
    contractName: string;
    contractAddress: string;
    extraOrShareToken?: string;
}

interface ContractMetaData {
    methodNames: string[];
    amountFieldIndex: number[];
}

interface Tokens {
    [tokenName: string]: string;
}

interface ChainPing {
    [network: string]: string;
}

interface StarGateRouter {
    [network: string]: string;
}

interface ApiResponse {
    contracts: Contract[];
    contractMetaData: Record<string, ContractMetaData>;
    tokens: Tokens;
    chainPing: ChainPing;
    starGateRouter: StarGateRouter;
}

interface AppState {
    connected: boolean;
    loading: boolean;
    smartAccount: BiconomySmartAccount | null;
    currentSigner: any;
    currentAddress: any;
    scwBalance: any;
    eoaBalance: any;

    currentProvider: string;

    fromChainId: any;
    toChainId: any;
    srcPoolId: any;
    destPoolId: any;

    tokenIn: any;
    tokenInDecimals: any;
    amountIn: any;
    isThisAmount: any;

    contractIndex: any;
    allNetworkData: ApiResponse | null;
    currentAbi: any;
    currentFunc: any;
    currentFuncIndex: any;

    funcArray: any[];
    params: any;
    fixParams: any;

    isSimulationOpen: any;
    isSimulationSuccessOpen: any;
    isSimulationErrorOpen: any;

    isSimulationSuccessDetailShow: any;
    isSimulationErrorDetailShow: any;

    simulationErrorMsg: any;
    simulation: any;
    gasUsed: any;
    gasCost: any;
    bridgeGasCost: any;
    simulateInputData: any;
    simulateLoading: any;

    sendTxLoading: any;
    sendTxLoadingForEoa: any;
    txhash: any;

    showWalletAddress: boolean;

    setConnected: (connected: any) => void;
    setLoading: (loading: any) => void;
    setSmartAccount: (smartAccount: any) => void;
    setCurrentSigner: (currentSigner: any) => void;
    setCurrentAddress: (currentAddress: any) => void;
    setScwBalance: (scwBalance: any) => void;
    setEoaBalance: (eoaBalance: any) => void;

    setCurrentProvider: (currentProvider: any) => void;

    setFromChainId: (fromChainId: any) => void;
    setToChainId: (toChainId: any) => void;
    setSrcPoolId: (srcPoolId: any) => void;
    setDestPoolId: (destPoolId: any) => void;

    setTokenIn: (tokenIn: any) => void;
    setTokenInDecimals: (tokenInDecimals: any) => void;
    setAmountIn: (amountIn: any) => void;
    setIsThisFieldAmount: (isThisAmount: any) => void;

    setContractIndex: (contractIndex: any) => void;
    setData: (allNetworkData: ApiResponse | null) => void;
    setAbi: (currentAbi: any) => void;
    setCurrentFunc: (currentFunc: any) => void;
    setCurrentFuncIndex: (currentFuncIndex: any) => void;

    setFunctionArray: (funcArray: any[]) => void;
    setParams: (params: any) => void;
    setFixParams: (fixParams: any) => void;

    setIsSimulationOpen: (isSimulationOpen: any) => void;
    setIsSimulationSuccessOpen: (isSimulationSuccessOpen: any) => void;
    setIsSimulationErrorOpen: (isSimulationErrorOpen: any) => void;

    setIsSimulationSuccessDetailShow: (isSimulationSuccessDetailShow: any) => void;
    setIsSimulationErrorDetailShow: (isSimulationErrorDetailShow: any) => void;

    setsimulationErrorMsg: (simulationErrorMsg: any) => void;
    setSimulation: (simulation: any) => void;
    setGasUsed: (gasUsed: any) => void;
    setGasCost: (gasCost: any) => void;
    setBridgeGasCost: (bridgeGasCost: any) => void;
    setSimulateInputData: (simulateInputData: any) => void;
    setSimulationLoading: (simulateLoading: any) => void;

    setSendtxLoading: (sendTxLoading: any) => void;
    setSendtxLoadingForEoa: (sendTxLoadingForEoa: any) => void;

    setTxHash: (txhash: any) => void;

    setShowWalletAddress: (showWalletAddress: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
    connected: false,
    loading: false,
    smartAccount: null,
    currentSigner: "",
    currentAddress: "",
    scwBalance: "",
    eoaBalance: "",

    currentProvider: "",

    fromChainId: "",
    toChainId: "",
    srcPoolId: 1,
    destPoolId: 1,

    tokenIn: "",
    tokenInDecimals: 6,
    amountIn: "100000",
    isThisAmount: "",

    contractIndex: "",
    allNetworkData: null,
    currentAbi: "",
    currentFunc: "",
    currentFuncIndex: 0,

    funcArray: [],
    params: [[]],
    fixParams: [[]],

    isSimulationOpen: false,
    isSimulationSuccessOpen: false,
    isSimulationErrorOpen: false,

    isSimulationSuccessDetailShow: false,
    isSimulationErrorDetailShow: false,

    simulationErrorMsg: "",
    simulation: "",
    gasUsed: "",
    gasCost: "",
    bridgeGasCost: "",
    simulateInputData: "",
    simulateLoading: false,

    sendTxLoading: false,
    sendTxLoadingForEoa: false,
    txhash: false,

    showWalletAddress: false,

    setConnected: (connected) => set(() => ({ connected })),
    setLoading: (loading) => set(() => ({ loading })),
    setSmartAccount: (smartAccount) => set(() => ({ smartAccount })),
    setCurrentSigner: (currentSigner) => set(() => ({ currentSigner })),
    setCurrentAddress: (currentAddress) => set(() => ({ currentAddress })),
    setScwBalance: (scwBalance) => set(() => ({ scwBalance })),
    setEoaBalance: (eoaBalance) => set(() => ({ eoaBalance })),

    setCurrentProvider: (currentProvider) => set(() => ({ currentProvider })),

    setFromChainId: (fromChainId) => set(() => ({ fromChainId })),
    setToChainId: (toChainId) => set(() => ({ toChainId })),
    setSrcPoolId: (srcPoolId) => set(() => ({ srcPoolId })),
    setDestPoolId: (destPoolId) => set(() => ({ destPoolId })),

    setTokenIn: (tokenIn) => set(() => ({ tokenIn })),
    setTokenInDecimals: (tokenInDecimals) => set(() => ({ tokenInDecimals })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setIsThisFieldAmount: (isThisAmount) => set(() => ({ isThisAmount })),

    setData: (allNetworkData) => set(() => ({ allNetworkData })),
    setContractIndex: (contractIndex) => set(() => ({ contractIndex })),
    setAbi: (currentAbi) => set(() => ({ currentAbi })),
    setCurrentFunc: (currentFunc) => set(() => ({ currentFunc })),
    setCurrentFuncIndex: (currentFuncIndex) => set(() => ({ currentFuncIndex })),

    setFunctionArray: (funcArray) => set(() => ({ funcArray })),
    setParams: (params) => set(() => ({ params })),
    setFixParams: (fixParams) => set(() => ({ fixParams })),

    setIsSimulationOpen: (isSimulationOpen) => set(() => ({ isSimulationOpen })),
    setIsSimulationSuccessOpen: (isSimulationSuccessOpen) => set(() => ({ isSimulationSuccessOpen })),
    setIsSimulationErrorOpen: (isSimulationErrorOpen) => set(() => ({ isSimulationErrorOpen })),

    setIsSimulationSuccessDetailShow: (isSimulationSuccessDetailShow) => set(() => ({ isSimulationSuccessDetailShow })),
    setIsSimulationErrorDetailShow: (isSimulationErrorDetailShow) => set(() => ({ isSimulationErrorDetailShow })),

    setsimulationErrorMsg: (simulationErrorMsg) => set(() => ({ simulationErrorMsg })),
    setSimulation: (simulation) => set(() => ({ simulation })),
    setGasUsed: (gasUsed) => set(() => ({ gasUsed })),
    setGasCost: (gasCost) => set(() => ({ gasCost })),
    setBridgeGasCost: (bridgeGasCost) => set(() => ({ bridgeGasCost })),
    setSimulateInputData: (simulateInputData) => set(() => ({ simulateInputData })),
    setSimulationLoading: (simulateLoading) => set(() => ({ simulateLoading })),

    setSendtxLoading: (sendTxLoading) => set(() => ({ sendTxLoading })),
    setSendtxLoadingForEoa: (sendTxLoadingForEoa) => set(() => ({ sendTxLoadingForEoa })),
    setTxHash: (txhash) => set(() => ({ txhash })),

    setShowWalletAddress: (showWalletAddress: any) => set(() => ({ showWalletAddress })),
}));

interface SwapAppState {
    tokenIn: any;
    tokenOut: any;
    amountIn: any;
    amountOut: any;
    slippage: number;
    setTokenIn: (tokenIn: any) => void;
    setTokenOut: (tokenOut: any) => void;
    setAmountIn: (amountIn: any) => void;
    setAmountOut: (amountOut: any) => void;
    setSlippage: (slippage: any) => void;
}

export const useSwapAppStore = create<SwapAppState>((set) => ({
    tokenIn: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    tokenOut: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    amountIn: "",
    amountOut: "",
    slippage: 0,
    setTokenIn: (tokenIn) => set(() => ({ tokenIn })),
    setTokenOut: (tokenOut) => set(() => ({ tokenOut })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setAmountOut: (amountOut) => set(() => ({ amountOut })),
    setSlippage: (slippage) => set(() => ({ slippage })),
}));

interface ChainState {
    activeChainName: "polygon" | "arbitrum" | "optimism" | "ethereum" | "avalanche" | "base";
    activeChainId: 137 | 42161 | 10 | 1 | 43114 | 8453;
    setActiveChainName: (activeChainName: any) => void;
    setActiveChainId: (activeChainId: any) => void;
}

export const useChainAppStore = create<ChainState>((set) => ({
    activeChainName: "polygon",
    activeChainId: 137,
    setActiveChainName: (activeChainName) => set(() => ({ activeChainName })),
    setActiveChainId: (activeChainId) => set(() => ({ activeChainId })),
}));

interface BatchState {
    tokensData: '';
    setTokensData: (tokensData: any) => void;
}

export const useBatchAppStore = create<BatchState>((set) => ({
    tokensData: "",
    setTokensData: (tokensData) => set(() => ({ tokensData })),
}));
