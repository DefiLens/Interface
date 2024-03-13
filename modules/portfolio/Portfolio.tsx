import Image from "next/image";
import { tPortfolio } from "./types";
import { ChainIdDetails } from "../../utils/data/network";
import { defaultBlue } from "../../assets/images";
import { startCase } from "lodash";
import { decreasePowerByDecimals } from "../../utils/helper";
import { BiLoaderAlt } from "react-icons/bi";
import Link from "next/link";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { IoIosRefresh } from "react-icons/io";

import { BigNumber as bg } from "bignumber.js";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import axios from "axios";
bg.config({ DECIMAL_PLACES: 5 });

const Portfolio: React.FC<any> = ({
    smartAccountAddress,
    handleFetchPorfolioData
}: tPortfolio) => {
    const address = useAddress();
    const { isSCW, setIsSCW, chainData, isLoading, error }: iPortfolio = usePortfolioStore((state) => state);
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);


    return (
        <div className="w-full flex flex-col justify-center items-center gap-10 p-5 sm:p-10 md:p-14 lg:p-20">


            {smartAccountAddress && !isLoading && (
                <div className="max-w-6xl w-full flex flex-row justify-between items-center gap-3">
                    <h1 className="md:text-primary-100 text-3xl font-bold">Your Assets</h1>
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
                </div>
            )}

            {chainData?.map((details: any) => (
                <div className="max-w-6xl w-full bg-backgound-300 flex flex-col justify-start items-start text-gray-300 border border-backgound-600 shadow shadow-backgound-600 rounded-3xl p-8">


                    <div className="w-full flex justify-start items-center gap-3 text-start mb-4">
                        <Image
                            height={100}
                            width={100}
                            src={details?.data?.items[0]?.logo_urls?.chain_logo_url ? details?.data?.items[0]?.logo_urls?.chain_logo_url : defaultBlue}
                            alt=""
                            className="h-12 w-12 rounded-full cursor-pointer"
                        />
                        <div className="flex flex-col justify-start items-start gap-1 text-primary-100 font-bold text-2xl">
                            <div>{startCase(details?.data?.chain_name)}  ·  ${details?.data?.items?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue.quote, 0).toFixed(4)}</div>
                        </div>
                    </div>

                    <div className="w-full flex justify-end items-center gap-3 text-xs md:text-sm text-primary-300 py-1">
                        <div className="w-full text-start text-primary-100 font-semibold">ASSET</div>
                        <div className="w-[25%] text-start">PRICE</div>
                        <div className="w-[25%] text-start">BALANCE</div>
                        <div className="w-[25%] text-start">VALUE</div>
                    </div>
                    {details?.data?.items?.map((item: any, i: any) => (
                        <div
                            key={item.contract_address}
                            className="w-full flex justify-end items-center gap-3 text-[13px] md:text-[15px] font-medium text-primary-100 py-4 border-t border-t-slate-700"
                        >
                            <div className="w-full flex justify-start items-center gap-3 text-start">
                                <Image
                                    height={100}
                                    width={100}
                                    src={item?.logo_urls.token_logo_url ? item?.logo_urls.token_logo_url : defaultBlue}
                                    alt=""
                                    className="h-10 w-10 rounded-full cursor-pointer"
                                />
                                <div className="flex flex-col justify-start items-start gap-1">
                                    <div>{item.contract_display_name}</div>
                                    <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                        <Image
                                            height={10}
                                            width={10}
                                            src={item?.logo_urls.chain_logo_url}
                                            alt=""
                                            className="h-4 w-4 rounded-full cursor-pointer"
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
                        </div>
                    ))}
                </div>
            ))}

            {isLoading ? (
                <div className="max-w-6xl w-full h-full flex flex-col justify-center items-center gap-5 rounded-3xl px-5 py-10 bg-backgound-300 text-font-100 border-backgound-600 shadow shadow-backgound-600">
                    <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">Feching User Tokens</h1>
                    <h6 className="w-full flex justify-center items-center gap-2 text-base md:text-lg font-semibold text-center">
                        Please Wait... <BiLoaderAlt className="animate-spin h-5 w-5" />
                    </h6>
                </div>
            ) : !chainData?.length && smartAccountAddress ? (
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
                !chainData?.length && (
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



            {/* {smartAccountAddress && !isUsersTokenLoading && (
                <div className="w-full flex flex-col justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-5">
                        <div
                            role="presentation"
                            onClick={() => setIsSCW(true)}
                            className="text-white font-bold text-lg md:text-xl cursor-pointer"
                        >
                            Smart Account
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!isSCW}
                                onClick={() => setIsSCW(!isSCW)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-backgound-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-backgound-800" />
                        </label>
                        <div
                            role="presentation"
                            onClick={() => setIsSCW(false)}
                            className="text-white font-bold text-lg md:text-xl cursor-pointer"
                        >
                            EOA
                        </div>
                    </div>
                    <div className="w-full bg-backgound-500 flex justify-between items-center gap-3 text-primary-100 border border-backgound-600 shadow shadow-backgound-600 rounded-lg px-8 py-2">
                        <div className="w-full flex justify-start items-center gap-3 text-lg md:text-xl font-extrabold text-primary-100">
                            Net Worth of {selectedNetwork.chainName} :
                            <span>
                                $ {totalNetworth.toString()}
                            </span>
                        </div>
                        {/* <div className="w-full flex justify-start items-center gap-3 text-lg md:text-xl font-extrabold text-primary-100">
                            Portfolio of {selectedNetwork.chainName}
                        </div> */}
            {/* <IoIosRefresh
                            onClick={() => handleFetchPorfolioData()}
                            className="h-10 w-10 px-2 cursor-pointer"
                        /> */}
            {/* </div>
                </div>
            )}
        

            {userTokensData?.length > 0 && (
                <div className="w-full bg-backgound-500 flex flex-col justify-start items-start gap-3 text-primary-100 border border-backgound-600 shadow shadow-backgound-600 rounded-lg p-8">
                    <div className="w-full text-lg md:text-xl font-extrabold text-primary-100">
                        <u>
                            {isSCW ? "Smart Account" : "EOA"} Wallet: {isSCW ? smartAccountAddress : address}
                        </u>
                    </div>
                    <div className="w-full flex justify-end items-center gap-2 text-lg md:text-xl font-extrabold text-primary-100 py-1 my-2 border-b border-b-backgound-900">
                        <div className="w-full text-start">Asset</div>
                        <div className="w-[25%] text-end">Price</div>
                        <div className="w-[25%] text-end">Balance</div>
                    </div>
                    {userTokensData.length > 0 &&
                        userTokensData
                            .filter((token: any) => token.type === "erc20Token")
                            .map((item: any, i: any) => (
                                <div
                                    key={item.tokenAddress}
                                    className="w-full flex justify-end items-center gap-2 text-sm md:text-base font-medium text-primary-100 py-1"
                                >
                                    <div className="w-full flex justify-start items-center gap-3 text-start">
                                        <Image
                                            height={100}
                                            width={100}
                                            src={item.logoURI ? item.logoURI : defaultBlue}
                                            alt=""
                                            className="h-10 w-10 rounded-full cursor-pointer"
                                        />
                                        <div className="flex flex-col justify-start items-start gap-1">
                                            <div>{item.name}</div>
                                            <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                                <Image
                                                    src={ChainIdDetails[item?.chainId].networkLogo}
                                                    alt=""
                                                    className="h-4 w-4 rounded-full cursor-pointer"
                                                />
                                                {startCase(ChainIdDetails[item?.chainId].networkName)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[25%] text-end">{item.price}</div>
                                    <div className="w-[25%] text-end">
                                        {decreasePowerByDecimals(bg(item.amount).toString(), item.decimals)}{" "}
                                        {item.symbol}
                                    </div>
                                </div>
                            ))}
                </div>
            )}

            {filteredDefiTokens.length > 0 &&
                filteredDefiTokens.map((subArray: any) => (
                    <div
                        key={subArray[0]?.protocol?.name}
                        className="w-full bg-backgound-500 flex flex-col justify-start items-start gap-3 text-primary-100 border border-backgound-600 shadow shadow-backgound-600 rounded-lg p-8"
                    >
                        <div className="w-full text-lg md:text-xl font-extrabold text-primary-100">
                            {startCase(subArray[0]?.protocol?.name)}
                        </div>
                        <div className="w-full flex justify-end items-center gap-2 text-lg md:text-xl font-extrabold text-primary-100 py-1 my-2 border-b border-b-backgound-900">
                            <div className="w-full text-start">Asset</div>
                            <div className="w-[25%] text-end">APY</div>
                            <div className="w-[30%] text-end">Category</div>
                            <div className="w-[25%] text-end">Price</div>
                            <div className="w-[25%] text-end">Balance</div>
                        </div>
                        {subArray.length > 0 &&
                            subArray.map((item: any) => (
                                <div
                                    key={item.name}
                                    className="w-full flex justify-end items-center gap-2 text-sm md:text-base font-medium text-primary-100 py-1"
                                >
                                    <div className="w-full flex justify-start items-center gap-3 text-start">
                                        <Image
                                            height={100}
                                            width={100}
                                            src={item?.protocol?.logo ? item?.protocol?.logo : defaultBlue}
                                            alt=""
                                            className="h-10 w-10 rounded-full cursor-pointer"
                                        />
                                        <div className="flex flex-col justify-start items-start gap-1">
                                            <div>{item.name}</div>
                                            <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                                <Image
                                                    src={ChainIdDetails[item?.protocol?.chainIds?.[0]].networkLogo}
                                                    alt=""
                                                    className="h-4 w-4 rounded-full cursor-pointer"
                                                />
                                                {startCase(ChainIdDetails[item?.protocol?.chainIds?.[0]].networkName)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[25%] text-end">{item?.apy !== 0 ? item?.apy : "-"}</div>
                                    <div className="w-[30%] text-end">{item?.protocol?.category}</div>
                                    <div className="w-[25%] text-end">{item.price} </div>
                                    <div className="w-[25%] text-end">
                                        {decreasePowerByDecimals(bg(item.amount).toString(), item.decimals)} {item.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                ))} */}
        </div>
    );
};

export default Portfolio;
