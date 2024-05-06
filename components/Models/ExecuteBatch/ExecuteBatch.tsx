import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { BsArrowRight } from "react-icons/bs";
import {HiArrowLongRight} from "react-icons/hi2";

import axiosInstance from "../../../axiosInstance/axiosInstance";
import { tExecuteBatch } from "./types";
import { buildTxHash } from "../../../utils/helper";
import { closeNarrow, tenderly } from "../../../assets/images";
import { ChainIdDetails } from "../../../utils/data/network";
import { protocolNames } from "../../../utils/data/protocols";
import { error, loading, success } from "../../../assets/gifs";
import { iIndividualBatch, iTrading, useTradingStore } from "../../../store/TradingStore";
import { iBatchHistory, iSingleTransaction } from "../../../modules/portfolio/types";
import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";
import { useAddress } from "@thirdweb-dev/react";
import { RxExternalLink } from "react-icons/rx";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { PiShieldCheckLight } from "react-icons/pi";

const ExecuteBatch = ({}: tExecuteBatch) => {
    const {
        selectedFromNetwork,
        individualBatch,
        setShowExecuteBatchModel,
        setHasExecutionSuccess,
        hasExecutionError,
        setHasExecutionError,
        txhash,
        setTxHash,
        simulationHashes,
        setSimulationsHashes,
    }: iTrading = useTradingStore((state) => state);
    const address = useAddress();
    const { smartAccountAddress, isSimulate }: iGlobal = useGlobalStore((state) => state);

    const closeExecuteBatchModel = () => {
        setShowExecuteBatchModel(false);
        setTxHash("");
        setHasExecutionSuccess("");
        setHasExecutionError("");
    };

    const [hasCrossChainTxs, setHasCrossChainTxs] = useState<iIndividualBatch[] | false>(false);

    const handleIsCrossChainTxs = () => {
        const txn =
            individualBatch.length > 0 &&
            individualBatch.filter((item: iIndividualBatch, index) => item.data.fromNetwork !== item.data.toNetwork);
        setHasCrossChainTxs(txn);
    };

    useEffect(() => {
        handleIsCrossChainTxs();
    }, [individualBatch]);

    const handleTxnHistory = async (txHistory: iBatchHistory) => {
        try {
            await axiosInstance
                .post(`/transactions/${isSimulate ? "batch-simulation" : "batch"}`, txHistory)
                .then(async (res) => {
                    console.log("Thanks for Working with us");
                })
                .catch((err) => {
                    console.log("Error! While storing history", err);
                });
        } catch (error: any) {
            console.log("handleTxnHistory: error:", error);
        }
    };

    useEffect(() => {
        if (individualBatch.length > 0 && txhash) {
            const txHistory: iSingleTransaction[] = individualBatch.map((item) => ({
                amountIn: item.data.amountIn,
                fromNetwork: item.data.fromNetwork,
                toNetwork: item.data.toNetwork,
                fromProtocol: item.data.fromProtocol,
                toProtocol: item.data.toProtocol,
                fromToken: item.data.fromToken,
                toToken: item.data.toToken,
                txHash: txhash,
                isSimulate: isSimulate,
                simulationLink: item.simulationHash,
            }));

            const dataToSend: iBatchHistory = {
                transactions: txHistory,
                smartAccount: smartAccountAddress,
                eoaAccount: address,
            };

            handleTxnHistory(dataToSend);
        }
    }, [txhash]);

    return (
        <div className="fixed w-full h-full flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 text-black backdrop-brightness-50 p-5 md:p-10">
            <div className="h-auto w-[600px] flex flex-col justify-center items-center gap-2 bg-white border-gray-300 rounded-2xl p-3 border-8 relative">
                {txhash || hasExecutionError ? (
                    <button
                        type="button"
                        onClick={() => closeExecuteBatchModel()}
                        className="absolute top-2 right-2 w-8 h-8 place-self-end p-2 bg-slate-50 hover:bg-slate-200 active:bg-slate-100 rounded-full cursor-pointer outline-none"
                    >
                        <Image src={closeNarrow} alt="close button" />
                    </button>
                ) : null}
                <div className="h-full w-full flex flex-col justify-center items-center gap-2 p-5">
                    <Image
                        src={txhash ? success : hasExecutionError ? error : loading}
                        alt="transaction_state_icon"
                        className="w-20 h-20 md:w-28 md:h-28 !bg-green-400"
                    />
                    {/* <PiShieldCheckLight size={80} /> */}
                    <div className="w-full text-center text-xl md:text-2xl text-black font-bold mb-8 mt-2">
                        {txhash
                            ? isSimulate
                                ? "Simulation Executed Successfully"
                                : "Batches Executed Successfully"
                            : hasExecutionError
                              ? "Execution Error"
                              : "Executing All Batches"}
                    </div>
                    <div className="w-full">
                        {selectedFromNetwork &&
                            !hasExecutionError &&
                            (individualBatch.length > 0 && individualBatch[0].txArray.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    <div className="w-full flex justify-start items-center gap-5">
                                        <div className="w-full flex justify-start items-center gap-3">
                                            <h1 className="text-xl font-bold">Source</h1>
                                        </div>

                                        <div className="w-full flex justify-start items-center gap-3">
                                            <h1 className="text-xl font-bold">Destination</h1>
                                        </div>
                                    </div>
                                    <div className="w-full max-h-60 flex flex-col justify-start items-center text-sm md:text-base gap-6 overflow-auto py-1">
                                        {individualBatch.map(
                                            (bar: iIndividualBatch, index) =>
                                                bar.txArray.length > 0 && (
                                                    <div
                                                        key={bar.id}
                                                        className="w-full flex justify-start items-center gap-5"
                                                    >
                                                        <div className="w-full flex justify-start items-center gap-3">
                                                            <div className="relative">
                                                                <Image
                                                                    src={
                                                                        ChainIdDetails[
                                                                            selectedFromNetwork.chainId.toString()
                                                                        ]?.networkLogo
                                                                    }
                                                                    alt=""
                                                                    className="h-10 w-10 bg-slate-200 rounded-full"
                                                                />
                                                                <div className="absolute -bottom-1 -right-1 bg-white h-5 w-5 flex justify-center items-center rounded-full">
                                                                    <Image
                                                                        src={
                                                                            protocolNames[
                                                                                selectedFromNetwork.chainId
                                                                            ]?.key.find(
                                                                                (entry) =>
                                                                                    entry.name == bar.data.fromProtocol
                                                                            )?.icon
                                                                        }
                                                                        alt=""
                                                                        className="h-5 w-5 bg-slate-200 rounded-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col justify-start items-start">
                                                                <span className="text-sm md:text-base font-semibold text-slate-700">
                                                                    {bar.data.amountIn} {bar.data.fromToken}
                                                                </span>
                                                                <span className="text-xs md:text-sm font-semibold text-slate-700">
                                                                    {bar.data.fromProtocol} on {bar.data.fromNetwork}
                                                                </span>
                                                            </div>
                                                            <div className="w-4">
                                                                {
                                                                    <a
                                                                        target="_blank"
                                                                        href={
                                                                            txhash.includes("tenderly")
                                                                                ? txhash
                                                                                : buildTxHash(
                                                                                      selectedFromNetwork.chainId,
                                                                                      txhash,
                                                                                      false
                                                                                  )
                                                                        }
                                                                        className="cursor-pointer ftext-gray-900 text-xl"
                                                                    >
                                                                        <RxExternalLink />
                                                                    </a>
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="w-full flex justify-start items-center gap-3">
                                                            <div className="relative">
                                                                <Image
                                                                    src={
                                                                        ChainIdDetails[bar.data.toChainId.toString()]
                                                                            ?.networkLogo
                                                                    }
                                                                    alt=""
                                                                    className="h-10 w-10 bg-slate-200 rounded-full"
                                                                />
                                                                <div className="absolute -bottom-1 -right-1 bg-white h-5 w-5 flex justify-center items-center rounded-full">
                                                                    <Image
                                                                        src={
                                                                            protocolNames[bar.data.toChainId].key.find(
                                                                                (entry) =>
                                                                                    entry.name == bar.data.toProtocol
                                                                            )?.icon
                                                                        }
                                                                        alt=""
                                                                        className="h-5 w-5 bg-slate-200 rounded-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col justify-start items-start">
                                                                <span className="text-sm md:text-base font-semibold text-slate-700">
                                                                    {/* {bar.data.toProtocol} */}
                                                                    {bar.data.amountIn} {bar.data.toToken}
                                                                </span>
                                                                <span className="text-xs md:text-sm font-semibold text-slate-700">
                                                                    {bar.data.toProtocol} on {bar.data.toNetwork}
                                                                    {/* {bar.data.amountIn} {bar.data.toToken} */}
                                                                </span>
                                                            </div>
                                                            <div className="w-4">
                                                                {bar?.simulationHash && (
                                                                    <a
                                                                        target="_blank"
                                                                        href={buildTxHash(
                                                                            selectedFromNetwork.chainId,
                                                                            bar?.simulationHash,
                                                                            false,
                                                                            true
                                                                        )}
                                                                        className="cursor-pointer text-gray-900 text-xl"
                                                                    >
                                                                        <RxExternalLink />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                </div>
                            ) : null)}
                    </div>
                    <div className="w-full break-words text-center text-base md:text-lg text-teal-500  font-semibold">
                        {txhash ? (
                            <span className="flex flex-col justify-center items-center gap-2">
                                {!isSimulate && (
                                    <a
                                        target="_blank"
                                        href={
                                            txhash.includes("tenderly")
                                                ? txhash
                                                : buildTxHash(selectedFromNetwork.chainId, txhash, false)
                                        }
                                        className="cursor-pointer bg-teal-500 text-white rounded-lg px-5 py-1"
                                    >
                                        View on Explorer
                                    </a>
                                )}
                                {!isSimulate && hasCrossChainTxs && hasCrossChainTxs.length > 0 && (
                                    <a
                                        target="_blank"
                                        href={buildTxHash(selectedFromNetwork.chainId, txhash, true)}
                                        className="bg-blue-700 text-white rounded-lg px-6 py-2"
                                    >
                                        View on SocketScan.io
                                    </a>
                                )}
                            </span>
                        ) : hasExecutionError ? (
                            <span className="text-red-500">
                                {hasExecutionError.includes("code=ACTION_REJECTED")
                                    ? "MetaMask Tx Signature: User denied Transaction Signature."
                                    : "Something went wrong."}
                            </span>
                        ) : (
                            !isSimulate && <span>Proceed in your wallet</span>
                        )}
                    </div>
                </div>
                <h2 className="flex gap-1 items-center">
                    <span className="text-lg md:text-xl font-bold text-black">Powered by</span>
                    <Image src={tenderly} alt="" className="h-10 w-10" />
                    <span className="text-base md:text-lg font-bold text-slate-900">tenderly</span>
                </h2>
            </div>
        </div>
    );
};
export default ExecuteBatch;
