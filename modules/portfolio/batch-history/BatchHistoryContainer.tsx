import axios from "axios";
import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";
import { iBatchHistory } from "../types";
import BatchHistory from "./BatchHistory";
import { useEffect, useState } from "react";
import { iPortfolio, usePortfolioStore } from "../../../store/Portfolio";
import axiosInstance from "../../../axiosInstance/axiosInstance";

const BatchHistoryContainer = () => {
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);
    const { chainName }: iPortfolio = usePortfolioStore((state) => state);
    const [transactions, setTransactions] = useState<iBatchHistory[]>([]);
    const [isSimulation, setIsSimulation] = useState<boolean>(false);

    const fetchTransactions = async () => {
        try {
            const response = await axiosInstance.get(
                `/transactions/${isSimulation ? "batch" : "batch-simulation"}/${smartAccountAddress}`,
                {
                    params: { network: chainName },
                }
            );
            setTransactions(response.data as iBatchHistory[]);
        } catch (error) {
            console.error("Error fetching transaction history:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [smartAccountAddress, chainName, isSimulation]);

    return <BatchHistory transactions={transactions} smartAccountAddress={smartAccountAddress} isSimulation={isSimulation} setIsSimulation={setIsSimulation} />;
};

export default BatchHistoryContainer;
