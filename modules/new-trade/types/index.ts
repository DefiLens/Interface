import { iSelectedNetwork } from "../../../store/TradingStore";

export type tTrade = {
    handleSelectFromNetwork: (_fromNetwork: iSelectedNetwork) => void;
    handleSelectToNetwork: (_toNetwork: iSelectedNetwork) => void;
    onChangeFromProtocol: (_fromProtocol: string) => void;
    onChangeFromToken: (_fromTokenAddress: string, _fromToken: string, _type: string) => void;
    onChangeToProtocol: (_toProtocol: string) => void;
    onChangeToToken: (_toTokenAddress: string, _toToken: string, _type: string) => void;
    onChangeAmountIn: (_amountIn: string) => void;
    handleSwap: () => void;
    removeBatch: (index: number) => void;
    toggleShowBatchList: (id: number) => void;
    sendSingleBatchToList: (isSCW: any) => void;
    handleExecuteMethod: () => void;
    ExecuteAllBatches: (isSCW: any, whichProvider: string) => void;
    closeFromSelectionMenu: () => void;
    closeToSelectionMenu: () => void;
    createSession: () => void;
    erc20Transfer: () => void;
    selectedFromAction: string;
    setSelectedFromAction: (selectedFromAction: string) => void;
    selectedToAction: string;
    setSelectedToAction: (selectedToAction: string) => void;
    isLoadingTokenList: boolean;
    fromSelectedActionTokenList: any;
    toSelectedActionTokenList: any;
    setFromSelectedActionTokenList: (fromSelectedActionTokenList: any) => void;
    setToSelectedActionTokenList: (toSelectedActionTokenList: any) => void;
    handleActionChange: (protocol: string, action: string, sendType: string) => void;
    balances: any;
};

export type tTradeProtocol = {
    name: string;
    icon: any;
    tokenList: any;
    tokenAddresses: any;
    type: string;
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
