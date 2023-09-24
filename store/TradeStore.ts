import { create } from "zustand";

interface iSelectedNetwork {
    key: string,
    chainName: string,
    chainId: string,
    icon: any,
};

export interface iTrade {
    showSelectNetworkList: boolean;
    selectedNetwork: iSelectedNetwork;

    setShowSelectNetworkList: (showSelectNetworkList: boolean) => void;
    setSelectedNetwork: (selectedNetwork: iSelectedNetwork) => void;

}

export const useTradeStore = create<iTrade>((set) => ({
    showSelectNetworkList: false,
    selectedNetwork:  {
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    },

    setShowSelectNetworkList: (showSelectNetworkList) => set(() => ({ showSelectNetworkList })),
    setSelectedNetwork: (selectedNetwork) => set(() => ({ selectedNetwork })),
}));