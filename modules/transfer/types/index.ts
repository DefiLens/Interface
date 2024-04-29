export type tokenData = {
    address: string;
    chainId: number;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
};

export type tTransfer = {
    onOptionChangeForWallet: () => void;
    // onOptionChange: () => void;
    setBalance: (_tokenName: string, _tokenAddress: string) => void;
    handleAmountIn: (_amountIn: string) => void;
    send: () => void;
};