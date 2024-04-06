import React from 'react';
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";

interface Chain {
    chainName: string;
    chainId: number;
}

interface ChainSelectionProps {
    dropdown?: boolean;
}

const ChainSelection: React.FC<ChainSelectionProps> = ({ dropdown = false }) => {
    const { chainId, setChainId }: iPortfolio = usePortfolioStore((state) => state);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setChainId(selectedId);
    };

    const handleButtonClick = (chainId: number) => {
        setChainId(chainId);
    };

    const chains: Chain[] = [
        { chainName: "All", chainId: 0 }, // All Chains
        { chainName: "Polygon", chainId: 137 }, // Polygon (Matic)
        { chainName: "Ethereum", chainId: 1 }, // Ethereum
        { chainName: "Base", chainId: 8453 }, // Base
        { chainName: "Optimism", chainId: 10 }, // Optimism
        { chainName: "Avalanche", chainId: 43114 }, // Avalanche
        { chainName: "Arbitrum", chainId: 42161 }, // Arbitrum
    ];

    return (
        <div className="">
            {dropdown ? (
                <div className="text-N20 text-lg bg-GR1 border rounded-lg px-2 cursor-pointer shadow-lg">
                    <select
                        value={chainId}
                        onChange={handleSelectChange}
                        className="bg-transparent py-2 cursor-pointer outline-none"
                    >
                        {chains.map((chain) => (
                            <option
                                key={chain.chainId}
                                value={chain.chainId}
                                className="bg-N20-300 py-2 px-4 border-none rounded-lg text-B100"
                            >
                                {chain.chainName}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="w-full flex items-center gap-3 overflow-scroll" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
                    {chains.map((chain) => (
                        <button
                            key={chain.chainId}
                            onClick={() => handleButtonClick(chain.chainId)}
                            className={`py-2 px-4 rounded-lg border border-B50 hover:bg-N50 ${chainId === chain.chainId ? 'bg-GR1 text-N20 border-none' : 'bg-N40 text-B100'}`}
                        >
                            {chain.chainName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChainSelection;
