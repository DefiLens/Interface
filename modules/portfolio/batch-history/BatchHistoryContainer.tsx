// // import axios from "axios";
// // import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";
// // import { iBatchHistory } from "../types";
// // import BatchHistory from "./BatchHistory";
// // import { useEffect, useState } from "react";
// // import { iPortfolio, usePortfolioStore } from "../../../store/Portfolio";
// // import axiosInstance from "../../../axiosInstance/axiosInstance";

// // const BatchHistoryContainer = () => {
// //     const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);
// //     const { chainName }: iPortfolio = usePortfolioStore((state) => state);
// //     const [transactions, setTransactions] = useState<iBatchHistory[]>([]);
// //     const [errorMessage, setErrorMessage] = useState<string>("");
// //     const [isSimulation, setIsSimulation] = useState<boolean>(true);

// //     const fetchTransactions = async () => {
// //         try {
// //             const response = await axiosInstance.get(
// //                 `/transactions/${isSimulation ? "batch" : "batch-simulation"}/${smartAccountAddress}`,
// //                 {
// //                     params: { network: chainName },
// //                 }
// //             );
// //             setTransactions(response.data);
// //             setErrorMessage(response.data.message);
// //         } catch (error) {
// //             console.error("Error fetching transaction history:", error);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchTransactions();
// //     }, [smartAccountAddress, chainName, isSimulation]);

// //     return <BatchHistory transactions={transactions} smartAccountAddress={smartAccountAddress} isSimulation={isSimulation} setIsSimulation={setIsSimulation} errorMessage={errorMessage}/>;
// // };

// // export default BatchHistoryContainer;

// import axios from "axios";
// import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";
// import { iBatchHistory } from "../types";
// import BatchHistory from "./BatchHistory";
// import { useEffect, useState } from "react";
// import { iPortfolio, usePortfolioStore } from "../../../store/Portfolio";
// import axiosInstance from "../../../axiosInstance/axiosInstance";

// const BatchHistoryContainer = () => {
//     const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);
//     const { chainName }: iPortfolio = usePortfolioStore((state) => state);
//     const [transactions, setTransactions] = useState<iBatchHistory[]>([]);
//     const [errorMessage, setErrorMessage] = useState<string>("");
//     const [isSimulation, setIsSimulation] = useState<boolean>(true);
//     const [page, setPage] = useState<number>(1);
//     const [limit, setLimit] = useState<number>(6);
//     const [totalPages, setTotalPages] = useState<number>(1);

//     const fetchTransactions = async () => {
//         try {
//             const response = await axiosInstance.get(
//                 `/transactions/${isSimulation ? "batch" : "batch-simulation"}/${smartAccountAddress}`,
//                 {
//                     params: { network: chainName, page, limit },
//                 }
//             );
//             setTransactions(response.data.transactions);
//             setErrorMessage(response.data.message);
//             setTotalPages(response.data.totalPages);
//         } catch (error) {
//             console.error("Error fetching transaction history:", error);
//         }
//     };

//     useEffect(() => {
//         fetchTransactions();
//     }, [smartAccountAddress, chainName, isSimulation, page, limit]);

//     const handlePreviousPage = () => {
//         if (page > 1) {
//             setPage(page - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (page < totalPages) {
//             setPage(page + 1);
//         }
//     };

//     return (
//         <BatchHistory
//             transactions={transactions}
//             smartAccountAddress={smartAccountAddress}
//             isSimulation={isSimulation}
//             setIsSimulation={setIsSimulation}
//             errorMessage={errorMessage}
//             page={page}
//             setPage={setPage}
//             limit={limit}
//             setLimit={setLimit}
//         />
//     );
// };

// export default BatchHistoryContainer;

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
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSimulation, setIsSimulation] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(8);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchTransactions = async () => {
        try {
            const response = await axiosInstance.get(
                `/transactions/${isSimulation ? "batch" : "batch-simulation"}/${smartAccountAddress}`,
                {
                    params: { network: chainName, page, limit },
                }
            );
            setTransactions(response.data.transactions);
            setErrorMessage(response.data.message);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            setErrorMessage("Error fetching transaction history");
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [smartAccountAddress, chainName, isSimulation, page, limit]);

    useEffect(() => {
        setPage(1);
    }, [isSimulation]);

   
    return (
        <div className="container mx-auto p-4">
            <BatchHistory
                transactions={transactions}
                isSimulation={isSimulation}
                setIsSimulation={setIsSimulation}
                errorMessage={errorMessage}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
    );
};

export default BatchHistoryContainer;
