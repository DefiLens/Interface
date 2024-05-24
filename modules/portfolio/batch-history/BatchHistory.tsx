import { iBatchHistory } from "../types";
import { decreasePowerByDecimals, formatDate } from "../../../utils/helper";
import { NETWORK_LIST } from "../../../utils/data/network";
import Image from "next/image";
import CopyButton from "../../../components/common/CopyButton";
import { iPortfolio, usePortfolioStore } from "../../../store/Portfolio";
import { useEffect, useState } from "react";
import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";
import { arbitrum, base, optimism, polygon } from "viem/chains";

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
                <div className="text-N20 text-lg bg-GR1 border rounded-lg px-2 cursor-pointer shadow-lg">
                    <select
                        value={chainName}
                        onChange={handleSelectChange}
                        className="bg-transparent py-2 cursor-pointer outline-none"
                    >
                        {chains.map((chain) => (
                            <option
                                key={chain.value}
                                value={chain.value}
                                className="bg-N20-300 py-2 px-4 border-none rounded-lg text-B100"
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
                        className={`py-2 px-4 rounded-lg border border-B50 hover:bg-N50 ${
                            isSimulation ? "bg-GR1 text-N20 border-none" : "bg-N40 text-B100"
                        }`}
                    >
                        Batch History
                    </button>
                    <button
                        onClick={() => setIsSimulation(false)}
                        className={`py-2 px-4 rounded-lg border border-B50 hover:bg-N50 ${
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

const tokensByNetworkForCC = {
    "137": {
        usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    "42161": {
        usdc: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    "10": {
        usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    "8453": {
        usdc: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    },
};

const ChainData = [
    {
        key: "Polygon",
        chainName: "polygon",
        chainId: "137",
        icon: polygon,
    },
    {
        key: "Arbitrum",
        chainName: "arbitrum",
        chainId: "42161",
        icon: arbitrum,
    },
    {
        key: "Optimism",
        chainName: "optimism",
        chainId: "10",
        icon: optimism,
    },
    {
        key: "Base",
        chainName: "base",
        chainId: "8453",
        icon: base,
    },
];

const TokenB2alance = () => {
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);
    const [balances, setBalances] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [totalUSDC, setTotalUSDC] = useState(0);

    useEffect(() => {
        const fetchBalances = async () => {
            const results = {};
            let total = 0;

            try {
                const fetchBalancePromises = Object.keys(tokensByNetworkForCC).map(async (chainId) => {
                    const tokenAddress = tokensByNetworkForCC[chainId].usdc;
                    const response = await fetch("http://localhost:8000/getBalances", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            chainId,
                            tokenAddress,
                            userAddress: "0x9Ce935D780424FB795bef7E72697f263A8258fAA",
                        }),
                    });
                    const result = await response.json();
                    results[chainId] = result;

                    // Sum up the USDC balance
                    total += parseFloat(result.balance);
                });

                await Promise.all(fetchBalancePromises);
                setBalances(results);
                setTotalUSDC(total);
            } catch (error) {
                console.error("Error fetching balances:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartAccountAddress]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const calculateTotalUSDC = () => {
        let totalUSDC = 0;
        Object.values(balances).forEach((balanceInfo: any) => {
            const balance = parseFloat(balanceInfo.balance);
            totalUSDC += balance;
        });
        return totalUSDC > 0 && decreasePowerByDecimals(totalUSDC, 6);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    const t: any = calculateTotalUSDC();

    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-3xl font-bold mb-6">Total USDC Balance: {decreasePowerByDecimals(totalUSDC, 6)}</h1> */}
            <h1 className="text-3xl font-bold mb-6">Total USDC Balance: {t}</h1>

            {balances &&
                Object.keys(balances).map((chainId) => (
                    <div key={chainId} className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Chain ID: {chainId}</h2>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-xl font-semibold">{balances[chainId].symbol}</h3>
                            <p>
                                <strong>Token Address:</strong> {balances[chainId].nativeToken}
                            </p>
                            <p>
                                <strong>Balance:</strong>{" "}
                                {balances[chainId]?.balance && decreasePowerByDecimals(balances[chainId]?.balance, 6)}
                            </p>
                            <p>
                                <strong>Total Supply:</strong> {balances[chainId].totalSupply}
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

const TokenBalance = () => {
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);
    const [balances, setBalances] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [totalUSDCPerChain, setTotalUSDCPerChain] = useState({});
    const [overallTotalUSDC, setOverallTotalUSDC] = useState(0);

    useEffect(() => {
        const fetchBalances = async () => {
            const results = {};
            const perChainTotal = {};
            let overallTotal = 0;

            try {
                const fetchBalancePromises = Object.keys(tokensByNetworkForCC).map(async (chainId) => {
                    const tokenAddress = tokensByNetworkForCC[chainId].usdc;
                    const response = await fetch("http://localhost:8000/getBalances", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ chainId, tokenAddress, userAddress: smartAccountAddress }),
                    });
                    const result = await response.json();
                    results[chainId] = result;

                    // Calculate the total USDC balance per chain
                    const balance = parseFloat(result.balance);
                    perChainTotal[chainId] = balance;
                    overallTotal += balance;
                });

                await Promise.all(fetchBalancePromises);
                setBalances(results);
                setTotalUSDCPerChain(perChainTotal);
                setOverallTotalUSDC(overallTotal);
            } catch (error) {
                console.error("Error fetching balances:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartAccountAddress]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            {!isLoading ? (
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-6">
                        Overall Total USDC Balance: {overallTotalUSDC && decreasePowerByDecimals(overallTotalUSDC, 6)}
                    </h1>
                    {Object.keys(balances).map((chainId) => (
                        <div key={chainId} className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Chain ID: {chainId}</h2>
                            <div className="bg-white shadow-md rounded-lg p-4">
                                <h3 className="text-xl font-semibold">{balances[chainId].symbol}</h3>
                                <p>
                                    <strong>Token Address:</strong> {balances[chainId].nativeToken}
                                </p>
                                <p>
                                    <strong>Balance:</strong> {balances[chainId].balance}
                                </p>
                                <p>
                                    <strong>Total Supply:</strong> {balances[chainId].totalSupply}
                                </p>
                            </div>
                            <p className="text-lg font-bold mt-4">
                                Total USDC Balance for Chain ID {chainId}:{" "}
                                {totalUSDCPerChain[chainId] && decreasePowerByDecimals(totalUSDCPerChain[chainId], 6)}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center animate-pulse items-center h-screen">Loading...</div>
            )}
        </>
    );
};

const BatchHistory: React.FC<BatchHistoryProps> = ({ transactions, setIsSimulation, isSimulation }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-10 p-4">
            <div className="max-w-6xl sticky h-[65px] top-0 z-20 w-full mx-auto bg-N0 shadow-lg rounded-md p-3 flex justify-between gap-2">
                <FilterSelection setIsSimulation={setIsSimulation} isSimulation={isSimulation} />
                <FilterSelection dropdown={true} />
            </div>
            <div className="max-w-6xl w-full mx-auto bg-N0 shadow-lg rounded-md p-3">
                <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

                <div className="flex flex-col gap-10">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((parentTransaction: iBatchHistory, index: number) => (
                            <div key={index}>
                                <h2 className="text-xl font-semibold">#{index + 1} Batch</h2>
                                <div className="flex justify-between items-end mb-4">
                                    <div className="flex items-center gap-3">
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
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="font-semibold">Total Amount: {parentTransaction.totalAmount}</p>
                                        <p className="font-semibold">Date: {formatDate(parentTransaction.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table-auto border-collapse w-full">
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
                                                        <td className="border px-4 py-2 text-center">
                                                            {fromNetworkObj ? (
                                                                <div className="flex gap-2 items-center">
                                                                    <Image
                                                                        src={fromNetworkObj.icon}
                                                                        alt={fromNetworkObj.key}
                                                                        className="h-8 w-8 rounded-full"
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
                                                                        className="h-8 w-8 rounded-full"
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
    );
};

export default BatchHistory;
