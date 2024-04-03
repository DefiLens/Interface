export type tExecuteBatch = {};

export type TransactionHistory = {
    amountIn: string;
    fromNetwork: string;
    toNetwork: string;
    fromProtocol: string;
    toProtocol: string;
    fromToken: string;
    toToken: string;
    txHash: string;
}[];
