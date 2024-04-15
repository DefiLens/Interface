import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { startCase } from "lodash";
import { useAddress } from "@thirdweb-dev/react";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { ChainIdDetails } from "../../utils/data/network";
import { defaultBlue, metamask } from "../../assets/images";
import { tPortfolio, tTxnHistory } from "./types";

import OneAsset from "./OneAsset";
import ChainSelection from "../../components/ChainSelection";
import OneAssetSkeleton from "../../components/skeleton/OneAssetSkeleton";
import CopyButton from "../../components/common/CopyButton";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import axiosInstance from "../../axiosInstance/axiosInstance";

const SampleDataGenerator = () => {
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    const [generated, setGenerated] = useState(false);

    const generateSampleData = async () => {
        // Generate sample individual batch data
        const individualBatch = [
            {
                data: {
                    amountIn: "1.78",
                    fromNetwork: "polygon",
                    toNetwork: "polygon",
                    fromProtocol: "erc20",
                    toProtocol: "aaveV2",
                    fromToken: "MATIC",
                    toToken: "aUSDC",
                },
            },
            {
                data: {
                    amountIn: "2.7",
                    fromNetwork: "polygon",
                    toNetwork: "polygon",
                    fromProtocol: "erc20",
                    toProtocol: "aaveV3",
                    fromToken: "MATIC",
                    toToken: "aUSDC",
                },
            },
        ];

        // Generate sample txhash
        const txhash = "0x89f506005163bef5aaab61cc3f1b47942a0ed0a66f5019b85a7b93df377bf4g4g4";

        // Create txHistory object
        const txHistory = {
            transactions: individualBatch.map((item) => ({
                amountIn: item.data.amountIn,
                fromNetwork: item.data.fromNetwork,
                toNetwork: item.data.toNetwork,
                fromProtocol: item.data.fromProtocol,
                toProtocol: item.data.toProtocol,
                fromToken: item.data.fromToken,
                toToken: item.data.toToken,
                txHash: txhash,
            })),
            smartAccount: smartAccountAddress, // Replace with actual smart account data
        };

        try {
            // Call the API with the generated data
            await handleTxnHistory(txHistory);

            // Set generated state to true
            setGenerated(true);
        } catch (error) {
            console.error("Error generating sample data:", error);
        }
    };

    // Saving txnHistory to dB
    const handleTxnHistory = async (txHistory: tTxnHistory) => {
        try {
            await axiosInstance.post("/transactions", txHistory);
        } catch (error) {
            console.error("Error sending data to backend:", error);
            throw error; 
        }
    };

    return (
        <div>
            <button onClick={generateSampleData} disabled={generated}>
                {generated ? "Sample Data Generated" : "Generate Sample Data"}
            </button>
        </div>
    );
};

const Portfolio: React.FC<tPortfolio> = ({ smartAccountAddress, handleFetchPorfolioData, send, handleAmountIn }) => {
    const { isSCW, chainData, isLoading, setIsSCW }: iPortfolio = usePortfolioStore((state) => state);
    const { smartAccount, scwBalance, eoaBalance, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const address = useAddress();

    const getTotalNetworth = useMemo(() => {
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
                                    <Link href="/portfolio/batch-history" className="">
                                        See Batch History
                                    </Link>
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
                                        <CopyButton copy={address ?? ""} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="sticky h-[115px] top-0 z-20 max-w-6xl w-full flex flex-col justify-between gap-3 shadow-lg bg-N0 rounded-lg p-2">
                        <div className="md:flex gap-4 flex justify-between items-center">
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
                        </div>
                        <ChainSelection />
                    </div>

                    {isLoading ? (
                        <OneAssetSkeleton count={2} />
                    ) : (
                        <>
                            {/* Mapping All the chains and their positions.  */}
                            {chainData?.map((portfolioData) => {
                                const positions = portfolioData?.data?.filter(
                                    (position) => position.attributes.value > 0.001
                                );
                                return (
                                    positions.length > 0 && (
                                        <div
                                            key={portfolioData.chainId}
                                            className="max-w-6xl w-full bg-N0 flex flex-col justify-start items-start text-B200 rounded-3xl p-8 relative border border-B50"
                                        >
                                            <div className="w-full flex justify-start items-center gap-3 text-start mb-4">
                                                {/* Network logo and name */}
                                                <div className="p-1.5 bg-N60 rounded-full">
                                                    <Image
                                                        height={42}
                                                        width={42}
                                                        src={`https://chain-icons.s3.amazonaws.com/chainlist/${portfolioData.chainId}`}
                                                        // src={
                                                        //     portfolioData?.data?.items[0]?.logo_urls?.chain_logo_url ||
                                                        //     defaultBlue
                                                        // }
                                                        alt="Chain logo"
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                {/* Network Asset worth */}
                                                <div className="flex flex-col justify-start items-start gap-1 text-B100 font-bold text-2xl">
                                                    <div>
                                                        {startCase(portfolioData?.data[0].relationships.chain.data.id)}{" "}
                                                        · $
                                                        {portfolioData?.data
                                                            ?.reduce(
                                                                (i, currentValue) => i + currentValue.attributes.value,
                                                                0
                                                            )
                                                            .toFixed(4)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Heading  */}
                                            <div className="sticky top-[114px] z-10 w-full bg-N0 flex justify-end items-center gap-3 text-xs md:text-sm text-B75 font-bold h-7">
                                                <div className="w-full max-w-md text-start text-B300 font-semibold">ASSET</div>
                                                <div className="w-full inline-flex items-center">
                                                    <div className="w-1/3 text-start">PRICE</div>
                                                    <div className="w-1/3 text-start">BALANCE</div>
                                                    <div className="w-1/3 text-start">VALUE</div>
                                                </div>
                                                <div className="w-[3%]"></div>
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
