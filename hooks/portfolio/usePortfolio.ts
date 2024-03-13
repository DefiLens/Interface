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
    const { setChainData, setIsLoading, setError }: iPortfolio = usePortfolioStore((state) => state);

    async function fetchPortfolio(address: any) {
        try {
            const authToken = process.env.NEXT_PUBLIC_COVALENT_API_KEY;

            const chains = [
                { chainId: 137 }, // Polygon
                { chainId: 1 }, // Ethereum
                { chainId: 8453 }, // Binance Smart Chain
                { chainId: 10 }, // Optimism
                { chainId: 43114 }, // Avalanche
                { chainId: 42161 }, // Arbitrum
            ];

            const requests = chains.map(async ({ chainId }) => {
                const response = await axios.get(
                    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                return { chainId, data: response.data.data };
            });

            const responseData = await Promise.all(requests);
            console.log("responseData----------", responseData);
            setChainData(responseData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching data");
        } finally {
            setIsLoading(false);
        }
    }
    return useMutation(fetchPortfolio);
}
