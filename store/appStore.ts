import {create} from "zustand"
import {devtools, persist} from "zustand/middleware"
import SmartAccount from "@biconomy/smart-account"

interface AppState {
    protcolName: any;
    contractAddress: any;
    action: any;
    tokenIn: any;
    tokenOut: any;
    decimalIn: any;
    decimalOut: any;
    balanceIn: any;
    amountIn: any;
    amountOut: any;
    allowanceIn: any;
    permit2Allowance: any;
    expiry: any;
    nonce: any;
    smartAccount: SmartAccount | null;

    setProtocolName: (protcolName: any) => void;
    setContract: (contractAddress: any) => void;
    setActionName: (functionName: any) => void;
    setTokenIn: (tokenIn: any) => void;
    setTokenOut: (tokenOut: any) => void;
    setDecimalIn: (decimalIn: any) => void;
    setDecimalOut: (decimalOut: any) => void;
    setBalanceIn: (balanceIn: any) => void;
    setAmountIn: (amountIn: any) => void;
    setAmountOut: (amountOut: any) => void;
    setAllowanceIn: (allowanceIn: any) => void;
    setPermit2Allowance: (permit2Allowance: any) => void;
    setPermit2Expiry: (expiry: any) => void;
    setpermit2Nonce: (nonce: any) => void;
    setSmartAccount: (smartAccount: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
    protcolName: '',
    contractAddress: '',
    action: '',
    tokenIn: '',
    tokenOut: '',
    decimalIn: '',
    decimalOut: '',
    balanceIn: '',
    amountIn: '',
    amountOut: '',
    allowanceIn: '',
    permit2Allowance: '',
    expiry: '',
    nonce: '',
    smartAccount: null,
    setProtocolName: (protcolName) => set(() => ({ protcolName })),
    setContract: (contractAddress) => set(() => ({ contractAddress })),
    setActionName: (action) => set(() => ({ action })),
    setTokenIn: (tokenIn) => set(() => ({ tokenIn })),
    setTokenOut: (tokenOut) => set(() => ({ tokenOut })),
    setDecimalIn: (decimalIn) => set(() => ({ decimalIn })),
    setDecimalOut: (decimalOut) => set(() => ({ decimalOut })),
    setBalanceIn: (balanceIn) => set(() => ({ balanceIn })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setAmountOut: (amountOut) => set(() => ({ amountOut })),
    setAllowanceIn: (allowanceIn) => set(() => ({ allowanceIn })),
    setPermit2Allowance: (permit2Allowance) =>
        set(() => ({ permit2Allowance })),
    setPermit2Expiry: (expiry) => set(() => ({ expiry })),
    setpermit2Nonce: (nonce) => set(() => ({ nonce })),
    setSmartAccount: (smartAccount) => set(() => ({ smartAccount }))
}));



// interface AppState {
//     contractAddress: any
//     amountIn: any
//     funcArray: any[]
//     params: any
//     currentAbi: any
//     currentFunc: any
//     currentFuncIndex: any
//     contractName: any
//     isThisAmount: any
//     smartAccount: SmartAccount | null

//     setContractAddress: (contractAddress: any) => void
//     setAmountIn: (amountIn: any) => void
//     setFunctionArray: (funcArray: any) => void
//     setParams: (params: any) => void
//     setAbi: (currentAbi: any) => void
//     setCurrentFunc: (currentFunc: any) => void
//     setCurrentFuncIndex: (currentFuncIndex: any) => void
//     setContractName: (contractName: any) => void
//     setIsThisFieldAmount: (isThisAmount: any) => void
//     setSmartAccount: (smartAccount: any) => void
// }

// export const useAppStore = create<AppState>((set) => ({
//     contractAddress: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
//     amountIn: "100000",
//     funcArray: [],
//     params: [[]],
//     currentAbi: "",
//     currentFunc: "",
//     currentFuncIndex: 0,
//     contractName: 0,
//     isThisAmount: "",
//     smartAccount: null,
//     setContractAddress: (contractAddress) => set(() => ({contractAddress})),
//     setAmountIn: (amountIn) => set(() => ({amountIn})),
//     setFunctionArray: (funcArray) => set(() => ({funcArray})),
//     setParams: (params) => set(() => ({params})),
//     setAbi: (currentAbi) => set(() => ({currentAbi})),
//     setCurrentFunc: (currentFunc) => set(() => ({currentFunc})),
//     setCurrentFuncIndex: (currentFuncIndex) => set(() => ({currentFuncIndex})),
//     setContractName: (contractName) => set(() => ({contractName})),
//     setIsThisFieldAmount: (isThisAmount) => set(() => ({isThisAmount})),
//     setSmartAccount: (smartAccount) => set(() => ({smartAccount})),
// }))

// // const [contractAddress, setContractAddress] = useState("0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7");
// // const [amountIn, setAmountIn] = useState("100000");
// // const [funcArray, setFunctionArray] = useState<any[]>([]);
// // const [params, setParams] = useState<any>([[]]);
// // const [currentAbi, setAbi] = useState<any>();
// // const [currentFunc, setCurrentFunc] = useState<any>();
// // const [currentFuncIndex, setCurrentFuncIndex] = useState<any>(0);
// // const [contractName, setContractName] = useState<any>(0);
// // const [isThisAmount, setIsThisFieldAmount] = useState<any>();
