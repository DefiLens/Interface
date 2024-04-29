import { create } from "zustand";
import { BigNumber } from "ethers";
import { tokenData } from "../modules/transfer/types";

export interface iTransfer {
    tokenAddress: number | string;
    amountIn: number | string;
    amountInDecimals: number;
    isNative: boolean;
    isSCW: boolean;
    sendTxLoading: boolean;
    txhash: string;
    tokensData: tokenData[];
    scwBalance: BigNumber;
    eoaBalance: BigNumber;
    tokenInDecimals: number;
    gasCost: number;
    isGasCostExpanded: boolean;
    searchToken: string;
    showTokenList: boolean;
    selectedToken: tokenData;

    setTokenAddress: (tokenAddress: number | string) => void;
    setAmountIn: (amountIn: number | string) => void;
    setAmountInDecimals: (amountInDecimals: number) => void;
    setIsnative: (isNative: boolean) => void;
    setIsSCW: (isSCW: boolean) => void;
    setSendtxLoading: (sendTxLoading: boolean) => void;
    setTxHash: (txhash: string) => void;
    setTokensData: (tokensData: tokenData[]) => void;
    setScwTokenInbalance: (scwBalance: BigNumber) => void;
    setEoaTokenInbalance: (eoaBalance: BigNumber) => void;
    setTokenInDecimals: (tokenInDecimals: number) => void;
    setGasCost: (gasCost: number) => void;
    setIsGasCostExpanded: (isGasCostExpanded: boolean) => void;
    setSearchToken: (searchToken: string) => void;
    setShowTokenList: (showTokenList: boolean) => void;
    setSelectedToken: (selectedToken: tokenData) => void;
}

export const useTransferStore = create<iTransfer>((set) => ({
    tokenAddress: 0,
    amountIn: 0,
    amountInDecimals: 0,
    isNative: true,
    isSCW: true,
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
    selectedToken: {} as tokenData,

    setTokenAddress: (tokenAddress) => set(() => ({ tokenAddress })),
    setAmountIn: (amountIn) => set(() => ({ amountIn })),
    setAmountInDecimals: (amountInDecimals) => set(() => ({ amountInDecimals })),
    setIsnative: (isNative) => set(() => ({ isNative })),
    setIsSCW: (isSCW) => set(() => ({ isSCW })),
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
