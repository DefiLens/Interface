import { create } from "zustand";

export interface iUserTokenInfo {
    tokenAddress: string;
    amount: string;
    decimals: number;
    name: string;
    symbol: string;
    logoURI: string;
    chainId: number;
    type: string;

    subtitle: string;
    apy: string;
    protocol: {
        name: string;
        slug: string;
        logo: string;
        url: string;
        description: string;
        twitter: string;
        category: string;
        chainIds: number[];
    };

    underlyingTokens: string[];
}

export interface iPortfolio {
    userTokensData: iUserTokenInfo[] | [] | null;
    isUsersTokenLoading: boolean;
    totalNetworth: string;

    isSCW: boolean;

    setTotalNetworth: (totalNetworth: string) => void;

    setUserTokensData: (userTokensData: iUserTokenInfo[] | any) => void;
    setIsUsersTokenLoading: (isUsersTokenLoading: boolean) => void;

    setIsSCW: (isSCW: boolean) => void;
}

export const usePortfolioStore = create<iPortfolio>((set) => ({
    userTokensData: null,
    isUsersTokenLoading: false,

    isSCW: false,
    totalNetworth: "0",

    setTotalNetworth: (totalNetworth) => set(() => ({ totalNetworth })),
    setUserTokensData: (userTokensData) => set(() => ({ userTokensData })),
    setIsUsersTokenLoading: (isUsersTokenLoading) => set(() => ({ isUsersTokenLoading })),

    setIsSCW: (isSCW) => set(() => ({ isSCW })),
}));
