import { memo } from "react";
import Image from "next/image";
import { ConnectWallet } from "@thirdweb-dev/react";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";

const WalletConnected = () => {
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    return (
        <div className="shadow-md rounded-full cursor-pointer overflow-hidden p-1">
            {selectedNetwork?.chainName && (
                <Image src={selectedNetwork.icon} alt="Current Network Icon" className="h-9 w-9 rounded-full" />
            )}
        </div>
    );
};

const ConnectWalletWrapper = memo(() => {
    return (
        <ConnectWallet
            theme={"light"}
            modalSize={"compact"}
            btnTitle="Connect Wallet"
            className="Custom-btn"
            modalTitle="Choose your wallet"
            modalTitleIconUrl=""
            detailsBtn={() => <WalletConnected />}
        />
    );
});

export default ConnectWalletWrapper;
