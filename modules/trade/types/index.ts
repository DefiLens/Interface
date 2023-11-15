import { iSelectedNetwork } from "../../../store/TradeStore";

export type tTrade = {
    handleSelectFromNetwork: (_fromNetwork: iSelectedNetwork) => void,
    handleSelectToNetwork: (_toNetwork: iSelectedNetwork) => void,
    onChangeFromProtocol: (_fromProtocol: string) => void,
    onChangeFromToken: (_fromToken: string) => void,
    onChangeToProtocol: (_toProtocol: string) => void,
    onChangeToToken: (_toToken: string) => void,
    onChangeAmountIn: (_amountIn: string) => void,
    handleSwap: () => void,
    removeBatch: (index: number) => void,
    toggleShowBatchList: (id: number) => void,
    sendSingleBatchToList: (isSCW: any) => void,
    ExecuteAllBatches: (isSCW: any) => void,
    closeFromSelectionMenu: () => void,
    closeToSelectionMenu: () => void,
};

export type tTradeProtocol = {
    name: string,
    icon: any,
    tokenList: any
    tokenAddresses: any
};

export interface iTokenInfo {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    extensions?: Record<string, { tokenAddress: string }>;
}

export interface iTokenList {
    name: string;
    timestamp: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    tags: Record<string, any>;
    logoURI: string;
    keywords: string[];
    tokens: iTokenInfo[];
}
