import React, { useEffect, useState } from "react";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { MdOutlineArrowBack } from "react-icons/md";
import { NETWORK_LIST } from "../../utils/data/network";
import Image from "next/image";
import { protocolNames } from "../../utils/data/protocols";
import { CiCircleChevDown } from "react-icons/ci";
import SearchInput from "../common/SearchInput";
import { iRebalance, iTrading, useRebalanceStore, useTradingStore } from "../../store/TradingStore";
import { getTokenListByChainId } from "../../utils/helper";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";

interface TokenModalProps {
    tokens: any[];
    isOpen: number | null;
    index: number;
    onClose: () => void;
    onNetworkSelect: (token: any) => void;
    onProtocolSelect: (token: any) => void;
    onTokenSelect: (token: any) => void;
    selectedProtocol: any;
    selectedNetwork: any;
}

const SelectErc20: React.FC<TokenModalProps> = ({
    tokens,
    isOpen,
    index,
    onClose,
    onNetworkSelect,
    onProtocolSelect,
    onTokenSelect,
    selectedNetwork,
}) => {
    const [filterValue, setFilterValue] = useState("");
    const [tokensData, setTokensData] = useState(tokens);

    useEffect(() => {
        async function onChangeselectedToProtocol() {
            const data = getTokenListByChainId(selectedNetwork?.chainId, UNISWAP_TOKENS);
            setTokensData(data);
        }
        onChangeselectedToProtocol();
    }, [selectedNetwork]);

    const filteredTokens = tokensData?.filter((token) =>
        token.symbol.toLowerCase().includes(filterValue.toLowerCase())
    );

    const { isModalOpen }: iRebalance = useRebalanceStore(); 
    return (
        <div
            className={`fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center ${
                isModalOpen === index ? "" : "hidden"
            }`}
        >
            <div className="relative bg-white w-full h-[80%] max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-scroll">
                <div className="">
                    <div
                        className={`w-full max-h-full bg-W100 flex flex-col gap-2 rounded-lg cursor-pointer p-3 shadow-2xl ${
                            isOpen ? "block" : "hidden"
                        }`}
                    >
                        <MdOutlineArrowBack
                            onClick={onClose}
                            className="rounded-full h-10 w-10 p-2 hover:bg-N40 active:bg-N60 text-B200"
                        />

                        {/* Networks List */}
                        <div className="flex flex-wrap justify-center items-center gap-2">
                            {NETWORK_LIST?.map((item) => (
                                <div
                                    key={item.chainName}
                                    onClick={() => {
                                        onNetworkSelect(item);
                                        onProtocolSelect("erc20");
                                    }}
                                    className={`h-14 w-14 flex justify-center items-center gap-3 bg-font-100 hover:bg-font-200 active:bg-font-400 border-2 border-font-200 hover:border-font-300 shadow-sm rounded-md cursor-pointer ${
                                        selectedNetwork?.chainName === item.chainName
                                            ? "bg-gradient-to-br from-[#7339FD] to-[#4DD4F4]"
                                            : "bg-white" // Change this to the desired color when not selected
                                    }`}
                                >
                                    <Image src={item.icon} alt="" className="h-10 w-10 rounded-full" />
                                </div>
                            ))}
                        </div>

                        {/* Search for by protocol */}
                        {protocolNames[selectedNetwork?.chainId]?.key.map((item, protocolIndex) => (
                            <div key={item.name} className="w-full py-0.5">
                                {protocolNames[selectedNetwork.chainId].value[protocolIndex] === "ERC20" && (
                                    <div
                                        key={item.name}
                                        onClick={() => onProtocolSelect(item.name)}
                                        className="w-full flex justify-between items-center gap-3 text-B300 bg-[rgba(132,144,251,.0.9) border border-[rgba(132,144,251)] hover:bg-[rgba(132,144,251,.1)] py-2 px-3 my-1 rounded-lg cursor-pointer"
                                    >
                                        <div className="w-full flex justify-start items-center gap-3">
                                            <Image
                                                src={item.icon}
                                                alt=""
                                                className="h-8 w-8 bg-N40 rounded-full cursor-pointer"
                                            />
                                            <div>{protocolNames[selectedNetwork.chainId].value[protocolIndex]}</div>
                                        </div>
                                        <CiCircleChevDown size="30px" className="text-[rgba(132,144,251)] h-7 w-7" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Tokens List */}
                        <div className="border border-[rgba(132,144,251)] text-B200 rounded-lg p-3 my-1.5">
                            <SearchInput value={filterValue} onChange={setFilterValue} placeholder="Search by Token" />
                            <ul className="flex flex-col divide-y divide-gray-200">
                                {filteredTokens?.map((token: any, index: number) => (
                                    <li key={index} className="py-2">
                                        <button
                                            onClick={() => {
                                                onTokenSelect(token.symbol);
                                                onClose();
                                            }}
                                            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                                        >
                                            <div className="flex items-center">
                                                <img src={token.logoURI} alt={token.name} className="w-8 h-8 mr-2" />
                                                <span>{token.name}</span>
                                            </div>
                                            <span className="text-gray-500">{token.symbol}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectErc20;
