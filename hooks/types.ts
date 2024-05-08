import { BigNumberish, ethers } from "ethers";
import { iBatchFlowData, iSelectedNetwork, iTokenData } from "../store/TradingStore";
import BigNumber from "bignumber.js";

export type tOneInch = {
    tokenIn: string;
    tokenOut: string;
    amountIn: BigNumberish;
    address: string;
    type: string;
    chainId: number;
    selectedToken: string;
};

export type tOneInchParams = {
    chainId: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    from: string;
    slippage: string;
};

export type tOneInchSwapResponseFromApi = {
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

export type tOneInchSwapResponse = {
    swapTx: tTx,
    tokenIn: string,
    tokenOut: string,
    amountOutprice: BigNumberish,
    amountOutpriceWithoutDecimal: BigNumberish,
    tokenInDecimals: number,
    tokenOutDecimals: number,
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
    currentAbi: Array<string>;
    contractAddress: string;
    extraOrShareToken: string;
    tokenOutNum: string;
    selectedToNetwork: iSelectedNetwork;
    selectedToProtocol: string;
    selectedToToken: string;
    toTokensData: iTokenData[];
};

export type tTx = {
    to: string | undefined;
    data: string |  undefined;
    value?: BigNumberish;
};

export type tStargateData = {
    txArray: Array<tTx>;
    value?: BigNumberish;
    simulationHash?: string;
    amountOutWithoutDecimal: BigNumber
};

export type tRefinance = {
    isSCW: boolean,
    fromProtocol: string,
    toProtocol: string,
    tokenIn: string,
    tokenInName: string,
    tokenOut: string,
    tokenOutName: string,
    amount: BigNumberish,
    address: string,
    provider: ethers.providers.JsonRpcProvider | undefined,
    selectedToNetwork: iSelectedNetwork
    selectedToProtocol: string,
    selectedToToken: string,
    amountIn: number
}

export type tRefinanceResponse = {
    txArray: Array<tTx>;
    value?: BigNumberish;
    batchFlow?: Array<iBatchFlowData>;
    simulationHash?: string;
};