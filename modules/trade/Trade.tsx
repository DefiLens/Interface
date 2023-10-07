import { useEffect } from "react";

import { BigNumber } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import Image from "next/image";
import { ImSpinner } from "react-icons/im";
import { AiOutlineSearch } from "react-icons/ai";
import { useChain, useAddress } from "@thirdweb-dev/react";
import { MdOutlineArrowBack, MdDelete } from "react-icons/md";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

import { tTrade } from "./types";
import IERC20 from "../../abis/IERC20.json";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { useRefinance } from "../../hooks/Batching/useRefinance";
import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { useEoaProvider } from "../../hooks/aaProvider/useEoaProvider";
import { shorten, setSafeState, buildTxHash } from "../../utils/helper";
import { useSwitchOnSpecificChain } from "../../hooks/useSwitchOnSpecificChain";
import { useTradeStore, iTrade, iSelectedNetwork } from "../../store/TradeStore";
import { useBiconomyProvider } from "../../hooks/aaProvider/useBiconomyProvider";
import { warning, swap, polygon, optimism, gas, downLine, bridgeCost, base, avalanche } from "../../assets/images";
import { getProvider, getErc20Decimals, getErc20Balanceof, getContractInstance } from "../../utils/web3Libs/ethers";
import { tokenAddressByProtocol, protocolNames, protocolByNetwork, NETWORK_LIST, BIG_ZERO } from "../../utils/constants";

bg.config({ DECIMAL_PLACES: 10 });

const Trade: React.FC<any> = ({}: tTrade) => {

    const chain = useChain(); // Detect the connected address
    const address = useAddress(); // Detect the connected address
    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { mutateAsync: refinance } = useRefinance();

    const { mutateAsync: switchOnSpecificChain } = useSwitchOnSpecificChain();

    const {
        scwBalance,
        smartAccount,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
        setSelectedFromNetwork,
        selectedFromProtocol,
        setSelectedFromProtocol,
        selectedFromToken,
        setSelectedFromToken,
        selectedToNetwork,
        setSelectedToNetwork,
        selectedToProtocol,
        setSelectedToProtocol,
        selectedToToken,
        setSelectedToToken,
        showFromSelectionMenu,
        setShowFromSelectionMenu,
        showToSelectionMenu,
        setShowToSelectionMenu,
        tokensData,
        setTokensData,
        amountIn,
        setAmountIn,
        fromTokenDecimal,
        setFromTokenDecimal,
        fromTokenBalanceForSCW,
        setFromTokenBalanceForSCW,
        fromTokenBalanceForEOA,
        setFromTokenBalanceForEOA,
        filterFromToken,
        setFilterFromToken,
        filterToToken,
        setFilterToToken,
        addToBatchLoading,
        setAddToBatchLoading,
        showBatchList,
        setShowBatchList,
        showIndividualBatchList,
        setShowIndividualBatchList,
        txhash,
        setTxHash,
        sendTxLoading,
        setSendTxLoading,
        sendTxLoadingForEoa,
        setSendTxLoadingForEoa,
        individualBatch,
        setIndividualBatch,
    }: iTrade = useTradeStore((state) => state);
    
    console.log("🚀 ~ file: Trade.tsx:86 ~ individualBatch:", individualBatch)
    
    const handleSelectFromNetwork = (_fromnetwork: iSelectedNetwork) => {
        if (selectedFromNetwork.chainName !== _fromnetwork.chainName) {
            switchOnSpecificChain(_fromnetwork.chainName)
            setSelectedFromNetwork(_fromnetwork)
        }
        setSelectedFromNetwork(_fromnetwork)
    };

    const handleSelectToNetwork = (data: any) => {
        setSelectedToNetwork(data)
    };

    useEffect(() => {
        if (selectedFromNetwork.chainName && selectedFromProtocol && selectedFromToken) {
            setShowFromSelectionMenu(false)
        }
    }, [selectedFromNetwork, selectedFromProtocol, selectedFromToken])

    useEffect(() => {
        if (selectedToNetwork.chainName && selectedToProtocol && selectedToToken) {
            setShowToSelectionMenu(false)
        }
    }, [selectedToNetwork, selectedToProtocol, selectedToToken])

    useEffect(() => {
        async function onChangeselectedFromProtocol() {
            if (selectedFromProtocol) {
                if (selectedFromProtocol !== "erc20") {
                    setAmountIn("");
                    setFromTokenDecimal(0);
                    // setFromTokenBalanceForSCW(BIG_ZERO);
                    // setFromTokenBalanceForEOA(BIG_ZERO);
                    
                    const firstFromToken = protocolByNetwork[selectedFromNetwork.chainName][selectedFromProtocol][0].name;
                    setSelectedFromToken(firstFromToken);
                    
                    const provider = await getProvider(selectedFromNetwork.chainId);
                    const tokenAddress = tokenAddressByProtocol[selectedFromNetwork.chainName][selectedFromProtocol][firstFromToken];
                    const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
                    // const scwBalance = await getErc20Balanceof(erc20, smartAccount?.address);
                    // const eoaBalance = await getErc20Balanceof(erc20, address);
                    const fromTokendecimal = await getErc20Decimals(erc20);
                    setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
                    // setSafeState(setFromTokenBalanceForSCW, BigNumber.from(scwBalance), BIG_ZERO);
                    // setSafeState(setFromTokenBalanceForEOA, BigNumber.from(eoaBalance), BIG_ZERO);
                } else {
                    const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === BigNumber.from(selectedFromNetwork.chainId).toNumber());
                    const filteredTokens = tokensWithChainId.map((token) => {
                        const { extensions, logoURI, ...filteredToken } = token;
                        return filteredToken;
                    });
                    setTokensData(filteredTokens);
                }
            }
        }
        onChangeselectedFromProtocol();
    }, [selectedFromProtocol]);

    useEffect(() => {
        async function onChangeselectedToProtocol() {
            if (selectedToProtocol) {
                if (selectedToProtocol == "erc20" && tokensData.length < 1) {
                    const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === BigNumber.from(selectedToNetwork.chainId).toNumber());
                    const filteredTokens = tokensWithChainId.map((token) => {
                        const { extensions, logoURI, ...filteredToken } = token;
                        return filteredToken;
                    });
                    setTokensData(filteredTokens);
                }
            }
        }
        onChangeselectedToProtocol();
    }, [selectedToProtocol]);

    const onChangeFromProtocol = async (_fromProtocol: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (!(selectedFromNetwork.chainName == "polygon" || selectedFromNetwork.chainName == "base")) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        setSelectedFromProtocol(_fromProtocol);
    };

    const onChangeFromToken = async (_fromToken: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (!(selectedFromNetwork.chainName == "polygon" || selectedFromNetwork.chainName == "base")) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        if (!selectedFromProtocol) {
            toast.error("select from protocol");
            return;
        }
        setAmountIn("");
        setFromTokenDecimal(0);
        // setFromTokenBalanceForSCW(BIG_ZERO);
        // setFromTokenBalanceForEOA(BIG_ZERO);

        setSelectedFromToken(_fromToken);
        const provider = await getProvider(selectedFromNetwork.chainId);

        const erc20Address: any =
            selectedFromProtocol == "erc20" ? tokensData.filter((token: any) => token.symbol === _fromToken) : "";
        const tokenAddress =
            selectedFromProtocol != "erc20"
                ? tokenAddressByProtocol[selectedFromNetwork.chainName][selectedFromProtocol][_fromToken]
                : erc20Address[0].address;
        const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
        // const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
        // const eoaBalance = await getErc20Balanceof(erc20, address);
        const fromTokendecimal = await getErc20Decimals(erc20);
        setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
        // setSafeState(setFromTokenBalanceForSCW, BigNumber.from(scwBalance), BIG_ZERO);
        // setSafeState(setFromTokenBalanceForEOA, BigNumber.from(eoaBalance), BIG_ZERO);
    };

    const onChangeToProtocol = async (_toProtocol: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (!(selectedFromNetwork.chainName == "polygon" || selectedFromNetwork.chainName == "base")) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        setSelectedToProtocol(_toProtocol);
    };

    const onChangeToToken = async (_toToken: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (!(selectedFromNetwork.chainName == "polygon" || selectedFromNetwork.chainName == "base")) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        setSelectedToToken(_toToken);
    };

    const onChangeAmountIn = async (_amountIn: string) => {
        if (addToBatchLoading) {
            toast.error('wait, tx loading');
            return;
        }
        if (!(selectedFromNetwork.chainName == "polygon" || selectedFromNetwork.chainName == "base")) {
            throw "Batching is only supported on polygon as of now";
        }
        if (_amountIn && fromTokenDecimal) {
            let amountInByDecimals = bg(_amountIn.toString());
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(fromTokenDecimal));
            setAmountIn(_amountIn);
        } else {
            setAmountIn("");
        }
    };

    const handleSwap = () => {
        let tempNetwork = selectedFromNetwork;
        let tempProtocol = selectedFromToken;
        let tempToken = selectedFromToken;

        setSelectedFromNetwork(selectedToNetwork);
        setSelectedToNetwork(tempNetwork);

        setSelectedFromProtocol(selectedToProtocol);
        setSelectedToProtocol(tempProtocol);

        setSelectedFromToken(selectedToToken);
        setSelectedToToken(tempToken);
    }

    const addBatch = () => {
        setIndividualBatch([]);
        setIndividualBatch([
            {
                id: 0,
                txHash: [],
                data: {
                    fromNetwork: "",
                    toNetwork: "",
                    fromProtocol: "",
                    toProtocol: "",
                    fromToken: "",
                    toToken: "",
                    amountIn: "",
                },
            },
        ]);
    };

    const removeBatch = (index: number) => {
        const updatedBatch = [...individualBatch];
        updatedBatch.splice(index, 1); // Remove the InputBar at the specified index
        setIndividualBatch(updatedBatch);
    };

    const updateInputValues = (index: number, txHash: string[], data: any) => {
        console.log("data: ", data, individualBatch);
        if (txHash.length < 1) return toast.error("Please complete the last input before adding a new one.");
        if (individualBatch.length == 0) {
            setIndividualBatch([
                ...individualBatch,
                {
                    id: 0,
                    txHash: [],
                    data: {
                        fromNetwork: "",
                        toNetwork: "",
                        fromProtocol: "",
                        toProtocol: "",
                        fromToken: "",
                        toToken: "",
                        amountIn: "",
                    },
                },
            ]);
        }
        const updatedBatch: any = [...individualBatch];
        updatedBatch[index].txHash = txHash;
        updatedBatch[index].data = data;
        setIndividualBatch([
            ...updatedBatch,
            {
                id: updatedBatch.length,
                txHash: [],
                data: {
                    fromNetwork: "",
                    toNetwork: "",
                    fromProtocol: "",
                    toProtocol: "",
                    fromToken: "",
                    toToken: "",
                    amountIn: "",
                },
            },
        ]);
    };

    const toggleShowBatchList = (id: number): void => {
        if (showIndividualBatchList === id) {
            setShowIndividualBatchList(null);
        } else {
            setShowIndividualBatchList(id);
        }
    };

    const sendSingleBatchToList = async (isSCW: any) => {
        try {
            if (isSCW) {
                setAddToBatchLoading(true);
            }
            if (selectedFromToken == selectedToToken) {
                toast.error("fromToken and toToken should not same");
                setAddToBatchLoading(false);
                return;
            }
            if (!(selectedFromNetwork.chainName == "polygon" || selectedFromNetwork.chainName == "base")) {
                toast.error("Batching is only supported on polygon as of now");
                setAddToBatchLoading(false);
                return;
            }
            // if ((amountIn.length > 0) && (scwBalance < amountIn)) {
            //     toast.error("You don't have enough funds to complete transaction");
            //     setAddToBatchLoading(false);
            //     return;
            // }
            if (addToBatchLoading) {
                toast.error("wait, tx loading");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedFromProtocol) {
                toast.error("select from protocol");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedFromToken) {
                toast.error("select fromToken");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedToProtocol) {
                toast.error("select to protocol");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedToToken) {
                toast.error("select toToken");
                setAddToBatchLoading(false);
                return;
            }
            if (!amountIn && fromTokenDecimal) {
                toast.error("select amountIn");
                setAddToBatchLoading(false);
                return;
            }
            const provider = await getProvider(selectedFromNetwork.chainId);
            console.log(
                "refinanceamoynt",
                amountIn.toString(),
                bg(amountIn).multipliedBy(bg(10).pow(fromTokenDecimal)).toString()
            );
            const _tempAmount = BigNumber.from(bg(amountIn).multipliedBy(bg(10).pow(fromTokenDecimal)).toString());
            const txHash = await refinance({
                isSCW: isSCW,
                fromProtocol: selectedFromProtocol,
                toProtocol: selectedToProtocol,
                tokenIn: "",
                tokenInName: selectedFromToken,
                tokenOut: "",
                tokenOutName: selectedToToken,
                amount: _tempAmount,
                address: isSCW ? smartAccount.address : address,
                provider,
            });

            updateInputValues(
                individualBatch.length - 1,
                txHash,
                {
                    fromNetwork: selectedFromNetwork.chainName,
                    toNetwork: selectedToNetwork.chainName,
                    fromProtocol: selectedFromProtocol,
                    toProtocol: selectedToProtocol,
                    fromToken: selectedFromToken,
                    toToken: selectedToToken,
                    amountIn: amountIn,
                }
            )

            setAddToBatchLoading(false);
            setShowBatchList(true);
        } catch (error) {
            setAddToBatchLoading(false);
            setShowBatchList(true);
            alert(error);
            console.log("sendBatch-error", error);
        }
    };

    const ExecuteAllBatches = async (isSCW: any) => {
        try {
            if (isSCW) {
                setSendTxLoading(true);
            } else {
                setSendTxLoadingForEoa(true);
            }
            const mergeArray: any = [];
            await individualBatch.map((bar) => bar.txHash.map((hash) => mergeArray.push(hash)));
            console.log("mergedArray--: ", mergeArray);
            let tempTxhash = "";
            if (isSCW) {
                tempTxhash = await sendToBiconomy(mergeArray);
            } else {
                tempTxhash = await sendTxTrditionally(mergeArray);
            }
            if (tempTxhash) {
                setTxHash(tempTxhash);
            }
            setSendTxLoading(false);
            setSendTxLoadingForEoa(false);
            addBatch();
        } catch (error) {
            setSendTxLoading(false);
            setSendTxLoadingForEoa(false);
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center py-5">
            <div className={`${showBatchList ? '!w-full' : '!w-[50%]'}  flex flex-col lg:flex-row justify-center items-start gap-4`}>
                <div className="w-full">
                    {showFromSelectionMenu || showToSelectionMenu ? (
                        <div className="w-full bg-gray-50 flex flex-col gap-2 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-3">
                            <MdOutlineArrowBack
                                onClick={
                                    showFromSelectionMenu
                                    ? () => setShowFromSelectionMenu(false)
                                    : () => setShowToSelectionMenu(false)
                                }
                                className="rounded-full h-10 w-10 p-2 hover:bg-gray-100 active:bg-gray-200  text-black"
                            />
                            <div className="flex flex-col justify-center items-center gap-5 px-4">
                                <div className="flex flex-wrap justify-center items-center gap-2">
                                    {NETWORK_LIST?.map((item) => {
                                        return (
                                            <div
                                                key={item.chainName}
                                                onClick={
                                                    showFromSelectionMenu
                                                    ? () => handleSelectFromNetwork(item)
                                                    : () => handleSelectToNetwork(item)
                                                }
                                                className="h-14 w-14 flex justify-center items-center gap-3 bg-white hover:bg-slate-100 active:bg-slate-200 border-2 border-slate-200 hover:border-slate-300 shadow-sm rounded-md cursor-pointer"
                                            >
                                                <Image
                                                    src={item.icon}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full"
                                                />
                                        </div>
                                        );
                                    })}
                                </div>
                                <div className="w-full flex justify-start items-center gap-2 bg-white border-2 border-slate-200 rounded-md py-2 px-5">
                                    <input
                                        type="text"
                                        value={showFromSelectionMenu ? filterFromToken : filterToToken}
                                        onChange={showFromSelectionMenu
                                            ? (e) => setFilterFromToken(e.target.value)
                                            : (e) => setFilterToToken(e.target.value)
                                        }
                                        placeholder="Search by token name or address"
                                        className="w-full text-sm md:text-base outline-none"
                                    />
                                    <AiOutlineSearch />
                                </div>
                                <div className="w-full overflow-auto flex flex-col justify-center items-center py-3">
                                    {showFromSelectionMenu && selectedFromNetwork.chainName && (
                                        <div className="w-full max-h-96">
                                            {protocolNames[selectedFromNetwork.chainName]?.key.map((item: any, protocolIndex: number) => (
                                                <div
                                                    key={item.name}
                                                    className="w-full"
                                                >
                                                    <div
                                                        key={item.name}
                                                        // onClick={() => setSelectedFromProtocol(item.name)}
                                                        onClick={() => onChangeFromProtocol(item.name)}
                                                        className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                    >
                                                        <Image
                                                            src={item.icon}
                                                            alt=""
                                                            className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                                                        />
                                                        <div>
                                                            {protocolNames[selectedFromNetwork.chainName].value[protocolIndex]}
                                                        </div>
                                                    </div>

                                                    {selectedFromProtocol === item.name && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {protocolByNetwork[selectedFromNetwork.chainName][selectedFromProtocol]?.map((token: any, tokenIndex: number) => (
                                                                <div
                                                                    key={tokenIndex}
                                                                    // onClick={() => setSelectedFromToken(token.name)}
                                                                    onClick={() => onChangeFromToken(token.name)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
                                                                    <Image
                                                                        src={token.icon}
                                                                        alt=""
                                                                        className="h-7 w-7 bg-slate-200 rounded-full cursor-pointer"
                                                                    />
                                                                    {token.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {selectedFromProtocol === "erc20" && tokensData && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {tokensData?.map((token: any, tokenIndex: number) => (
                                                                <div
                                                                    key={tokenIndex}
                                                                    // onClick={() => setSelectedFromToken(token.symbol)}
                                                                    onClick={() => onChangeFromToken(token.symbol)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
                                                                    <Image
                                                                        src={optimism}
                                                                        alt=""
                                                                        className="h-7 w-7 bg-slate-200 rounded-full cursor-pointer"
                                                                    />
                                                                    {token.symbol}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {showToSelectionMenu && selectedToNetwork.chainName && (
                                        <div className="w-full max-h-96">
                                            {protocolNames[selectedToNetwork.chainName]?.key.map((item: any, protocolIndex: number) => (
                                                <div
                                                    key={item.name}
                                                    className="w-full"
                                                >
                                                    <div
                                                        key={item.name}
                                                        // onClick={() => setSelectedToProtocol(item.name)}
                                                        onClick={() => onChangeToProtocol(item.name)}
                                                        className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                    >
                                                        <Image
                                                            src={item.icon}
                                                            alt=""
                                                            className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                                                        />
                                                        <div>
                                                            {protocolNames[selectedToNetwork.chainName].value[protocolIndex]}
                                                        </div>
                                                    </div>
                                                    {selectedToProtocol === item.name && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {protocolByNetwork[selectedToNetwork.chainName][selectedToProtocol]?.map((token: any, tokenIndex: number) => (
                                                                <div
                                                                    key={tokenIndex}
                                                                    // onClick={() => setSelectedToToken(token.name)}
                                                                    onClick={() => onChangeToToken(token.name)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
                                                                    <Image
                                                                        src={token.icon}
                                                                        alt=""
                                                                        className="h-7 w-7 bg-slate-200 rounded-full cursor-pointer"
                                                                    />
                                                                    {token.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {selectedToProtocol === "erc20" && tokensData && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {tokensData?.map((token: any, tokenIndex: number) => (
                                                                <div
                                                                    key={tokenIndex}
                                                                    // onClick={() => setSelectedToToken(token.symbol)}
                                                                    onClick={() => onChangeToToken(token.symbol)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
                                                                    <Image
                                                                        src={avalanche}
                                                                        alt=""
                                                                        className="h-7 w-7 bg-slate-200 rounded-full cursor-pointer"
                                                                    />
                                                                    {token.symbol}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-gray-50 flex flex-col gap-1 shadow-md shadow-primary-950 rounded-2xl cursor-pointer">
                            <h1 className="w-full bg-purple-950 text-white text-lg md:text-xl lg:text-2xl text-center font-bold rounded-t-2xl p-5">
                                Building Batch No. {individualBatch.length}
                            </h1>
                            <div className="w-full flex flex-col gap-5 px-5 py-7">
                                <div
                                    className={`w-full relative flex justify-center items-center gap-5 ${
                                        selectedToNetwork.chainName
                                        && selectedToProtocol
                                        && selectedToToken
                                        && selectedFromNetwork.chainName
                                        && selectedFromProtocol
                                        && selectedFromToken
                                        ? 'flex-row'
                                        : 'flex-col'
                                        }`
                                    }
                                >
                                    {/* ---------- FROM Section START ---------- */}
                                    <div
                                        onClick={() => setShowFromSelectionMenu(true)}
                                        className="w-full bg-white border border-slate-300 shadow rounded-lg px-5 py-3"
                                    >
                                        <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-slate-800">
                                            From
                                        </h5>
                                        <div className="flex flex-row justify-start items-center gap-8 py-3">
                                            {selectedFromNetwork.chainName ? (
                                                <div className="relative">
                                                    <Image
                                                        src={selectedFromNetwork.icon}
                                                        alt=""
                                                        className="h-12 w-12 bg-slate-200 rounded-full cursor-pointer"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 bg-white h-6 w-6 flex justify-center items-center rounded-full">
                                                        <Image
                                                            src={selectedFromNetwork.icon}
                                                            alt=""
                                                            className="h-5 w-5 bg-slate-200 rounded-full cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                <div
                                                    className="h-12 w-12 bg-slate-200 rounded-full cursor-pointer"
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-white h-6 w-6 flex justify-center items-center rounded-full">
                                                        <div
                                                            className="h-5 w-5 bg-slate-200 rounded-full cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {selectedFromNetwork.chainName ? (
                                                    <div className="text-slate-400">
                                                        <div className="text-base md:text-lg text-black font-semibold">
                                                            {selectedFromNetwork.key}
                                                        </div>
                                                        <div className="text-xs text-slate-500 font-medium">
                                                            on {selectedFromProtocol} Chain ( {selectedFromToken} )
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-base md:text-lg text-slate-400">
                                                        Select Chain and token
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    {/* ---------- FROM Section END ---------- */}

                                    <div
                                        onClick={handleSwap}
                                        className="absolute flex justify-center items-center border-2 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-full"
                                    >
                                        <Image
                                            src={swap}
                                            alt=""
                                            className={`h-12 w-12 p-3 ${
                                                selectedToNetwork.chainName
                                                && selectedToProtocol
                                                && selectedToToken
                                                && selectedFromNetwork.chainName
                                                && selectedFromProtocol
                                                && selectedFromToken
                                                ? '!rotate-90'
                                                : '!rotate-0'
                                                }`}
                                        />
                                    </div>

                                    {/* ---------- To Section START ---------- */}
                                    <div
                                        onClick={() => setShowToSelectionMenu(true)}
                                        className="w-full bg-white border border-slate-300 shadow rounded-lg px-5 py-3"
                                    >
                                        <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-slate-800">
                                            To
                                        </h5>
                                        <div className="flex flex-row justify-start items-center gap-8 py-3">
                                            {selectedToNetwork.chainName ? (
                                                <div className="relative">
                                                    <Image
                                                        src={selectedToNetwork.icon}
                                                        alt=""
                                                        className="h-12 w-12 bg-slate-200 rounded-full cursor-pointer"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 bg-white h-6 w-6 flex justify-center items-center rounded-full">
                                                        <Image
                                                            src={selectedToNetwork.icon}
                                                            alt=""
                                                            className="h-5 w-5 bg-slate-200 rounded-full cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <div
                                                        className="h-12 w-12 bg-slate-200 rounded-full cursor-pointer"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 bg-white h-6 w-6 flex justify-center items-center rounded-full">
                                                        <div
                                                            className="h-5 w-5 bg-slate-200 rounded-full cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                        {selectedToNetwork.chainName ? (
                                            <div className="text-slate-400">
                                                <div className="text-base md:text-lg text-black font-semibold">
                                                    {selectedToNetwork.key}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium">
                                                    on {selectedToProtocol} Chain ( {selectedToToken} )
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-base md:text-lg text-slate-400">
                                                Select Chain and token
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    {/* ---------- To Section END ---------- */}
                                </div>

                                {/* ---------- YOU PAY Section START ---------- */}
                                <div
                                    className="bg-white border border-slate-300 shadow rounded-lg px-5 py-3"
                                >
                                    <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-slate-800">
                                        You Pay
                                    </h5>
                                    <div className="relative flex flex-row justify-start items-center gap-8 py-3">
                                        {selectedFromNetwork.chainName ? (
                                            <div className="relative">
                                                <Image
                                                    src={selectedFromNetwork.icon}
                                                    alt=""
                                                    className="h-12 w-12 bg-slate-200 rounded-full cursor-pointer"
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-white h-6 w-6 flex justify-center items-center rounded-full">
                                                    <Image
                                                        src={selectedFromNetwork.icon}
                                                        alt=""
                                                        className="h-5 w-5 bg-slate-200 rounded-full cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <div
                                                    className="h-12 w-12 bg-slate-200 rounded-full cursor-pointer"
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-white h-6 w-6 flex justify-center items-center rounded-full">
                                                    <div
                                                        className="h-5 w-5 bg-slate-200 rounded-full cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                    <div className="text-slate-400">
                                        <input
                                            min="0"
                                            type="number"
                                            placeholder="0"
                                            value={fromTokenDecimal && amountIn && bg(amountIn).isGreaterThan(0) ? amountIn : amountIn}
                                            onChange={(e: any) => onChangeAmountIn(e.target.value)}
                                            className="w-full text-xl md:text-2xl text-black placeholder:text-slate-500 font-bold outline-none"
                                        />
                                        <div className="text-xs md:text-sm text-slate-500 font-medium">
                                            $0.00
                                        </div>
                                        <div className="absolute right-0 bottom-0 flex flex-col justify-center items-end gap-1">
                                            <span className="text-xs md:text-sm text-purple-100 font-medium bg-purple-700 rounded-xl px-3 py-1">
                                                Max
                                            </span>
                                            <span className="text-xs md:text-sm text-slate-600 font-medium ">
                                                / {scwBalance ? scwBalance : 0 }
                                            </span>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                {/* ---------- YOU PAY Section END ---------- */}

                                {/* ---------- Add Batch o List START ---------- */}
                                {(amountIn.length > 0) && (scwBalance < amountIn) && (
                                    <div className="flex justify-start items-center gap-3 text-sm md:text-base font-medium bg-yellow-400 shadow rounded-lg px-5 py-2">
                                        <Image
                                            src={warning}
                                            alt=""
                                            className="h-8 w-8"
                                        />
                                        You don&#39;t have enough funds to complete transaction.
                                    </div>
                                )}

                                <div className="w-full flex flex-col justify-center items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => sendSingleBatchToList(true)}
                                        className="w-full flex justify-center items-center gap-2 bg-purple-900 hover:bg-purple-950 py-2 px-5 rounded-full text-white font-medium border-b-4 border-purple-950 transition duration-300"
                                    >
                                        {addToBatchLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                                        Add Batch to List
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => ExecuteAllBatches(true)}
                                        className="w-full flex justify-center items-center gap-2 bg-purple-900 hover:bg-purple-950 py-2 px-5 rounded-full text-white font-medium border-b-4 border-purple-950 transition duration-300"
                                    >
                                        {sendTxLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                                        Execute Batch
                    
                                    </button>
                                </div>
                                {/* ---------- Add Batch o List Section END ---------- */}
                            </div>

                        </div>
                    )}
                </div>

                {showBatchList && (
                    <div className="w-full bg-gray-50 flex flex-col justify-start items-center gap-1 shadow-md shadow-primary-950 rounded-2xl cursor-pointer">
                        <h1 className="w-full bg-purple-950 text-white text-lg md:text-xl lg:text-2xl text-center font-bold rounded-t-2xl p-5">
                            Batching List
                        </h1>
                        <div className="w-full flex flex-col gap-5 px-5 py-7">
                        {txhash && (
                            <div className="flex flex-col justify-center items-center gap-5 py-5">
                                <a
                                    target="_blank"
                                    href={buildTxHash(selectedToNetwork.chainName, txhash, false)}
                                    className="text-lg md:text-xl lg:text-2xl text-center text-green-600 underline underline-offset-2 font-extrabold"
                                >
                                    Success Batch TxHash : {shorten(txhash)}
                                </a>
                            </div>
                        )}

                        {individualBatch.length > 0 && individualBatch[0].txHash.length > 0 ? (
                            individualBatch.map((bar, inputBarIndex) => (
                                <>
                                     {bar.txHash.length > 0 && (
                                        <div key={bar.id} className="relative">
                                            <div className="simulation-success flex flex-col justify-center items-start gap-6 bg-purple-100 p-5 rounded-xl text-black font-medium border-2 border-purple-300 shadow-md transition duration-300">
                                                <div className="w-full flex justify-between items-center gap-2">
                                                    <h1 className="flex justify-center items-center gap-3 text-black font-semibold text-base">
                                                        {inputBarIndex + 1}.
                                                        <span>
                                                          {bar.data.fromNetwork} To {bar.data.toNetwork}
                                                        </span>
                                                    </h1>
                                                    <MdDelete
                                                        color="red"
                                                        size="40px"
                                                        onClick={() => removeBatch(inputBarIndex)}
                                                        className="hover:bg-slate-50 active:bg-slate-100 p-2 rounded-full"
                                                    />
                                                </div>
                                                <div
                                                    className="w-full flex flex-col justify-between items-start gap-2 p-3 rounded-xl bg-white shadow-sm"
                                                    onClick={() => toggleShowBatchList(bar.id)}
                                                >
                                                    <div className="w-full flex justify-between items-center gap-2">
                                                        <div className="flex justify-start items-start gap-5">
                                                            <div className="relative">
                                                                <Image
                                                                    src={polygon}
                                                                    alt=""
                                                                    className="h-10 w-10 bg-slate-200 rounded-full cursor-pointer"
                                                                    />
                                                                    <div className="absolute -bottom-1 -right-1 bg-white h-5 w-5 flex justify-center items-center rounded-full">
                                                                        <Image
                                                                            src={polygon}
                                                                            alt=""
                                                                            className="h-4 w-4 bg-slate-200 rounded-full cursor-pointer"
                                                                        />
                                                                    </div>
                                                            </div>
                                                            <div className="flex flex-col justify-start items-start">
                                                                <span className="text-lg md:text-xl lg:text-2xl font-bold text-slate-700">
                                                                    {bar.data.amountIn}
                                                                </span>
                                                                <span className="text-base md:text-lg font-semibold text-slate-700">
                                                                   {bar.data.fromProtocol} on {bar.data.fromNetwork}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex justify-center items-center bg-purple-100 hover:bg-purple-200 rounded-full p-0.5"
                                                        >
                                                            {showIndividualBatchList === bar.id ? (
                                                                <MdKeyboardArrowUp size="30px" />
                                                            ) : (
                                                                <MdKeyboardArrowDown size="30px" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    {showIndividualBatchList === bar.id && (
                                                        <div className="flex flex-col justify-start items-start gap-1 pl-10 pt-3">
                                                            <div className="flex justify-center items-center gap-3">
                                                                <div className="relative">
                                                                    <Image
                                                                        src={polygon}
                                                                        alt=""
                                                                        className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                                                                        />
                                                                        <div className="absolute -bottom-1 -right-1 bg-white h-4 w-4 flex justify-center items-center rounded-full">
                                                                            <Image
                                                                                src={polygon}
                                                                                alt=""
                                                                                className="h-3 w-3 bg-slate-200 rounded-full cursor-pointer"
                                                                            />
                                                                        </div>
                                                                </div>
                                                                <div className="flex flex-col justify-start items-start">
                                                                    <span className="text-sm md:text-base font-semibold text-slate-700">
                                                                        {bar.data.fromProtocol} on {bar.data.fromNetwork}
                                                                    </span>
                                                                    <span className="text-xs md:text-sm font-semibold text-slate-700">
                                                                        {bar.data.amountIn} {bar.data.fromToken}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Image
                                                                src={downLine}
                                                                alt=""
                                                                className="h-8"
                                                            />
                                                            <div className="flex justify-center items-center gap-3">
                                                                <div className="relative">
                                                                    <Image
                                                                        src={base}
                                                                        alt=""
                                                                        className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                                                                        />
                                                                        <div className="absolute -bottom-1 -right-1 bg-white h-4 w-4 flex justify-center items-center rounded-full">
                                                                            <Image
                                                                                src={base}
                                                                                alt=""
                                                                                className="h-3 w-3 bg-slate-200 rounded-full cursor-pointer"
                                                                            />
                                                                        </div>
                                                                </div>
                                                                <div className="flex flex-col justify-start items-start">
                                                                    <span className="text-sm md:text-base font-semibold text-slate-700">
                                                                        {bar.data.toProtocol} on {bar.data.toNetwork}
                                                                    </span>
                                                                    <span className="text-xs md:text-sm font-semibold text-slate-700">
                                                                        {bar.data.amountIn} {bar.data.toToken}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-full flex justify-between items-center gap-2">
                                                    <div className="flex justify-center items-center gap-3 text-black font-semibold text-base">
                                                        <Image
                                                            src={gas}
                                                            alt=""
                                                            className="h-7 w-7"
                                                        />
                                                        <span>
                                                          $0.70
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-center items-center gap-3 text-black font-semibold text-base">
                                                        <Image
                                                            src={bridgeCost}
                                                            alt=""
                                                            className="h-7 w-7"
                                                        />
                                                        <span>
                                                          $0.00
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ))
                        ) : (
                            <div className="text-center text-slate-600 font-semibold text-base md:text-lg">
                                {txhash ? "Last Batches executed, Now create new batches" : "No Batches Found !" }
                            </div>
                        )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trade;
