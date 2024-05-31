import { iBatchHistory } from "../types";
import { formatDate } from "../../../utils/helper";
import { NETWORK_LIST } from "../../../utils/data/network";
import Image from "next/image";
import CopyButton from "../../../components/common/CopyButton";
import { iPortfolio, usePortfolioStore } from "../../../store/Portfolio";
import { useEffect, useRef } from "react";
import { tokensByProtocol } from "../../../utils/data/tokensByProtocol";
import { protocolNames } from "../../../utils/data/protocols";
import { RxExternalLink } from "react-icons/rx";

interface BatchHistoryProps {
    transactions: iBatchHistory[];
    isSimulation: boolean;
    setIsSimulation: (value: boolean) => void;
    errorMessage: string;
    page: number;
    setPage: (value: number) => void;
    totalPages: number;
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

const BatchHistory: React.FC<BatchHistoryProps> = ({
    transactions,
    isSimulation,
    setIsSimulation,
    errorMessage,
    totalPages,
    page,
    setPage,
}) => {
    interface INetworkMap {
        [networkName: string]: number;
    }

    const NETWORK_MAP: INetworkMap = {
        polygon: 137,
        avalanche: 43114,
        arbitrum: 42161,
        optimism: 10,
        base: 8453,
    };

    const containerRef = useRef<HTMLDivElement>(null);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [page]);

    return (
        <div className="w-full flex flex-col justify-center items-center gap-10 p-4">
            <div className="max-w-6xl sticky h-[65px] top-0 z-20 w-full mx-auto bg-N0 shadow-lg rounded-md p-3 flex justify-between gap-2">
                <FilterSelection setIsSimulation={setIsSimulation} isSimulation={isSimulation} />
                <FilterSelection dropdown={true} />
            </div>

            <div className="max-w-6xl w-full mx-auto p-3">
                <div className="flex flex-col gap-10 scroll-smooth" ref={containerRef}>
                    {transactions && transactions.length > 0 ? (
                        transactions?.map((parentTransaction: iBatchHistory, index: number) => (
                            <div key={index} className="bg-N0 shadow-lg rounded-xl border border-N40 p-4">
                                <div className="flex flex-col mb-4">
                                    {!isSimulation ? (
                                        <div className="flex items-center gap-1 text-base text-B200">
                                            <p className="font-semibold">
                                                Simulation Link:{"  "}
                                                {parentTransaction.txHash
                                                    ? parentTransaction.txHash.slice(0, 20) +
                                                      "......." +
                                                      parentTransaction.txHash.slice(-8)
                                                    : "N/A"}
                                            </p>
                                            <a href={parentTransaction.txHash} target="_blank">
                                                <RxExternalLink />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-base text-B200">
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
                                    )}
                                    <div className="flex gap-3 text-sm text-B200">
                                        <p className="font-semibold">Date: {formatDate(parentTransaction.createdAt)}</p>
                                        <p className="font-semibold">
                                            Total Amount: {Number(parentTransaction.totalAmount).toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table-auto border-collapse w-full border border-N40">
                                        <thead>
                                            <tr className="text-sm text-B200 text-start border border-N40">
                                                <th className="px-4 py-2 text-start">Source</th>
                                                <th className="px-4 py-2 text-start">Destination</th>
                                                <th className="px-4 py-2 text-start">From Protocol</th>
                                                <th className="px-4 py-2 text-start">To Protocol</th>
                                                <th className="px-4 py-2 text-start">Amount</th>
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

                                                const findTokenDetails = (chain, protocol, tokenName) => {
                                                    // Check if the chain exists in the data structure
                                                    if (protocol === "erc20") {
                                                        return { chain, protocol, tokenName };
                                                    }
                                                    if (tokensByProtocol[chain]) {
                                                        // Check if the protocol exists within the specified chain
                                                        if (tokensByProtocol[chain][protocol]) {
                                                            // Find the token by name within the specified protocol
                                                            const token = tokensByProtocol[chain][protocol].find(
                                                                (t) => t.name === tokenName
                                                            );
                                                            if (token) {
                                                                return token;
                                                            } else {
                                                                console.error(
                                                                    `Token with name "${tokenName}" not found in protocol "${protocol}" on chain "${chain}".`
                                                                );
                                                                return null;
                                                            }
                                                        } else {
                                                            console.error(
                                                                `Protocol "${protocol}" not found on chain "${chain}".`
                                                            );
                                                            return null;
                                                        }
                                                    } else {
                                                        console.error(`Chain "${chain}" not found.`);
                                                        return null;
                                                    }
                                                };
                                                const fromTokenDetails = findTokenDetails(
                                                    transaction.fromNetwork,
                                                    transaction.fromProtocol,
                                                    transaction.fromToken
                                                );
                                                const toTokenDetails = findTokenDetails(
                                                    transaction.toNetwork,
                                                    transaction.toProtocol,
                                                    transaction.toToken
                                                );

                                                const getProtocolIcon = (chainName: string, protocolName: string) => {
                                                    const chainId = NETWORK_MAP[chainName];
                                                    const protocol = protocolNames[chainId]?.key?.find(
                                                        (protocol) => protocol.name === protocolName
                                                    );
                                                    return protocol;
                                                };

                                                // Example usage
                                                const fromProtocolDetails = getProtocolIcon(
                                                    transaction.fromNetwork,
                                                    transaction.fromProtocol
                                                );
                                                const toProtocolDetails = getProtocolIcon(
                                                    transaction.toNetwork,
                                                    transaction.toProtocol
                                                );

                                                return (
                                                    <tr key={transaction._id} className="border-b border-N40">
                                                        <td className=" px-4 py-2 text-sm gap-2">
                                                            <div className="flex gap-2 items-center mb-2">
                                                                Token:
                                                                {fromTokenDetails.image ? (
                                                                    <Image
                                                                        src={
                                                                            fromTokenDetails.image &&
                                                                            fromTokenDetails.image
                                                                        }
                                                                        alt={`${fromTokenDetails.name}-logo`}
                                                                        width={10}
                                                                        height={10}
                                                                        className="w-7 h-7 rounded-full"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-B50 text-B100 font-bold text-[.6rem]">
                                                                        {transaction.fromToken.slice(0, 2)}
                                                                    </div>
                                                                )}
                                                                {transaction.fromToken}
                                                            </div>
                                                            {fromNetworkObj ? (
                                                                <div className="flex gap-2 items-center">
                                                                    Chain:
                                                                    <Image
                                                                        src={fromNetworkObj.icon}
                                                                        alt={fromNetworkObj.key}
                                                                        className="h-7 w-7 rounded-full"
                                                                    />
                                                                    {fromNetworkObj.key}
                                                                </div>
                                                            ) : null}
                                                        </td>

                                                        <td className="px-4 py-2 gap-2 text-sm">
                                                            <div className="flex gap-2 items-center mb-2">
                                                                Token:
                                                                {toTokenDetails.image ? (
                                                                    <Image
                                                                        src={
                                                                            toTokenDetails.image && toTokenDetails.image
                                                                        }
                                                                        alt={`${toTokenDetails.name}-logo`}
                                                                        width={10}
                                                                        height={10}
                                                                        className="w-7 h-7 rounded-full"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-B50 text-B100 font-bold text-[.6rem]">
                                                                        {transaction.toToken.slice(0, 2)}
                                                                    </div>
                                                                )}
                                                                {transaction.toToken}
                                                            </div>
                                                            {toNetworkObj ? (
                                                                <div className="flex gap-2">
                                                                    Chain:
                                                                    <Image
                                                                        src={toNetworkObj.icon}
                                                                        alt={toNetworkObj.key}
                                                                        className="h-7 w-7 rounded-full"
                                                                    />
                                                                    {toNetworkObj.key}
                                                                </div>
                                                            ) : null}
                                                        </td>
                                                        <td className="px-4 py-2 ">
                                                            <div className="flex gap-2 items-center mb-2">
                                                                {fromProtocolDetails && fromProtocolDetails.icon ? (
                                                                    <Image
                                                                        src={fromProtocolDetails.icon}
                                                                        alt={`${fromTokenDetails.name}-logo`}
                                                                        width={10}
                                                                        height={10}
                                                                        className="w-6 h-6 rounded-full"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-B50 text-B100 font-bold text-[.6rem]">
                                                                        {fromTokenDetails.name.slice(0, 2)}
                                                                    </div>
                                                                )}
                                                                {transaction.fromProtocol === "erc20"
                                                                    ? transaction.fromProtocol
                                                                    : fromProtocolDetails && fromTokenDetails.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 ">
                                                            <div className="flex gap-2 items-center mb-2">
                                                                {toProtocolDetails && toProtocolDetails.icon ? (
                                                                    <Image
                                                                        src={toProtocolDetails.icon}
                                                                        alt={`${toProtocolDetails.name}-logo`}
                                                                        width={10}
                                                                        height={10}
                                                                        className="w-6 h-6 rounded-full"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-B50 text-B100 font-bold text-[.6rem]">
                                                                        {toProtocolDetails &&
                                                                            toProtocolDetails.name.slice(0, 2)}
                                                                    </div>
                                                                )}
                                                                {toProtocolDetails && toProtocolDetails.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {Number(transaction.amountIn).toFixed(4)}
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
                        <div className="bg-N0 shadow-lg rounded-xl border border-N40 p-4">{errorMessage}</div>
                    )}
                </div>
                {transactions && transactions.length !== 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-md bg-W300 text-B100 border-2 border-W300 hover:bg-white transition-colors ease-in-out duration-300 ${page === 1 ? "hover:bg-W300 cursor-not-allowed opacity-50" : ""}`}
                        >
                            Previous
                        </button>
                        <span className="mx-4">{`Page ${page} of ${totalPages}`}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded-md bg-W300 text-B100 border border-gray-100 hover:bg-white transition-colors ease-in-out duration-300 ${page === totalPages ? "hover:bg-W300 cursor-not-allowed opacity-50" : ""}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchHistory;
