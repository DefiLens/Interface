// Library Imports
import React, { useState } from "react";
import Image from "next/image";
import { startCase } from "lodash";
import { useChainId } from "@thirdweb-dev/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
// Store, Components, Util, Type Imports
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { closeNarrow, defaultBlue } from "../../assets/images";
import { tOneAsset } from "./types";
import MigrateAsset from "./MigrateAsset";
import { buildTxHash } from "../../utils/helper";
import { success } from "../../assets/gifs";
import CopyButton from "../../components/common/CopyButton";

const OneAsset: React.FC<tOneAsset> = ({ positions, send, handleAmountIn, currentChainId }) => {
    const { selectOneAsset, setSelectOneAsset, showMigrationSuccess, setShowMigrationSuccess, txhash }: iPortfolio =
        usePortfolioStore((state) => state);

    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const chainId = useChainId();

    return (
        <>
            {positions
                ?.sort((a, b) => b.attributes.value - a.attributes.value)
                .slice(0, showAll ? undefined : 4)
                .map((item) => (
                    <div
                        key={item.id}
                        className="w-full flex justify-end items-center gap-3 text-[13px] md:text-[15px] font-medium text-B200 py-4 border-t border-B50"
                    >
                        <div className="w-full flex max-w-md justify-start items-center gap-3 text-start">
                            {/* Token logo */}
                            <Image
                                height={38}
                                width={38}
                                src={item?.attributes.fungible_info.icon?.url || defaultBlue}
                                alt="Token logo"
                                className="rounded-full bg-N60"
                            />
                            <div className="flex flex-col gap-[6px]">
                                {/* Token Name */}
                                <div>{item?.attributes.fungible_info.name}</div>
                                {/* Chain logo and name */}
                                <div className="inline-flex justify-start items-center gap-1 text-xs text-font-500">
                                    <p className="text-gray-500 font-medium">
                                        {item?.attributes.protocol
                                            ? item?.attributes.protocol.toUpperCase()
                                            : startCase(item?.attributes.position_type)}
                                    </p>
                                    {item?.attributes.protocol && (
                                        <>
                                            <span className="text-sm"> · </span>
                                            <p className="bg-gray-100 text-gray-500 rounded-md px-[6px] py-[2px]">
                                                Deposited
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full inline-flex items-center">
                            <div className="w-1/3 text-start">
                                {item?.attributes.price && `$${Number(item.attributes.price.toFixed(4))}`}
                            </div>
                            <div className="w-1/3 text-start">
                                {Number(item?.attributes.quantity.float.toFixed(4))}{" "}
                                {item?.attributes.fungible_info.symbol}
                            </div>
                            <div className="w-1/3 text-start text-success-600">
                                {item?.attributes.value && `$${Number(item.attributes.value.toFixed(4))}`}
                            </div>
                        </div>
                        <div className="w-[3%]">
                            {chainId === currentChainId && (
                                <div className="group flex justify-center transition-all p-1 hover:bg-N40 rounded-md cursor-pointer">
                                    <BiDotsVerticalRounded
                                        size="30px"
                                        className="text-B100"
                                        onClick={() => setSelectOneAsset(item)}
                                    />
                                    <span className="absolute px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:-translate-y-9 z-20 bg-gray-500 bg-opacity-10 duration-700 text-sm whitespace-nowrap">
                                        Migrate Asset
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Migrate Assets Modal */}
                        {selectOneAsset === item && <MigrateAsset send={send} handleAmountIn={handleAmountIn} />}
                        {showMigrationSuccess && (
                            <div
                                className={`fixed z-[52] inset-0 overflow-y-auto ${showMigrationSuccess ? "block" : "hidden"}`}
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-[1px] backdrop-filter"></div>
                                <div className="relative flex items-center justify-center min-h-screen">
                                    <div className="h-auto w-[600px] flex flex-col justify-center items-center gap-2 bg-white border-2 border-gray-300 rounded-2xl p-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowMigrationSuccess(false)}
                                            className="w-8 h-8 place-self-end p-2 bg-slate-50 hover:bg-slate-200 active:bg-slate-100 rounded-xl cursor-pointer outline-none"
                                        >
                                            <Image src={closeNarrow} alt="" />
                                        </button>
                                        <div className="h-full w-full flex flex-col justify-center items-center gap-2 p-5">
                                            <Image
                                                src={success}
                                                alt=""
                                                className="w-20 h-20 md:w-28 md:h-28 !bg-green-400"
                                            />
                                            <div className="w-full text-center text-xl md:text-2xl text-black font-bold cursor-pointer">
                                                Transaction Successful
                                            </div>
                                            <div className="w-full relative flex items-center justify-center gap-3">
                                                <div className="flex flex-col justify-center items-start gap-2">
                                                    <span className="text-B100 text-base font-medium">
                                                        {txhash && txhash.slice(0, 25) + "......" + txhash.slice(-8)}
                                                    </span>
                                                </div>
                                                <CopyButton copy={txhash} />
                                            </div>

                                            <div className="w-full break-words text-center text-base md:text-lg text-teal-500  font-semibold m-2">
                                                <span className="flex flex-col justify-center items-center gap-2">
                                                    <a
                                                        target="_blank"
                                                        href={buildTxHash(chainId?.toString(), txhash, false)}
                                                        className="cursor-pointer bg-teal-500 text-white rounded-lg px-5 py-1"
                                                    >
                                                        View on Explorer
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

            {/* Show all Btn */}
            <div className="w-full flex justify-center items-center">
                {positions.length > 4 && (
                    <button
                        onClick={toggleShowAll}
                        className="cursor-pointer px-3 py-1 md:text-base text-center rounded-lg transition duration-300 border border-B50 bg-N40 hover:bg-N50"
                    >
                        {showAll ? "Show Less" : "Show All"}
                    </button>
                )}
            </div>
        </>
    );
};

export default OneAsset;
