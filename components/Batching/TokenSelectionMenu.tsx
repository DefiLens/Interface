import React from "react";
import { NETWORK_LIST } from "../../utils/data/network";
import { MdOutlineArrowBack } from "react-icons/md";
import Image from "next/image";
import SearchInput from "../common/SearchInput";
import ProtocolSelection from "./ProtocolSelection";
import { iSelectedNetwork } from "../../store/GlobalStore";
import { iRebalance, iTokenData, iTrading, useRebalanceStore, useTradingStore } from "../../store/TradingStore";

interface TokenSelectionMenuProps {
    showMenu: boolean;
    closeMenu: () => void;
    handleSelectNetwork: (item: any) => void;
    selectedNetwork: iSelectedNetwork;
    filterToken: string;
    setFilterToken: (filterToken: string) => void;
    filterAddress: string;
    setFilterAddress: (filterAddress: string) => void;
    tokensData: iTokenData[];
    selectedProtocol: string;
    onChangeToken: (item: any) => void;
    onChangeProtocol: (protocol: string) => void;
    protocolNames: {};
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

    return (
        <div
            className={`w-full max-h-full bg-W100 flex flex-col gap-2 rounded-lg cursor-pointer p-3 shadow-2xl ${
                showMenu ? "block" : "hidden"
            }`}
        >
            {/* Back Btn */}
            <MdOutlineArrowBack
                onClick={closeMenu}
                className="rounded-full h-10 w-10 p-2 hover:bg-N40 active:bg-N60 text-B200"
            />

            <div className="flex flex-col justify-center items-center gap-5 px-4">
                {/* Networks List */}
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
                                <Image src={item.icon} alt="" className="h-10 w-10 rounded-full" />
                            </div>
                        );
                    })}
                </div>

                {/* Search for by protocol */}
                {!isRebalance && (
                    <SearchInput value={filterToken} onChange={setFilterToken} placeholder="Search by Protocol" />
                )}

                {/* Select Protocol */}
                <div className="w-full overflow-auto flex flex-col justify-center items-center py-1">
                    <ProtocolSelection
                        showMenu={showMenu}
                        onChangeProtocol={onChangeProtocol}
                        selectedNetwork={selectedNetwork}
                        filterToken={filterToken}
                        filterAddress={filterAddress}
                        setFilterAddress={setFilterAddress}
                        tokensData={tokensData}
                        selectedProtocol={selectedProtocol}
                        onChangeToken={onChangeToken}
                        protocolNames={protocolNames}
                    />
                </div>
            </div>
        </div>
    );
};

export default TokenSelectionMenu;
