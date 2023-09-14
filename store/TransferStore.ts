import { create } from "zustand";
import { BigNumber } from "ethers";

export interface iTransfer {
    tokenAddress: number | string;
    amountIn: number | string;
    amountInDecimals: number;
    isNative: boolean;
    isSCW: boolean;
    sendTxLoading: boolean;
    txhash:boolean | string;
    tokensData: object[];
    scwBalance: BigNumber;
    eoaBalance: BigNumber;
    tokenInDecimals: number;
    gasCost: number;

    setTokenAddress: (tokenAddress: number | string) => void;
    setAmountIn: (amountIn: number | string) => void;
    setAmountInDecimals: (amountInDecimals: number) => void;
    setIsnative: (isNative: boolean) => void;
    setIsSCW: (isSCW: boolean) => void;
    setSendtxLoading: (sendTxLoading: boolean) => void;
    setTxHash: (txhash: boolean | string) => void;
    setTokensData: (tokensData: object[]) => void;
    setScwTokenInbalance: (scwBalance: BigNumber) => void;
    setEoaTokenInbalance: (eoaBalance: BigNumber) => void;
    setTokenInDecimals: (tokenInDecimals: number) => void;
    setGasCost: (gasCost: number) => void;

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
}));