import Image from "next/image";
import { tTrade } from "./types";
import { useState, useEffect } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { NETWORK_LIST, protocolByNetwork, protocolNames } from "../../utils/constants";
import { swap, warning } from "../../assets/images";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { useChain } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { ImSpinner } from "react-icons/im";

const Trade: React.FC<any> = ({}: tTrade) => {

    const chain = useChain(); // Detect the connected address

    const [selectedFromNetwork, setSelectedFromNetwork] = useState({
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    })

    const [selectedFromProtocol, setSelectedFromProtocol] = useState("")
    const [selectedFromToken, setSelectedFromToken] = useState("")

    const [selectedToNetwork, setSelectedToNetwork] = useState({
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    })

    const [selectedToProtocol, setSelectedToProtocol] = useState("")
    const [selectedToToken, setSelectedToToken] = useState("")

    const handleSelectFromNetwork = (data: any) => {
        setSelectedFromNetwork(data)
    };

    const handleSelectToNetwork = (data: any) => {
        setSelectedToNetwork(data)
    };

    const [showFromSelectionMenu, setShowFromSelectionMenu] = useState(false)
    const [showToSelectionMenu, setShowToSelectionMenu] = useState(false)

    const [tokensData, setTokensData] = useState<any>("")
    const [amountIn, setAmountIn] = useState("")
    const [filterFromToken, setFilterFromToken] = useState("")
    const [filterToToken, setFilterToToken] = useState("")

    const [addToBatchLoading, setAddToBatchLoading] = useState(false)
    const [showBatchList, setShowBatchList] = useState(false)

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
                if (selectedFromProtocol === "erc20") {
                    const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === chain?.chainId);
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

    const sendBatch = async (isSCW: any) => {
        try {
            if (isSCW) {
                setAddToBatchLoading(true);
                setShowBatchList(true)
            } 
            setAddToBatchLoading(false);
        } catch (error) {
            setAddToBatchLoading(false);
            alert(error);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center py-5">
            <div className={`${showBatchList ? '!w-full' : '!w-[50%]'} h-full flex flex-col lg:flex-row justify-center items-center gap-4`}>
                <div className="w-full min-h-full">
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
                                            {protocolNames[selectedFromNetwork.chainName]?.key.map((item: any, protocolIndex: any) => (
                                                <div
                                                    key={item}
                                                    className="w-full"
                                                >
                                                    <div
                                                        key={item}
                                                        onClick={() => setSelectedFromProtocol(item)}
                                                        className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                    >
                                                        <div>
                                                            {protocolNames[selectedFromNetwork.chainName].value[protocolIndex]}
                                                        </div>
                                                    </div>
                                                    
                                                    {selectedFromProtocol === item && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {protocolByNetwork[selectedFromNetwork.chainName][selectedFromProtocol]?.map((token: any, tokenIndex: any) => (
                                                                <div
                                                                    key={tokenIndex}
                                                                    onClick={() => setSelectedFromToken(token)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
                                                                    {token}
                                                                </div>
                                                            ))} 
                                                        </div>
                                                    )}
                                                    {selectedFromProtocol === "erc20" && tokensData && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {tokensData?.map((token: any, tokenIndex: any) => (
                                                                <div 
                                                                    key={tokenIndex}
                                                                    onClick={() => setSelectedFromToken(token.symbol)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
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
                                            {protocolNames[selectedToNetwork.chainName]?.key.map((item: any, protocolIndex: any) => (
                                                <div
                                                    key={item}
                                                    className="w-full"
                                                >
                                                    <div
                                                        key={item}
                                                        onClick={() => setSelectedToProtocol(item)}
                                                        className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                    >
                                                        <div>
                                                            {protocolNames[selectedToNetwork.chainName].value[protocolIndex]}
                                                        </div>
                                                    </div>
                                                    {selectedToNetwork === item && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {protocolByNetwork[selectedToNetwork.chainName][selectedToProtocol]?.map((token: any, tokenIndex: any) => (
                                                                <div
                                                                    key={tokenIndex}
                                                                    onClick={() => setSelectedToToken(token)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
                                                                    {token}
                                                                </div>
                                                            ))} 
                                                        </div>
                                                    )}
                                                    {selectedToProtocol === "erc20" && tokensData && (
                                                        <div className="bg-blue-200 rounded-lg p-3 my-1">
                                                            {tokensData?.map((token: any, tokenIndex: any) => (
                                                                <div 
                                                                    key={tokenIndex}
                                                                    onClick={() => setSelectedToToken(token.symbol)}
                                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                                >
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
                        <div className="w-full bg-gray-50 flex flex-col gap-5 shadow-md shadow-primary-950 rounded-lg cursor-pointer px-5 py-7">
                            <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold">
                                Building Batch
                            </h1>

                            <div 
                                className={`w-full relative flex justify-center items-center gap-5 ${
                                    selectedToNetwork.chainName 
                                    && selectedToProtocol 
                                    &&selectedToToken
                                    && selectedFromNetwork.chainName 
                                    && selectedFromProtocol 
                                    &&selectedFromToken
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
                                        className={`h-12 w-12 p-3 rotate-90 ${
                                            selectedToNetwork.chainName 
                                            && selectedToProtocol 
                                            &&selectedToToken
                                            && selectedFromNetwork.chainName 
                                            && selectedFromProtocol 
                                            &&selectedFromToken
                                            ? 'rotate-90'
                                            : 'rotate-0' 
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
                                        value={amountIn}
                                        onChange={(e) => setAmountIn(e.target.value)}
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
                                            / 0
                                        </span>
                                    </div>
                                </div>
                                </div>
                            </div>
                            {/* ---------- YOU PAY Section END ---------- */}

                            {/* ---------- Add Batch o List START ---------- */}
                            <div className="flex justify-start items-center gap-3 text-sm md:text-base font-medium bg-yellow-400 shadow rounded-lg px-5 py-2">
                                <Image
                                    src={warning}
                                    alt=""
                                    className="h-8 w-8"
                                />
                                You don&#39;t have enough funds to complete transaction.
                            </div>

                            <div className="w-full flex justify-center items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => sendBatch(true)}
                                    className="w-full flex justify-center items-center gap-2 bg-purple-900 hover:bg-purple-950 py-2 px-5 rounded-full text-white font-medium border-b-4 border-purple-950 transition duration-300"
                                >
                                    {addToBatchLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                                    Add Batch to List
                                </button>
                            </div>
                            {/* ---------- Add Batch o List Section END ---------- */}

                        </div>
                    )}
                </div>
                {/* <div className={`w-full min-h-full ${showBatchList
                        ? "opacity-100"
                        : "opacity-0"
                    } transition-all delay-100 duration-300 ease-linear`}> */}
                    {showBatchList && (
                        <div className="w-full min-h-full bg-gray-50 flex flex-col justify-start items-center gap-5 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                            <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold mb-5">
                                Batchig List
                            </h1>
                            <div className="text-slate-600 font-semibold text-base md:text-lg">
                               No Batches Found !
                            </div>
                        </div>
                    )}
                {/* </div> */}
            </div>
        </div>
    );
};

export default Trade;
