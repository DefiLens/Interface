import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import Button from "../../components/Button/Button";
import { copyToClipboard, decreasePowerByDecimals, shorten } from "../../utils/helper";
import { useChainId } from "@thirdweb-dev/react";

import { BiDotsVerticalRounded } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { BsArrowRight } from "react-icons/bs";
import { useState } from "react";
import Image from "next/image";
import { defaultBlue } from "../../assets/images";
import { BigNumber } from "ethers";
import { BigNumber as bg } from "bignumber.js";
import { tOneAsset } from "./types";
import { FiCopy } from "react-icons/fi";

const OneAsset: React.FC<tOneAsset> = ({ positions, send, handleAmountIn, currentChainId }) => {
    const { isSCW, selectOneAsset, setSelectOneAsset, amountInDecimals, sendTxLoading, txhash }: iPortfolio =
        usePortfolioStore((state) => state);
    const { smartAccount }: iGlobal = useGlobalStore((state) => state);

    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };
    const chainId = useChainId();

    return (
        <>
            {positions
                ?.sort((a, b) => b.quote - a.quote)
                .slice(0, showAll ? undefined : 4)
                .map((item) => (
                    <div
                        key={item.contract_address}
                        className="w-full flex justify-end items-center gap-3 text-[13px] md:text-[15px] font-medium text-B200 py-4 border-t border-B50"
                    >
                        <div className="w-full flex justify-start items-center gap-3 text-start">
                            {/* Token logo */}
                            <Image
                                height={100}
                                width={100}
                                src={item?.logo_url || defaultBlue}
                                alt=""
                                className="h-10 w-10 rounded-full bg-N60"
                            />
                            <div className="flex flex-col justify-start items-start gap-1">
                                {/* Token Name */}
                                <div>{item.contract_display_name}</div>
                                {/* Chain logo and name */}
                                <div className="inline-flex justify-start items-center gap-1 text-xs text-font-500">
                                    <p className="text-gray-500">Protocol</p> |
                                    <p className="bg-gray-100 text-gray-500 rounded-md px-[6px] py-[2px]">
                                        isDeposited
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-[25%] text-start">{item.quote_rate && `$${item.quote_rate}`}</div>
                        <div className="w-[25%] text-start">
                            {Number(
                                decreasePowerByDecimals(bg(item.balance).toString(), item.contract_decimals)
                            ).toLocaleString("en-US")}{" "}
                            {item.contract_ticker_symbol}
                        </div>
                        <div className="w-[25%] text-start text-success-600">
                            {item.quote && `$${Number(item.quote).toLocaleString("en-US")}`}
                        </div>
                        <div className="w-[3%]">
                            {chainId === currentChainId && (
                                <div className="group flex justify-center transition-all p-1 hover:bg-N40 rounded-md cursor-pointer">
                                    <BiDotsVerticalRounded
                                        size="30px"
                                        className="text-B100"
                                        onClick={() => setSelectOneAsset(item)}
                                    />
                                    <span className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-3 duration-700 text-sm whitespace-nowrap">
                                        Migrate Asset
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Modal */}
                        {selectOneAsset === item && (
                            <>
                                <div
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-N0 border-1 border-B75 p-3 rounded-lg transition duration-300 shadow-lg"
                                    style={{ minWidth: "30%", minHeight: "30%" }}
                                >
                                    {smartAccount && (
                                        <div className="w-full flex flex-col justify-center items-center gap-3">
                                            {/* Heading and close btn */}
                                            <div className="w-full flex justify-between items-center gap-3 text-start mb-4">
                                                <h3 className="font-semibold text-lg md:text-2xl text-B200 p-1">
                                                    Migrate Asset
                                                </h3>
                                                <RxCross2
                                                    size="32px"
                                                    className="text-B200 active:text-B200 p-1 hover:bg-N60 rounded-md cursor-pointer"
                                                    onClick={() => setSelectOneAsset(null)}
                                                />
                                            </div>

                                            {/* Token name and Image */}
                                            <div className="w-full flex justify-center items-center gap-3 text-start mb-4">
                                                <Image
                                                    height={100}
                                                    width={100}
                                                    src={item?.logo_urls.token_logo_url || defaultBlue}
                                                    alt=""
                                                    className="h-12 w-12 rounded-full bg-N60"
                                                />
                                                <div className="flex flex-col justify-start items-start gap-1 text-B100 font-bold text-2xl">
                                                    <div>{item?.contract_display_name}</div>
                                                </div>
                                            </div>

                                            {/* To show transferring from which account */}
                                            <div className="w-full lg:w-[100%] flex flex-col sm:flex-row justify-center items-center gap-5 md:gap-10 bg-GR1 p-5 rounded-md">
                                                <div className="w-auto md:w-40 flex justify-center items-baseline gap-3">
                                                    <span className="font-bold text-xs text-N20">From</span>
                                                    <span className="font-bold text-xl text-N0">
                                                        {isSCW ? "SCW" : "EOA"}
                                                    </span>
                                                </div>

                                                <BsArrowRight size="25px" className="text-N0" />

                                                <div className="w-auto md:w-40 flex justify-center items-baseline gap-3">
                                                    <span className="font-bold text-xs text-N20">To</span>
                                                    <span className="font-bold text-xl text-N0">
                                                        {isSCW ? "EOA" : "SCW"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-[100%] flex flex-col justify-center items-center gap-3 my-1">
                                                <div className="w-full">
                                                    {/* Show current balance */}
                                                    <div className="flex justify-end items-center gap-2 font-semibold text-xs md:text-sm p-1">
                                                        {isSCW ? (
                                                            <div className="text-B100 text-sm">
                                                                SmartAccount Balance :
                                                                <span className="font-bold text-B100 text-base px-1">
                                                                    {decreasePowerByDecimals(
                                                                        BigNumber.from(
                                                                            selectOneAsset.balance
                                                                        ).toString(),
                                                                        selectOneAsset.contract_decimals
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-B100 text-sm">
                                                                EOA Balance :
                                                                <span className="font-bold text-B100 text-base px-1">
                                                                    {decreasePowerByDecimals(
                                                                        BigNumber.from(
                                                                            selectOneAsset.balance
                                                                        ).toString(),
                                                                        selectOneAsset.contract_decimals
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Take amount of tokens as input */}
                                                    <div className="w-full flex justify-start items-center gap-1 bg-N0 text-B100 border border-B75 rounded-lg overflow-hidden mt-1 px-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Amount"
                                                            className="w-full bg-transparent text-B100 font-extrabold text-xl outline-none shadow-outline p-3 pr-5 block appearance-none leading-normal"
                                                            value={amountInDecimals}
                                                            onChange={(e: any) => handleAmountIn(e.target.value)}
                                                        />

                                                        {/* Btn to take input max balance */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAmountIn(
                                                                    decreasePowerByDecimals(
                                                                        BigNumber.from(
                                                                            selectOneAsset.balance
                                                                        ).toString(),
                                                                        selectOneAsset.contract_decimals
                                                                    )
                                                                )
                                                            }
                                                            className="w-20 text-center font-bold text-S600 bg-[rgba(109,223,255,.4)] rounded-lg py-1"
                                                        >
                                                            Max
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Btn to trasnfer funds */}
                                            <Button
                                                handleClick={() => send()}
                                                disabled={sendTxLoading}
                                                isLoading={sendTxLoading}
                                                customStyle="sm:w-[100%] mt-4"
                                                innerText={
                                                    isSCW ? "Send SmartAccount to EOA" : "Send EOA to SmartAccount"
                                                }
                                            />

                                            {/* Show TxHash when tx. completes */}
                                            {txhash && (
                                                <div className="text-font-100 flex flex-wrap justify-start items-center gap-3 text-base">
                                                    <FiCopy
                                                        onClick={() =>
                                                            copyToClipboard(txhash, "Transaction Hash Copied")
                                                        }
                                                    />
                                                    <p>TxHash : {shorten(txhash)}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Modal Backdrop */}
                                <div
                                    onClick={() => setSelectOneAsset(null)}
                                    className="fixed top-0 left-0 z-40 w-screen h-screen bg-[rgba(0,0,0,0.4)] transition duration-300"
                                ></div>
                            </>
                        )}
                    </div>
                ))}

            {/* Show all btn */}
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
