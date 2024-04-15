import Image from "next/image";
import SearchInput from "../common/SearchInput";
import { optimism } from "../../assets/images";
import { iTokenData } from "../../store/TradingStore";

interface TokenListProps {
    erc20: boolean;
    filterValue: string;
    tokens: iTokenData[];
    setFilterValue: (value: string) => void;
    onItemClick: (tokenName: string) => void;
}

const TokenList: React.FC<TokenListProps> = ({ erc20, filterValue, setFilterValue, tokens, onItemClick }) => {
    return (
        <>
            <div className="border border-[rgba(132,144,251)] text-B200 rounded-lg p-3 my-1.5">
                {/* Search input */}
                <SearchInput value={filterValue} onChange={setFilterValue} placeholder="Search by Token" />

                <ul className="flex flex-col divide-y divide-gray-200">
                    {tokens.map((token, index) => {
                        // Check if the token matches the filter value
                        const isErc20 = erc20
                            ? token.symbol.toLowerCase().includes(filterValue.toLowerCase())
                            : token.name.toLowerCase().includes(filterValue.toLowerCase());
                        return (
                            // Render token item if it matches the filter
                            isErc20 && (
                                <li key={index} className="py-2">
                                    <button
                                        onClick={() => onItemClick(erc20 ? token.symbol : token.name)}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                                    >
                                        <div className="flex items-center">
                                            {erc20 && (
                                                <Image
                                                    src={
                                                        token.logoURI.includes("s2.coinmarketcap.com")
                                                            ? optimism
                                                            : token.logoURI
                                                    }
                                                    alt=""
                                                    width={10}
                                                    height={10}
                                                    className="w-8 h-8 mr-2"
                                                />
                                            )}
                                            <span>{erc20 ? token.symbol : token.name}</span>
                                        </div>
                                        {erc20 && <span className="text-gray-500">{token.symbol}</span>}
                                    </button>
                                </li>
                            )
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default TokenList;
