import Image from "next/image";
import SearchInput from "../common/SearchInput";
import { optimism } from "../../assets/images";

interface TokenListProps {
    erc20: boolean;
    filterValue: string;
    tokens: any[];
    setFilterValue: (value: string) => void;
    onItemClick: (tokenName: string) => void;
}

const TokenList: React.FC<TokenListProps> = ({ erc20, filterValue, setFilterValue, tokens, onItemClick }) => {
    return (
        <>
            <div className="border border-[rgba(132,144,251)] text-B200 rounded-lg p-3 my-1.5">
                {/* Search input */}
                <SearchInput value={filterValue} onChange={setFilterValue} placeholder="Search by Token" />

                {tokens.map((token: any, index: number) => {
                    // Check if the token matches the filter value
                    const isErc20 = erc20
                        ? token.symbol.toLowerCase().includes(filterValue.toLowerCase())
                        : token.name.toLowerCase().includes(filterValue.toLowerCase());
                    return (
                        // Render token item if it matches the filter
                        isErc20 && (
                            <div
                                key={index}
                                onClick={() => onItemClick(erc20 ? token.symbol : token.name)}
                                className="w-full flex justify-start items-center gap-3 hover:bg-[rgba(132,144,251,.1)] py-2 px-3 rounded-lg cursor-pointer my-2"
                            >
                                {erc20 && (
                                    <Image
                                        src={token.logoURI.includes("s2.coinmarketcap.com") ? optimism : token.logoURI}
                                        alt=""
                                        width={10}
                                        height={10}
                                        className="h-10 w-10 bg-font-200 rounded-full cursor-pointer"
                                    />
                                )}
                                {erc20 ? token.symbol : token.name}
                            </div>
                        )
                    );
                })}
            </div>
        </>
    );
};

export default TokenList;
