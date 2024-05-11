// Library Imports
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAddress } from "@thirdweb-dev/react";
import { BigNumber as bg } from "bignumber.js";
import { HiMiniExclamationCircle } from "react-icons/hi2";
// Type, Component, Store, Util Imports
import { tTrade } from "./types";
import ExecuteBatch from "../../components/Models/ExecuteBatch/ExecuteBatch";
import ExecuteMethod from "../../components/Models/ExecuteMethod/ExecuteMethod";
import ModalWrapper from "../../components/Models/ModalWrapper";
import TokenSelectionMenu from "../../components/Batching/TokenSelectionMenu";
import BatchSelectionSection from "../../components/Batching/BatchSelectionSection";
import BatchingListSection from "../../components/Batching/BatchingListSection";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { protocolNames } from "../../utils/data/protocols";
import { cn } from "../../lib/utils";
import { socialHandles } from "../../utils/constants";

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
        oraclePriceLoading,
    }: iTrading = useTradingStore((state) => state);

    const { scwBalance }: iGlobal = useGlobalStore((state) => state);
    const [noScwBalance, setNoScwBalance] = useState<boolean>(false);
    const [isOnboardOpen, setIsOnboardOpen] = useState<boolean>(false);

    const address = useAddress();

    useEffect(() => {
        const balance = address ? (!isNaN(parseFloat(scwBalance)) ? parseFloat(scwBalance) ?? 0 : 0) : 1;
        setNoScwBalance(balance <= 0);
        setIsOnboardOpen(balance <= 0);
    }, [scwBalance, useAddress]);

    return (
        <div className="w-full flex flex-col justify-center items-center py-5">
            <div
                className={cn(
                    showBatchList ? "!w-full" : "w-full md:w-3/4 lg:!w-1/2", // width when showing batchlist
                    "flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start gap-4", // positions
                    "h-full px-4 sm:px-0 lg:px-5 xl:px-0 max-w-lg lg:max-w-7xl" // sizes
                )}
            >
                {/* FROM_TOKEN SELECTION MODAL */}
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
                {/* TO_TOKEN SELECTION MODAL */}
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

                {/* BATCHING TOKEN SELECTION --> TO AND FROM */}
                <div className={cn("relative md:max-w-xl", showBatchList ? "w-full" : "w-full xl:w-3/4")}>
                    <BatchSelectionSection
                        handleSwap={handleSwap}
                        onChangeAmountIn={onChangeAmountIn}
                        sendSingleBatchToList={sendSingleBatchToList}
                        handleExecuteMethod={handleExecuteMethod}
                        processRebalancing={processRebalancing}
                        oraclePrice={oraclePrice}
                        oraclePriceLoading={oraclePriceLoading}
                    />
                    {noScwBalance && address && (
                        <button
                            className="absolute -top-4 -right-4 z-0 rounded-full border bg-white hover:scale-105 transition-transform"
                            onClick={() => setIsOnboardOpen(true)}
                        >
                            <HiMiniExclamationCircle className="text-red-500 text-3xl" />
                        </button>
                    )}
                </div>

                {/* Modal - Select Execution Method */}
                {showReviewModal && <ExecuteMethod ExecuteAllBatches={ExecuteAllBatches} />}

                {/* Modal - While Executing Batches */}
                {showExecuteBatchModel && <ExecuteBatch />}

                {/* Modal that appears if user have no balance in smart-account */}
                <ModalWrapper
                    open={isOnboardOpen}
                    onOpenChange={setIsOnboardOpen}
                    title="Welcome to DefiLens!"
                    description="and to the world of Account Abstraction"
                    footer={
                        <p className="text-slate-400 text-sm font-medium w-full">
                            Note: Please contact us on our{" "}
                            <Link className="underline underline-offset-2" href={socialHandles[0].href} target="_blank">
                                telegram community
                            </Link>{" "}
                            if you need help.
                        </p>
                    }
                >
                    <div className="flex flex-col gap-4">
                        <p>You need balance on smart-account to be able to Batch tokens.</p>
                        <Link
                            href="/onboarding"
                            className="rounded-md bg-black/80 hover:bg-black/100 text-white max-w-fit px-4 py-2 hover:shadow-md transition-all"
                        >
                            Migrate Tokens
                        </Link>
                    </div>
                </ModalWrapper>

                {/* Batching List */}
                {selectedFromNetwork.chainId && showBatchList && (
                    <BatchingListSection removeBatch={removeBatch} toggleShowBatchList={toggleShowBatchList} />
                )}
            </div>
        </div>
    );
};

export default Trade;
