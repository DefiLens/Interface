// Library Imports
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { startCase } from "lodash";
import { useAddress } from "@thirdweb-dev/react";
import { LiaWalletSolid } from "react-icons/lia";
import CountUp from "react-countup";
import AvatarIcon from "./Avatar";
// Store, Util, Type Imports
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { ChainIdDetails } from "../../utils/data/network";
import { tPortfolio } from "./types";
import OneAsset from "./OneAsset";
import ChainSelection from "../../components/ChainSelection";
import OneAssetSkeleton from "../../components/skeleton/OneAssetSkeleton";
import CopyButton from "../../components/common/CopyButton";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { ConnectWalletWrapper } from "../../components/Button";
import Header from "../header/Header";

const Portfolio: React.FC<tPortfolio> = ({ smartAccountAddress, handleFetchPorfolioData, send, handleAmountIn }) => {
    const { isSCW, chainData, isLoading, setIsSCW }: iPortfolio = usePortfolioStore((state) => state);
    const { smartAccount, scwBalance, eoaBalance, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const address = useAddress();

    const getTotalNetworth = useMemo(() => {
        if (!chainData) return 0;
        return chainData
            ?.reduce(
                (
                    acc: number,
                    pos?: {
                        data?: {
                            attributes?: {
                                value: number;
                            };
                        }[];
                    }
                ) => {
                    if (pos && pos.data) {
                        return (
                            acc +
                            pos.data.reduce((subAcc, currentItem) => subAcc + (currentItem?.attributes?.value ?? 0), 0)
                        );
                    }
                    return acc;
                },
                0
            )
            .toFixed(4);
    }, [chainData]);

    return (
        <>
            <Header title="Portfolio" />
            <div className="w-full flex flex-col justify-center items-center gap-4">
                {smartAccountAddress && (
                    <>
                        {/* Account Details */}
                        <div className=" w-full flex flex-row justify-between items-center gap-3 bg-N0 shadow-lg rounded-lg px-2 py-3">
                            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-2 text-start">
                                {/* User Image and total Worth of tokens */}
                                <div className="flex flex-row items-center gap-2">
                                    <AvatarIcon address={address ?? ""} />
                                    <div className="flex flex-col gap-1 md:gap-3 p-2 text-transparent bg-clip-text bg-GR1">
                                        <h1 className="text-xl md:text-2xl font-bold">Total Networth</h1>
                                        {isLoading ? (
                                            <div className="animate-pulse bg-gray-300 h-7 w-full rounded-md" />
                                        ) : (
                                            <>
                                                {/* <h1 className="text-4xl md:text-5xl font-bold">${getTotalNetworth}</h1> */}
                                                <CountUp
                                                    start={0}
                                                    end={Number(getTotalNetworth)}
                                                    prefix="$"
                                                    decimals={4}
                                                    separator=","
                                                    duration={1.5}
                                                    delay={0}
                                                >
                                                    {({ countUpRef }) => (
                                                        <span
                                                            className="text-2xl md:text-3xl font-bold h-7"
                                                            ref={countUpRef}
                                                        />
                                                    )}
                                                </CountUp>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Account Address */}
                                <div className="w-full max-w-full sm:max-w-fit flex flex-col sm:flex-row lg:flex-row justify-center items-start gap-4 text-B200 font-bold">
                                    <div className="w-full relative flex justify-between items-center p-2 rounded bg-W100 gap-3">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-sm">Smart Account</span>
                                            <span className="text-B100 text-lg">
                                                {smartAccount &&
                                                    Number(scwBalance).toLocaleString("en-US") +
                                                        " " +
                                                        `${startCase(
                                                            ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                ?.gasFeesName
                                                        )}`}
                                            </span>
                                            <span className="text-B100 text-sm font-medium inline-flex items-center gap-1">
                                                {smartAccount &&
                                                    smartAccountAddress.slice(0, 8) +
                                                        "..." +
                                                        smartAccountAddress.slice(-8)}
                                                {/* <CopyButton copy={smartAccountAddress} /> */}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-between items-center p-2 rounded bg-W100 gap-3">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-sm">EOA</span>
                                            <span className="text-B100 text-lg">
                                                {smartAccount &&
                                                    Number(eoaBalance).toLocaleString("en-US") +
                                                        " " +
                                                        `${startCase(
                                                            ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                ?.gasFeesName
                                                        )}`}
                                            </span>
                                            <span className="text-B100 text-sm font-medium inline-flex items-center gap-1">
                                                {smartAccount && address?.slice(0, 8) + "..." + address?.slice(-8)}
                                                {/* <CopyButton copy={address ?? ""} /> */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        {/* <div className="sticky h-[115px] top-0 z-20  w-full flex flex-col justify-between gap-3 shadow-lg bg-N0 rounded-lg p-2 border-2 border-red-800"> */}
                        {/* <div className="h-[4rem] sticky top-0 z-10  w-full flex flex-col justify-center gap-3 shadow-lg bg-N0 rounded-lg p-2"> */}
                        <div className="h-[3.3rem] sticky -top-2 z-10  w-full flex flex-col justify-center gap-3 shadow-lg bg-N0 rounded-lg p-2">
                            {/* <div className="md:flex gap-4 flex justify-between items-center">
                            <div className="hidden md:flex justify-center items-center gap-2 text-B100 text-lg bg-GR1 shadow-lg rounded-lg p-1">
                                <button
                                    className={`cursor-pointer px-3 py-1 text-sm md:text-base text-center rounded-md ${
                                        !isSCW ? "hover:bg-N30" : ""
                                    } transition duration-300 ${isSCW ? "bg-N10" : "text-N20 hover:text-B100"} `}
                                    onClick={() => {
                                        setIsSCW(true);
                                        handleFetchPorfolioData();
                                    }}
                                >
                                    Smart Account
                                </button>
                                <button
                                    className={`cursor-pointer px-3 py-1 text-sm md:text-base text-center rounded-md ${
                                        isSCW ? "hover:bg-N30" : ""
                                    } transition duration-300 ${!isSCW ? "bg-N10" : "text-N20 hover:text-B100"} `}
                                    onClick={() => {
                                        setIsSCW(false);
                                        handleFetchPorfolioData();
                                    }}
                                >
                                    EOA
                                </button>
                            </div>
                            <ChainSelection dropdown={true} />
                        </div> */}
                            <ChainSelection />
                        </div>

                        {isLoading ? (
                            <OneAssetSkeleton count={2} />
                        ) : (
                            <>
                                {/* Mapping All the chains and their positions.  */}
                                {chainData?.map((portfolioData) => {
                                    const positions = portfolioData?.data?.filter(
                                        (position) => position.attributes.value > 0.0001
                                    );
                                    return (
                                        positions.length > 0 && (
                                            <div
                                                key={portfolioData.chainId}
                                                className=" w-full bg-N0 flex flex-col justify-start items-start text-B200 rounded-3xl p-4 relative border border-B50"
                                            >
                                                <div className="w-full flex justify-start items-center gap-2 text-start mb-2">
                                                    {/* Network logo and name */}
                                                    <div className="p-1 bg-N60 rounded-full">
                                                        <Image
                                                            height={34}
                                                            width={34}
                                                            src={`https://chain-icons.s3.amazonaws.com/chainlist/${portfolioData.chainId}`}
                                                            alt="Chain logo"
                                                            className="rounded-full"
                                                        />
                                                    </div>
                                                    {/* Network Asset worth */}
                                                    <div className="flex flex-col justify-start items-start gap-1 text-B100 font-bold text-lg">
                                                        <div>
                                                            {startCase(
                                                                portfolioData?.data[0].relationships.chain.data.id
                                                            )}{" "}
                                                            · $
                                                            {portfolioData?.data
                                                                ?.reduce(
                                                                    (i, currentValue) =>
                                                                        i + currentValue.attributes.value,
                                                                    0
                                                                )
                                                                .toFixed(4)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Heading  */}
                                                {/* <div className="sticky top-[4rem] z-10 w-full bg-N0 flex justify-end items-center gap-3 text-xs md:text-sm text-B75 font-bold h-7"> */}
                                                <div className="w-full bg-N0 flex justify-end items-center gap-3 text-xs text-B75 font-bold h-7">
                                                    <div className="w-full max-w-md text-start text-B300 font-semibold">
                                                        ASSET
                                                    </div>
                                                    <div className="w-full inline-flex items-center">
                                                        <div className="w-1/3 text-start">PRICE</div>
                                                        <div className="w-1/3 text-start">BALANCE</div>
                                                        <div className="w-1/3 text-start">VALUE</div>
                                                    </div>
                                                    {/* <div className="w-[3%]"></div> */}
                                                </div>

                                                <OneAsset
                                                    positions={positions}
                                                    send={send}
                                                    handleAmountIn={handleAmountIn}
                                                    currentChainId={portfolioData.chainId}
                                                />
                                            </div>
                                        )
                                    );
                                })}
                            </>
                        )}
                    </>
                )}

                {/* No data or Wallet not connected */}
                {!chainData && !isLoading && smartAccountAddress ? (
                    <div className="w-full h-full flex flex-col justify-center items-center gap-5 rounded-3xl px-5 py-10 bg-W100 text-B200">
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
                        <div className="w-full h-full flex flex-col justify-center items-center mt-5 gap-5 rounded-3xl px-5 py-20 bg-N20 text-B200 shadow-xl">
                            <LiaWalletSolid className="w-10 h-10 text-black" />
                            <ConnectWalletWrapper />
                            <h6 className="text-base md:text-lg font-bold text-center">To Track Portfolio</h6>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default Portfolio;
