export type tPortfolio = {
    smartAccountAddress: string;
    // currentChainId: number;
    // details: iChainData;
    handleFetchPorfolioData: () => void;
    send: () => void;
    handleAmountIn: (_amountIn: string) => void;
};

export type tOneAsset = {
    // smartAccountAddress: string;
    currentChainId: number;
    positions: tPosition[];
    // handleFetchPorfolioData: () => void;
    send: () => void;
    handleAmountIn: (_amountIn: string) => void;
};

export type Chain = {
    chainName: string;
    chainId: number;
};

export type tPosition = {
    type: string;
    id: string;
    attributes: {
        parent: null;
        protocol: string;
        name: string;
        position_type: string;
        quantity: {
            int: string;
            decimals: number;
            float: number;
            numeric: string;
        };
        value: number;
        price: number;
        changes: {
            absolute_1d: number;
            percent_1d: number;
        };
        fungible_info: {
            name: string;
            symbol: string;
            icon: {
                url: string;
            };
            flags: {
                verified: boolean;
            };
            implementations: Array<{
                chain_id: string;
                address: string;
                decimals: number;
            }>;
        };
        flags: {
            displayable: boolean;
            is_trash: boolean;
        };
        updated_at: string;
        updated_at_block: null | number;
    };
    relationships: {
        chain: {
            links: {
                related: string;
            };
            data: {
                type: string;
                id: string;
            };
        };
        dapp: {
            data: {
                type: string;
                id: string;
            };
        };
        fungible: {
            links: {
                related: string;
            };
            data: {
                type: string;
                id: string;
            };
        };
    };
};

export type tTxnHistory = {
    transactions: {
        amountIn: string;
        fromNetwork: string;
        toNetwork: string;
        fromProtocol: string;
        toProtocol: string;
        fromToken: string;
        toToken: string;
        txHash: string;
    }[];
    message?: string;
    smartAccount: any;
}

export interface iBatchHistory {
    _id?: string;
    txHash?: string;
    totalAmount?: number;
    smartAccount: string;
    eoaAccount: string | undefined;
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
