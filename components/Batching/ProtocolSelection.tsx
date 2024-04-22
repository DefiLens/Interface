import React from "react";
import clsx from "clsx";
import { CiCircleChevDown } from "react-icons/ci";
import TokenList from "./TokenList";
import Image from "next/image";
import { iSelectedNetwork } from "../../store/GlobalStore";
import { iRebalance, iTokenData, iTrading, useRebalanceStore, useTradingStore } from "../../store/TradingStore";
import { iProtocolNames } from "../../utils/data/protocols";
import SearchInput from "../common/SearchInput";

interface iProtocolSelectionProps {
    showMenu: boolean;
    onChangeProtocol: (protocol: string) => void;
    selectedNetwork: iSelectedNetwork;
    filterToken: string;
    filterAddress: string;
    setFilterAddress: (filterAddress: string) => void;
    tokensData: iTokenData[];
    selectedProtocol: string;
    onChangeToken: (protocol: string) => void;
    protocolNames: iProtocolNames;
}

const ProtocolSelection: React.FC<iProtocolSelectionProps> = ({
    showMenu,
    onChangeProtocol,
    selectedNetwork,
    filterToken,
    filterAddress,
    setFilterAddress,
    tokensData,
    selectedProtocol,
    onChangeToken,
    protocolNames,
}) => {
    const { showFromSelectionMenu }: iTrading = useTradingStore((state) => state);
    const { isRebalance }: iRebalance = useRebalanceStore((state) => state);
    const selectedNetworkProtocols = protocolNames[selectedNetwork.chainId];

    return (
        showMenu &&
        selectedNetwork?.chainName && (
            <div className="flex flex-col w-full max-h-fit overflow-hidden">
                {selectedNetworkProtocols.key.map((protocol, protocolIndex) => {
                    const isFilteredProtocol = selectedNetworkProtocols.value[protocolIndex]
                        .toLowerCase()
                        .includes(filterToken.toLowerCase());
                    // Mapping protocols
                    return (
                        isFilteredProtocol && (
                            <div key={protocol.name} className="w-full">
                                {/* Protocol Selection Bar */}
                                {(isRebalance &&
                                    showFromSelectionMenu &&
                                    selectedNetworkProtocols.value[protocolIndex] != "ERC20") ||
                                    (selectedProtocol && selectedProtocol !== protocol.name) || (
                                        <div
                                            key={protocol.name}
                                            onClick={() => onChangeProtocol(protocol.name)}
                                            className={clsx(
                                                "w-full flex justify-between protocols-center gap-3 text-B300 bg-[rgba(132,144,251,.0.9) border border-[rgba(132,144,251)] hover:bg-[rgba(132,144,251,.1)] py-2 px-3 cursor-pointer",
                                                selectedProtocol === protocol.name
                                                    ? "border-b-0 rounded-t-lg mb-0"
                                                    : "rounded-lg my-1.5"
                                            )}
                                        >
                                            <div className="w-full flex justify-start protocols-center gap-3">
                                                <Image
                                                    src={protocol.icon}
                                                    alt=""
                                                    className="h-8 w-8 bg-N40 rounded-full cursor-pointer"
                                                />
                                                <div>{selectedNetworkProtocols.value[protocolIndex]}</div>
                                            </div>
                                            <CiCircleChevDown
                                                size="30px"
                                                className={clsx(
                                                    "text-[rgba(132,144,251)] h-7 w-7",
                                                    selectedProtocol === protocol.name && "transform rotate-180"
                                                )}
                                            />
                                        </div>
                                    )}

                                {selectedProtocol && selectedProtocol === protocol.name && (
                                    <div className="border-x border-[rgba(132,144,251)] px-3 pt-3">
                                        <SearchInput
                                            value={filterAddress}
                                            onChange={setFilterAddress}
                                            placeholder="Search by token symbol"
                                        />
                                    </div>
                                )}

                                {/* Tokens */}
                                {selectedProtocol === protocol.name && selectedProtocol !== "erc20" && (
                                    <TokenList
                                        erc20={false}
                                        filterValue={filterAddress}
                                        tokens={protocol.tokenList}
                                        onItemClick={onChangeToken}
                                        selectedNetwork={selectedNetwork}
                                        tokenAddresses={protocol.tokenAddresses}
                                    />
                                )}

                                {/* ERC20 Tokens */}
                                {protocol.name === "erc20" && selectedProtocol === "erc20" && tokensData && (
                                    <TokenList
                                        erc20={true}
                                        filterValue={filterAddress}
                                        tokens={tokensData}
                                        selectedNetwork={selectedNetwork}
                                        onItemClick={onChangeToken}
                                    />
                                )}
                            </div>
                        )
                    );
                })}
            </div>
        )
    );
};

export default ProtocolSelection;
