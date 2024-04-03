import { tTradeProtocol } from "../../modules/trade/types";
import { CiCircleChevDown } from "react-icons/ci";
import TokenList from "./TokenList";
import Image from "next/image";
import { iSelectedNetwork } from "../../store/GlobalStore";
import { iTokenData } from "../../store/TradingStore";
import { iProtocolNames } from "../../utils/data/protocols";

interface iProtocolSelectionProps {
    showMenu: boolean;
    onChangeProtocol: (protocol: string) => void;
    selectedNetwork: iSelectedNetwork;
    filterToken: string;
    filterAddress: string;
    setFilterAddress: (filterAddress: string) => void;
    tokensData: iTokenData;
    selectedProtocol: string;
    onChangeToken: (item: string) => void;
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
    return (
        showMenu &&
        selectedNetwork.chainName && (
            <div className="w-full max-h-96">
                {protocolNames[selectedNetwork.chainId]?.key.map((item: tTradeProtocol, protocolIndex: number) => {
                    return protocolNames[selectedNetwork.chainId].value[protocolIndex]
                        .toLowerCase()
                        .includes(filterToken.toLowerCase()) ? (
                        <div key={item.name} className="w-full py-0.5">
                            {/* Protocol Name and Image */}
                            <div
                                key={item.name}
                                onClick={() => onChangeProtocol(item.name)}
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

                            {/* Tokens */}
                            {selectedProtocol === item.name && selectedProtocol !== "erc20" && (
                                <TokenList
                                    erc20={false}
                                    filterValue={filterAddress}
                                    setFilterValue={setFilterAddress}
                                    tokens={item.tokenList}
                                    onItemClick={onChangeToken}
                                />
                            )}

                            {/* ERC20 Tokens */}
                            {item.name === "erc20" && selectedProtocol === "erc20" && tokensData && (
                                <TokenList
                                    erc20={true}
                                    filterValue={filterAddress}
                                    setFilterValue={setFilterAddress}
                                    tokens={tokensData}
                                    onItemClick={onChangeToken}
                                />
                            )}
                        </div>
                    ) : null;
                })}
            </div>
        )
    );
};

export default ProtocolSelection;
