import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { fetchData } from "../../utils/helper";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";

export type UserToken = {
    token: string;
    amount: string;
    decimals: number;
};

export type ERC20Token = {
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    address: string;
    chainId: number;
};

export type Protocol = {
    name: string;
    slug: string;
    logo: string;
    url: string;
    description: string;
    twitter: string;
    category: string;
    chainIds: number[];
};

export type DefiToken = {
    apy: number;
    chainId: number;
    name: string;
    subtitle: string;
    tokenAddress: string;
    protocol?: Protocol;
    underlyingTokens?: string[];
};

// Updating the AggregatedTokenInfo type to include the Protocol type
export type AggregatedTokenInfo = {
    tokenAddress: string;
    amount: string;
    decimals: number;
    name?: string;
    symbol?: string;
    logoURI?: string;
    chainId?: number;
    subtitle?: string;
    apy?: number;
    protocol?: Protocol;
    underlyingTokens?: string[];
    price?: number; // New field for price
    type?: "erc20Token" | "defiToken";
};

type TokenPrice = {
    decimals: number;
    symbol: string;
    price: number;
    timestamp: number;
    confidence: number;
};

async function fetchTokenPrice(chainId: number, tokenAddress: string): Promise<number> {
    try {
        const url = `https://api.enso.finance/api/v1/prices/${chainId}/${tokenAddress}`;
        const response = await axios.get<TokenPrice>(url);
        return response.data.price;
    } catch (error) {
        console.error(`Error fetching price for token ${tokenAddress}: ${error}`);
        return 0; // Return a default value or handle this case as needed
    }
}

export function usePortfolio() {
    const { setUserTokensData, setIsUsersTokenLoading }: iPortfolio = usePortfolioStore((state) => state);

    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const chainIds = [137, 10, 8453];
    async function fetchPortfolio({ address }: any) {
        try {
            setIsUsersTokenLoading(true);

            const userTokensUrl = `https://api.enso.finance/api/v1/wallet/balances?chainId=${selectedNetwork.chainId}&eoaAddress=${address}&useEoa=true`;
            // const userTokensUrlOptimism = `https://api.enso.finance/api/v1/wallet/balances?chainId=${chainIds[1]}&eoaAddress=${address}&useEoa=true`;
            // const userTokensUrlBase = `https://api.enso.finance/api/v1/wallet/balances?chainId=${chainIds[2]}&eoaAddress=${address}&useEoa=true`;

            const baseTokensUrl = "https://enso-scrape.s3.us-east-2.amazonaws.com/output/backend/baseTokens.json";
            const defiTokensUrl = "https://enso-scrape.s3.us-east-2.amazonaws.com/output/backend/defiTokens.json";

            const userTokens = await fetchData<UserToken[]>(userTokensUrl);
            // const userTokensOptimism = await fetchData<UserToken[]>(userTokensUrlOptimism);
            // const userTokensBase = await fetchData<UserToken[]>(userTokensUrlBase);

            const baseTokens = await fetchData<ERC20Token[]>(baseTokensUrl);
            const defiTokens = await fetchData<DefiToken[]>(defiTokensUrl);

            console.log("userTokens: ", userTokens);
            // console.log('userTokensUrlOptimism: ', userTokensOptimism)
            // console.log('userTokensUrlBase: ', userTokensBase)
            // console.log('defiTokensUrl: ', baseTokens)
            // console.log('defiTokensUrl: ', defiTokens)

            const aggregatedData: AggregatedTokenInfo[] = [];
            // await  [...userTokensPolygon, ...userTokensOptimism, ...userTokensBase].forEach(async (userToken, index) => {
            await [...userTokens].forEach(async (userToken, index) => {
                // const price = await fetchTokenPrice(chainId, userToken.token);
                const defiTokenMatch = defiTokens.find(
                    (defiToken) => defiToken.tokenAddress.toLowerCase() == userToken.token.toLowerCase()
                );
                if (defiTokenMatch) {
                    const aggregatedInfo: AggregatedTokenInfo = {
                        tokenAddress: userToken.token,
                        amount: userToken.amount,
                        decimals: userToken.decimals,
                        name: defiTokenMatch.name,
                        subtitle: defiTokenMatch.subtitle,
                        apy: defiTokenMatch.apy,
                        protocol: defiTokenMatch.protocol, // Adding protocol info
                        underlyingTokens: defiTokenMatch.underlyingTokens,
                        // price,
                        type: "defiToken",
                    };
                    aggregatedData.push(aggregatedInfo);
                } else {
                    const erc20TokenMatch = baseTokens.find((baseToken) => baseToken.address === userToken.token);
                    if (erc20TokenMatch) {
                        let aggregatedInfo: AggregatedTokenInfo = {
                            tokenAddress: userToken.token,
                            amount: userToken.amount,
                            decimals: userToken.decimals,
                            name: erc20TokenMatch.name,
                            symbol: erc20TokenMatch.symbol,
                            logoURI: erc20TokenMatch.logoURI,
                            chainId: erc20TokenMatch.chainId,
                            // price,
                            type: "erc20Token",
                        };

                        aggregatedData.push(aggregatedInfo);
                    }
                }
            });
            console.log("aggregatedData", aggregatedData);
            setUserTokensData(aggregatedData);
            setIsUsersTokenLoading(false);
            return aggregatedData;
        } catch (error: any) {
            if (error.message) {
                console.log("refinance: Error", error.message);
            } else {
                console.log("refinance: Error", error);
            }
            setIsUsersTokenLoading(false);
            return;
        }
    }
    return useMutation(fetchPortfolio);
}
