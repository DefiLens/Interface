export type tTransfer = {
    onOptionChangeForWallet: (e: any) => void,
    onOptionChange: (e: any) => void,
    handleTokenAddress: (_tokenAddress: string) => void,
    handleAmountIn: (_amountIn: string) => void,
    send: () => void,
};
