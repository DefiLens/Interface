import { useEffect } from "react";

import Portfolio from "./Portfolio";
import { usePortfolio } from "../../hooks/portfolio/usePortfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { useAddress } from "@thirdweb-dev/react";

const PortfolioContainer: React.FC<any> = () => {
    const { mutateAsync: fetchPortfolio } = usePortfolio();
    const address = useAddress();

    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    const { userTokensData, setUserTokensData, isUsersTokenLoading, isSCW }: iPortfolio = usePortfolioStore(
        (state) => state
    );

    const handleFetchPorfolioData = () => {
        const fetch = async (address: string) => {
            await fetchPortfolio({ address : "0xb50685c25485CA8C520F5286Bbbf1d3F216D6989" });
        };

        if (smartAccountAddress) {
            setUserTokensData(null);
            fetch(isSCW ? smartAccountAddress : address);
        }
    };

    useEffect(() => {
        handleFetchPorfolioData();
    }, [smartAccountAddress, isSCW]);

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
