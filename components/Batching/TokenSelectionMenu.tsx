import React from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { HiOutlineXMark } from "react-icons/hi2";
import { NETWORK_LIST } from "../../utils/data/network";
import SearchInput from "../common/SearchInput";
import ProtocolSelection from "./ProtocolSelection";
import { iSelectedNetwork } from "../../store/GlobalStore";
import { iRebalance, iTokenData, iTrading, useRebalanceStore, useTradingStore } from "../../store/TradingStore";
import { iProtocolNames } from "../../utils/data/protocols";

interface TokenSelectionMenuProps {
    showMenu: boolean;
    closeMenu: () => void;
    handleSelectNetwork: (item: iSelectedNetwork) => void;
    selectedNetwork: iSelectedNetwork;
    filterToken: string;
    setFilterToken: (filterToken: string) => void;
    filterAddress: string;
    setFilterAddress: (filterAddress: string) => void;
    tokensData: iTokenData[];
    selectedProtocol: string;
    onChangeToken: (item: string) => void;
    onChangeProtocol: (protocol: string) => void;
    protocolNames: iProtocolNames;
    title?: string;
    description?: string;
    handleSelectedTokenAddress?: (_tokenAddress: string) => void;
}

const TokenSelectionMenu: React.FC<TokenSelectionMenuProps> = ({
    showMenu,
    closeMenu,
    handleSelectNetwork,
    selectedNetwork,
    filterToken,
    setFilterToken,
    filterAddress,
    setFilterAddress,
    tokensData,
    selectedProtocol,
    onChangeToken,
    onChangeProtocol,
    protocolNames,
    title = "Select a token",
    description = "To select a token, choose the Network and Protocol of your choice.",
    handleSelectedTokenAddress,
}) => {
    const { isRebalance }: iRebalance = useRebalanceStore((state) => state);
    const { showFromSelectionMenu }: iTrading = useTradingStore((state) => state);

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center",
                !showMenu && "hidden"
            )}
        >
            <div className="relative w-full max-h-[80%] min-h-[80%] max-w-sm mx-auto rounded-lg z-50 overflow-auto">
                <div
                    className={cn(
                        "w-full max-h-full bg-W100 flex flex-col gap-2 rounded-lg p-5",
                        showMenu ? "block" : "hidden"
                    )}
                >
                    <button
                        className="absolute top-4 right-4 text-B200 group opacity-70 hover:opacity-100 rounded-full p-1.5 bg-N40 transition-opacity duration-200"
                        onClick={() => closeMenu()}
                    >
                        <HiOutlineXMark className="h-5 w-5" />
                    </button>
                    {/* Modal Cotent -- Networks Row, Search input, List of Protocols  */}
                    <div className="flex flex-col justify-center items-start gap-3">
                        {/* Title and Description */}
                        <div className="flex flex-col w-10/12 align-center items-start">
                            <h1 className="text-lg font-semibold">{title}</h1>
                            <h3 className="text-font-600 text-sm font-normal">{description}</h3>
                        </div>
                        {/* Networks Row -- Polygon, Arbitrum, Optimisum, Base */}
                        <div className="w-full flex flex-wrap justify-center items-center gap-3">
                            {NETWORK_LIST?.map((item) => {
                                return (
                                    <div
                                        key={item.chainName}
                                        onClick={() => handleSelectNetwork(item)}
                                        className={cn(
                                            "h-12 w-12 flex justify-center items-center gap-3 bg-font-100 hover:bg-font-200 active:bg-font-400 border-2 border-font-200 hover:border-font-300 shadow-sm rounded-md cursor-pointer",
                                            selectedNetwork?.chainName === item.chainName &&
                                                "bg-gradient-to-br from-[#7339FD] to-[#4DD4F4]"
                                        )}
                                    >
                                        <Image src={item.icon} alt="Network Icons" className="h-9 w-9 rounded-full" />
                                    </div>
                                );
                            })}
                        </div>
                        {/* Search Input Box */}
                        {(showFromSelectionMenu && isRebalance) ||
                            selectedProtocol.length !== 0 ||
                            !Boolean(selectedNetwork.chainName) || (
                                <SearchInput
                                    value={filterToken}
                                    onChange={setFilterToken}
                                    placeholder="Search by Protocol"
                                />
                            )}
                        {/* List of Protocols on selected Network */}
                        <div className="w-full overflow-auto flex flex-col justify-center items-center">
                            {selectedProtocol.length > 0 && (
                                <p className="w-full text-left text-gray-400 text-xs mb-1">
                                    To see other Protocols, close the selected Protocol.
                                </p>
                            )}
                            <ProtocolSelection
                                showMenu={showMenu}
                                onChangeProtocol={onChangeProtocol}
                                selectedNetwork={selectedNetwork}
                                selectedProtocol={selectedProtocol}
                                onChangeToken={onChangeToken}
                                filterToken={filterToken}
                                filterAddress={filterAddress}
                                setFilterAddress={setFilterAddress}
                                tokensData={tokensData}
                                protocolNames={protocolNames}
                                handleSelectedTokenAddress={handleSelectedTokenAddress}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenSelectionMenu;
