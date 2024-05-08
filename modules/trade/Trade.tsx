import { BigNumber as bg } from "bignumber.js";
import { tTrade } from "./types";
import { protocolNames } from "../../utils/data/protocols";
import ExecuteBatch from "../../components/Models/ExecuteBatch/ExecuteBatch";
import ExecuteMethod from "../../components/Models/ExecuteMethod/ExecuteMethod";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import TokenSelectionMenu from "../../components/Batching/TokenSelectionMenu";
import BatchSelectionSection from "../../components/Batching/BatchSelectionSection";
import BatchingListSection from "../../components/Batching/BatchingListSection";
import clsx from "clsx";

bg.config({ DECIMAL_PLACES: 10 });

const Trade: React.FC<tTrade> = ({
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
    processRebalancing,
    handleSelectedTokenAddress,
}) => {
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
        showReviewModal,
        oraclePrice,
        oraclePriceLoading
    }: iTrading = useTradingStore((state) => state);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center py-5">
            <div
                className={clsx(
                    showBatchList ? "!w-full" : "!w-[50%]",
                    "h-full flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start gap-4"
                )}
            >
                <div className="w-full md:max-w-xl h-full flex flex-col justify-start items-center">
                    {/* FROM_TOKEN SELECTION MENU */}
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
                        title="Select source token"
                        handleSelectedTokenAddress={handleSelectedTokenAddress}
                    />
                    {/* TO_TOKEN SELECTION MENU */}
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
                        title="Select destination token"
                    />

                    {/* Batching Component */}
                    <BatchSelectionSection
                        handleSwap={handleSwap}
                        onChangeAmountIn={onChangeAmountIn}
                        sendSingleBatchToList={sendSingleBatchToList}
                        handleExecuteMethod={handleExecuteMethod}
                        processRebalancing={processRebalancing}
                    />
                </div>

                {/* Modal - Select Execution Method */}
                {showReviewModal && <ExecuteMethod ExecuteAllBatches={ExecuteAllBatches} />}

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
