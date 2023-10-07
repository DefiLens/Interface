import { BigNumber as bg } from "bignumber.js";

import { useConnect, metamaskWallet } from "@thirdweb-dev/react";

import Header from "./Header";
import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { useSwitchOnSpecificChain } from "../../hooks/useSwitchOnSpecificChain";

bg.config({ DECIMAL_PLACES: 5 });

const HeaderContainer: React.FC<any> = () => {

    const {
        setConnected,
    }: iGlobal = useGlobalStore((state) => state);

    const { mutateAsync: switchOnSpecificChain } = useSwitchOnSpecificChain();

    const metamaskConfig = metamaskWallet();
    const connect = useConnect();

    const handleConnect = async () => {
        connect(metamaskConfig, {})
            .then(() => {
                setConnected(true);
            })
            .catch(() => {
                setConnected(false);
            });
    };

    return (
        <Header
            handleConnect={handleConnect}
            switchOnSpecificChain={switchOnSpecificChain}
        />
    );
};

export default HeaderContainer;
