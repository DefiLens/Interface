import { useEffect, useState } from "react";

import { useAddress } from "@thirdweb-dev/react";

import MigrateAsset from "./MigrateAsset";
import { usePortfolio } from "../../hooks/portfolio/usePortfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iPortfolio, iUserTokenInfo, usePortfolioStore } from "../../store/Portfolio";

const MigrateAssetContainer: React.FC<any> = () => {

    const { mutateAsync: fetchPortfolio } = usePortfolio();
    const address = useAddress();

    const [scwTokenAddressesData, setScwTokenAddressesData] = useState([]);
    const [eoaTokenAddressesData, setEoaTokenAddressesData] = useState([]);

    const {
        smartAccountAddress,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        userTokensData,
        setUserTokensData,
        isUsersTokenLoading,
        isSCW,
    }: iPortfolio = usePortfolioStore((state) => state);

    const handleFetchPorfolioData = () => {
        const  fetch = async (address: string) => {
            await fetchPortfolio({ address })
         }
 
         if (smartAccountAddress) {
            setUserTokensData(null)
            fetch(isSCW ? smartAccountAddress : address);
         }
    }

    useEffect(() => {
        handleFetchPorfolioData()
        isTokenAddresses()
    }, [smartAccountAddress, isSCW]);

    const isTokenAddresses = async () => {
        if(isSCW) {
            if (localStorage.getItem('0xScw')?.toString() !== undefined) {
                const tokenAddresses = JSON.parse(localStorage.getItem('0xScw')?.toString() ?? '');
                setScwTokenAddressesData(tokenAddresses);
            }
        } else {
            if (localStorage.getItem('0xEoa')?.toString() !== undefined) {
                const tokenAddresses = JSON.parse(localStorage.getItem('0xEoa')?.toString() ?? '');
                setScwTokenAddressesData(tokenAddresses);
            }
        }
      };

    const checkTokensData = (data: iUserTokenInfo) => {
        if(isSCW) {
            let getScwTokens: any = [];

            if (localStorage.getItem('0xScw')?.toString() === undefined) {
                localStorage.setItem('0xScw', JSON.stringify([]));
            } else {
                getScwTokens = JSON.parse(localStorage.getItem('0xScw')?.toString() ?? '');
            }
            if (!getScwTokens.includes(`${data.tokenAddress}`)) {
                getScwTokens.push(`${data.tokenAddress}`);

                localStorage.setItem('0xScw', JSON.stringify(getScwTokens));
                setScwTokenAddressesData(getScwTokens);
            } else {
                getScwTokens = getScwTokens.filter((token: any) => token !== data.tokenAddress);
                localStorage.setItem('0xEoa', JSON.stringify(getScwTokens));
                setScwTokenAddressesData(getScwTokens);
            }
        } else {
            let getEoaTokens: any = [];

            if (localStorage.getItem('0xEoa')?.toString() === undefined) {
                localStorage.setItem('0xEoa', JSON.stringify([]));
            } else {
                getEoaTokens = JSON.parse(localStorage.getItem('0xEoa')?.toString() ?? '');
            }
            if (!getEoaTokens.includes(`${data.tokenAddress}`)) {
                getEoaTokens.push(`${data.tokenAddress}`);

                localStorage.setItem('0xEoa', JSON.stringify(getEoaTokens));
                setEoaTokenAddressesData(getEoaTokens);
            } else {
                getEoaTokens = getEoaTokens.filter((token: any) => token !== data.tokenAddress);
                localStorage.setItem('0xEoa', JSON.stringify(getEoaTokens));
                setEoaTokenAddressesData(getEoaTokens);
            }
        }
    };

    const handleExecuteMgrateAsset = () => {
        if(isSCW) {
            console.log("Execute: Scw Tokens", scwTokenAddressesData)
        } else {
            console.log("Execute: Eoa Tokens", eoaTokenAddressesData)
        }
    }

    const separatedArray = (userTokensData || []).filter((token: any) => token.type === "defiToken")
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

    const TotalNetWorth = (userTokensData || []).reduce((acc, curr) => {
        acc.netWorth = parseFloat(curr.amount)
    return acc;
    }, { netWorth: 0});

    return (
        <MigrateAsset
            isUsersTokenLoading={isUsersTokenLoading}
            smartAccountAddress={smartAccountAddress}
            userTokensData={userTokensData}
            filteredDefiTokens={filteredDefiTokens}
            handleFetchPorfolioData={handleFetchPorfolioData}
            totalNetWorth={TotalNetWorth.netWorth}
            scwTokenAddressesData={scwTokenAddressesData}
            eoaTokenAddressesData={eoaTokenAddressesData}
            checkTokensData={checkTokensData}
            handleExecuteMgrateAsset={handleExecuteMgrateAsset}
        />
    )  
};
export default MigrateAssetContainer;