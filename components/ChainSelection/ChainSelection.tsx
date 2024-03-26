import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";

interface Chain {
    chainName: string;
    chainId: number;
}

interface ChainSelectionProps {
    onChange: (chainId: number) => void;
}

const ChainSelection: React.FC<ChainSelectionProps> = () => {
    const { chainId, setChainId }: iPortfolio = usePortfolioStore((state) => state);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setChainId(selectedId);
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
        <div
            className=" text-N20 text-lg bg-gradient-to-br from-[#7339FD] via-[#56B0F6] to-[#4DD4F4] shadow-xl rounded-lg px-2 cursor-pointer"
        >
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

    );
};

export default ChainSelection;