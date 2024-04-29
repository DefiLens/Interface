import { create } from "zustand";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { WalletInstance } from "@thirdweb-dev/react";

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
    smartAccount: BiconomySmartAccountV2 | null | any;
    smartAccountAddress: string | null | any;
    scwBalance: string;
    eoaBalance: string;

    currentProvider: string;

    connectedWallet: WalletInstance | null;
    setConnectedWallet: (wallet: WalletInstance | null) => void;

    setSelectedNetwork: (selectedNetwork: iSelectedNetwork) => void;
    setActiveChainName: (activeChainName: string) => void;
    setActiveChainId: (activeChainId: number) => void;

    setShowSelectNetworkList: (showSelectNetworkList: boolean) => void;
    setShowTransferFundToggle: (showTransferFundToggle: boolean) => void;
    setShowWalletAddress: (showWalletAddress: boolean) => void;

    setConnected: (connected: boolean) => void;
    setLoading: (loading: boolean) => void;
    setSmartAccount: (smartAccount: BiconomySmartAccountV2 | null) => void;
    setSmartAccountAddress: (smartAccountAddress: string | null) => void;
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
    smartAccountAddress: "",
    scwBalance: "",
    eoaBalance: "",

    connectedWallet: null,
    setConnectedWallet: (connectedWallet) => set(() => ({ connectedWallet })),

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
    setSmartAccountAddress: (smartAccountAddress) => set(() => ({ smartAccountAddress })),
    setScwBalance: (scwBalance) => set(() => ({ scwBalance })),
    setEoaBalance: (eoaBalance) => set(() => ({ eoaBalance })),

    setCurrentProvider: (currentProvider) => set(() => ({ currentProvider })),
}));
