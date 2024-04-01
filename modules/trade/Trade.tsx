import { BigNumber as bg } from "bignumber.js";
import { tTrade } from "./types";
import { protocolNames } from "../../utils/data/protocols";
import ExecuteBatch from "../../components/Models/ExecuteBatch/ExecuteBatch";
import ExecuteMethod from "../../components/Models/ExecuteMethod/ExecuteMethod";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import TokenSelectionMenu from "../../components/Batching/TokenSelectionMenu";
import BatchSelectionSection from "../../components/Batching/BatchSelectionSection";
import BatchingListSection from "../../components/Batching/BatchingListSection";

bg.config({ DECIMAL_PLACES: 10 });


interface TokenListProps {
    erc20: boolean;
    filterValue: string;
    setFilterValue: (value: string) => void;
    tokens: any[];
    onItemClick: (tokenName: string) => void;
}

const TokenList: React.FC<TokenListProps> = ({ erc20, filterValue, setFilterValue, tokens, onItemClick }) => {
    return (
        <>
            <div className="border border-[rgba(132,144,251)] text-B200 rounded-lg p-3 my-1.5">
                <SearchInput
                    value={filterValue}
                    onChange={setFilterValue}
                    placeholder="Search by Token"
                />
                {tokens.map((token: any, index: number) => {
                    const isErc20 = erc20 ? token.symbol.toLowerCase().includes(filterValue.toLowerCase()) : token.name.toLowerCase().includes(filterValue.toLowerCase());
                    return (
                        isErc20 && (
                            <div
                                key={index}
                                onClick={() => onItemClick(erc20 ? token.symbol : token.name)}
                                className="w-full flex justify-start items-center gap-3 hover:bg-[rgba(132,144,251,.1)] py-2 px-3 rounded-lg cursor-pointer my-2"
                            >
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
                                        className="h-10 w-10 bg-font-200 rounded-full cursor-pointer"
                                    />
                                )}
                                {/* {token.name} */}
                                {erc20 ? token.symbol : token.name}
                            </div>
                        )
                    );
                })}

            </div>
        </>
    );
};


const ProtocolSelection: React.FC<any> = ({
    showMenu,
    onChangeProtocol,
    selectedNetwork,
    filterToken,
    setFilterToken,
    filterAddress,
    setFilterAddress,
    tokensData,
    selectedProtocol,
    onChangeToken,
    protocolNames,
}) => {
    return (
        showMenu && selectedNetwork.chainName && (
            <div className="w-full max-h-96">
                {protocolNames[selectedNetwork.chainId]?.key.map((item: tTradeProtocol, protocolIndex: number) => {
                    return protocolNames[selectedNetwork.chainId].value[protocolIndex].toLowerCase().includes(filterToken.toLowerCase()) ? (
                        <div key={item.name} className="w-full py-0.5">
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
                                    <div>
                                        {protocolNames[selectedNetwork.chainId].value[protocolIndex]}
                                    </div>
                                </div>
                                <CiCircleChevDown
                                    size="30px"
                                    className="text-[rgba(132,144,251)] h-7 w-7"
                                />
                            </div>

                            {selectedProtocol === item.name && selectedProtocol !== "erc20" && (
                                <TokenList
                                    erc20={false}
                                    filterValue={filterAddress}
                                    setFilterValue={setFilterAddress}
                                    tokens={item.tokenList}
                                    onItemClick={onChangeToken}
                                />
                            )}
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


const Trade: React.FC<any> = ({
    handleSelectFromNetwork,
    handleSelectToNetwork,
    onChangeFromProtocol,
    onChangeFromToken,
    onChangeToProtocol,
    onChangeToToken,
    onChangeAmountIn,
    handleSwap,
    removeBatch,
    toggleShowBatchList,
    sendSingleBatchToList,
    handleExecuteMethod,
    ExecuteAllBatches,
    closeFromSelectionMenu,
    closeToSelectionMenu,
}: tTrade) => {
    const {
        selectedFromNetwork,
        selectedFromProtocol,
        selectedToNetwork,
        selectedToProtocol,
        showFromSelectionMenu,
        showToSelectionMenu,
        fromTokensData,
        toTokensData,
        filterFromToken,
        setFilterFromToken,
        filterToToken,
        setFilterToToken,
        filterFromAddress,
        setFilterFromAddress,
        filterToAddress,
        setFilterToAddress,
        showBatchList,
        showExecuteBatchModel,
        showExecuteMethodModel,
    }: iTrading = useTradingStore((state) => state);


    return (
        <div className="w-full h-full flex flex-col justify-center items-center py-5">
            <div
                className={`${
                    showBatchList ? "!w-full" : "!w-[50%]"
                } h-full flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start gap-4`}
            >
                <div className="w-full md:max-w-xl h-full flex flex-col justify-start items-center">
                    {showFromSelectionMenu || showToSelectionMenu ? (
                        <>
                            <TokenSelectionMenu
                                showMenu={showFromSelectionMenu}
                                closeMenu={closeFromSelectionMenu}
                                handleSelectNetwork={handleSelectFromNetwork}
                                selectedNetwork={selectedFromNetwork}
                                filterToken={filterFromToken}
                                setFilterToken={setFilterFromToken}
                                filterAddress={filterFromAddress}
                                setFilterAddress={setFilterFromAddress}
                                tokensData={fromTokensData}
                                selectedProtocol={selectedFromProtocol}
                                onChangeToken={onChangeFromToken}
                                onChangeProtocol={onChangeFromProtocol}
                                protocolNames={protocolNames}
                            />

                            <TokenSelectionMenu
                                showMenu={showToSelectionMenu}
                                closeMenu={closeToSelectionMenu}
                                handleSelectNetwork={handleSelectToNetwork}
                                selectedNetwork={selectedToNetwork}
                                filterToken={filterToToken}
                                setFilterToken={setFilterToToken}
                                filterAddress={filterToAddress}
                                setFilterAddress={setFilterToAddress}
                                tokensData={toTokensData}
                                selectedProtocol={selectedToProtocol}
                                onChangeToken={onChangeToToken}
                                onChangeProtocol={onChangeToProtocol}
                                protocolNames={protocolNames}
                            />
                        </>
                    ) : (
                        <BatchSelectionSection
                            handleSwap={handleSwap}
                            onChangeAmountIn={onChangeAmountIn}
                            sendSingleBatchToList={sendSingleBatchToList}
                            handleExecuteMethod={handleExecuteMethod}
                        />
                    )}
                </div>

                {/* Modal - Select Execution Method */}
                {showExecuteMethodModel && <ExecuteMethod ExecuteAllBatches={ExecuteAllBatches} />}

                {/* Modal - While Executing Batches */}
                {showExecuteBatchModel && <ExecuteBatch />}

                {/* Batching List */}
                {selectedFromNetwork.chainId && showBatchList && (
                    <BatchingListSection removeBatch={removeBatch} toggleShowBatchList={toggleShowBatchList} />
                )}
            </div>
        </div>
    );
};

export default Trade;
