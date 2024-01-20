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

    const { userTokensData, setUserTokensData, isUsersTokenLoading, isSCW }: iPortfolio = usePortfolioStore(
        (state) => state
    );

    const handleFetchPorfolioData = () => {
        const fetch = async (address: string, chainId: string) => {
            await fetchPortfolio({ address, chainId });
        };

        if (isSCW && smartAccountAddress) {
            setUserTokensData(null);
            // Fetch SCW Portfolio Data
            fetch(smartAccountAddress, selectedNetwork.chainId);
        }
        if (!isSCW && address) {
            setUserTokensData(null);
            // Fetch EOA Portfolio Data
            fetch(address, selectedNetwork.chainId);
        }
    };

    useEffect(() => {
        if (selectedNetwork.chainId) handleFetchPorfolioData();
    }, [selectedNetwork, isSCW]);

    const separatedArray = (userTokensData || [])
        .filter((token: any) => token.type === "defiToken")
        .reduce((acc, curr) => {
            const key: any = curr.protocol?.name;
            if (!acc[key]) {
                acc[key] = [curr];
            } else {
                acc[key].push(curr);
            }
            return acc;
        }, {});

    const filteredDefiTokens = Object.values(separatedArray);

    const TotalNetWorth = (userTokensData || []).reduce(
        (acc, curr) => {
            acc.netWorth = parseFloat(curr.amount);
            return acc;
        },
        { netWorth: 0 }
    );

    return (
        <Portfolio
            isUsersTokenLoading={isUsersTokenLoading}
            smartAccountAddress={smartAccountAddress}
            userTokensData={userTokensData}
            filteredDefiTokens={filteredDefiTokens}
            handleFetchPorfolioData={handleFetchPorfolioData}
            totalNetWorth={TotalNetWorth.netWorth}
        />
    );
};
export default PortfolioContainer;
