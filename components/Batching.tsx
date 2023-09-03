import * as React from "react";
import { useEffect } from "react";
import { BigNumber as bg } from "bignumber.js";
import { BiSolidDownArrow, BiSolidChevronDown } from "react-icons/bi";
import { ImSpinner9, ImSpinner } from "react-icons/im";
import { BsArrowRightCircleFill, BsChevronDown } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { useSigner, useAddress, useChain, useSwitchChain, useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { useAppStore } from "../store/appStore";
import { chooseChianId, shorten } from "../utils/helper";
import {
    NetworkNameByChainId,
    NetworkNameByStargateChainId,
    _functionType,
    _nonce,
    bundlerURLs,
    gasFeesNames,
    gasFeesNamesByChainId,
    methodWithApi,
    paymasterURLs,
    protocolByNetwork,
    tokenAddressByProtocol,
    tokensByNetwork,
} from "../utils/constants";
import { fetchMethodParams, getNetworkAndContractData } from "../utils/apis";
import { useSendTx } from "../hooks/useSendTx";
import { useSimulate } from "../hooks/useSimulate";
import { useGenerateAbis } from "../hooks/useGenerateAbis";
import { useOnChangeFunctions, useOnChangeInput, useOnChangeTokenIn } from "../hooks/useOnChangeMainForm";
import { ChainId } from "@biconomy/core-types";
import { IBundler, Bundler } from "@biconomy/bundler";
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import ChainContext from "../Context/ChainContext";
import { toast } from "react-hot-toast";
import { useCalculatebalance } from "../hooks/useCalculateBalance";
import { getContractInstance, getErc20Balanceof, getErc20Decimals, getProvider } from "../utils/web3Libs/ethers";
import IERC20 from "../abis/IERC20.json";
import { BigNumber, ethers } from "ethers";
import { LiaChevronDownSolid, LiaChevronUpSolid } from "react-icons/lia";
import { RiAddCircleLine, RiDeleteBin5Fill } from "react-icons/ri";
import { BiSolidRightArrowCircle } from "react-icons/bi";

import { MdDelete } from "react-icons/md";

import { TbSquareRoundedChevronDownFilled, TbSquareRoundedChevronUpFilled } from "react-icons/tb";

import { useRefinance } from "../hooks/Batching/useRefinance";
import {
    abiFetcher,
    abiFetcherNum,
    fetchApy,
    nativeTokenFetcher,
    nativeTokenNum,
} from "../hooks/Batching/batchingUtils";

import aave_v2_Abi from "../abis/defi/aave_v2.json";
import IndividualBatch from "./BatchingComponenets/IndividualBatch";
import { useBiconomyProvider } from "../hooks/aaProvider/useBiconomyProvider";
import { useEoaProvider } from "../hooks/aaProvider/useEoaProvider";
import { format } from "date-fns";
bg.config({ DECIMAL_PLACES: 10 });

export default function Batching() {
    const chain = useChain(); // Detect the connected address
    const switchChain = useSwitchChain();
    const address = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address
    const connect = useConnect();
    const metamaskConfig = metamaskWallet();
    const { mutateAsync: sendTxToChain } = useSendTx();
    const { mutateAsync: simulateTx } = useSimulate();
    const { mutateAsync: generateAbisForContract } = useGenerateAbis();
    const { mutateAsync: onChangeTokenInHook } = useOnChangeTokenIn();
    const { mutateAsync: onChangeFunctionsHook } = useOnChangeFunctions();
    const { mutateAsync: onChangeInputHook } = useOnChangeInput();
    const { mutateAsync: fetchNativeBalance } = useCalculatebalance();
    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { mutateAsync: refinance } = useRefinance();
    const { selectedChain, setSelectedChain, selectedChainId, setSelectedChainId } = React.useContext(ChainContext);
    const { smartAccount, sendTxLoading, sendTxLoadingForEoa, setSendtxLoading, setSendtxLoadingForEoa, txhash }: any =
        useAppStore((state) => state);

    const [fromProtocol, setFromProtocol] = React.useState<any>();
    const [toProtocol, setToProtocol] = React.useState<any>();
    const [fromToken, setFromToken] = React.useState<any>();
    const [toToken, setToToken] = React.useState<any>();
    const [amountIn, setAmountIn] = React.useState<any>();
    const [fromTokenBalanceForSCW, setFromTokenBalanceForSCW] = React.useState<any>(0);
    const [fromTokenBalanceForEOA, setFromTokenBalanceForEOA] = React.useState<any>(0);
    const [fromTokenDecimal, setFromTokenDecimal] = React.useState<any>(0);
    const [apys, setApys] = React.useState<any>([]);
    const [apysTo, setApysForTo] = React.useState<any>([]);
    // const [individualBatch, setIndividualBatch] = React.useState<number[]>([]);
    // const [collectedValues, setCollectedValues] = React.useState<string[][]>([]);
    // const [currentRow, setCurrentRow] = React.useState<string[]>([]);
    const [individualBatch, setIndividualBatch] = React.useState<{ id: number; txHash: string[] }[]>([
        { id: 1, txHash: [""] },
    ]);
    console.log("🚀 ~ file: Batching.tsx:95 ~ Batching ~ individualBatch:", individualBatch);
    const [showIndividualBatchList, setShowIndividualBatchList] = React.useState<any>(null);
    const [allTxs, setCollectedValues] = React.useState<any>([]);

    // useEffect(() => {
    //     async function apys() {
    //         if (!fromProtocol) return
    //         setApys([])
    //         const data = protocolByNetwork[fromProtocol]
    //         console.log('data', data[0].toString())
    //         let abiNum = abiFetcherNum[data[0].toString()];
    //         let lendingContractAddress = abiFetcher[abiNum]["contractAddress"];
    //         let apyFunction = abiFetcher[abiNum]["apyFetch"];
    //         const provider = await getProvider("109");
    //         for (let i=0; i<protocolByNetwork[fromProtocol].length; i++) {
    //             const tokenInNum = nativeTokenNum[data[i]];
    //             const nativeTokenIn = nativeTokenFetcher[tokenInNum].nativeToken;
    //             let apy: any = await fetchApy({
    //                 protocol: apyFunction,
    //                 contractAddress: lendingContractAddress,
    //                 // abi,
    //                 provider,
    //                 signer,
    //                 token: nativeTokenIn
    //             })
    //             setApys(apys => [...apys, apy])
    //         }
    //     }
    //     apys()
    // }, [fromProtocol])

    // useEffect(() => {
    //     async function apys() {
    //         if (!toProtocol) return
    //         setApysForTo([])
    //         const data = protocolByNetwork[toProtocol]
    //         console.log('data---', toProtocol, data[0].toString())
    //         let abiNum = abiFetcherNum[data[0].toString()];
    //         let lendingContractAddress = abiFetcher[abiNum]["contractAddress"];
    //         let apyFunction = abiFetcher[abiNum]["apyFetch"];
    //         const provider = await getProvider("109");
    //         for (let i=0; i<protocolByNetwork[toProtocol].length; i++) {
    //             const tokenInNum = nativeTokenNum[data[i]];
    //             const nativeTokenIn = nativeTokenFetcher[tokenInNum].nativeToken;
    //             let apy: any = await fetchApy({
    //                 protocol: apyFunction,
    //                 contractAddress: lendingContractAddress,
    //                 // abi,
    //                 provider,
    //                 signer,
    //                 token: nativeTokenIn
    //             })
    //             setApysForTo(apysTo => [...apysTo, apy])
    //         }
    //     }
    //     apys()
    // }, [toProtocol])

    // const addBatch = () => {
    //     setIndividualBatch((prevInputBars) => [...prevInputBars, Date.now()]);
    // };

    const addBatch = () => {
        const id = individualBatch.length + 1;
        setIndividualBatch((prevInputBars) => [...prevInputBars, { id, txHash: [""] }]);
    };

    const removeBatch = (id: number) => {
        setIndividualBatch((prevInputBars) => prevInputBars.filter((bar) => bar.id !== id));
    };

    // const removeBatch = (id: number) => {
    //     setIndividualBatch((prevInputBars) => prevInputBars.filter((barId) => barId !== id));
    // };

    // const updateInputValue = (id: number, value: string) => {
    //     setIndividualBatch((prevInputBars) => [...prevInputBars, Date.now()]
    //       prevInputBars.map((bar) =>
    //         bar.id === id ? { ...bar, value } : bar
    //       )
    //     );
    //   };

    const updateInputValues = (id: number, txHash: string[]) => {
        setIndividualBatch((prevInputBars) => prevInputBars.map((bar) => (bar.id === id ? { ...bar, txHash } : bar)));
        addBatch();
    };

    // const collectInputValues = async () => {
    //     const mergeArray: any = [];
    //     const txHash = await individualBatch.map((bar) => bar.txHash.map((hash) => mergeArray.push(hash)));
    //     console.log("txHash---: ", txHash);
    //     console.log("mergedArray--: ", mergeArray);
    //     setCollectedValues(mergeArray);
    // };

    // const checkvalues = () => {
    //     console.log("collectInputValues: ", allTxs);
    // };

    useEffect(() => {
        async function onChangeFromProtocol() {
            if (fromProtocol) {
                setFromTokenBalanceForSCW(undefined);
                setFromTokenBalanceForEOA(undefined);
                const firstFromToken = protocolByNetwork[fromProtocol][0];
                setFromToken(firstFromToken);
                const provider = await getProvider("109");
                const tokenAddress = tokenAddressByProtocol[fromProtocol][firstFromToken];
                const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
                const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
                const eoaBalance = await getErc20Balanceof(erc20, address);
                const fromTokendecimal = await getErc20Decimals(erc20);
                setFromTokenDecimal(fromTokendecimal);
                setFromTokenBalanceForSCW(scwBalance);
                setFromTokenBalanceForEOA(eoaBalance);
            }
        }
        onChangeFromProtocol();
    }, [fromProtocol]);

    const onChangeFromProtocol = async (_fromProtocol: any) => {
        if (sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading");
            return;
        }
        if (selectedChain != "polygon") {
            alert("Batching is only supported on polygon as of now");
            return;
        }
        setFromProtocol(_fromProtocol);
    };

    const onChangeToProtocol = async (_toProtocol: any) => {
        if (sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading");
            return;
        }
        if (selectedChain != "polygon") {
            alert("Batching is only supported on polygon as of now");
            return;
        }
        setToProtocol(_toProtocol);
    };

    const onChangeFromToken = async (_fromToken: any) => {
        if (sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading");
            return;
        }
        if (selectedChain != "polygon") {
            alert("Batching is only supported on polygon as of now");
            return;
        }
        if (!fromProtocol) {
            alert("select from protocol");
            return;
        }
        setFromTokenBalanceForSCW(undefined);
        setFromTokenBalanceForEOA(undefined);
        setFromToken(_fromToken);
        const provider = await getProvider("109");
        const tokenAddress = tokenAddressByProtocol[fromProtocol][_fromToken];
        const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
        const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
        const eoaBalance = await getErc20Balanceof(erc20, address);
        const fromTokendecimal = await getErc20Decimals(erc20);
        setFromTokenDecimal(fromTokendecimal);
        setFromTokenBalanceForSCW(scwBalance);
        setFromTokenBalanceForEOA(eoaBalance);
    };

    const onChangeToToken = async (_toToken: any) => {
        if (sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading");
            return;
        }
        if (selectedChain != "polygon") {
            alert("Batching is only supported on polygon as of now");
            return;
        }
        setToToken(_toToken);
    };

    const onChangeAmountIn = async (_amountIn: any) => {
        if (sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading");
            return;
        }
        if (selectedChain != "polygon") {
            alert("Batching is only supported on polygon as of now");
            return;
        }
        // console.log("_amountIn-1", _amountIn.toString());
        if (_amountIn) {
            // console.log("_amountIn-2", _amountIn.toString());
            let amountInByDecimals = bg(_amountIn);
            // console.log("_amountIn-3", amountInByDecimals.toString());
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(fromTokenDecimal));
            // console.log("_amountIn-4", amountInByDecimals.toString());
            if (amountInByDecimals.eq(0)) {
                // console.log("_amountIn-5", _amountIn.toString());
                setAmountIn(_amountIn);
            } else {
                // console.log("_amountIn-6", amountInByDecimals.toString());
                setAmountIn(amountInByDecimals.toString());
            }
        } else {
            // console.log("_amountIn-7", _amountIn.toString());
            setAmountIn("");
        }
    };

    const copyToClipboard = (id: any) => {
        navigator.clipboard.writeText(id);
        // Alert the copied text
        toast.success("Destination Lending CallData Copied");
    };

    const sendBatchAll = async (isSCW: any) => {
        try {
            if (isSCW) {
                setSendtxLoading(true);
            } else {
                setSendtxLoadingForEoa(true);
            }
            const mergeArray: any = [];
            const txHash = await individualBatch.map((bar) => bar.txHash.map((hash) => mergeArray.push(hash)));
            console.log("txHash---: ", txHash);
            console.log("mergedArray--: ", mergeArray);
            // setCollectedValues(mergeArray);
            if (isSCW) {
                await sendToBiconomy(mergeArray);
            } else {
                await sendTxTrditionally(mergeArray);
            }
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
        } catch (error) {
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
        }
    };

    const sendBatch = async (isSCW: any) => {
        try {
            alert(fromToken + toToken);
            if (fromToken == toToken) {
                alert("fromToken and toToken should not same");
                return;
            }
            if (selectedChain != "polygon") {
                alert("Batching is only supported on polygon as of now");
                return;
            }
            if (sendTxLoading || sendTxLoadingForEoa) {
                alert("wait, tx loading");
                return;
            }
            if (!fromProtocol) {
                alert("select from protocol");
                return;
            }
            if (!fromToken) {
                alert("select fromToken");
                return;
            }
            if (!toProtocol) {
                alert("select to protocol");
                return;
            }
            if (!toToken) {
                alert("select toToken");
                return;
            }
            if (!amountIn) {
                alert("select amountIn");
                return;
            }
            const provider = await getProvider("109");
            await refinance({
                isSCW: isSCW,
                fromProtocol: fromProtocol,
                toProtocol: toProtocol,
                tokenIn: "",
                tokenInName: fromToken,
                tokenOut: "",
                tokenOutName: toToken,
                amount: amountIn,
                address: isSCW ? smartAccount.address : address,
                provider,
            });
        } catch (error) {
            console.log("sendBatch-error", error);
        }
    };

    const toggleShowBatchList = (id: number): void => {
        if (showIndividualBatchList === id) {
            setShowIndividualBatchList(null);
        } else {
            setShowIndividualBatchList(id);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center gap-3 py-1">
                    <button
                        type="button"
                        onClick={addBatch}
                        className="flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-950 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-slate-600 hover:border-slate-700 transition duration-300"
                    >
                        <RiAddCircleLine size="20px" /> Add New Batch Bar
                    </button>
                    <button
                        type="button"
                        onClick={() => sendBatchAll(true)}
                        className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                    >
                        {sendTxLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                        Excecute Batch {!sendTxLoading && <BiSolidRightArrowCircle size="20px" />}
                    </button>
                    {/* <button
                        type="button"
                        onClick={() => sendBatchAll(false)}
                        className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                    >
                        {sendTxLoadingForEoa && <ImSpinner className="animate-spin h-5 w-5" />}
                        Send Batches via EOA
                    </button> */}
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-start gap-4">
                    {true && (
                        <div className="w-full min-h-[calc(100vh-225px)] bg-gradient-to-t from-gray-200 via-white to-gray-200 flex flex-col gap-5 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                            <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold mb-5">
                                Cross-Chain Lending and Batching
                            </h1>

                            {/* {individualBatch.map((bar) => (
                                <IndividualBatch
                                    key={bar.id}
                                    // values={bar.txHash}
                                    onUpdate={(newValues) => updateInputValues(bar.id, newValues)}
                                />
                            ))} */}

                            <IndividualBatch
                                key={individualBatch[individualBatch.length - 1]?.id}
                                // values={bar.txHash}
                                onUpdate={(newValues) =>
                                    updateInputValues(individualBatch[individualBatch.length - 1]?.id, newValues)
                                }
                            />
                        </div>
                    )}
                    <div className="w-full min-h-[calc(100vh-225px)] bg-gradient-to-t from-gray-200 via-white to-gray-200 text-center flex flex-col gap-3 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                        {individualBatch.length > 0 ? (
                            individualBatch.map((bar) => (
                                <div key={bar.id} className="relative">
                                    <div className="simulation-success flex justify-between items-center gap-5 bg-black py-2 px-3 rounded-lg text-primary-100 font-medium   transition duration-300">
                                        <div className="flex justify-start items-baseline gap-2">
                                            <h1 className="flex justify-center items-center gap-3 text-white font-semibold text-base">
                                                {bar.id}.
                                            </h1>
                                            <div className="flex justify-center items-center gap-2 text-white text-sm">
                                                <span>0x{bar.id}</span>
                                                <span>0x{bar.id}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center gap-2">
                                            <div>
                                                <MdDelete color="red" size="20px" onClick={() => removeBatch(bar.id)} />
                                            </div>
                                            <span className="flex justify-center items-center gap-2">
                                                <div onClick={() => toggleShowBatchList(bar.id)}>
                                                    {showIndividualBatchList === bar.id ? (
                                                        <LiaChevronUpSolid size="20px" />
                                                    ) : (
                                                        <LiaChevronDownSolid size="20px" />
                                                    )}
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    {showIndividualBatchList === bar.id && (
                                        <div className="w-full my-1 z-50 flex flex-col justify-center items-start text-start gap-1 bg-gray-700 p-3 rounded-lg">
                                            <div className="w-full text-base font-bold text-gray-400">
                                                Interact With :-
                                            </div>
                                            <div className="w-full flex justify-start items-baseline gap-1 text-base font-medium text-white">
                                                <span>matic :</span>
                                                <span className="font-normal text-sm">0xabcdefghigk999</span>
                                            </div>

                                            <div className="w-full text-md font-semibold text-gray-400 mt-3">
                                                Deposited Eth :-
                                            </div>
                                            <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                <div className="w-60 font-medium text-sm">(address) :</div>
                                                <div className="w-full font-normal text-xs">0x{bar.id}</div>
                                            </div>
                                            <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                <div className="w-60 font-medium text-sm">onBehalfOf (address) :</div>
                                                <div className="w-full font-normal text-xs">0x{bar.id}</div>
                                            </div>
                                            <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                <div className="w-60 font-medium text-sm">refferalCode (uin16) :</div>
                                                <div className="w-full font-normal text-xs">0</div>
                                            </div>
                                            <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                <div className="w-60 font-medium text-sm">Created :</div>
                                                <div className="w-full font-normal text-xs">
                                                    {format(new Date(), "dd/MM/yyyy HH:mm:ss")}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-black font-semibold text-base md:text-lg">No Batches Found !</div>
                        )}
                    </div>
                </div>

                {txhash && (
                    <div className="flex justify-center items-center gap-3 py-5">
                        <p>
                            <a target="_blank" href={`https://polygonscan.com/tx/${txhash}`} style={{ color: "white" }}>
                                TxHash : {shorten(txhash)}
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
