import { iBatchHistory } from "../types";
import { decreasePowerByDecimals, formatDate } from "../../../utils/helper";
import { NETWORK_LIST } from "../../../utils/data/network";
import Image from "next/image";
import CopyButton from "../../../components/common/CopyButton";
import { iPortfolio, usePortfolioStore } from "../../../store/Portfolio";
import Header from "../../header/Header";
import IERC20 from "../../../abis/IERC20.json";

interface BatchHistoryProps {
    transactions: iBatchHistory[];
    smartAccountAddress: string;
    isSimulation: boolean;
    setIsSimulation: (isSimulation: boolean) => void;
}

interface Chain {
    chainName: string;
    value: string;
}

interface FilterSelectionProps {
    dropdown?: boolean;
    isSimulation?: boolean;
    setIsSimulation?: (isSimulation: boolean) => void;
}

const FilterSelection: React.FC<FilterSelectionProps> = ({ dropdown = false, setIsSimulation, isSimulation }) => {
    const { chainName, setChainName }: iPortfolio = usePortfolioStore((state) => state);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChainName(e.target.value);
    };

    const handleButtonClick = (chainName: string) => {
        setChainName(chainName);
    };

    const chains: Chain[] = [
        { chainName: "All", value: "" }, // All Chains
        { chainName: "Polygon", value: "polygon" }, // Polygon (Matic)
        { chainName: "Base", value: "base" }, // Base
        { chainName: "Optimism", value: "optimism" }, // Optimism
    ];

    return (
        <div className="">
            {dropdown ? (
                <div className="text-N20 bg-GR1 border rounded-lg px-3 cursor-pointer shadow-lg text-xs">
                    <select
                        value={chainName}
                        onChange={handleSelectChange}
                        className="bg-transparent py-2 cursor-pointer outline-none"
                    >
                        {chains.map((chain) => (
                            <option
                                key={chain.value}
                                value={chain.value}
                                className="bg-N20-300 text-sm py-2 px-3 border-none rounded-lg text-B100"
                            >
                                {chain.chainName}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="w-full flex items-center gap-3 overflow-scroll" style={{ scrollbarWidth: "none" }}>
                    {/* {chains.map((chain) => (
                        <button
                            key={chain.chainName}
                            onClick={() => handleButtonClick(chain.value)}
                            className={`py-2 px-4 rounded-lg border border-B50 hover:bg-N50 ${
                                chainName === chain.value ? "bg-GR1 text-N20 border-none" : "bg-N40 text-B100"
                            }`}
                        >
                            {chain.chainName}
                        </button>
                    ))} */}
                    <button
                        onClick={() => setIsSimulation(true)}
                        // className={`py-2 px-4 rounded-lg border border-B50 hover:bg-N50 ${
                        //     isSimulation ? "bg-GR1 text-N20 border-none" : "bg-N40 text-B100"
                        // }`}
                        className={`py-2 px-3 text-xs rounded-lg border text-B200 border-gray-300 bg-W100 hover:bg-W50 transition-all duration-75 ${
                            isSimulation ? "bg-GR1 text-N20 border-none" : "bg-N40 text-B100"
                        }`}
                    >
                        Batch History
                    </button>
                    <button
                        onClick={() => setIsSimulation(false)}
                        className={`py-2 px-3 text-xs rounded-lg border text-B200 border-gray-300 bg-W100 hover:bg-W50 transition-all duration-75 ${
                            !isSimulation ? "bg-GR1 text-N20 border-none" : "bg-N40 text-B100"
                        }`}
                    >
                        Simulation History
                    </button>
                </div>
            )}
        </div>
    );
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";
import { getContractInstance, getProvider } from "../../../utils/web3Libs/ethers";
import { Button } from "../../../components/Button";

// const MyComponenft = () => {
//     const [tokenBalances, setTokenBalances] = useState<any>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const fetchBalances = async () => {
//         // if (!userAddress || !tokenList.length) return;

//         setIsLoading(true);

//         try {
//             const response = await axios.post("http://localhost:8000/getBalances", {
//                 userAddress: smartAccountAddress,
//                 tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
//                 chainId: 137,
//             });

//             setTokenBalances(response.data);
//             console.log(response.data);
//         } catch (error) {
//             console.error("Error fetching token balances:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div>
//             <button onClick={fetchBalances} disabled={isLoading}>
//                 {isLoading ? "Loading..." : "Fetch Balances"}
//             </button>
//             <ul className="flex flex-col">
//                 <li>{decreasePowerByDecimals(tokenBalances.balance, tokenBalances.decimals)}</li>
//                 <li>{tokenBalances.decimals}</li>
//                 <li>{tokenBalances.name}</li>
//                 <li>{tokenBalances.symbol}</li>
//                 <li> {decreasePowerByDecimals(tokenBalances.totalSupply, tokenBalances.decimals)}</li>
//             </ul>
//         </div>
//     );
// };

interface TokenData {
    nativeToken: string;
    symbol: string;
    decimals: number;
    balance: string;
    totalSupply: string;
}

const My3Component = () => {
    const [tokenData, setTokenData] = useState<TokenData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    useEffect(() => {
        const fetchTokenData = async () => {
            const chainId = 137; // Example chain ID

            try {
                const response = await fetch("http://localhost:8000/getTokenBalancesAndSupplies", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chainId, userAddress: smartAccountAddress }),
                });
                const data = await response.json();
                setTokenData(data.results);
            } catch (error) {
                console.error("Error fetching token data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTokenData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {tokenData.map(({ nativeToken, symbol, decimals, balance, totalSupply }) => (
                <div key={nativeToken}>
                    <h3>{symbol}</h3>
                    <p>Address: {nativeToken}</p>
                    <p>Decimals: {decimals}</p>
                    <p>Balance: {balance}</p>
                    <p>Total Supply: {totalSupply}</p>
                </div>
            ))}
        </div>
    );
};

const MyComponent = () => {
    const [data, setData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    useEffect(() => {
        const fetchData = async () => {
            const userAddress = smartAccountAddress;

            try {
                const response = await axios.post("http://localhost:8000/getTokenBalancesAndSupplies", {
                    userAddress,
                    chainId: 137,
                });
                setData(response.data.results);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {data?.map(({ nativeToken, symbol, decimals, balance, totalSupply }, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-xl font-semibold">{symbol}</h3>
                    <p>
                        <strong>Token Address:</strong> {nativeToken}
                    </p>
                    <p>
                        <strong>Decimals:</strong> {decimals}
                    </p>
                    <p>
                        <strong>Balance:</strong> {balance}
                    </p>
                    <p>
                        <strong>Total Supply:</strong> {totalSupply}
                    </p>
                </div>
            ))}
        </div>
    );
};

const BatchHistory: React.FC<BatchHistoryProps> = ({ transactions, setIsSimulation, isSimulation }) => {
    // const [eventLogs, setEventLogs] = useState<any[]>([]);
    // const listenToEvents = async () => {
    //     const provider = await getProvider(137);

    //     const contract: any = await getContractInstance("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", IERC20, provider);

    //     contract.on("Transfer", (from, to, value) => {
    //         const data = {
    //             from,
    //             to,
    //             value,
    //         };
    //         console.log("Transfer event:", from, to, value);
    //         setEventLogs((prev) => [...prev, data]);
    //     });
    // };

    return (
        <> 
            {/* <MyComponent /> */}
            {/* <button onClick={listenToEvents}>Get event</button>
            {eventLogs.reverse().map((log, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                    <p>{log.from}</p>
                    <p>{"===>"}</p>
                    <p>{log.to}</p>
                    {/* <p>{log.value}</p> */}
                {/* </div>
            ))} */}
            <Header title="History" />
            <div className="w-full flex flex-col justify-center items-center gap-6">
                <div className="sticky h-[3.3rem] -top-2 z-20 w-full mx-auto bg-N0 shadow-lg rounded-md p-3 flex justify-between gap-2 items-center">
                    <FilterSelection setIsSimulation={setIsSimulation} isSimulation={isSimulation} />
                    <FilterSelection dropdown={true} />
                </div>
                <div className="w-full mx-auto bg-N0 shadow-lg rounded-md p-3">
                    <h1 className="text-xl font-bold mb-4">Transaction History</h1>

                    <div className="flex flex-col gap-6">
                        {transactions && transactions.length > 0 ? (
                            transactions.map((parentTransaction: iBatchHistory, index: number) => (
                                <div key={index}>
                                    <h2 className="text-base font-semibold">#{index + 1} Batch</h2>
                                    <div className="flex text-base justify-between items-end mb-1">
                                        <div className="flex items-center gap-1">
                                            <p className="font-semibold">
                                                Transaction Hash:{"  "}
                                                {parentTransaction.txHash
                                                    ? parentTransaction.txHash.slice(0, 20) +
                                                      "......." +
                                                      parentTransaction.txHash.slice(-8)
                                                    : "N/A"}
                                            </p>
                                            <CopyButton copy={parentTransaction.txHash || ""} />
                                        </div>
                                        <div className="flex text-base flex-col items-center gap-1">
                                            <p className="font-semibold">
                                                Total Amount: {parentTransaction.totalAmount}
                                            </p>
                                            <p className="font-semibold">
                                                Date: {formatDate(parentTransaction.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="table-auto border-collapse w-full text-sm">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">From Network</th>
                                                    <th className="px-4 py-2">From Protocol</th>
                                                    <th className="px-4 py-2">From Token</th>
                                                    <th className="px-4 py-2">To Network</th>
                                                    <th className="px-4 py-2">To Protocol</th>
                                                    <th className="px-4 py-2">To Token</th>
                                                    <th className="px-4 py-2">Amount In</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parentTransaction.transactions.map((transaction) => {
                                                    // Find the corresponding network object for fromNetwork
                                                    const fromNetworkObj = NETWORK_LIST.find(
                                                        (network) =>
                                                            network.chainName.toLowerCase() ===
                                                            transaction.fromNetwork.toLowerCase()
                                                    );

                                                    // Find the corresponding network object for toNetwork
                                                    const toNetworkObj = NETWORK_LIST.find(
                                                        (network) =>
                                                            network.chainName.toLowerCase() ===
                                                            transaction.toNetwork.toLowerCase()
                                                    );

                                                    return (
                                                        <tr key={transaction._id}>
                                                            <td className="border text-sm px-4 py-2 text-center">
                                                                {fromNetworkObj ? (
                                                                    <div className="flex gap-2 items-center">
                                                                        <Image
                                                                            src={fromNetworkObj.icon}
                                                                            alt={fromNetworkObj.key}
                                                                            className="h-6 w-6 rounded-full"
                                                                        />
                                                                        {fromNetworkObj.key}
                                                                    </div>
                                                                ) : null}
                                                            </td>
                                                            <td className="border px-4 py-2 text-center">
                                                                {transaction.fromProtocol}
                                                            </td>
                                                            <td className="border px-4 py-2 text-center">
                                                                {transaction.fromToken}
                                                            </td>
                                                            <td className="border px-4 py-2 text-center">
                                                                {toNetworkObj ? (
                                                                    <div className="flex gap-2 items-center">
                                                                        <Image
                                                                            src={toNetworkObj.icon}
                                                                            alt={toNetworkObj.key}
                                                                            className="h-6 w-6 rounded-full"
                                                                        />
                                                                        {toNetworkObj.key}
                                                                    </div>
                                                                ) : null}
                                                            </td>
                                                            <td className="border px-4 py-2 text-center">
                                                                {transaction.toProtocol}
                                                            </td>
                                                            <td className="border px-4 py-2 text-center">
                                                                {transaction.toToken}
                                                            </td>
                                                            <td className="border px-4 py-2 text-center">
                                                                {transaction.amountIn}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>{transactions?.message}</>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BatchHistory;
