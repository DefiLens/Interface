import { BigNumberish, ethers } from "ethers";

export type tOneInch = {
    tokenIn: string;
    tokenOut: string;
    amountIn: BigNumberish;
    address: string;
    type: string;
    chainId: number;
};

export type tOneInchParams = {
    chainId: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    from: string;
    slippage: string;
};

export type OneInchSwapResponse = {
    dstAmount: string;
    tx: {
        from: string;
        to: string;
        data: string;
        value: string;
        gas: number;
        gasPrice: string;
    };
    srcToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        logoURI: string;
        tags: string[];
    };
    dstToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        logoURI: string;
        tags: string[];
    };
};

export type tApprove = {
    tokenIn: string;
    spender: string;
    amountIn: BigNumberish;
    address: string;
    web3JsonProvider: ethers.providers.JsonRpcProvider | undefined;
};

export type tCCSendTx = {
    tokenIn: string;
    _amountIn: BigNumberish;
    address: string;
    isSCW: boolean;
    params: [];
    isThisAmount: string;
    srcPoolId: string;
    destPoolId: string;
    fromChainId: number;
    toChainId: number;
    currentFunc: string;
    currentAbi: Array<String>;
    contractAddress: string;
    extraOrShareToken: string;
    tokenOutNum: string;
};

export type tTx = {
    to: string;
    data: string;
    value?: string;
};

export type tStargateData = {
    txArray: Array<tTx>;
    value?: string;
};
