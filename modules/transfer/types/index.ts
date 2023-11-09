export type tTransfer = {
    onOptionChangeForWallet: () => void,
    onOptionChange: () => void,
    handleTokenAddress: (_tokenAddress: string) => void,
    handleAmountIn: (_amountIn: string) => void,
    send: () => void,
};
