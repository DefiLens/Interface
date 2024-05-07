import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import SelectionBar from "../SelectionBar/SelectionBar";
import Button from "../Button/Button";
import { iRebalance, iTrading, useRebalanceStore, useTradingStore } from "../../store/TradingStore";
import { protocolNames } from "../../utils/data/protocols";
import { defaultBlue, tenderly } from "../../assets/images";
import { BiLoaderAlt } from "react-icons/bi";
import { tBatchSelectionSection } from "../../modules/trade/types";
import CustomCheckbox from "../common/CustomCheckbox";
import { Rebalance } from "./Rebalance";
import { cn } from "../../lib/utils";
import axios from "axios";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useChain } from "@thirdweb-dev/react";
import { CgSpinner } from "react-icons/cg";

bg.config({ DECIMAL_PLACES: 10 });

const BatchSelectionSection: React.FC<tBatchSelectionSection> = ({
    handleSwap,
    onChangeAmountIn,
    sendSingleBatchToList,
    handleExecuteMethod,
    processRebalancing,
    oraclePrice,
    oraclePriceLoading,
}) => {
    const {
        maxBalance,
        ismaxBalanceLoading,
        selectedFromNetwork,
        selectedFromProtocol,
        selectedFromToken,
        selectedToNetwork,
        selectedToProtocol,
        selectedToToken,
        setShowFromSelectionMenu,
        setShowToSelectionMenu,
        amountIn,
        fromTokenDecimal,
        addToBatchLoading,
        sendTxLoading,
        setSelectedFromProtocol,
        individualBatch,
    }: iTrading = useTradingStore((state) => state);

    const { isRebalance, setIsRebalance, rebalanceData }: iRebalance = useRebalanceStore((state) => state);
    const { isSimulate }: iGlobal = useGlobalStore((state) => state);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        setIsRebalance(event.target.checked); // isRebalance is a function of checkbox
        if (event.target.checked) {
            setSelectedFromProtocol("erc20");
        } else {
            setSelectedFromProtocol("");
        }
    };

    // Tip: This can be implemented using useMemo, instead of useEffect hook.
    const [isRebalanceBtnClickable, setIsRebalanceBtnClickable] = useState(false);
    const [isOneBatchBtnClickable, setIsOneBatchBtnClickable] = useState(false);
    const [isExecuteBtnClickable, setIsExecuteBtnClickable] = useState(false);

    useEffect(() => {
        const areAllObjectsFilled =
            rebalanceData.length > 0 &&
            rebalanceData.every((object) => Object.values(object).every((value) => value !== ""));

        const isButtonClickable =
            selectedFromProtocol != "" && selectedFromToken != "" && amountIn != 0 && areAllObjectsFilled;
        setIsRebalanceBtnClickable(isButtonClickable);
    }, [selectedFromProtocol, selectedFromToken, amountIn, rebalanceData]);

    useEffect(() => {
        const isButtonClickable =
            selectedFromProtocol != "" &&
            selectedFromToken != "" &&
            amountIn != 0 &&
            selectedToProtocol != "" &&
            selectedToToken != "";
        setIsOneBatchBtnClickable(isButtonClickable);
    }, [selectedFromProtocol, selectedFromToken, amountIn, selectedToProtocol, selectedToToken]);

    useEffect(() => {
        const areAllObjectsFilled =
            individualBatch.length > 0 &&
            individualBatch.every((object) => Object.values(object).every((value) => value !== ""));
        setIsExecuteBtnClickable(areAllObjectsFilled);
    }, [individualBatch]);

    const handleShowFromSelectionMenu = () => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        setShowFromSelectionMenu(true);
    };
    const handleShowToSelectionMenu = () => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        setShowToSelectionMenu(true);
    };

    return (
        <div className="w-full md:max-w-xl mx-auto flex flex-col gap-5 bg-gradient-to-br from-[#7339FD] via-[#56B0F6] to-[#4DD4F4] rounded-2xl shadow-lg border lg:shadow-xl overflow-hidden">
            <div className="px-5 pt-7">
                <div className="flex flex-col gap-3 bg-[rgba(225,225,225,.4)] rounded-xl px-5 py-3 ">
                    {/* Token Selection */}
                    <div
                        className={cn(
                            "w-full relative flex justify-center items-center gap-5",
                            !isRebalance &&
                                selectedToNetwork.chainName &&
                                selectedToProtocol &&
                                selectedToToken &&
                                selectedFromNetwork.chainName &&
                                selectedFromProtocol &&
                                selectedFromToken
                                ? "flex-row"
                                : "flex-col"
                        )}
                    >
                        {/* Selection Bar - FROM */}
                        <SelectionBar
                            handleSelectionMenu={handleShowFromSelectionMenu}
                            titlePlaceholder="From"
                            iconCondition={selectedFromNetwork.chainName && selectedFromProtocol}
                            mainIcon={selectedFromNetwork?.icon}
                            subIcon={
                                protocolNames[selectedFromNetwork.chainId]?.key.find(
                                    (entry) => entry.name == selectedFromProtocol
                                )?.icon
                            }
                            valueCondition={selectedFromNetwork.chainName}
                            valuePlaceholder="Select Chain and token"
                            mainValue={selectedFromNetwork.key}
                            firstSubValue={selectedFromProtocol}
                            secondSubValue={selectedFromToken}
                        />

                        {/* Swap Btn */}
                        {!isRebalance &&
                            selectedToNetwork.chainName &&
                            selectedToProtocol &&
                            selectedToToken &&
                            selectedFromNetwork.chainName &&
                            selectedFromProtocol &&
                            selectedFromToken && (
                                <div
                                    onClick={handleSwap}
                                    className="absolute flex justify-center items-center border-2 bg-N60 hover:bg-font-100 active:bg-font-400 rounded-full p-1"
                                >
                                    <HiOutlineArrowsRightLeft size="25px" className="rotate-90 sm:rotate-0 text-B100" />
                                </div>
                            )}

                        {/* Selection Bar - TO variants based on rebalancing state */}
                        {!isRebalance ? (
                            <SelectionBar
                                handleSelectionMenu={handleShowToSelectionMenu}
                                titlePlaceholder="To"
                                iconCondition={selectedToNetwork.chainName}
                                mainIcon={selectedToNetwork?.icon}
                                subIcon={
                                    protocolNames[selectedToNetwork.chainId]?.key.find(
                                        (entry) => entry.name == selectedToProtocol
                                    )?.icon
                                }
                                valueCondition={selectedToNetwork.chainName}
                                valuePlaceholder="Select Chain and token"
                                mainValue={selectedToNetwork.key}
                                firstSubValue={selectedToProtocol}
                                secondSubValue={selectedToToken}
                            />
                        ) : (
                            <Rebalance />
                        )}
                    </div>
                    {/* Rebalance Checkbox */}
                    <div className="flex items-center w-full">
                        <CustomCheckbox checked={isRebalance} onChange={handleCheckboxChange} />
                        <span className="ml-2 text-N0">Rebalance</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col gap-5 px-5 py-7 bg-W100 rounded-xl">
                {/* Amount Selection */}
                <div
                    className={`border ${
                        bg(maxBalance).isLessThan(amountIn) ? "border-error-600" : "border-[#A9A9A9]"
                    } rounded-lg px-5 py-3`}
                >
                    <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-B200">You Pay</h5>

                    {/* Token Icons */}
                    <div className="relative flex flex-row justify-start items-center gap-8 py-3">
                        {selectedFromNetwork.chainName && selectedFromProtocol ? (
                            <div className="relative">
                                <Image
                                    src={selectedFromNetwork.icon}
                                    alt=""
                                    className="h-12 w-12 bg-N40 rounded-full cursor-pointer"
                                />
                                <div className="absolute -bottom-1 -right-1 border-[3px] border-W100 bg-N50 h-6 w-6 flex justify-center items-center rounded-full">
                                    <Image
                                        src={
                                            protocolNames[selectedFromNetwork.chainId].key.find(
                                                (entry) => entry.name == selectedFromProtocol
                                            )?.icon || defaultBlue
                                        }
                                        alt=""
                                        className="h-5 w-5 rounded-full cursor-pointer"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="h-12 w-12 bg-N50 rounded-full cursor-pointer" />
                                <div className="absolute -bottom-1 border-[3px] border-W100 -right-1 bg-N50 h-6 w-6 flex justify-center items-center rounded-full">
                                    <div className="h-5 w-5 rounded-full cursor-pointer" />
                                </div>
                            </div>
                        )}

                            {/* Amount Input */}
                            <div className="text-B200">
                                <input
                                    min="0"
                                    type="number"
                                    placeholder="0"
                                    value={
                                        fromTokenDecimal && amountIn && bg(amountIn).isGreaterThan(0)
                                            ? amountIn
                                            : amountIn
                                    }
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        onChangeAmountIn(e.target.value)
                                    }
                                    className="w-full text-xl bg-W100 md:text-2xl text-B100 placeholder:text-slate-400 font-bold outline-none"
                                />
                                <div className="text-xs md:text-sm text-B100 font-medium">
                                    {oraclePriceLoading ? (
                                        <div className="bg-gray-200 h-4 w-16 animate-pulse rounded-md"></div>
                                    ) : (
                                        oraclePrice && <p>${(oraclePrice * amountIn).toFixed(5)}</p>
                                    )}
                                </div>
                                <div className="absolute right-0 bottom-0 flex flex-col justify-center items-end gap-1">
                                    {maxBalance !== amountIn && maxBalance !== "0" ? (
                                        <span
                                            onClick={() => onChangeAmountIn(maxBalance ? maxBalance.toString() : "0")}
                                            className="text-xs md:text-sm text-S600 font-medium bg-[rgba(109,223,255,.4)] rounded-xl px-3 py-1 cursor-pointer"
                                        >
                                            Max
                                        </span>
                                    ) : maxBalance == "0" ? (
                                        <span className="text-xs md:text-sm text-S600 font-medium bg-[rgba(109,223,255,.4)] rounded-xl px-3 py-1 cursor-default">
                                            No Balance
                                        </span>
                                    ) : null}
                                    <span className="flex gap-2 text-xs md:text-sm text-B100 font-semibold cursor-default">
                                        Balance:
                                        {ismaxBalanceLoading ? (
                                            // <BiLoaderAlt className="animate-spin h-4 w-4" />
                                            <div className="bg-gray-200 h-4 w-14 animate-pulse rounded-md"></div>
                                        ) : (
                                            <span className="text-B100">
                                                {maxBalance ? maxBalance : 0} {selectedFromToken && selectedFromToken}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                    {/* Error Message */}
                    {bg(maxBalance).isLessThan(amountIn) && (
                        <div className="text-sm md:text-base text-error-600 font-semibold">Insufficient Balance</div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col justify-center items-center gap-3">
                    {isRebalance ? (
                        <Button
                            handleClick={() => processRebalancing()}
                            isLoading={addToBatchLoading}
                            customStyle=""
                            disabled={!isRebalanceBtnClickable || addToBatchLoading}
                            innerText="Rebalance"
                        />
                    ) : (
                        <Button
                            handleClick={() => sendSingleBatchToList(true)}
                            isLoading={addToBatchLoading}
                            disabled={!isOneBatchBtnClickable || addToBatchLoading}
                            customStyle=""
                            innerText="Add Batch to List"
                        />
                    )}

                        {!isSimulate ? (
                            <Button
                                handleClick={() => handleExecuteMethod()}
                                isLoading={sendTxLoading}
                                disabled={!isExecuteBtnClickable || addToBatchLoading}
                                customStyle=""
                                innerText="Execute Batch"
                            />
                        ) : (
                            <button
                                type="button"
                                disabled={sendTxLoading}
                                onClick={() => handleExecuteMethod()}
                                className={`${sendTxLoading ? "bg-[rgba(132,144,251,.3)] cursor-not-allowed" : "bg-[rgba(132,144,251,.08)] hover:bg-[rgba(132,144,251,.1)]"} border border-[rgba(132,144,251)] w-full flex justify-center items-center gap-2  py-3 px-5 rounded-lg text-base md:text-lg text-[rgba(132,144,251)] font-bold transition duration-300`}
                            >
                                {sendTxLoading && <CgSpinner className="animate-spin h-7 w-7" />}
                                Simulate
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchSelectionSection;
