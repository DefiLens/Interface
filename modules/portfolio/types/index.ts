export type tPortfolio = {
    smartAccountAddress: string;
    currentChainId: number;
    details: [];
    handleFetchPorfolioData: () => void;
    send: () => void;
    handleAmountIn: (_amountIn: string) => void;
};


export interface iBatchHistory {
    _id?: string;
    txHash?: string;
    totalAmount?: number;
    smartAccount: string;
    transactions: iSingleTransaction[];
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}

export interface iSingleTransaction {
    _id?: string;
    fromNetwork: string;
    fromProtocol: string;
    fromToken: string;
    toNetwork: string;
    toProtocol: string;
    toToken: string;
    amountIn: string;
    txHash: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}
