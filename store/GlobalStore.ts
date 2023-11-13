import { create } from "zustand";

import { BiconomySmartAccount } from "@biconomy/account";

export interface iSelectedNetwork {
    key: string;
    chainName: string;
    chainId: string;
    icon: any;
}

export interface iGlobal {
    selectedNetwork: iSelectedNetwork;
    activeChainName: string;
    activeChainId: number;

    showSelectNetworkList: boolean;
    showTransferFundToggle: boolean;
    showWalletAddress: boolean;

    connected: boolean;
    loading: boolean;
    smartAccount: BiconomySmartAccount | null | any;
    scwBalance: string;
    eoaBalance: string;

    currentProvider: string;

    setSelectedNetwork: (selectedNetwork: iSelectedNetwork) => void;
    setActiveChainName: (activeChainName: string) => void;
    setActiveChainId: (activeChainId: number) => void;

    setShowSelectNetworkList: (showSelectNetworkList: boolean) => void;
    setShowTransferFundToggle: (showTransferFundToggle: boolean) => void;
    setShowWalletAddress: (showWalletAddress: boolean) => void;

    setConnected: (connected: boolean) => void;
    setLoading: (loading: boolean) => void;
    setSmartAccount: (smartAccount: BiconomySmartAccount | null) => void;
    setScwBalance: (scwBalance: string) => void;
    setEoaBalance: (eoaBalance: string) => void;

    setCurrentProvider: (currentProvider: string) => void;
}

export const useGlobalStore = create<iGlobal>((set) => ({
    selectedNetwork: {
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    },
    activeChainName: "polygon",
    activeChainId: 137,

    showSelectNetworkList: false,
    showTransferFundToggle: false,
    showWalletAddress: false,

    connected: false,
    loading: false,
    smartAccount: null,
    scwBalance: "",
    eoaBalance: "",

    currentProvider: "",

    setSelectedNetwork: (selectedNetwork) => set(() => ({ selectedNetwork })),
    setActiveChainName: (activeChainName) => set(() => ({ activeChainName })),
    setActiveChainId: (activeChainId) => set(() => ({ activeChainId })),

    setShowSelectNetworkList: (showSelectNetworkList) => set(() => ({ showSelectNetworkList })),
    setShowTransferFundToggle: (showTransferFundToggle) => set(() => ({ showTransferFundToggle })),
    setShowWalletAddress: (showWalletAddress) => set(() => ({ showWalletAddress })),

    setConnected: (connected) => set(() => ({ connected })),
    setLoading: (loading) => set(() => ({ loading })),
    setSmartAccount: (smartAccount) => set(() => ({ smartAccount })),
    setScwBalance: (scwBalance) => set(() => ({ scwBalance })),
    setEoaBalance: (eoaBalance) => set(() => ({ eoaBalance })),

    setCurrentProvider: (currentProvider) => set(() => ({ currentProvider })),

}));