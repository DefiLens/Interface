import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { walletInfo } from "../../utils/constants";
import AvatarIcon from "../../modules/portfolio/Avatar";
import styles from "./wallet.module.css";
import { smallLogo } from "../../assets/images";

const WalletConnected = () => {
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const address = useAddress();
    return (
        <div className="shadow-md rounded-full cursor-pointer overflow-hidden p-1 border">
            {selectedNetwork?.chainName && (
                <AvatarIcon address={address ?? ""} size={32} />
            )}
        </div>
    );
};

const ConnectWalletWrapper = () => {
    return (
        <ConnectWallet
            theme={"light"}
            modalSize="compact"
            btnTitle="Login"
            modalTitleIconUrl='https://res.cloudinary.com/dsguoq6ad/image/upload/v1716444923/mentorexperienceImages/otdarxcjkhxhrv2ldtii.svg'
            modalTitle={walletInfo.modalTitle}
            className={styles.customBtn}
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
            hideTestnetFaucet={true}
        />
    );
};

export default ConnectWalletWrapper;
