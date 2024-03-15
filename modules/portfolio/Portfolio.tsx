import Image from "next/image";
import { tPortfolio } from "./types";
import { ChainIdDetails } from "../../utils/data/network";
import { change, defaultBlue, metamask } from "../../assets/images";
import { success, loading } from "../../assets/gifs";
import { startCase } from "lodash";
import { copyToClipboard, decreasePowerByDecimals, shorten } from "../../utils/helper";
import { BiLoaderAlt } from "react-icons/bi";
import Link from "next/link";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { IoIosRefresh } from "react-icons/io";

import { BigNumber as bg } from "bignumber.js";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "@thirdweb-dev/react";
import { FiCopy } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import useClickOutside from "../../hooks/useClickOutside";
import Transfer from "../transfer/Transfer";
import TransferContainer from "../transfer/TransferContainer";
import { iTransfer, useTransferStore } from "../../store/TransferStore";
import { BigNumber } from "ethers";
import { RxCross2 } from "react-icons/rx";
import Button from "../../components/Button/Button";
import { BsArrowRight } from "react-icons/bs";
import toast from "react-hot-toast";

bg.config({ DECIMAL_PLACES: 5 });

interface Chain {
    chainName: string;
    chainId: number;
}

interface ChainSelectionProps {
    onChange: (chainId: number) => void;
}

const ChainSelection: React.FC<ChainSelectionProps> = () => {
    const { chainId, setChainId }: iPortfolio = usePortfolioStore((state) => state);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setChainId(selectedId);
    };

    const chains: Chain[] = [
        { chainName: "All", chainId: 0 }, // All Chains
        { chainName: "Polygon", chainId: 137 }, // Polygon (Matic)
        { chainName: "Ethereum", chainId: 1 }, // Ethereum
        { chainName: "Base", chainId: 8453 }, // Base
        { chainName: "Optimism", chainId: 10 }, // Optimism
        { chainName: "Avalanche", chainId: 43114 }, // Avalanche
        { chainName: "Arbitrum", chainId: 42161 }, // Arbitrum
    ];

    return (
        <div
            className=" text-primary-100 text-lg bg-backgound-300 rounded-lg px-2 cursor-pointer"
        >
            <select
                value={chainId}
                onChange={handleSelectChange}
                className="bg-backgound-300 py-2 cursor-pointer outline-none"
            >
                {chains.map((chain) => (
                    <option
                        key={chain.chainId}
                        value={chain.chainId}
                        className="bg-backgound-300 py-2 px-4 border-none rounded-lg"
                    >
                        {chain.chainName}
                    </option>
                ))}
            </select>
        </div>

    );
};

const OneAsset: React.FC<any> = ({ details, send, handleAmountIn }) => {
    const { isSCW, setIsSCW, selectOneAsset, setSelectOneAsset, amountIn, setAmountIn, amountInDecimals, sendTxLoading, txhash }: iPortfolio = usePortfolioStore((state) => state);
    const { smartAccount, smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };


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
                        <div className="w-[3%]" title="Migrate Assets">
                            <BiDotsVerticalRounded
                                size="30px"
                                className="text-font-100 active:text-font-300 p-1 hover:bg-backgound-700 rounded-md cursor-pointer"
                                onClick={() => setSelectOneAsset(item)}
                            />
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
                                                    onClick={() => setShowWalletBtn(item)}
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

                                    {/* {sendTxLoading &&
                                        <div className="w-full flex flex-col justify-center items-center gap-3 p-3">
                                            <Image
                                                height={100}
                                                width={100}
                                                src={loading}
                                                alt=""
                                                className="h-30 w-30 rounded-full"
                                            />
                                            <div className="flex flex-col justify-center items-center gap-1 text-primary-100 font-bold text-xl text-center">
                                                <p>Loading...</p>
                                                <p>Your Transaction is in process</p>
                                            </div>
                                        </div>
                                    } */}
                                    {/* {txhash && !sendTxLoading && (
                                        <div className="w-full flex flex-col justify-center items-center gap-3 p-3">
                                            <Image
                                                height={100}
                                                width={100}
                                                src={success}
                                                alt=""
                                                className="h-30 w-30 rounded-full"
                                            />

                                            <div className="text-font-100 flex flex-wrap justify-start items-center gap-3 text-base">
                                                <FiCopy onClick={() => copyToClipboard(txhash, "Transaction Hash Copied")} />
                                                <p>TxHash : {shorten(txhash)}</p>
                                            </div>
                                        </div>
                                    )} */}

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


const Portfolio: React.FC<any> = ({
    smartAccountAddress,
    handleFetchPorfolioData,
    send,
    handleAmountIn
}: tPortfolio) => {
    const address = useAddress();
    const { isSCW, setIsSCW, chainData, isLoading, error, chainId, setChainId }: iPortfolio = usePortfolioStore((state) => state);
    const {
        smartAccount,
        scwBalance,
        eoaBalance,
        selectedNetwork,
    }: iGlobal = useGlobalStore((state) => state);

    return (
        <div className="w-full flex flex-col justify-center items-center gap-10 p-4">


            {smartAccountAddress && !isLoading && (
                <>

                    <div className="max-w-6xl w-full flex flex-row justify-between items-center gap-3">
                        <div className="w-full flex justify-start items-center gap-3 text-start mb-4">
                            <div>
                                <Image
                                    height={100}
                                    width={100}
                                    src={metamask}
                                    alt=""
                                    className="h-40 w-40 rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start gap-1 text-primary-100 font-bold text-2xl">
                                <div
                                    className="w-full h-40 flex flex-col justify-center items-start gap-6 bg-backgound-200 border-2 border-backgound-500 shadow-md shadow-backgound-100 p-3 rounded-lg"
                                >
                                    <button className="w-full relative flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-font-100 text-base font-medium">
                                                {smartAccount && smartAccountAddress}
                                            </span>
                                            <span className="text-font-300 text-xs">
                                                {smartAccount &&
                                                    "SmartAccount : (" +
                                                    scwBalance +
                                                    " " +
                                                    `${ChainIdDetails[selectedNetwork.chainId.toString()]
                                                        ?.gasFeesName
                                                    }` +
                                                    ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() =>
                                                copyToClipboard(smartAccountAddress, "Smart account address Copied")
                                            }
                                        />
                                    </button>
                                    <button className="w-full flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-font-100 text-base font-medium">
                                                {smartAccount && address}
                                            </span>
                                            <span className="text-font-300 text-xs">
                                                {smartAccount &&
                                                    "EOA : (" +
                                                    eoaBalance +
                                                    " " +
                                                    `${ChainIdDetails[selectedNetwork.chainId.toString()]
                                                        ?.gasFeesName
                                                    }` +
                                                    ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() => copyToClipboard(address, "EOA address Copied")}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sticky h-[60px] top-0 z-20 max-w-6xl w-full flex flex-row justify-between items-center gap-3 bg-backgound-100 py-2 px-3">
                        <h1 className="md:text-primary-100 text-2xl font-bold">Your Total Networth{"  "}·{"  "}
                            ${chainData?.reduce((acc: number, val?: { data?: { items?: { quote: number }[] } }) => {
                                if (val && val.data && val.data.items) {
                                    return acc + val.data.items.reduce((subAcc: number, currentItem: { quote: number }) => subAcc + currentItem.quote, 0);
                                }
                                return acc;
                            }, 0)?.toFixed(4)}
                        </h1>

                        <div className="md:flex gap-4">
                            <div className="hidden md:flex justify-center items-center gap-2 text-primary-100 text-lg bg-backgound-300 rounded-lg p-1">
                                <div
                                    className={`cursor-pointer px-3 py-1 text-sm md:text-base text-center rounded-lg ${!isSCW ? "hover:bg-backgound-500" : ""} transition duration-300 ${isSCW ? "bg-backgound-100" : ""} `}
                                    onClick={() => {
                                        setIsSCW(true)
                                        handleFetchPorfolioData()
                                    }}
                                >
                                    Smart Account
                                </div>
                                <div
                                    className={`cursor-pointer px-3 py-1 text-sm md:text-base text-center rounded-lg ${isSCW ? "hover:bg-backgound-500" : ""} transition duration-300 ${!isSCW ? "bg-backgound-100" : ""} `}
                                    onClick={() => {
                                        setIsSCW(false)
                                        handleFetchPorfolioData()
                                    }}
                                >
                                    EOA
                                </div>
                            </div>
                            <ChainSelection />
                        </div>
                    </div>
                    {chainData?.map((details: any) => (
                        <div className="max-w-6xl w-full bg-backgound-300 flex flex-col justify-start items-start text-gray-300 rounded-3xl p-8 relative">

                            <div className="w-full flex justify-start items-center gap-3 text-start mb-4">
                                <Image
                                    height={100}
                                    width={100}
                                    src={details?.data?.items[0]?.logo_urls?.chain_logo_url || defaultBlue}
                                    alt=""
                                    className="h-12 w-12 rounded-full"
                                />
                                <div className="flex flex-col justify-start items-start gap-1 text-primary-100 font-bold text-2xl">
                                    <div>{startCase(details?.data?.chain_name)}  ·  ${details?.data?.items?.reduce((i: number, currentValue: number) => i + currentValue.quote, 0).toFixed(4)}</div>
                                </div>
                            </div>

                            <div className="sticky top-[60px] z-10 w-full bg-backgound-300 flex justify-end items-center gap-3 text-xs md:text-sm text-primary-300 h-7">
                                <div className="w-full text-start text-primary-100 font-semibold">ASSET</div>
                                <div className="w-[25%] text-start">PRICE</div>
                                <div className="w-[25%] text-start">BALANCE</div>
                                <div className="w-[25%] text-start">VALUE</div>
                                <div className="w-[3%]"></div>
                            </div>

                            <OneAsset details={details} send={send} handleAmountIn={handleAmountIn} />
                        </div>
                    ))}
                </>
            )}



            {isLoading ? (
                <div className="max-w-6xl w-full h-full flex flex-col justify-center items-center gap-5 rounded-3xl px-5 py-10 bg-backgound-300 text-font-100 border-backgound-600 shadow shadow-backgound-600">
                    <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">Feching User Tokens</h1>
                    <h6 className="w-full flex justify-center items-center gap-2 text-base md:text-lg font-semibold text-center">
                        Please Wait... <BiLoaderAlt className="animate-spin h-5 w-5" />
                    </h6>
                </div>
            ) : !chainData && smartAccountAddress ? (
                <div className="max-w-6xl w-full h-full flex flex-col justify-center items-center gap-5 rounded-3xl px-5 py-10 bg-backgound-300 text-font-100 border-backgound-600 shadow shadow-backgound-600">
                    <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">
                        {selectedNetwork.chainId == "8453" ? "Base is not integrated for Portfolio." : ""}
                    </h1>
                    <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">No Data Found!</h1>
                    <h6 className="w-full text-xl md:text-2xl font-extrabold text-center">
                        <Link
                            href="/"
                            key="trade"
                            className="cursor-pointer px-8 py-1.5 text-sm md:text-base text-center rounded-full bg-backgound-600 hover:bg-backgound-700 transition duration-300"
                        >
                            Let&apos;s Trade
                        </Link>
                    </h6>
                </div>
            ) : (
                !smartAccountAddress && (
                    <div className="max-w-6xl w-full h-full flex flex-col justify-center items-center gap-5 rounded-3xl px-5 py-10 bg-backgound-300 text-font-100 border-backgound-600 shadow shadow-backgound-600">
                        <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">
                            Please Conect Your Wallet
                        </h1>
                        <h6 className="w-full flex justify-center items-center gap-2 text-base md:text-lg font-semibold text-center">
                            For Track Your Portfolio
                        </h6>
                    </div>
                )
            )}

        </div >
    );
};

export default Portfolio;
