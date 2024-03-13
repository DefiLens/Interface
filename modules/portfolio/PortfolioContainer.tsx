import { useEffect } from "react";

import Portfolio from "./Portfolio";
import { usePortfolio } from "../../hooks/portfolio/usePortfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { useAddress } from "@thirdweb-dev/react";

const PortfolioContainer: React.FC<any> = () => {
    const { mutateAsync: fetchPortfolio } = usePortfolio();
    const address = useAddress();

    const {
        smartAccountAddress,
        selectedNetwork
    }: iGlobal = useGlobalStore((state) => state);

    const { isSCW, setChainData }: iPortfolio = usePortfolioStore(
        (state) => state
    );

    const handleFetchPorfolioData = () => {
        console.log("SCW----------", isSCW)
        const fetch = async (address: string) => {
            await fetchPortfolio(address);
        };

        if (isSCW && smartAccountAddress) {
            setChainData(null);
            // Fetch SCW Portfolio Data
            fetch(smartAccountAddress);
        }
        if (!isSCW && address) {
            setChainData(null);
            // Fetch EOA Portfolio Data
            fetch(address);
        }
    };

    useEffect(() => {
        handleFetchPorfolioData();
    }, [isSCW]);

    return (
        <Portfolio
            smartAccountAddress={smartAccountAddress}
            handleFetchPorfolioData={handleFetchPorfolioData}
        />
    );
};
export default PortfolioContainer;
