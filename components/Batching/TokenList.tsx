import React from "react";
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
}

const TokenList: React.FC<TokenListProps> = ({
    isErc20,
    filterValue,
    tokens,
    onItemClick,
    selectedNetwork,
    tokenAddresses,
}) => {
    return (
        <>
            <div className="border border-[rgba(132,144,251)] text-B200 border-t-0 rounded-lg rounded-t-none max-h-[247px] p-3 overflow-auto">
                <ul className="flex flex-col divide-y divide-gray-200">
                    {tokens.map((token) => {
                        // Check if the token matches the filter value
                        const filteredTokens = isErc20
                            ? token.symbol.toLowerCase().includes(filterValue.toLowerCase())
                            : token.name.toLowerCase().includes(filterValue.toLowerCase());
                        return (
                            filteredTokens && (
                                <Token
                                    key={isErc20 ? token.symbol : token.name}
                                    network={selectedNetwork}
                                    isErc20={isErc20}
                                    tokenAddresses={tokenAddresses}
                                    token={token}
                                    onItemClick={onItemClick}
                                />
                            )
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default TokenList;
