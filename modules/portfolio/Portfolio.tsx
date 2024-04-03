import Image from "next/image";
import Link from "next/link";

import { startCase } from "lodash";
import { useAddress } from "@thirdweb-dev/react";
import { iChainData, iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { ChainIdDetails } from "../../utils/data/network";
import { defaultBlue, metamask } from "../../assets/images";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { tPortfolio } from "./types";

import OneAsset from "./OneAsset";
import ChainSelection from "../../components/ChainSelection/ChainSelection";
import OneAssetSkeleton from "../../components/skeleton/OneAssetSkeleton";
import CopyButton from "../../components/common/CopyButton";

const Portfolio: React.FC<any> = ({
    smartAccountAddress,
    handleFetchPorfolioData,
    send,
    handleAmountIn,
}: tPortfolio) => {
    const { isSCW, chainData, isLoading, setIsSCW }: iPortfolio = usePortfolioStore((state) => state);
    const { smartAccount, scwBalance, eoaBalance, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const address = useAddress();

    return (
        <div className="w-full flex flex-col justify-center items-center gap-10 p-4">
            {smartAccountAddress && (
                <>
                    {/* Account Details */}
                    <div className="max-w-6xl w-full flex flex-row justify-between items-center gap-3 bg-N0 shadow-lg rounded-lg p-3">
                        <div className="w-full flex justify-between items-center gap-3 text-start ">
                            {/* User Image and total Worth of tokens */}
                            <div className="flex items-center gap-6">
                                <Image
                                    height={100}
                                    width={100}
                                    src={metamask}
                                    alt=""
                                    className="h-40 w-40 rounded-lg"
                                />
                                <div className="flex flex-col gap-3 p-2 text-transparent bg-clip-text bg-GR1">
                                    <h1 className=" text-4xl font-bold ">Total Networth</h1>
                                    {isLoading ? (
                                        <div className="animate-pulse bg-gray-300 h-6 w-full rounded-md"></div>
                                    ) : (
                                        <h1 className="text-4xl font-bold">
                                            $
                                            {chainData
                                                ?.reduce(
                                                    (acc: number, val?: { data?: { items?: { quote: number }[] } }) => {
                                                        if (val && val.data && val.data.items) {
                                                            return (
                                                                acc +
                                                                val.data.items.reduce(
                                                                    (subAcc: number, currentItem: { quote: number }) =>
                                                                        subAcc + currentItem.quote,
                                                                    0
                                                                )
                                                            );
                                                        }
                                                        return acc;
                                                    },
                                                    0
                                                )
                                                ?.toFixed(4)}
                                        </h1>
                                    )}
                                </div>
                            </div>

                            {/* Account Address */}
                            <div className="flex flex-col justify-start items-start gap-1 text-B100 font-bold text-2xl">
                                <div className="w-full h-40 flex flex-col justify-center items-start gap-6 text-B200 ">
                                    <button className="w-full relative flex justify-between items-center gap-3">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-B100 text-base font-medium">
                                                {smartAccount && smartAccountAddress}
                                            </span>
                                            <span className="text-B100 text-xs">
                                                {smartAccount &&
                                                    "SmartAccount : (" +
                                                        scwBalance +
                                                        " " +
                                                        `${
                                                            ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                ?.gasFeesName
                                                        }` +
                                                        ")"}
                                            </span>
                                        </div>
                                        <CopyButton copy={smartAccountAddress} />
                                    </button>
                                    <button className="w-full flex justify-between items-center gap-3">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-B100 text-base font-medium">
                                                {smartAccount && address}
                                            </span>
                                            <span className="text-B100 text-xs">
                                                {smartAccount &&
                                                    "EOA : (" +
                                                        eoaBalance +
                                                        " " +
                                                        `${
                                                            ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                ?.gasFeesName
                                                        }` +
                                                        ")"}
                                            </span>
                                        </div>
                                        <CopyButton copy={address} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="sticky h-[115px] top-0 z-20 max-w-6xl w-full flex flex-col justify-between gap-3 shadow-lg bg-N0 rounded-lg p-2">
                        <div className="md:flex gap-4 flex justify-between items-center">
                            <div className="hidden md:flex justify-center items-center gap-2 text-B100 text-lg bg-GR1 shadow-lg rounded-lg p-1">
                                <div
                                    className={`cursor-pointer px-3 py-1 text-sm md:text-base text-center rounded-lg ${
                                        !isSCW ? "hover:bg-N30" : ""
                                    } transition duration-300 ${isSCW ? "bg-N10" : "text-N20 hover:text-B100"} `}
                                    onClick={() => {
                                        setIsSCW(true);
                                        handleFetchPorfolioData();
                                    }}
                                >
                                    Smart Account
                                </div>
                                <div
                                    className={`cursor-pointer px-3 py-1 text-sm md:text-base text-center rounded-lg ${
                                        isSCW ? "hover:bg-N30" : ""
                                    } transition duration-300 ${!isSCW ? "bg-N10" : "text-N20 hover:text-B100"} `}
                                    onClick={() => {
                                        setIsSCW(false);
                                        handleFetchPorfolioData();
                                    }}
                                >
                                    EOA
                                </div>
                            </div>
                            <ChainSelection dropdown={true} />
                        </div>
                        <ChainSelection />
                    </div>

                    {isLoading ? (
                        <OneAssetSkeleton count={2} />
                    ) : (
                        <>
                            {chainData?.map((details, index) => (
                                <div
                                    key={index}
                                    className="max-w-6xl w-full bg-N0 flex flex-col justify-start items-start text-B200 rounded-3xl p-8 relative border border-B50"
                                >
                                    <div className="w-full flex justify-start items-center gap-3 text-start mb-4">
                                        {/* Network logo and name */}
                                        <Image
                                            height={100}
                                            width={100}
                                            src={details?.data?.items[0]?.logo_urls?.chain_logo_url || defaultBlue}
                                            alt=""
                                            className="h-12 w-12 rounded-full bg-N60"
                                        />
                                        {/* Network Aseet worth */}
                                        <div className="flex flex-col justify-start items-start gap-1 text-B100 font-bold text-2xl">
                                            <div>
                                                {startCase(details?.data?.chain_name)} · $
                                                {details?.data?.items
                                                    ?.reduce(
                                                        (i: number, currentValue: number) => i + currentValue.quote,
                                                        0
                                                    )
                                                    .toFixed(4)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Heading  */}
                                    <div className="sticky top-[114px] z-10 w-full bg-N0 flex justify-end items-center gap-3 text-xs md:text-sm text-B100 font-bold h-7">
                                        <div className="w-full text-start text-B300 font-semibold">ASSET</div>
                                        <div className="w-[25%] text-start">PRICE</div>
                                        <div className="w-[25%] text-start">BALANCE</div>
                                        <div className="w-[25%] text-start">VALUE</div>
                                        <div className="w-[3%]"></div>
                                    </div>

                                    <OneAsset
                                        details={details}
                                        send={send}
                                        handleAmountIn={handleAmountIn}
                                        currentChainId={details?.data?.chain_id}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}

            {/* No data or Wallet not connected */}
            {!chainData && !isLoading && smartAccountAddress ? (
                <div className="max-w-6xl w-full h-full flex flex-col justify-center items-center gap-5 rounded-3xl px-5 py-10 bg-N20 text-B200 shadow-xl">
                    {/* <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">
                        {selectedNetwork.chainId == "8453" ? "Base is not integrated for Portfolio." : ""}
                    </h1> */}
                    <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">No Data Found!</h1>
                    <h6 className="w-full text-xl md:text-2xl font-extrabold text-center">
                        <Link
                            href="/"
                            key="trade"
                            className="cursor-pointer px-8 py-1.5 text-sm md:text-base text-center rounded-full bg-W200 hover:bg-W100 transition duration-300"
                        >
                            Let&apos;s Trade
                        </Link>
                    </h6>
                </div>
            ) : (
                !smartAccountAddress && (
                    <div className="max-w-6xl w-full h-full flex flex-col justify-center items-center gap-5 rounded-3xl px-5 py-10 bg-N20 text-B200 shadow-xl">
                        <h1 className="w-full text-xl md:text-2xl font-extrabold text-center">
                            Please Conect Your Wallet
                        </h1>
                        <h6 className="w-full flex justify-center items-center gap-2 text-base md:text-lg font-semibold text-center">
                            For Track Your Portfolio
                        </h6>
                    </div>
                )
            )}
        </div>
    );
};

export default Portfolio;
