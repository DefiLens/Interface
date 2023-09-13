import { create } from "zustand";
import { BigNumber } from "ethers";

interface iContract {
    contractName: string;
    contractAddress: string;
    extraOrShareToken?: string;
};

interface iContractMetaData {
    methodNames: string[];
    amountFieldIndex: number[];
};

interface iTokens {
    [tokenName: string]: string;
};

interface iChainPing {
    [network: string]: string;
};

interface iStarGateRouter {
    [network: string]: string;
};

interface iApiResponse {
    contracts: iContract[];
    contractMetaData: Record<string, iContractMetaData>;
    tokens: iTokens;
    chainPing: iChainPing;
    starGateRouter: iStarGateRouter;
};

interface iFuncArray {
    name: string;
    inputs: any[];
    outputs: any[]; 
    stateMutability: string;
    type: string;
};

export interface iCrossChainDifi {
    fromChainId: string;
    toChainId: string;
    srcPoolId: number;
    destPoolId: number;

    tokenIn: string
    tokenInDecimals: number;
    amountIn: number;
    isThisAmount: string | number;

    contractIndex: string;
    allNetworkData: iApiResponse | null;
    currentAbi: string;
    currentFunc: string;
    currentFuncIndex: number;

    funcArray: iFuncArray[] | null;
    params: any[][];
    fixParams: any[][];

    isSimulationOpen: boolean;
    isSimulationSuccessOpen: boolean;
    isSimulationErrorOpen: boolean;

    isSimulationSuccessDetailShow: boolean;
    isSimulationErrorDetailShow: boolean;

    simulationErrorMsg: string;
    simulation: string;
    gasUsed: number;
    gasCost: number;
    bridgeGasCost: number;
    simulateInputData: string;
    simulateLoading: boolean;

    sendTxLoading: boolean;
    sendTxLoadingForEoa: boolean;
    txhash: string;

    scwTokenInBalance: BigNumber;
    eoaTokenInBalance: BigNumber;


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

    setFunctionArray: (funcArray: iFuncArray[] | null) => void;
    setParams: (params: any[][]) => void;
    setFixParams: (fixParams: any[][]) => void;

    setIsSimulationOpen: (isSimulationOpen: boolean) => void;
    setIsSimulationSuccessOpen: (isSimulationSuccessOpen: boolean) => void;
    setIsSimulationErrorOpen: (isSimulationErrorOpen: boolean) => void;

    setIsSimulationSuccessDetailShow: (isSimulationSuccessDetailShow: boolean) => void;
    setIsSimulationErrorDetailShow: (isSimulationErrorDetailShow: boolean) => void;

    setsimulationErrorMsg: (simulationErrorMsg: string) => void;
    setSimulation: (simulation: string) => void;
    setGasUsed: (gasUsed: number) => void;
    setGasCost: (gasCost: number) => void;
    setBridgeGasCost: (bridgeGasCost: number) => void;
    setSimulateInputData: (simulateInputData: string) => void;
    setSimulationLoading: (simulateLoading: boolean) => void;

    setSendtxLoading: (sendTxLoading: boolean) => void;
    setSendtxLoadingForEoa: (sendTxLoadingForEoa: boolean) => void;

    setTxHash: (txhash: string) => void;

    setScwTokenInbalance: (scwTokenInBalance: BigNumber) => void;
    setEoaTokenInbalance: (eoaTokenInBalance: BigNumber) => void;
}

export const useCrossChainDifiStore = create<iCrossChainDifi>((set) => ({
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

    funcArray: null,
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
   
    scwTokenInBalance: BigNumber.from(0),
    eoaTokenInBalance: BigNumber.from(0),


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