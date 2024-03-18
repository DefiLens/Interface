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



const OneAsset: React.FC<any> = ({ details, send, handleAmountIn, currentChainId }: tPortfolio) => {
    const { isSCW, selectOneAsset, setSelectOneAsset, amountInDecimals, sendTxLoading, txhash }: iPortfolio = usePortfolioStore((state) => state);
    const { smartAccount }: iGlobal = useGlobalStore((state) => state);

    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };
    const chainId = useChainId();

    return (
        <>
            {details?.data?.items?.sort((a: any, b: any) => b.quote - a.quote)
                .slice(0, showAll ? undefined : 4).map((item: any) => (
                    <div
                        key={item.contract_address}
                        className="w-full flex justify-end items-center gap-3 text-[13px] md:text-[15px] font-medium text-primary-100 py-4 border-t border-t-slate-700"
                    >
                        <div className="w-full flex justify-start items-center gap-3 text-start">
                            <Image
                                height={100}
                                width={100}
                                src={item?.logo_urls.token_logo_url || defaultBlue}
                                alt=""
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="flex flex-col justify-start items-start gap-1">
                                <div>{item.contract_display_name}</div>
                                <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                    <Image
                                        height={10}
                                        width={10}
                                        src={item?.logo_urls.chain_logo_url}
                                        alt=""
                                        className="h-4 w-4 rounded-full"
                                    />
                                    {details?.data?.chain_name}
                                </div>
                            </div>
                        </div>
                        <div className="w-[25%] text-start">{item.quote_rate && `$${item.quote_rate}`}</div>
                        <div className="w-[25%] text-start">
                            {decreasePowerByDecimals(bg(item.balance).toString(), item.contract_decimals)}{" "}
                            {item.contract_ticker_symbol}
                        </div>
                        <div className="w-[25%] text-start text-success-600">{item.quote && `$${item.quote.toFixed(5)}`}</div>
                        <div className="w-[3%]">
                            {chainId === currentChainId &&
                                <BiDotsVerticalRounded
                                    title="Migrate Assets"
                                    size="30px"
                                    className="text-font-100 active:text-font-300 p-1 hover:bg-backgound-700 rounded-md cursor-pointer"
                                    onClick={() => setSelectOneAsset(item)}
                                />
                            }
                        </div>
                        {selectOneAsset === item && (
                            <>
                                <div
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-backgound-600 border-2 border-backgound-500 shadow-md shadow-backgound-100 p-3 rounded-lg transition duration-300"
                                    style={{ minWidth: '30%', minHeight: '30%' }}
                                >
                                    {smartAccount && (
                                        <div className="w-full flex flex-col justify-center items-center gap-3">
                                            <div className="w-full flex justify-between items-center gap-3 text-start mb-4">
                                                <h3 className="font-semibold text-lg md:text-2xl text-font-100 p-1">Migrate Asset</h3>
                                                <RxCross2
                                                    size="32px"
                                                    className="text-font-100 active:text-font-300 p-1 hover:bg-backgound-700 rounded-md cursor-pointer"
                                                    onClick={() => setSelectOneAsset(null)}
                                                />
                                            </div>

                                            <div className="w-full flex justify-center items-center gap-3 text-start mb-4">
                                                <Image
                                                    height={100}
                                                    width={100}
                                                    src={item?.logo_urls.token_logo_url || defaultBlue}
                                                    alt=""
                                                    className="h-12 w-12 rounded-full"
                                                />
                                                <div className="flex flex-col justify-start items-start gap-1 text-primary-100 font-bold text-2xl">
                                                    <div>{item?.contract_display_name}</div>
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-[100%] flex flex-col sm:flex-row justify-center items-center gap-5 md:gap-10 bg-backgound-200 text-font-100 p-5 rounded-md">
                                                <div className="w-auto md:w-40 flex justify-center items-baseline gap-3">
                                                    <span className="font-bold text-xs text-font-300">From</span>
                                                    <span className="font-bold text-xl text-font-100">{isSCW ? "SCW" : "EOA"}</span>
                                                </div>

                                                <BsArrowRight
                                                    size="25px"
                                                />

                                                <div className="w-auto md:w-40 flex justify-center items-baseline gap-3">
                                                    <span className="font-bold text-xs text-font-300">To</span>
                                                    <span className="font-bold text-xl text-font-100">{isSCW ? "EOA" : "SCW"}</span>
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-[100%] flex flex-col justify-center items-center gap-3 my-1">
                                                <div className="w-full">
                                                    <div className="flex justify-end items-center gap-2 text-font-100 font-semibold text-xs md:text-sm p-1">
                                                        {isSCW ? (
                                                            <div className="text-font-300 text-sm">
                                                                SmartAccount Balance :
                                                                <span className="font-bold text-font-100 text-base px-1">
                                                                    {decreasePowerByDecimals(
                                                                        BigNumber.from(selectOneAsset.balance).toString(),
                                                                        selectOneAsset.contract_decimals
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-font-300 text-sm">
                                                                EOA Balance :
                                                                <span className="font-bold text-font-100 text-base px-1">
                                                                    {decreasePowerByDecimals(
                                                                        BigNumber.from(selectOneAsset.balance).toString(),
                                                                        selectOneAsset.contract_decimals
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-full flex justify-start items-center gap-1 bg-backgound-200 text-font-1100 border border-backgound-600 rounded-lg overflow-hidden mt-1 px-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Amount"
                                                            className="w-full bg-backgound-200 text-font-100 font-extrabold text-xl outline-none shadow-outline p-3 pr-5 block appearance-none leading-normal"
                                                            value={amountInDecimals}
                                                            onChange={(e: any) => handleAmountIn(e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAmountIn(
                                                                    decreasePowerByDecimals(
                                                                        BigNumber.from(selectOneAsset.balance).toString(),
                                                                        selectOneAsset.contract_decimals
                                                                    )
                                                                )
                                                            }
                                                            className="w-20 font-bold text-center text-font-100 bg-button-100 rounded-lg py-1"
                                                        >
                                                            Max
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                handleClick={() => send()}
                                                disabled={sendTxLoading}
                                                isLoading={sendTxLoading}
                                                customStyle="sm:w-[100%] mt-4"
                                                innerText={isSCW ? "Send SmartAccount to EOA" : "Send EOA to SmartAccount"}
                                            />

                                            {txhash && (
                                                <div className="text-font-100 flex flex-wrap justify-start items-center gap-3 text-base">
                                                    <FiCopy onClick={() => copyToClipboard(txhash, "Transaction Hash Copied")} />
                                                    <p>TxHash : {shorten(txhash)}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>

                                <div
                                    onClick={() => setSelectOneAsset(null)}
                                    className="fixed top-0 left-0 z-40 w-screen h-screen bg-[rgba(0,0,0,0.4)] transition duration-300"></div>
                            </>
                        )}
                    </div >
                ))}
            <div className="w-full flex justify-center items-center">
                {details?.data?.items?.length > 5 && (
                    <button onClick={toggleShowAll} className="cursor-pointer px-3 py-1 md:text-base text-center rounded-lg hover:bg-backgound-500 transition duration-300 bg-backgound-100">
                        {showAll ? 'Show Less' : 'Show All'}
                    </button>
                )}
            </div>
        </>
    )
}

export default OneAsset;