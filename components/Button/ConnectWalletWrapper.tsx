import Image from "next/image";
import { ConnectWallet } from "@thirdweb-dev/react";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { walletInfo } from "../../utils/constants";

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

const ConnectWalletWrapper = () => {
    return (
        <ConnectWallet
            theme={"light"}
            modalSize={"wide"}
            btnTitle={walletInfo.buttonTitle}
            className="Custom-btn"
            modalTitle={walletInfo.modalTitle}
            modalTitleIconUrl=""
            detailsBtn={() => <WalletConnected />}
            welcomeScreen={{
                title: walletInfo.welcomeScreen.title,
                subtitle: walletInfo.welcomeScreen.subtitle,
                img: {
                    src: "/next.svg",
                    width: 120,
                    height: 120,
                },
            }}
            switchToActiveChain={true}
        />
    );
};

export default ConnectWalletWrapper;
