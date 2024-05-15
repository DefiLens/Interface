import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { chains } from "../../modules/portfolio/constants";
import toast from "react-hot-toast";
import axiosInstance from "../../axiosInstance/axiosInstance";

export function usePortfolio() {
    const { chainId, setChainData, setIsLoading, setError }: iPortfolio = usePortfolioStore((state) => state);

    /**
     * 
     * @param address Requested portfolio's user's account address
     */
    async function fetchPortfolio(address: string) {
        try {
            setIsLoading(true);

            let requests;
            if (chainId) {
                // Fetch data for a specific chain if chainId is provided
                const chain = chains.find((c) => c.chainId === chainId);
                if (!chain) {
                    throw new Error(`Chain with ID ${chainId} not found.`);
                }
                const response = await axiosInstance.get(`/token/portfolio?address=${address}&chainName=${chain.chainName.toLowerCase()}`);
                requests = [{ chainId, data: response.data.data }];
            } else {
                // Fetch data for all chains if chainId is not provided
                requests = await Promise.all(
                    chains.map(async ({ chainName, chainId }) => {
                        const response = await axiosInstance.get(`/token/portfolio?address=${address}&chainName=${chainName.toLowerCase()}`);
                        return { chainId, data: response.data.data };
                    })
                );
            }
            // Storing the array of req results of portfolio into chainData: { chainId, data }
            setChainData(requests);
        } catch (error) {
            // console.error("Error fetching data");
            toast.error("Error while loading Portfolio data. Please try again.");
            setError("Error fetching data");
        } finally {
            setIsLoading(false);
        }
    }

    return useMutation(fetchPortfolio);
}
