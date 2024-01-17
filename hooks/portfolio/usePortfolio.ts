import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { decreasePowerByDecimals, fetchData } from "../../utils/helper";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { BigNumber as bg } from "bignumber.js";
bg.config({ DECIMAL_PLACES: 5 });
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

async function fetchTokenPrice(chainId: number, tokenAddress: string): Promise<number | undefined> {
    try {
        const url = `https://api.enso.finance/api/v1/prices/${chainId}/${tokenAddress}`;
        const response = await axios.get<TokenPrice>(url);
        // console.log('price: ', response.data.price)
        if (response.data.price) {
            return response.data.price;
        }
        return undefined;
    } catch (error) {
        console.error(`Error fetching price for token ${tokenAddress}: ${error}`);
        return 0; // Return a default value or handle this case as needed
    }
}

export function usePortfolio() {
    const { setUserTokensData, setIsUsersTokenLoading, setTotalNetworth }: iPortfolio = usePortfolioStore((state) => state);

    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const chainIds = [137, 10, 8453];
    async function fetchPortfolio({ address }: any) {
        try {
            let networth: any = bg(0)
            setIsUsersTokenLoading(true);

            const userTokensUrl = `https://api.enso.finance/api/v1/wallet/balances?chainId=${selectedNetwork.chainId}&eoaAddress=${address}&useEoa=true`;
            // const userTokensUrlOptimism = `https://api.enso.finance/api/v1/wallet/balances?chainId=${chainIds[1]}&eoaAddress=${address}&useEoa=true`;
            // const userTokensUrlBase = `https://api.enso.finance/api/v1/wallet/balances?chainId=${chainIds[2]}&eoaAddress=${address}&useEoa=true`;

            const baseTokensUrl = "https://enso-scrape.s3.us-east-2.amazonaws.com/output/backend/baseTokens.json";
            const defiTokensUrl = "https://enso-scrape.s3.us-east-2.amazonaws.com/output/backend/defiTokens.json";
            console.log("userTokensUrl: ", userTokensUrl);

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
                    const price = await fetchTokenPrice(Number(selectedNetwork.chainId), userToken.token)
                    console.log('userToken: ', defiTokenMatch.name, price?.toString())
                    const aggregatedInfo: AggregatedTokenInfo = {
                        tokenAddress: userToken.token,
                        amount: userToken.amount,
                        decimals: userToken.decimals,
                        name: defiTokenMatch.name,
                        subtitle: defiTokenMatch.subtitle,
                        apy: defiTokenMatch.apy,
                        protocol: defiTokenMatch.protocol, // Adding protocol info
                        underlyingTokens: defiTokenMatch.underlyingTokens,
                        price : price != undefined ? price : 0,
                        type: "defiToken",
                    };
                    aggregatedData.push(aggregatedInfo);
                    if (price) {
                        // console.log('price---', bg(networth).toString(), bg(decreasePowerByDecimals(bg(userToken.amount), userToken.decimals)).multipliedBy(bg(price?.toString())).toString())
                        networth = bg(networth).plus(bg(decreasePowerByDecimals(bg(userToken.amount), userToken.decimals)).multipliedBy(bg(price?.toString())))
                    }
                } else {
                    const erc20TokenMatch = baseTokens.find((baseToken) => baseToken.address === userToken.token);
                    if (erc20TokenMatch) {
                        const price = await fetchTokenPrice(Number(selectedNetwork.chainId), userToken.token)
                        console.log('userToken: ', erc20TokenMatch.name, price?.toString())
                        let aggregatedInfo: AggregatedTokenInfo = {
                            tokenAddress: userToken.token,
                            amount: userToken.amount,
                            decimals: userToken.decimals,
                            name: erc20TokenMatch.name,
                            symbol: erc20TokenMatch.symbol,
                            logoURI: erc20TokenMatch.logoURI,
                            chainId: erc20TokenMatch.chainId,
                            price : price != undefined ? price : 0,
                            type: "erc20Token",
                        };
                        aggregatedData.push(aggregatedInfo);
                        if (price) {
                            // console.log('price---2', bg(networth).toString(), bg(decreasePowerByDecimals(bg(userToken.amount), userToken.decimals)).multipliedBy(bg(price?.toString())).toString())
                            networth = bg(networth).plus(bg(decreasePowerByDecimals(bg(userToken.amount), userToken.decimals)).multipliedBy(bg(price?.toString())))
                        }
                    }
                }
                setTotalNetworth(networth.toString())
            });
            console.log("aggregatedData", aggregatedData, networth.toString());
            // for (let i=0; i<aggregatedData.length; i++) {
            //     console.log("aggregatedData-i: ", i)
            //     await fetchTokenPrice(137, aggregatedData[i].tokenAddress)
            // }
            setUserTokensData(aggregatedData);
            setIsUsersTokenLoading(false);
            return aggregatedData;
        } catch (error: any) {
            if (error.message) {
                console.log("portfolio: Error", error.message);
            } else {
                console.log("portfolio: Error", error);
            }
            setIsUsersTokenLoading(false);
            return;
        }
    }
    return useMutation(fetchPortfolio);
}
