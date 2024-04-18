import { create } from "zustand";
import { BigNumber } from "ethers";
import { tPosition } from "../modules/portfolio/types";

export interface iChainData {
    chainId: number;
    data: tPosition[];
}

export interface iPortfolio {
    chainData: iChainData[] | null;
    isLoading: boolean;
    error: string;
    isSCW: boolean;
    chainId: number;
    chainName: string;
    selectOneAsset: tPosition;


    setChainData: (chainData: any) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    setIsSCW: (isSCW: boolean) => void;
    setChainId: (chainId: number) => void;
    setChainName: (chainName: string) => void;
    setSelectOneAsset: (selectOneAsset: tPosition | null) => void;


    //Migrate assets
    tokenAddress: number | string;
    amountIn: number | string;
    amountInDecimals: number | string;
    isNative: boolean;
    sendTxLoading: boolean;
    txhash: string;
    tokensData: object[];
    scwBalance: BigNumber;
    eoaBalance: BigNumber;
    tokenInDecimals: number;
    gasCost: number;
    isGasCostExpanded: boolean;
    searchToken: string;
    showTokenList: boolean;
    selectedToken: Object;

    setTokenAddress: (tokenAddress: number | string) => void;
    setAmountIn: (amountIn: number | string) => void;
    setAmountInDecimals: (amountInDecimals: number | string) => void;
    setIsnative: (isNative: boolean) => void;
    setSendtxLoading: (sendTxLoading: boolean) => void;
    setTxHash: (txhash: boolean | string) => void;
    setTokensData: (tokensData: object[]) => void;
    setScwTokenInbalance: (scwBalance: BigNumber) => void;
    setEoaTokenInbalance: (eoaBalance: BigNumber) => void;
    setTokenInDecimals: (tokenInDecimals: number) => void;
    setGasCost: (gasCost: number) => void;
    setIsGasCostExpanded: (isGasCostExpanded: boolean) => void;
    setSearchToken: (searchToken: string) => void;
    setShowTokenList: (showTokenList: boolean) => void;
    setSelectedToken: (selectedToken: Object) => void;
}

export const usePortfolioStore = create<iPortfolio>((set) => ({
    chainData: null,
    isLoading: false,
    error: "",
    isSCW: false,
    chainId: 0,
    chainName: "",
    selectOneAsset: null,

    setChainData: (chainData) => set(() => ({ chainData })),
    setIsLoading: (isLoading) => set(() => ({ isLoading })),
    setError: (error) => set(() => ({ error })),
    setIsSCW: (isSCW) => set(() => ({ isSCW })),
    setChainId: (chainId) => set(() => ({ chainId })),
    setChainName: (chainName) => set(() => ({ chainName })),
    setSelectOneAsset: (selectOneAsset) => set(() => ({ selectOneAsset })),


    //Migrate assets
    tokenAddress: 0,
    amountIn: 0,
    amountInDecimals: "",
    isNative: true,
    sendTxLoading: false,
    txhash: false,
    tokensData: [],
    scwBalance: BigNumber.from(0),
    eoaBalance: BigNumber.from(0),
    tokenInDecimals: 18,
    gasCost: 0,
    isGasCostExpanded: false,
    searchToken: "",
    showTokenList: false,
    selectedToken: {},

    setTokenAddress: (tokenAddress) => set(() => ({ tokenAddress })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setAmountInDecimals: (amountInDecimals) => set(() => ({ amountInDecimals })),
    setIsnative: (isNative) => set(() => ({ isNative })),
    setSendtxLoading: (sendTxLoading) => set(() => ({ sendTxLoading })),
    setTxHash: (txhash) => set(() => ({ txhash })),
    setTokensData: (tokensData) => set(() => ({ tokensData })),
    setScwTokenInbalance: (scwBalance) => set(() => ({ scwBalance })),
    setEoaTokenInbalance: (eoaBalance) => set(() => ({ eoaBalance })),
    setTokenInDecimals: (tokenInDecimals) => set(() => ({ tokenInDecimals })),
    setGasCost: (gasCost) => set(() => ({ gasCost })),
    setIsGasCostExpanded: (isGasCostExpanded) => set(() => ({ isGasCostExpanded })),
    setSearchToken: (searchToken) => set(() => ({ searchToken })),
    setShowTokenList: (showTokenList) => set(() => ({ showTokenList })),
    setSelectedToken: (selectedToken) => set(() => ({ selectedToken })),
}));
