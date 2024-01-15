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
bg.config({ DECIMAL_PLACES: 5 });

const Portfolio: React.FC<any> = ({
    isUsersTokenLoading,
    smartAccountAddress,
    userTokensData,
    filteredDefiTokens,
    handleFetchPorfolioData,
    totalNetWorth,
}: tPortfolio) => {
    const address = useAddress();
    const { isSCW, setIsSCW }: iPortfolio = usePortfolioStore((state) => state);
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    return (
        <div className="w-full flex flex-col justify-center items-center gap-10 p-5 sm:p-10 md:p-14 lg:p-20">
            {smartAccountAddress && !isUsersTokenLoading && (
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
                        {/* <div className="w-full flex justify-start items-center gap-3 text-lg md:text-xl font-extrabold text-primary-100">
                            Net Worth :
                            <span>
                                {decreasePowerByDecimals(totalNetWorth.toString(), 18)}
                            </span>
                        </div> */}
                        <div className="w-full flex justify-start items-center gap-3 text-lg md:text-xl font-extrabold text-primary-100">
                            Portfolio of {selectedNetwork.chainName}
                        </div>
                        <IoIosRefresh
                            onClick={() => handleFetchPorfolioData()}
                            className="h-10 w-10 px-2 cursor-pointer"
                        />
                    </div>
                </div>
            )}

            {isUsersTokenLoading ? (
                <div className="w-full h-full flex flex-col justify-center items-center gap-5 rounded-xl px-5 py-10 bg-backgound-500 text-font-100 border-backgound-600 shadow shadow-backgound-600">
                    <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">Feching User Tokens</h1>
                    <h6 className="w-full flex justify-center items-center gap-2 text-base md:text-lg font-semibold text-center">
                        Please Wait... <BiLoaderAlt className="animate-spin h-5 w-5" />
                    </h6>
                </div>
            ) : !userTokensData?.length && smartAccountAddress ? (
                <div className="w-full h-full flex flex-col justify-center items-center gap-5 rounded-xl px-5 py-10 bg-backgound-500 text-font-100 border-backgound-600 shadow shadow-backgound-600">
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
                !userTokensData?.length && (
                    <div className="w-full h-full flex flex-col justify-center items-center gap-5 rounded-xl px-5 py-10 bg-backgound-500 text-font-100 border-backgound-600 shadow shadow-backgound-600">
                        <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">
                            Please Conect Your Wallet
                        </h1>
                        <h6 className="w-full flex justify-center items-center gap-2 text-base md:text-lg font-semibold text-center">
                            For Track Your Portfolio
                        </h6>
                    </div>
                )
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
                        {/* <div className="w-[25%] text-end">
                            Price
                        </div> */}
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
                                    {/* <div className="w-[25%] text-end">
                                {decreasePowerByDecimals(bg(item.amount).toString(), 18)}
                            </div> */}
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
                            {/* <div className="w-[25%] text-end">
                        Price
                    </div> */}
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
                                    {/* <div className="w-[25%] text-end">
                            {decreasePowerByDecimals(bg(item.amount).toString(), item.decimals)}{" "}
                        </div> */}
                                    <div className="w-[25%] text-end">
                                        {decreasePowerByDecimals(bg(item.amount).toString(), item.decimals)} {item.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
        </div>
    );
};

export default Portfolio;
