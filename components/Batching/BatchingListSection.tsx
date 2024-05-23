import React, { useEffect, useState } from "react";
import Image from "next/image";
import { startCase } from "lodash";
import { MdDelete, MdKeyboardArrowDown } from "react-icons/md";
import { HiArrowLongRight, HiOutlineEllipsisVertical } from "react-icons/hi2";
import { BsFillFuelPumpFill } from "react-icons/bs";
import gas from "../../assets/images/gas.png";
import { protocolNames } from "../../utils/data/protocols";
import { ChainIdDetails } from "../../utils/data/network";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { defaultBlue } from "../../assets/images";
import { tBatchListSection } from "../../modules/trade/types";
import { cn } from "../../lib/utils";

const BatchingListSection: React.FC<tBatchListSection> = ({ removeBatch, toggleShowBatchList }) => {
    const { selectedFromNetwork, showIndividualBatchList, txhash, individualBatch }: iTrading = useTradingStore(
        (state) => state
    );

    const [totalFees, setTotalFees] = useState<number>(0);
    // Calculate total fees
    function calculateTotalFees() {
        let totalFees = 0;
        let totalExtraFees = 0;

        individualBatch?.forEach((batch) => {
            if (batch?.data && batch?.data?.fees) {
                totalFees += parseFloat(batch?.data?.fees);
                totalExtraFees += parseFloat(batch?.data?.extraValue);
            }
        });

        return totalFees + totalExtraFees;
    }

    useEffect(() => {
        const totalFees = calculateTotalFees();
        setTotalFees(totalFees);
    }, [individualBatch]);

    return (
        <div
            className={cn(
                "flex flex-col justify-start items-center gap-1 max-w-md", // position
                "min-w-fit md:max-w-xl h-fit rounded-2xl", // sizes
                "bg-W100 shadow-lg lg:shadow-lg cursor-pointer max-h-[31.75rem]" // colors
            )}
        >
            {/* Batching List Title */}
            <div className="w-full flex justify-between items-center gap-1 p-4">
                <h1 className="text-B200 text-base md:text-lg lg:text-xl text-center font-bold rounded-t-2xl">
                    Batching List
                </h1>

                {/* Display Total Gas if available */}
                {selectedFromNetwork.chainId && totalFees != 0 && (
                    <div className="w-auto flex justify-between items-center text-green-400 gap-2 md:gap-3 bg-[rgba(109,223,255,.2)] border border-green-400 rounded-xl px-3 py-1.5">
                        <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-xs">
                            <Image src={gas} alt="gas" className="h-4 w-4 mr-1" />
                            <span>Total Gas</span>
                        </h3>

                        <div className="flex justify-between items-center gap-1">
                            <Image
                                src={ChainIdDetails[selectedFromNetwork.chainId].networkLogo}
                                alt="gas"
                                className="h-4 w-4 rounded-full"
                            />
                            <h6 className="font-semibold text-xs">{Number(totalFees).toPrecision(4).toString()}</h6>
                        </div>
                    </div>
                )}
            </div>

            {/* Batching List Content */}
            <div className="w-full max-h-full overflow-auto flex flex-col gap-5 px-2 py-3">
                {selectedFromNetwork?.chainId &&
                individualBatch?.length > 0 &&
                individualBatch[0]?.txArray?.length > 0 ? (
                    individualBatch.map((bar, inputBarIndex) => (
                        <div key={inputBarIndex}>
                            {/* Display individual batch */}
                            {bar.txArray.length > 0 && (
                                <div key={bar.id} className="relative">
                                    <div className="simulation-success flex flex-col justify-center items-start border-2 border-B50 rounded-lg bg-N0 p-3 text-black font-medium transition duration-300">
                                        <div className="w-full flex justify-between items-center gap-2">
                                            {/* Display batch index and networks */}
                                            <h1 className="flex justify-center items-center gap-2 text-B100 font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-br from-[#7339FD] via-[#56B0F6] to-[#4DD4F4]">
                                                {inputBarIndex + 1}.
                                                <span>
                                                    {startCase(bar.data.fromNetwork)} to {startCase(bar.data.toNetwork)}
                                                </span>
                                            </h1>

                                            {/* Delete batch button */}
                                            <button
                                                onClick={() => removeBatch(inputBarIndex)}
                                                className="hover:bg-N40 group active:bg-N60 p-1.5 mb-0.5 rounded-full overflow-hidden"
                                            >
                                                <MdDelete size="20px" className="text-B100 group-hover:text-red-700" />
                                            </button>
                                        </div>

                                        {/* Display individual batch details */}
                                        <div
                                            className="w-full flex flex-col justify-between items-start gap-2 p-3 rounded-xl bg-[rgba(132,144,251,.1)] mt-2 cursor-pointer"
                                            onClick={() => toggleShowBatchList(inputBarIndex)}
                                        >
                                            <div className="w-full flex justify-between items-center gap-2">
                                                {/* Display Header */}
                                                <div className="flex justify-start items-start gap-5">
                                                    <div className="relative">
                                                        <div  className="h-9 w-9">
                                                            <Image
                                                                src={
                                                                    ChainIdDetails[selectedFromNetwork.chainId]
                                                                        .networkLogo
                                                                }
                                                                alt="network logo"
                                                                className="h-9 w-9 bg-font-200 rounded-full cursor-pointer"
                                                            />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 bg-font-100 h-4 w-4 flex justify-center items-center rounded-full">
                                                            <Image
                                                                src={
                                                                    protocolNames[selectedFromNetwork.chainId].key.find(
                                                                        (entry) => entry.name == bar.data.fromProtocol
                                                                    )?.icon || defaultBlue
                                                                }
                                                                alt="protocol icon"
                                                                className="h-3 w-3  bg-font-200 rounded-full cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-start items-start">
                                                        <span className="text-md md:text-lg lg:text-sm font-bold text-B200">
                                                            {bar.data.amountIn} {bar.data.fromToken}
                                                        </span>
                                                        <p className="inline-flex items-center gap-1 text-sm xl:text-xs font-semibold text-font-500">
                                                            <span>
                                                                {bar.data.fromProtocol} on{" "}
                                                                {startCase(bar.data.fromNetwork)}
                                                            </span>
                                                            <HiArrowLongRight size="20px" />
                                                            <span>
                                                                {bar.data.toProtocol} on {startCase(bar.data.toNetwork)}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex ml-2 justify-center items-center bg-[rgba(132,144,251,.1)] rounded-full">
                                                    <MdKeyboardArrowDown
                                                        size="28px"
                                                        className={cn(
                                                            "text-[rgba(132,144,251)] transition-transform duration-300",
                                                            showIndividualBatchList === inputBarIndex && "rotate-180"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            {/* Display Batch Flow */}
                                            {showIndividualBatchList === inputBarIndex && (
                                                <div className="flex flex-col justify-start items-start gap-1 pl-8 pt-3">
                                                    {bar.batchesFlow !== undefined &&
                                                        bar.batchesFlow.length > 0 &&
                                                        bar.batchesFlow.map((item, index: number) => (
                                                            <div
                                                                key={item.action}
                                                                className="flex flex-col justify-start items-start"
                                                            >
                                                                <div
                                                                    key={item.action}
                                                                    className="flex justify-center items-center gap-3"
                                                                >
                                                                    <div className="relative">
                                                                        <Image
                                                                            src={
                                                                                ChainIdDetails[item.fromChainId]
                                                                                    .networkLogo
                                                                            }
                                                                            alt="network_chain_logo"
                                                                            className="h-7 w-7 bg-slate-200 rounded-full cursor-pointer"
                                                                        />
                                                                        <div className="absolute -bottom-1 -right-1 bg-font-100 h-3.5 w-3.5 flex justify-center items-center rounded-full">
                                                                            <Image
                                                                                src={
                                                                                    protocolNames[
                                                                                        item.fromChainId
                                                                                    ].key.find(
                                                                                        (entry) =>
                                                                                            entry.name === item.protocol
                                                                                    )?.icon || defaultBlue
                                                                                }
                                                                                alt="protocol_logo"
                                                                                className="h-2.5 w-2.5 bg-font-200 rounded-full cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-start items-start">
                                                                        <span className="text-xs md:text-sm font-semibold text-B200 break-all">
                                                                            {item.action} on {item.protocol}
                                                                        </span>
                                                                        <span className="text-xs md:text-xs font-semibold text-font-400">
                                                                            {item.amount.toString()} {item.tokenIn} for{" "}
                                                                            {item.tokenOut}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {/* Notion to demonstrate trxn's moving forward */}
                                                                {bar.batchesFlow !== undefined &&
                                                                    bar.batchesFlow.length - 1 > index && (
                                                                        <HiOutlineEllipsisVertical
                                                                            size="1.7rem"
                                                                            className="text-B200"
                                                                        />
                                                                    )}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                            {/* Display Gas Used */}
                                            {showIndividualBatchList === inputBarIndex && (
                                                <div className="w-full flex flex-col justify-between items-center px-0 pt-2 mt-3 border-t border-slate-300">
                                                    {/* Gas Used for Executing Batching */}
                                                    <div className="w-full flex justify-between items-center text-font-700  gap-4 md:gap-6 rounded-xl px-4 py-2">
                                                        <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-xs">
                                                            <BsFillFuelPumpFill size="16px" className="mr-1 sm:mr-2" />
                                                            <span>Gas Used</span>
                                                        </h3>

                                                        <div className="flex justify-between items-center gap-1">
                                                            <Image
                                                                src={
                                                                    ChainIdDetails[selectedFromNetwork.chainId]
                                                                        .networkLogo
                                                                }
                                                                alt="gas"
                                                                className="h-4 w-4 rounded-full"
                                                            />
                                                            <h6 className="font-semibold text-xs">
                                                                {Number(bar.data.fees).toPrecision(3).toString()}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    {/* Extra Native Gas */}
                                                    {Number(bar.data.extraValue) ? (
                                                        <div className="w-full flex justify-between items-center text-font-700 gap-4 md:gap-6 rounded-xl px-4 py-2">
                                                            <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-xs">
                                                                <BsFillFuelPumpFill
                                                                    size=".9rem"
                                                                    className="mr-1 sm:mr-2"
                                                                />
                                                                <span>Extra Native Gas</span>
                                                            </h3>

                                                            <div className="flex justify-between items-center gap-1">
                                                                <Image
                                                                    src={
                                                                        ChainIdDetails[selectedFromNetwork.chainId]
                                                                            .networkLogo
                                                                    }
                                                                    alt="gas"
                                                                    className="h-4 w-4 rounded-full"
                                                                />
                                                                <h6 className="font-semibold text-xs">
                                                                    {Number(bar.data.extraValue)
                                                                        .toPrecision(3)
                                                                        .toString()}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    // Display message when no batches found
                    <div className="text-center text-font-700 font-semibold text-base md:text-lg">
                        {txhash
                            ? "Last Batches executed, Please create new batches."
                            : "No Batches found, Please create new Batch."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchingListSection;
