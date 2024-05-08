import React from "react";

import Image from "next/image";

import { tExecuteMethod } from "./types";
import Button from "../../Button/Button";
import { loading01, payClick } from "../../../assets/gifs";
import { ExecutionMethodsList } from "../../../utils/data/constants";
import { closeNarrow, defaultBlue } from "../../../assets/images";
import { iTrading, useTradingStore } from "../../../store/TradingStore";
import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";
import clsx from "clsx";
import { ChainIdDetails } from "../../../utils/data/network";
import { protocolNames } from "../../../utils/data/protocols";
import { startCase } from "lodash";
import { HiArrowLongRight, HiOutlineEllipsisVertical } from "react-icons/hi2";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { BsFillFuelPumpFill } from "react-icons/bs";

const ExecuteMethod = ({ ExecuteAllBatches }: tExecuteMethod) => {
    const { isSimulate }: iGlobal = useGlobalStore((state) => state);

    const {
        sendTxLoading,
        setShowReviewModal,
        setShowExecuteMethodModel,
        individualBatch,
        selectedFromNetwork,
        selectedExecuteMethod,
        oraclePrice,
        addToBatchLoading
    }: iTrading = useTradingStore((state) => state);

    const closeExecuteMethodModel = () => {
        setShowReviewModal(false);
    };

    console.log(individualBatch, "individualBatch");

    const getNetworkLogoByNetworkName = (networkName) => {
        const chainIds = Object.keys(ChainIdDetails);
        for (let i = 0; i < chainIds.length; i++) {
            const chainId = chainIds[i];
            if (ChainIdDetails[chainId].networkName === networkName) {
                return ChainIdDetails[chainId].networkLogo;
            }
        }
        // If networkName is not found, return a default logo or handle it accordingly
        return null; // or return a default logo image
    };

    return (
        <div className="fixed w-full h-full flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 text-black backdrop-brightness-50 p-5 md:p-10">
            <div className="min-h-80 w-[45rem] flex flex-col justify-center items-center gap-2 bg-white border-2 border-gray-300 rounded-2xl p-3 relative p-4">
                <div className="w-full flex items-center justify-between text-center text-xl md:text-2xl text-black font-extrabold">
                    Review Batch
                    <button
                        type="button"
                        onClick={() => closeExecuteMethodModel()}
                        className="w-8 h-8 place-self-end p-2 bg-slate-50 hover:bg-slate-200 active:bg-slate-100 rounded-xl cursor-pointer outline-none"
                    >
                        <Image src={closeNarrow} alt="close" />
                    </button>
                </div>
                <div className="h-full w-full flex flex-col justify-center items-center gap-2">
                    <div className="w-full border-3 max-h-96 overflow-auto flex flex-col justify-start items-center gap-5 mt-5">
                        <div className="w-full max-h-full overflow-auto flex flex-col gap-5 px-2 py-2">
                            {selectedFromNetwork?.chainId &&
                                individualBatch?.length > 0 &&
                                individualBatch.map((bar, inputBarIndex) => (
                                    <div key={inputBarIndex}>
                                        {bar.txArray.length > 0 && (
                                            <div key={bar.id} className="relative">
                                                <div className="simulation-success flex flex-col justify-center items-start">
                                                    <div className="w-full flex flex-col justify-between items-start gap-2 p-3 rounded-xl bg-[rgba(132,144,251,.1)] cursor-pointer border-2 border-B50">
                                                        <div className="w-full flex flex-col gap-2">
                                                            <div className="w-full flex justify-between items-center gap-2">
                                                                <div className="flex justify-start items-start gap-5">
                                                                    <div className="relative">
                                                                        <Image
                                                                            src={
                                                                                ChainIdDetails[
                                                                                    selectedFromNetwork.chainId
                                                                                ].networkLogo
                                                                            }
                                                                            alt="network logo"
                                                                            className="h-10 w-10 bg-font-200 rounded-full cursor-pointer"
                                                                        />
                                                                        <div className="absolute -bottom-1 -right-1 bg-font-100 h-5 w-5 flex justify-center items-center rounded-full">
                                                                            <Image
                                                                                src={
                                                                                    protocolNames[
                                                                                        selectedFromNetwork.chainId
                                                                                    ].key.find(
                                                                                        (entry) =>
                                                                                            entry.name ==
                                                                                            bar.data.fromProtocol
                                                                                    )?.icon || defaultBlue
                                                                                }
                                                                                alt="protocol icon"
                                                                                className="h-4 w-4  bg-font-200 rounded-full cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-start items-start">
                                                                        <span className="text-md md:text-lg lg:text-xl font-bold text-B200">
                                                                            {bar.data.fromProtocol} on{" "}
                                                                            {bar.data.fromNetwork}
                                                                        </span>
                                                                        <p className="inline-flex items-center gap-2 text-sm xl:text-base font-semibold text-font-500">
                                                                            {bar.data.amountIn} {bar.data.fromToken}
                                                                            {/* <span>
                                                                            {bar.data.toProtocol} on{" "}
                                                                            {startCase(bar.data.toNetwork)}
                                                                        </span> */}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <HiArrowLongRight size="20px" />
                                                                <div className="flex justify-start items-start gap-5">
                                                                    <div className="relative">
                                                                        <Image
                                                                            src={getNetworkLogoByNetworkName(
                                                                                bar.data.toNetwork
                                                                            )}
                                                                            alt="network logo"
                                                                            className="h-10 w-10 bg-font-200 rounded-full cursor-pointer"
                                                                        />
                                                                        <div className="absolute -bottom-1 -right-1 bg-font-100 h-5 w-5 flex justify-center items-center rounded-full">
                                                                            <Image
                                                                                src={
                                                                                    protocolNames[
                                                                                        selectedFromNetwork.chainId
                                                                                    ].key.find(
                                                                                        (entry) =>
                                                                                            entry.name ==
                                                                                            bar.data.toProtocol
                                                                                    )?.icon || defaultBlue
                                                                                }
                                                                                alt="protocol icon"
                                                                                className="h-4 w-4  bg-font-200 rounded-full cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-start items-start">
                                                                        <span className="text-md md:text-lg lg:text-xl font-bold text-B200">
                                                                            {bar.data.toProtocol} on{" "}
                                                                            {bar.data.toNetwork}
                                                                        </span>
                                                                        <p className="inline-flex items-center gap-2 text-sm xl:text-base font-semibold text-font-500">
                                                                            {bar.data.amountIn} {bar.data.toToken}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center justify-between text-lg font-semibold">
                                                                    Bridge fee :{""}
                                                                    <span>
                                                                        {bar.batchesFlow !== undefined &&
                                                                            bar.batchesFlow[1].amount} {bar.data.fromToken}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-lg font-semibold">
                                                                    Gas fee :{""}
                                                                    <span>
                                                                        {Number(bar.data.fees)
                                                                            .toPrecision(3)
                                                                            .toString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <Button
                    handleClick={() => {
                        ExecuteAllBatches(true, selectedExecuteMethod);
                        setShowReviewModal(false);
                    }}
                    customStyle="w-full"
                    innerText="Execute Batch"
                />
            </div>
        </div>
    );
};
export default ExecuteMethod;
