import React from "react";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { chains } from "../../modules/portfolio/constants";

interface ChainSelectionProps {
    // onChange: (chainId: number) => void;
    dropdown?: boolean;
}

const ChainSelection: React.FC<ChainSelectionProps> = ({ dropdown = false }) => {
    const { chainId, setChainId }: iPortfolio = usePortfolioStore((state) => state);
    const allChains = [{ chainName: "All", chainId: 0 }, ...chains];

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setChainId(selectedId);
    };

    const handleButtonClick = (chainId: number) => {
        setChainId(chainId);
    };

    return (
        <div className="">
            {dropdown ? (
                <div className="text-N20 text-sm bg-GR1 border rounded-lg px-2 cursor-pointer shadow-lg">
                    <select
                        value={chainId}
                        onChange={handleSelectChange}
                        className="bg-transparent py-2 cursor-pointer outline-none"
                    >
                        {allChains.map((chain) => (
                            <option
                                key={chain.chainId}
                                value={chain.chainId}
                                className="bg-N20 py-2 text-sm px-3 border-none rounded-lg text-B100"
                            >
                                {chain.chainName}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <div
                    className="w-full flex items-center gap-2 overflow-scroll"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {allChains.map((chain) => (
                        <button
                            key={chain.chainId}
                            onClick={() => handleButtonClick(chain.chainId)}
                            className={`py-2 px-3 text-xs rounded-lg border text-B200 border-gray-300 bg-W100 hover:bg-W50 transition-all duration-300 ${
                                chainId === chain.chainId ? "bg-GR1 text-N20 border-none" : "bg-N40 text-B100"
                            }`}
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
