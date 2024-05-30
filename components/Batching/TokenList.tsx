import React, { useState, useEffect } from "react";
import { iSelectedNetwork, iTokenData } from "../../store/TradingStore";
import { tokenList } from "../../utils/data/protocols";
import Token from "./Token";

interface TokenListProps {
    isErc20: boolean;
    filterValue: string;
    tokens: iTokenData[] | tokenList[];
    onItemClick: (tokenName: string) => void;
    selectedNetwork: iSelectedNetwork;
    tokenAddresses?: { [key: string]: string };
    handleSelectedTokenAddress?: (_tokenAddress: string) => void;
    protocolName: string;
}

const TokenList: React.FC<TokenListProps> = ({
    isErc20,
    filterValue,
    tokens,
    onItemClick,
    selectedNetwork,
    tokenAddresses,
    handleSelectedTokenAddress,
    protocolName,
}) => {
    const [visibleTokens, setVisibleTokens] = useState(tokens.slice(0, 8));
    const [displayCount, setDisplayCount] = useState(8);

    useEffect(() => {
        const filteredTokens: any = tokens.filter((token) =>
            isErc20
                ? token.symbol && token.symbol.toLowerCase().includes(filterValue.toLowerCase())
                : token.name.toLowerCase().includes(filterValue.toLowerCase())
        );
        setVisibleTokens(filteredTokens.slice(0, displayCount));
    }, [filterValue, tokens, displayCount, isErc20]);

    const loadMoreTokens = () => {
        setDisplayCount(displayCount + 8);
    };

    return (
        <>
            <div className="border border-[rgba(132,144,251)] text-B200 border-t-0 rounded-lg rounded-t-none max-h-[25rem] p-3 overflow-auto">
                <ul className="flex flex-col divide-y divide-gray-200">
                    {visibleTokens.map((token) => (
                        <Token
                            key={isErc20 ? token.symbol : token.name}
                            network={selectedNetwork}
                            isErc20={isErc20}
                            tokenAddresses={tokenAddresses}
                            token={token}
                            onItemClick={onItemClick}
                            handleSelectedTokenAddress={handleSelectedTokenAddress}
                            protocolName={protocolName}
                        />
                    ))}
                </ul>
                {visibleTokens.length < tokens.length && !filterValue && (
                    <div className="text-center mt-4">
                        <button
                            onClick={loadMoreTokens}
                            className="cursor-pointer px-3 py-1 md:text-base text-center rounded-lg transition duration-300 border border-B50 bg-N40 hover:bg-N50"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default TokenList;
