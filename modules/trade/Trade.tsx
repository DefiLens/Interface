import { useEffect, useState } from "react";
import { BigNumber as bg } from "bignumber.js";
import { tTrade } from "./types";
import { protocolNames } from "../../utils/data/protocols";
import ExecuteBatch from "../../components/Models/ExecuteBatch/ExecuteBatch";
import ExecuteMethod from "../../components/Models/ExecuteMethod/ExecuteMethod";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import TokenSelectionMenu from "../../components/Batching/TokenSelectionMenu";
import BatchSelectionSection from "../../components/Batching/BatchSelectionSection";
import BatchingListSection from "../../components/Batching/BatchingListSection";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { cn } from "../../lib/utils";
import { useAddress } from "@thirdweb-dev/react";
import ModalWrapper from "../../components/Models/ModalWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/Card";
import Link from "next/link";
import { HiExclamationCircle, HiMiniExclamationCircle } from "react-icons/hi2";

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
        <div className="w-full h-full flex flex-col justify-center items-center py-5">
            <div
                className={cn(
                    showBatchList ? "!w-full" : "!w-[50%]",
                    "h-full flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start gap-4"
                )}
            >
                <div className="w-full md:max-w-xl h-full flex flex-col justify-center items-center">
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
                    <div className="relative w-full">
                        <BatchSelectionSection
                            handleSwap={handleSwap}
                            onChangeAmountIn={onChangeAmountIn}
                            sendSingleBatchToList={sendSingleBatchToList}
                            handleExecuteMethod={handleExecuteMethod}
                            processRebalancing={processRebalancing}
                        />
                        {noScwBalance && <button
                            className="absolute -top-4 -right-4 z-20 rounded-full border bg-white hover:scale-105 transition-transform"
                            onClick={() => setIsOnboardOpen(true)}
                        >
                            <HiMiniExclamationCircle className="text-red-500 text-3xl" />
                        </button>}
                    </div>
                </div>

                {/* Modal - Select Execution Method */}
                {showExecuteMethodModel && <ExecuteMethod ExecuteAllBatches={ExecuteAllBatches} />}

                {/* Modal - While Executing Batches */}
                {showExecuteBatchModel && <ExecuteBatch />}

                {/* No SCW Balance Card */}
                {/* <Card className="absolute right-10 top-20 max-w-md bg-white text-black-600 shadow-lg">
                    <CardHeader>
                        <CardTitle>Welcome to DefiLens!</CardTitle>
                        <CardDescription>
                            and to the world of Account Abstraction
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <p>
                                🚨 You need balance on smart-account to be able
                                to Batch tokens.
                            </p>
                            <Link
                                href="/onboarding"
                                className="rounded-md bg-black/80 hover:bg-black/100 text-white max-w-fit px-4 py-2 hover:shadow-md transition-all"
                            >
                                Migrate Tokens
                            </Link>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-slate-400 text-sm font-medium w-full">
                            Note: Please contact us on our{" "}
                            <a
                                className="underline underline-offset-2"
                                href="https://google.com"
                                target="_blank"
                            >
                                telegram community
                            </a>{" "}
                            if you need help.
                        </p>
                    </CardFooter>
                </Card> */}

                <ModalWrapper
                    open={isOnboardOpen}
                    onOpenChange={setIsOnboardOpen}
                    title="Welcome to DefiLens!"
                    description="and to the world of Account Abstraction"
                    footer={
                        <p className="text-slate-400 text-sm font-medium w-full">
                            Note: Please contact us on our{" "}
                            <Link
                                className="underline underline-offset-2"
                                href="https://x.com/DefiLensTech"
                                target="_blank"
                            >
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
