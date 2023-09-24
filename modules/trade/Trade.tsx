import Image from "next/image";
import { tTrade } from "./types";
import { useState, useEffect } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { NETWORK_LIST, protocolByNetwork, protocolNames } from "../../utils/constants";
import { warning } from "../../assets/images";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { useChain } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";


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

    useEffect(() => {
        if (selectedFromNetwork.chainName && selectedFromProtocol && selectedFromToken) {
            setShowFromSelectionMenu(false)
        }
    }, [selectedFromNetwork, selectedFromProtocol, selectedFromToken])

    useEffect(() => {
        if (selectedToNetwork.chainName && selectedToProtocol && selectedToToken) {
            setShowFromSelectionMenu(false)
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
            if (selectedFromProtocol) {
                if (selectedFromProtocol == "erc20" && tokensData.length <1) {
                    const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === BigNumber.from(selectedToNetwork.chainId).toNumber());
                    const filteredTokens = tokensWithChainId.map((token) => {
                        const { extensions, logoURI, ...filteredToken } = token;
                        return filteredToken;
                    });
                    console.log("filteredTokens: ", filteredTokens);
                    setTokensData(filteredTokens);
                }
            }
        }
        onChangeselectedToProtocol();
    }, [selectedToNetwork]);

    return (
        <div className="w-full flex flex-col justify-center items-center py-5">
            <div className="w-full h-full flex flex-col lg:flex-row justify-center items-start gap-4">
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
                                        placeholder="Search by token name or address"
                                        className="w-full text-sm md:text-base outline-none"
                                    />
                                    <AiOutlineSearch />
                                </div>
                                <div className="w-full overflow-auto flex flex-col justify-center items-center py-3">
                                    {showFromSelectionMenu && selectedFromNetwork.chainName &&
                                        protocolNames[selectedFromNetwork.chainName]?.key.map((item: any, protocolIndex: any) => (
                                            <div
                                                key={item}
                                                className="w-full"
                                            >
                                                <div
                                                    key={item}
                                                    onClick={() => setSelectedFromProtocol(item)}
                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                    >
                                                    {/* <Image
                                                        src={item.icon}
                                                        alt=""
                                                        className="h-8 w-8 rounded-full"
                                                    /> */}
                                                    <div>
                                                        {protocolNames[selectedFromNetwork.chainName].value[protocolIndex]}
                                                    </div>
                                                </div>
                                                
                                                {selectedFromProtocol === item &&
                                                    protocolByNetwork[selectedFromNetwork.chainName][selectedFromProtocol]?.map((token: any, tokenIndex: any) => (
                                                        <div
                                                            key={tokenIndex}
                                                            onClick={() => setSelectedFromToken(token)}
                                                            className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                        >
                                                            {token}
                                                        </div>
                                                    )) 
                                                }
                                                {selectedFromProtocol === "erc20" && tokensData &&
                                                    tokensData?.map((token: any, tokenIndex: any) => (
                                                        <div 
                                                            key={tokenIndex}
                                                            onClick={() => setSelectedFromToken(token.symbol)}
                                                            className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                        >
                                                            {token.symbol}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    ))}

                                    {showToSelectionMenu && selectedToNetwork.chainName &&
                                        protocolNames[selectedToNetwork.chainName]?.key.map((item: any, protocolIndex: any) => (
                                            <div
                                                key={item}
                                                className="w-full"
                                            >
                                                <div
                                                    key={item}
                                                    onClick={() => setSelectedToProtocol(item)}
                                                    className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                    >
                                                    {/* <Image
                                                        src={item.icon}
                                                        alt=""
                                                        className="h-8 w-8 rounded-full"
                                                    /> */}
                                                    <div>
                                                        {protocolNames[selectedToNetwork.chainName].value[protocolIndex]}
                                                    </div>
                                                </div>
                                                {selectedToNetwork === item &&
                                                    protocolByNetwork[selectedToNetwork.chainName][selectedToProtocol]?.map((token: any, tokenIndex: any) => (
                                                        <div
                                                            key={tokenIndex}
                                                            onClick={() => setSelectedToToken(token)}
                                                            className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                        >
                                                            {token}
                                                        </div>
                                                    )) 
                                                }
                                                {selectedToProtocol === "erc20" && tokensData &&
                                                    tokensData?.map((token: any, tokenIndex: any) => (
                                                        <div 
                                                            key={tokenIndex}
                                                            onClick={() => setSelectedToToken(token.symbol)}
                                                            className="w-full flex justify-start items-center gap-3 hover:bg-slate-300 active:bg-slate-200 py-2 px-3 rounded-lg cursor-pointer"
                                                        >
                                                            {token.symbol}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-gray-50 flex flex-col gap-5 shadow-md shadow-primary-950 rounded-lg cursor-pointer px-5 py-7">
                            <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold">
                                Building Batch
                            </h1>

                            {/* ---------- FROM Section START ---------- */}
                            <div 
                                onClick={() => setShowFromSelectionMenu(true)}
                                className="bg-white border border-slate-300 shadow rounded-lg px-5 py-3"
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
                                                    on {selectedFromProtocol} Chain
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

                            {/* ---------- To Section START ---------- */}
                            <div 
                                onClick={() => setShowToSelectionMenu(true)}
                                className="bg-white border border-slate-300 shadow rounded-lg px-5 py-3"
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
                                            on {selectedToProtocol} Chain
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

                            {/* ---------- YOU PAY Section START ---------- */}
                            <div 
                                className="bg-white border border-slate-300 shadow rounded-lg px-5 py-3"
                            >
                                <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-slate-800">
                                    You Pay
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

                            <div className="flex justify-center items-center gap-3">
                                <button
                                    type="button"
                                    className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                                >
                                    Add Batch to List
                                </button>
                            </div>
                            {/* ---------- Add Batch o List Section END ---------- */}

                        </div>
                    )}
                </div>

                <div className="w-full min-h-full bg-gray-50 flex flex-col gap-5 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                    <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold mb-5">
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Trade;
