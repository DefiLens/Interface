import React from "react";
import { NETWORK_LIST } from "../../utils/data/network";
import { MdOutlineArrowBack } from "react-icons/md";
import Image from "next/image";
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
}) => {
    const { isRebalance }: iRebalance = useRebalanceStore((state) => state);
    const { showFromSelectionMenu }: iTrading = useTradingStore((state) => state);

    return (
        <div
            className={`fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center ${
                showMenu ? "" : "hidden"
            }`}
        >
            <div className="relative w-full max-h-[80%] max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-auto">
                <div
                    className={`w-full max-h-full bg-W100 flex flex-col gap-2 rounded-lg p-3 shadow-2xl ${
                        showMenu ? "block" : "hidden"
                    }`}
                >
                    <MdOutlineArrowBack
                        onClick={() => closeMenu()}
                        className="rounded-full h-10 w-10 p-2 hover:bg-N40 active:bg-N60 text-B200"
                    />
                    {/* Modal Cotent -- Networks Row, Search input, List of Protocols  */}
                    <div className="flex flex-col justify-center items-center gap-5 px-4">
                        {/* Networks Row -- Polygon, Arbitrum, Optimisum, Base */}
                        <div className="flex flex-wrap justify-center items-center gap-2">
                            {NETWORK_LIST?.map((item) => {
                                return (
                                    <div
                                        key={item.chainName}
                                        onClick={() => handleSelectNetwork(item)}
                                        className={`h-14 w-14 flex justify-center items-center gap-3 bg-font-100 hover:bg-font-200 active:bg-font-400 border-2 border-font-200 hover:border-font-300 shadow-sm rounded-md cursor-pointer  ${
                                            selectedNetwork?.chainName === item.chainName
                                                ? "bg-gradient-to-br from-[#7339FD] to-[#4DD4F4]"
                                                : ""
                                        }`}
                                    >
                                        <Image src={item.icon} alt="Network Icons" className="h-10 w-10 rounded-full" />
                                    </div>
                                );
                            })}
                        </div>
                        {/* Search Input Box */}
                        {(showFromSelectionMenu && isRebalance) || selectedProtocol.length !== 0 || (
                            <SearchInput
                                value={filterToken}
                                onChange={setFilterToken}
                                placeholder="Search by Protocol"
                            />
                        )}
                        {/* List of Protocols on selected Network */}
                        <div className="w-full overflow-auto flex flex-col justify-center items-center">
                            {selectedProtocol.length > 0 && (
                                <p className="w-full text-left text-gray-400 text-xs mb-1.5">
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenSelectionMenu;
