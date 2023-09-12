import { create } from "zustand";
import { BiconomySmartAccount } from "@biconomy/account";

interface iContract {
    contractName: string;
    contractAddress: string;
    extraOrShareToken?: string;
}

interface iContractMetaData {
    methodNames: string[];
    amountFieldIndex: number[];
}

interface iTokens {
    [tokenName: string]: string;
}

interface iChainPing {
    [network: string]: string;
}

interface iStarGateRouter {
    [network: string]: string;
}

interface iApiResponse {
    contracts: iContract[];
    contractMetaData: Record<string, iContractMetaData>;
    tokens: iTokens;
    chainPing: iChainPing;
    starGateRouter: iStarGateRouter;
}

export interface iCrossChainDifi {
    connected: boolean;
    loading: boolean;
    smartAccount: BiconomySmartAccount | null | any;
    // currentSigner: any;
    // currentAddress: any;
    scwBalance: string;
    eoaBalance: string;

    currentProvider: string;

    fromChainId: string;
    toChainId: string;
    srcPoolId: number;
    destPoolId: number;

    tokenIn: string
    tokenInDecimals: number;
    amountIn: number;
    isThisAmount: string | number | any;

    contractIndex: string;
    allNetworkData: iApiResponse | null;
    currentAbi: string;
    currentFunc: string;
    currentFuncIndex: number;

    funcArray: any;
    params: any;
    fixParams: any;

    isSimulationOpen: boolean | undefined;
    isSimulationSuccessOpen: boolean | undefined;
    isSimulationErrorOpen: boolean | undefined;

    isSimulationSuccessDetailShow: boolean;
    isSimulationErrorDetailShow: boolean;

    simulationErrorMsg: string;
    simulation: string | undefined;
    gasUsed: number;
    gasCost: number;
    bridgeGasCost: number;
    simulateInputData: string | undefined;
    simulateLoading: boolean;

    sendTxLoading: boolean;
    sendTxLoadingForEoa: boolean;
    txhash: string;

    scwTokenInBalance: number | object | undefined;
    eoaTokenInBalance: number | object | undefined;

    setConnected: (connected: boolean) => void;
    setLoading: (loading: boolean) => void;
    setSmartAccount: (smartAccount: BiconomySmartAccount | null) => void;
    // setCurrentSigner: (currentSigner: any) => void;
    // setCurrentAddress: (currentAddress: any) => void;
    setScwBalance: (scwBalance: string) => void;
    setEoaBalance: (eoaBalance: string) => void;

    setCurrentProvider: (currentProvider: string) => void;

    setFromChainId: (fromChainId: string) => void;
    setToChainId: (toChainId: string) => void;
    setSrcPoolId: (srcPoolId: number) => void;
    setDestPoolId: (destPoolId: number) => void;

    setTokenIn: (tokenIn: string) => void;
    setTokenInDecimals: (tokenInDecimals: number) => void;
    setAmountIn: (amountIn: number) => void;
    setIsThisFieldAmount: (isThisAmount: string | number) => void;

    setContractIndex: (contractIndex: string) => void;
    setData: (allNetworkData: iApiResponse | null) => void;
    setAbi: (currentAbi: string) => void;
    setCurrentFunc: (currentFunc: string) => void;
    setCurrentFuncIndex: (currentFuncIndex: number) => void;

    setFunctionArray: (funcArray: any) => void;
    setParams: (params: any) => void;
    setFixParams: (fixParams: any) => void;

    setIsSimulationOpen: (isSimulationOpen: boolean | undefined) => void;
    setIsSimulationSuccessOpen: (isSimulationSuccessOpen: boolean | undefined) => void;
    setIsSimulationErrorOpen: (isSimulationErrorOpen: boolean | undefined) => void;

    setIsSimulationSuccessDetailShow: (isSimulationSuccessDetailShow: boolean) => void;
    setIsSimulationErrorDetailShow: (isSimulationErrorDetailShow: boolean) => void;

    setsimulationErrorMsg: (simulationErrorMsg: string) => void;
    setSimulation: (simulation: string | undefined) => void;
    setGasUsed: (gasUsed: number) => void;
    setGasCost: (gasCost: number) => void;
    setBridgeGasCost: (bridgeGasCost: number) => void;
    setSimulateInputData: (simulateInputData: string | undefined) => void;
    setSimulationLoading: (simulateLoading: boolean) => void;

    setSendtxLoading: (sendTxLoading: boolean) => void;
    setSendtxLoadingForEoa: (sendTxLoadingForEoa: boolean) => void;

    setTxHash: (txhash: string) => void;

    setScwTokenInbalance: (scwTokenInBalance: number | object | undefined) => void;
    setEoaTokenInbalance: (eoaTokenInBalance: number | object | undefined) => void;
}

export const useCrossChainDifiStore = create<iCrossChainDifi>((set) => ({
    connected: false,
    loading: false,
    smartAccount: null,
    // currentSigner: "",
    // currentAddress: "",
    scwBalance: "",
    eoaBalance: "",

    currentProvider: "",

    fromChainId: "",
    toChainId: "",
    srcPoolId: 1,
    destPoolId: 1,

    tokenIn: "",
    tokenInDecimals: 6,
    amountIn: 100000,
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
    gasUsed: 0,
    gasCost: 0,
    bridgeGasCost: 0,
    simulateInputData: "",
    simulateLoading: false,

    sendTxLoading: false,
    sendTxLoadingForEoa: false,
    txhash: "",
   
    scwTokenInBalance: 0,
    eoaTokenInBalance: 0,

    setConnected: (connected) => set(() => ({ connected })),
    setLoading: (loading) => set(() => ({ loading })),
    setSmartAccount: (smartAccount) => set(() => ({ smartAccount })),
    // setCurrentSigner: (currentSigner) => set(() => ({ currentSigner })),
    // setCurrentAddress: (currentAddress) => set(() => ({ currentAddress })),
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

    setScwTokenInbalance: (scwTokenInBalance) => set(() => ({ scwTokenInBalance })),
    setEoaTokenInbalance: (eoaTokenInBalance) => set(() => ({ eoaTokenInBalance })),
}));