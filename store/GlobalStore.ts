import { create } from "zustand";

export interface iGlobal {
    // activeChainName: "polygon" | "arbitrum" | "optimism" | "ethereum" | "avalanche" | "base";
    // activeChainId: 137 | 42161 | 10 | 1 | 43114 | 8453;

    activeChainName: string;
    activeChainId: number;

    showTransferFundToggle: boolean;
    showWalletAddress: boolean;
    
    setActiveChainName: (activeChainName: string) => void;
    setActiveChainId: (activeChainId: number) => void;
   
    setShowTransferFundToggle: (showTransferFundToggle: boolean) => void;
    setShowWalletAddress: (showWalletAddress: boolean) => void;
}

export const useGlobalStore = create<iGlobal>((set) => ({
    activeChainName: "polygon",
    activeChainId: 137,

    smartAccount: false,
    scwBalance: false,
    eoaBalance: false,
    loading: false,
    showTransferFundToggle: false,
    connected: false,
    showWalletAddress: false,

    setActiveChainName: (activeChainName) => set(() => ({ activeChainName })),
    setActiveChainId: (activeChainId) => set(() => ({ activeChainId })),
  
    setShowTransferFundToggle: (showTransferFundToggle) => set(() => ({ showTransferFundToggle })),
    setShowWalletAddress: (showWalletAddress) => set(() => ({ showWalletAddress })),
}));