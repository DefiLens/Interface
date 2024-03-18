import { iUserTokenInfo } from "../../../store/Portfolio";

export type tPortfolio = {
    details: [];
    isUsersTokenLoading: boolean;
    smartAccountAddress: string;
    userTokensData: iUserTokenInfo[];
    filteredDefiTokens: iUserTokenInfo[][];
    handleFetchPorfolioData: () => void;
    totalNetWorth: number;
    handleAmountIn: (_amountIn: string) => void;
    send: () => void;
    currentChainId: number;
};
