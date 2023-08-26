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
import { BigNumber } from "ethers";
import { FiCopy } from "react-icons/fi";
import { useRefinance } from "../hooks/Batching/useRefinance";
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
    const { mutateAsync: refinance } = useRefinance();
    const { selectedChain, setSelectedChain, selectedChainId, setSelectedChainId } = React.useContext(ChainContext);
    const { smartAccount, sendTxLoading, sendTxLoadingForEoa, txhash }: any = useAppStore((state) => state);

    const [fromProtocol, setFromProtocol] = React.useState<any>();
    const [toProtocol, setToProtocol] = React.useState<any>();
    const [fromToken, setFromToken] = React.useState<any>();
    const [toToken, setToToken] = React.useState<any>();
    const [amountIn, setAmountIn] = React.useState<any>();
    const [fromTokenBalanceForSCW, setFromTokenBalanceForSCW] = React.useState<any>(0);
    const [fromTokenBalanceForEOA, setFromTokenBalanceForEOA] = React.useState<any>(0);
    const [fromTokenDecimal, setFromTokenDecimal] = React.useState<any>(0);

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
        console.log("_amountIn-1", _amountIn.toString());
        if (_amountIn) {
            console.log("_amountIn-2", _amountIn.toString());
            let amountInByDecimals = bg(_amountIn);
            console.log("_amountIn-3", amountInByDecimals.toString());
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(fromTokenDecimal));
            console.log("_amountIn-4", amountInByDecimals.toString());
            if (amountInByDecimals.eq(0)) {
                console.log("_amountIn-5", _amountIn.toString());
                setAmountIn(_amountIn);
            } else {
                console.log("_amountIn-6", amountInByDecimals.toString());
                setAmountIn(amountInByDecimals.toString());
            }
        } else {
            console.log("_amountIn-7", _amountIn.toString());
            setAmountIn("");
        }
    };

    const copyToClipboard = (id: any) => {
        navigator.clipboard.writeText(id);
        // Alert the copied text
        toast.success("Destination Lending CallData Copied");
    };

    const sendBatch = async (isSCW: any) => {
        try {
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
    return (
        <>
            <div className="main-container flex justify-start items-start gap-3">
                {true && (
                    <div className="w-full h-[calc(100vh-108px)] bg-gradient-to-r from-primary-950 via-primary-600 to-primary-950 flex flex-col justify-center items-center gap-5 border-2 border-secondary-800 shadow-sm shadow-primary-950 rounded-lg cursor-pointer p-10">
                        <div className="w-full">
                            <span className="text-white font-semibold text-xs md:text-sm lg:text-base">From</span>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md mt-1">
                                <div className="w-48 relative">
                                    <label htmlFor="fromNetwork" className="sr-only">
                                        From Protocol
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
                                        placeholder="Network"
                                        name="networks"
                                        id="fromNetwork"
                                        onChange={(e: any) => onChangeFromProtocol(e.target.value)}
                                        value={fromProtocol ? fromProtocol : ""}
                                    >
                                        <option value="" disabled selected>
                                            Protocols
                                        </option>
                                        <option value="aaveV2">AAVE V2</option>
                                        <option value="compoundV3">Compound V3</option>
                                        <option value="dForce">dForce</option>
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                                <div className="w-full relative">
                                    <label htmlFor="token" className="sr-only">
                                        Tokens
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
                                        placeholder="Token"
                                        name="networks"
                                        id="token"
                                        value={fromToken ? fromToken : ""}
                                        onChange={(e: any) => onChangeFromToken(e.target.value)}
                                    >
                                        <option value="" disabled selected>
                                            From Tokens
                                        </option>

                                        {fromProtocol &&
                                            protocolByNetwork[fromProtocol].map((token: any, tokenIndex: any) => (
                                                <option value={token} key={tokenIndex}>{token}</option>
                                            ))}
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-white -mb-3">
                            <HiOutlineRefresh size="22px" />
                        </div>

                        <div className="w-full">
                            <span className="text-white font-semibold text-xs md:text-sm lg:text-base">To</span>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md mt-1">
                                <div className="w-48 relative">
                                    <label htmlFor="toNetwork" className="sr-only">
                                        To Protocols
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
                                        placeholder="Network"
                                        name="networks"
                                        id="toNetwork"
                                        onChange={(e: any) => onChangeToProtocol(e.target.value)}
                                        value={toProtocol ? toProtocol : ""}
                                    >
                                        <option value="" disabled selected>
                                            Protocols
                                        </option>
                                        <option value="aaveV2">AAVE V2</option>
                                        <option value="compoundV3">Compound V3</option>
                                        <option value="dForce">dForce</option>
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                                <div className="w-full relative">
                                    <label htmlFor="contractAddresses" className="sr-only">
                                        To Tokens
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
                                        placeholder="To Token"
                                        name="contractAddresses"
                                        id="contractAddresses"
                                        onChange={(e: any) => onChangeToToken(e.target.value)}
                                        value={toToken}
                                    >
                                        <option key={"0x"} value="" disabled selected>
                                            To Tokens
                                        </option>
                                        {toProtocol &&
                                            protocolByNetwork[toProtocol].map((token: any, tokenIndex: any) => (
                                                <option value={token} key={tokenIndex}>{token}</option>
                                            ))}
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            {/* {
                                <>
                                    {scwTokenInBalance &&
                                        console.log(
                                            "lll",
                                            scwTokenInBalance.toString(),
                                            tokenInDecimals,
                                            bg(scwTokenInBalance).dividedBy(bg(10).pow(tokenInDecimals)).toString()
                                        )}
                                </>
                            } */}
                            <div className="flex justify-between items-center gap-2 text-white font-semibold text-xs md:text-sm pr-2">
                                <span>Total Amount</span>
                                <>{console.log("fromTokenBalance: ", fromTokenBalanceForSCW)}</>
                                <span>
                                    {`(SCW Balance : ${
                                        fromTokenBalanceForSCW != undefined
                                            ? bg(BigNumber.from(fromTokenBalanceForSCW).toString())
                                                  .dividedBy(bg(10).pow(fromTokenDecimal))
                                                  .toString()
                                            : "calculating..."
                                    } ${fromToken ? fromToken : ""})
                                    `}
                                    {`|| (EOA Balance : ${
                                        fromTokenBalanceForEOA != undefined
                                            ? bg(BigNumber.from(fromTokenBalanceForEOA).toString())
                                                  .dividedBy(bg(10).pow(fromTokenDecimal))
                                                  .toString()
                                            : "calculating..."
                                    } ${fromToken ? fromToken : ""})
                                    `}
                                </span>
                            </div>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md mt-1">
                                <input
                                    type="number"
                                    placeholder="amountIn"
                                    className="w-full bg-white font-medium outline-none shadow-outline border-2  rounded-md py-1 px-3 block appearance-none leading-normal focus:border-primary-950"
                                    value={
                                        amountIn != 0
                                            ? bg(amountIn).dividedBy(bg(10).pow(fromTokenDecimal)).toString()
                                            : amountIn
                                    }
                                    onChange={(e: any) => onChangeAmountIn(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-3 py-3">
                            <button
                                type="button"
                                onClick={() => sendBatch(true)}
                                className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                            >
                                {sendTxLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                                Sendbatch via SCW
                            </button>
                            <button
                                type="button"
                                onClick={() => sendBatch(false)}
                                className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                            >
                                {sendTxLoadingForEoa && <ImSpinner className="animate-spin h-5 w-5" />}
                                Sendbatch via EOA
                            </button>
                        </div>
                        <div className="flex justify-center items-center gap-3 py-5">
                            {txhash && (
                                <p>
                                    <a
                                        target="_blank"
                                        href={`https://polygonscan.com/tx/${txhash}`}
                                        style={{ color: "white" }}
                                    >
                                        TxHash : {shorten(txhash)}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
