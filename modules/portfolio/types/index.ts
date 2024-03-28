export type tPortfolio = {
    smartAccountAddress: string;
    currentChainId: number;
    details: [];
    handleFetchPorfolioData: () => void;
    send: () => void;
    handleAmountIn: (_amountIn: string) => void;
};
