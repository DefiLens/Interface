import { create } from "zustand";

export interface iChainData {
    chainId: number;
    data: any;
}

export interface iPortfolio {
    chainData: iChainData[] | [] | null;
    isLoading: boolean;
    error: string;
    isSCW: boolean;


    setChainData: (chainData: any) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    setIsSCW: (isSCW: boolean) => void;
}

export const usePortfolioStore = create<iPortfolio>((set) => ({
    chainData: null,
    isLoading: true,
    error: "",
    isSCW: false,

    setChainData: (chainData) => set(() => ({ chainData })),
    setIsLoading: (isLoading) => set(() => ({ isLoading })),
    setError: (error) => set(() => ({ error })),
    setIsSCW: (isSCW) => set(() => ({ isSCW })),
}));
