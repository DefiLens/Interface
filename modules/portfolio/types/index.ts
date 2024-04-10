import { iChainData } from "../../../store/Portfolio";

export type tPortfolio = {
    smartAccountAddress: string;
    // currentChainId: number;
    // details: iChainData;
    handleFetchPorfolioData: () => void;
    send: () => void;
    handleAmountIn: (_amountIn: string) => void;
};

export type tOneAsset = {
    // smartAccountAddress: string;
    currentChainId: number;
    positions: any[];
    // handleFetchPorfolioData: () => void;
    send: () => void;
    handleAmountIn: (_amountIn: string) => void;
};

export type Chain = {
    chainName: string;
    chainId: number;
}