import { useEffect } from "react";

import Portfolio from "./Portfolio";
import { usePortfolio } from "../../hooks/portfolio/usePortfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";

const PortfolioContainer: React.FC<any> = () => {

    const { mutateAsync: fetchPortfolio } = usePortfolio();

    const {
        smartAccountAddress,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        userTokensData,
    }: iPortfolio = usePortfolioStore((state) => state);

    useEffect(() => {
        const  fetch = async (address: string) => {
           await fetchPortfolio({ address })
        }

        if (smartAccountAddress) {
            fetch(smartAccountAddress);
        }
    }, [smartAccountAddress]);

    const separatedArray = userTokensData.filter((token: any) => token.type === "defiToken")
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

    return (
        <Portfolio
            userTokensData={userTokensData}
            filteredDefiTokens={filteredDefiTokens}
        />
    )  
};
export default PortfolioContainer;
