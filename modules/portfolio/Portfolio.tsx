import Image from "next/image";
import Link from "next/link";
import { startCase } from "lodash";
import { useAddress } from "@thirdweb-dev/react";

import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { copyToClipboard } from "../../utils/helper";
import { ChainIdDetails } from "../../utils/data/network";
import { defaultBlue, metamask } from "../../assets/images";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";

import { BiLoaderAlt } from "react-icons/bi";
import { FiCopy } from "react-icons/fi";

import { tPortfolio } from "./types";
import ChainSelection from "../../components/ChainSelection/ChainSelection";
import OneAsset from "./OneAsset";

const Portfolio: React.FC<any> = ({
    smartAccountAddress,
    handleFetchPorfolioData,
    send,
    handleAmountIn
}: tPortfolio) => {
    const address = useAddress();
    const {
        isSCW,
        chainData,
        isLoading,
        setIsSCW
    }: iPortfolio = usePortfolioStore((state) => state);
    const {
        smartAccount,
        scwBalance,
        eoaBalance,
        selectedNetwork
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

                            <OneAsset details={details} send={send} handleAmountIn={handleAmountIn} currentChainId={details?.data?.chain_id}/>
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
