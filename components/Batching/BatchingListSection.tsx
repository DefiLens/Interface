import React, { useEffect, useState } from "react";
import gas from "../../assets/images/gas.png";
import { protocolNames } from "../../utils/data/protocols";
import { ChainIdDetails } from "../../utils/data/network";
import { startCase } from "lodash";
import { MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import Image from "next/image";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { defaultBlue } from "../../assets/images";
import { tBatchListSection } from "../../modules/trade/types";

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
        <div className="w-full md:max-w-2xl max-h-full bg-W100 flex flex-col justify-start items-center gap-1 rounded-2xl cursor-pointer shadow-2xl">
            {/* Batching List Title */}
            <div className="w-full flex justify-between items-center gap-1 px-5 pt-7">
                <h1 className="text-B200 text-lg md:text-xl lg:text-2xl text-center font-bold rounded-t-2xl ">
                    Batching List...
                </h1>

                {/* Display Total Gas if available */}
                {selectedFromNetwork.chainId && totalFees != 0 && (
                    <div className="w-auto flex justify-between items-center text-green-400 gap-4 md:gap-6 bg-[rgba(109,223,255,.2)] border border-green-400 rounded-xl px-4 py-2">
                        <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-sm">
                            <Image src={gas} alt="gas" className="h-5 w-5 mr-1 sm:mr-2" />
                            <span>Total Gas</span>
                        </h3>

                        <div className="flex justify-between items-center gap-1">
                            <Image
                                src={ChainIdDetails[selectedFromNetwork.chainId].networkLogo}
                                alt="gas"
                                className="h-5 w-5 rounded-full"
                            />
                            <h6 className="font-semibold text-sm">{Number(totalFees).toPrecision(4).toString()}</h6>
                        </div>
                    </div>
                )}
            </div>

            {/* Batching List Content */}
            <div className="w-full max-h-full overflow-auto flex flex-col gap-5 px-5 py-7">
                {selectedFromNetwork?.chainId &&
                individualBatch?.length > 0 &&
                individualBatch[0]?.txArray?.length > 0 ? (
                    individualBatch.map((bar, inputBarIndex) => (
                        <div key={inputBarIndex}>
                            {/* Display individual batch */}
                            {bar.txArray.length > 0 && (
                                <div key={bar.id} className="relative">
                                    <div className="simulation-success flex flex-col justify-center items-start gap-1 border-2 border-B50 rounded-lg bg-N0 p-5 text-black font-medium transition duration-300">
                                        <div className="w-full flex justify-between items-center gap-2 border-b border-B50">
                                            {/* Display batch index and networks */}
                                            <h1 className="flex justify-center items-center gap-3 text-B100 font-extrabold text-base text-transparent bg-clip-text bg-gradient-to-br from-[#7339FD] via-[#56B0F6] to-[#4DD4F4]">
                                                {inputBarIndex + 1}.
                                                <span>
                                                    {startCase(bar.data.fromNetwork)} To {startCase(bar.data.toNetwork)}
                                                </span>
                                            </h1>

                                            {/* Delete batch button */}
                                            <MdDelete
                                                size="40px"
                                                onClick={() => removeBatch(inputBarIndex)}
                                                className="hover:bg-N60 active:bg-N60 p-2 rounded-full text-B100"
                                            />
                                        </div>

                                        {/* Display individual batch details */}
                                        <div
                                            className="w-full flex flex-col justify-between items-start gap-2 p-3 rounded-xl bg-[rgba(132,144,251,.1)] mt-4"
                                            onClick={() => toggleShowBatchList(inputBarIndex)}
                                        >
                                            <div className="w-full flex justify-between items-center gap-2">
                                                <div className="flex justify-start items-start gap-5">
                                                    <div className="relative">
                                                        <Image
                                                            src={
                                                                ChainIdDetails[selectedFromNetwork.chainId].networkLogo
                                                            }
                                                            alt=""
                                                            className="h-10 w-10 bg-font-200 rounded-full cursor-pointer"
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 bg-font-100 h-5 w-5 flex justify-center items-center rounded-full">
                                                            <Image
                                                                src={
                                                                    protocolNames[selectedFromNetwork.chainId].key.find(
                                                                        (entry) =>
                                                                            entry.name == bar.data.fromProtocol
                                                                    )?.icon || defaultBlue
                                                                }
                                                                alt=""
                                                                className="h-4 w-4 bg-font-200 rounded-full cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-start items-start">
                                                        <span className="text-md md:text-lg lg:text-xl font-bold text-B200">
                                                            {bar.data.amountIn} {bar.data.fromToken}
                                                        </span>
                                                        <span className="text-sm md:text-base font-semibold text-font-400">
                                                            {bar.data.fromProtocol} on {bar.data.fromNetwork} {" ... "}
                                                            {bar.data.toProtocol} on {bar.data.toNetwork}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center items-center border border-[rgba(132,144,251)] hover:bg-[rgba(132,144,251,.1)] rounded-full">
                                                    {showIndividualBatchList === inputBarIndex ? (
                                                        <MdKeyboardArrowUp
                                                            size="30px"
                                                            className="text-[rgba(132,144,251)]"
                                                        />
                                                    ) : (
                                                        <MdKeyboardArrowDown
                                                            size="30px"
                                                            className="text-[rgba(132,144,251)]"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {showIndividualBatchList === inputBarIndex && (
                                                <div className="flex flex-col justify-start items-start gap-1 pl-10 pt-3">
                                                    {bar.batchesFlow !== undefined && bar.batchesFlow.length > 0 &&
                                                        bar.batchesFlow.map((item, index: number) => (
                                                            <div
                                                                key={item.action}
                                                                className="flex flex-col justify-start items-start gap-1"
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
                                                                            alt=""
                                                                            className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                                                                        />
                                                                        <div className="absolute -bottom-1 -right-1 bg-font-100 h-4 w-4 flex justify-center items-center rounded-full">
                                                                            <Image
                                                                                src={
                                                                                    protocolNames[
                                                                                        item.fromChainId
                                                                                    ].key.find(
                                                                                        (entry) =>
                                                                                            entry.name === item.protocol
                                                                                    )?.icon || defaultBlue
                                                                                }
                                                                                alt=""
                                                                                className="h-3 w-3 bg-font-200 rounded-full cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-start items-start">
                                                                        <span className="text-sm md:text-base font-semibold text-B200 break-all">
                                                                            {item.action} on {item.protocol}
                                                                        </span>
                                                                        <span className="text-xs md:text-sm font-semibold text-font-400">
                                                                            {item.amount.toString()} {item.tokenIn} for{" "}
                                                                            {item.tokenOut}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {bar.batchesFlow.length - 1 > index ? (
                                                                    <PiDotsThreeOutlineVertical
                                                                        size="32px"
                                                                        className="text-B200"
                                                                    />
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                            {showIndividualBatchList === inputBarIndex && (
                                                <div className="w-full flex justify-between items-center gap-1 rounded-lg px-2 mt-3">
                                                    <div className="w-auto flex justify-between items-center text-green-400 gap-4 md:gap-6 bg-[rgba(109,223,255,.2)] border border-green-400 rounded-xl px-4 py-2">
                                                        <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-sm">
                                                            <Image
                                                                src={gas}
                                                                alt="gas"
                                                                className="h-5 w-5 mr-1 sm:mr-2"
                                                            />
                                                            <span>Gas Used</span>
                                                        </h3>

                                                        <div className="flex justify-between items-center gap-1">
                                                            <Image
                                                                src={
                                                                    ChainIdDetails[selectedFromNetwork.chainId]
                                                                        .networkLogo
                                                                }
                                                                alt="gas"
                                                                className="h-5 w-5 rounded-full"
                                                            />
                                                            <h6 className="font-semibold text-sm">
                                                                {Number(bar.data.fees).toPrecision(3).toString()}
                                                            </h6>
                                                        </div>
                                                    </div>

                                                    {Number(bar.data.extraValue) ? (
                                                        <div className="w-auto flex justify-between items-center text-green-400 gap-4 md:gap-6 bg-[rgba(109,223,255,.2)] border border-green-400 rounded-xl px-4 py-2">
                                                            <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-xs">
                                                                <Image
                                                                    src={gas}
                                                                    alt="gas"
                                                                    className="h-5 w-5 mr-1 sm:mr-2"
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
                                                                    className="h-5 w-5 rounded-full"
                                                                />
                                                                <h6 className="font-semibold text-sm">
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
                        {txhash ? "Last Batches executed, Now create new batches" : "No Batches Found !"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchingListSection;
