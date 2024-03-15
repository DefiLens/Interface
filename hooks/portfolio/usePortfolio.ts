import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";

export function usePortfolio() {
    const { chainId, setChainData, setIsLoading, setError }: iPortfolio = usePortfolioStore((state) => state);

    async function fetchPortfolio(address: string) {
        // address = "0x9Ce935D780424FB795bef7E72697f263A8258fAA";
        try {
            setIsLoading(true);
            const authToken = process.env.NEXT_PUBLIC_COVALENT_API_KEY;

            const chains = [
                { chainName: "Polygon", chainId: 137 }, // Polygon (Matic)
                { chainName: "Ethereum", chainId: 1 }, // Ethereum
                { chainName: "Base", chainId: 8453 }, // Base
                { chainName: "Optimism", chainId: 10 }, // Optimism
                { chainName: "Avalanche", chainId: 43114 }, // Avalanche
                { chainName: "Arbitrum", chainId: 42161 }, // Arbitrum
            ];

            let requests;
            if (chainId) {
                // Fetch data for a specific chain if chainId is provided
                const chain = chains.find((c) => c.chainId === chainId);
                if (!chain) {
                    throw new Error(`Chain with ID ${chainId} not found.`);
                }
                const response = await axios.get(
                    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                requests = [{ chainId, data: response.data.data }];
            } else {
                // Fetch data for all chains if chainId is not provided
                requests = await Promise.all(
                    chains.map(async ({ chainId }) => {
                        const response = await axios.get(
                            `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
                            {
                                headers: {
                                    Authorization: `Bearer ${authToken}`,
                                },
                            }
                        );
                        return { chainId, data: response.data.data };
                    })
                );
            }

            setChainData(requests);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching data");
        } finally {
            setIsLoading(false);
        }
    }

    return useMutation(fetchPortfolio);
}