import * as React from "react";
import { useEffect } from "react";

import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { ImSpinner } from "react-icons/im";
import { BiSolidChevronDown } from "react-icons/bi";
import { useAddress, useChain } from "@thirdweb-dev/react";

import IERC20 from "../../abis/IERC20.json";
import { setSafeState } from "../../utils/helper";
import ChainContext from "../../Context/ChainContext";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { useRefinance } from "../../hooks/Batching/useRefinance";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iBatchingTxn, useBatchingTxnStore } from "../../store/BatchingTxnStore";
import { getContractInstance, getErc20Balanceof, getErc20Decimals, getProvider } from "../../utils/web3Libs/ethers";
import { _functionType, _nonce, BIG_ZERO, protocolByNetwork, protocolNames, tokenAddressByProtocol } from "../../utils/constants";

bg.config({ DECIMAL_PLACES: 10 });

const IndividualBatch: React.FC<any> = ({ onUpdate }: any) => {
    const address = useAddress(); // Detect the connected address
    const chain = useChain(); // Detect the connected address
    const { mutateAsync: refinance } = useRefinance();
    const { selectedChain, selectedChainId } = React.useContext(ChainContext);

    useEffect(() => {
        // toast.error(selectedChain)
    }, []);

    const { smartAccount }: iGlobal = useGlobalStore((state) => state);

    const {
        tokensData,
        setTokensData,
        // fromProtocol,
        // setFromProtocol,
        // toProtocol,
        // setToProtocol,
        // fromToken,
        // setFromToken,
        // toToken,
        // setToToken,
        // amountIn,
        // setAmountIn,
        // fromTokenBalanceForSCW,
        // setFromTokenBalanceForSCW,
        // fromTokenBalanceForEOA,
        // setFromTokenBalanceForEOA,
        // fromTokenDecimal,
        // setFromTokenDecimal,
        addToBatchLoading,
        setAddToBatchLoading,
        apys,
        setApys,
        apysTo,
        setApysForTo,
        sendTxLoadingForEoa,
        setSendtxLoadingForEoa,
    }: iBatchingTxn = useBatchingTxnStore((state) => state);

    const [fromProtocol, setFromProtocol] = React.useState<string>();
    const [toProtocol, setToProtocol] = React.useState<string>();
    const [fromToken, setFromToken] = React.useState<string>();
    const [toToken, setToToken] = React.useState<string>();
    const [amountIn, setAmountIn] = React.useState<string>();
    const [fromTokenBalanceForSCW, setFromTokenBalanceForSCW] = React.useState<BigNumber>(BigNumber.from(0));
    const [fromTokenBalanceForEOA, setFromTokenBalanceForEOA] = React.useState<BigNumber>(BigNumber.from(0));
    const [fromTokenDecimal, setFromTokenDecimal] = React.useState<number>();

    useEffect(() => {
        async function onChangeFromProtocol() {
            if (fromProtocol) {
                if (fromProtocol != "erc20") {
                    setAmountIn("");
                    // setAmountIn(BIG_ZERO);
                    setFromTokenDecimal(0);
                    setFromTokenBalanceForSCW(BIG_ZERO);
                    setFromTokenBalanceForEOA(BIG_ZERO);
                    const firstFromToken = protocolByNetwork[selectedChain][fromProtocol][0];
                    setFromToken(firstFromToken);
                    const provider = await getProvider(selectedChainId);
                    const tokenAddress = tokenAddressByProtocol[selectedChain][fromProtocol][firstFromToken];
                    const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
                    const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
                    const eoaBalance = await getErc20Balanceof(erc20, address);
                    const fromTokendecimal = await getErc20Decimals(erc20);
                    setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
                    setSafeState(setFromTokenBalanceForSCW, BigNumber.from(scwBalance), BIG_ZERO);
                    setSafeState(setFromTokenBalanceForEOA, BigNumber.from(eoaBalance), BIG_ZERO);
                } else {
                    const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === chain?.chainId);
                    const filteredTokens = tokensWithChainId.map((token) => {
                        const { extensions, logoURI, ...filteredToken } = token;
                        return filteredToken;
                    });
                    console.log("filteredTokens: ", filteredTokens);
                    setTokensData(filteredTokens);
                }
            }
        }
        onChangeFromProtocol();
    }, [fromProtocol]);

    useEffect(() => {
        async function onChangeFromProtocol() {
            console.log('toProtocol-0', toProtocol, tokensData)
            if (toProtocol) {
                if (toProtocol == "erc20" && tokensData.length <1) {
                    console.log("toProtocol-1", toProtocol)
                    const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === BigNumber.from(selectedChainId).toNumber());
                    const filteredTokens = tokensWithChainId.map((token) => {
                        const { extensions, logoURI, ...filteredToken } = token;
                        return filteredToken;
                    });
                    console.log("filteredTokens: ", filteredTokens);
                    setTokensData(filteredTokens);
                }
                console.log("toProtocol-2", toProtocol)
            }
        }
        onChangeFromProtocol();
    }, [toProtocol]);

    const onChangeFromProtocol = async (_fromProtocol: any) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (!(selectedChain == "polygon" || selectedChain == "base")) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        setFromProtocol("");
        setFromProtocol(_fromProtocol);
    };

    const onChangeToProtocol = async (_toProtocol: any) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (!(selectedChain == "polygon" || selectedChain == "base")) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        setToToken("");
        setToProtocol(_toProtocol);
    };

    const onChangeFromToken = async (_fromToken: any) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        // if (selectedChain != "polygon") {
        if (!(selectedChain == "polygon" || selectedChain == "base")) {
            toast.error("Batching is only supported on polygon as of now");
            return;
        }
        if (!fromProtocol) {
            toast.error("select from protocol");
            return;
        }
        // setAmountIn(BIG_ZERO);
        setAmountIn("");
        setFromTokenDecimal(0);
        setFromTokenBalanceForSCW(BIG_ZERO);
        setFromTokenBalanceForEOA(BIG_ZERO);
        setFromToken(_fromToken);
        const provider = await getProvider(selectedChainId);

        const erc20Address: any =
            fromProtocol == "erc20" ? tokensData.filter((token: any) => token.symbol === _fromToken) : "";
        const tokenAddress =
            fromProtocol != "erc20"
                ? tokenAddressByProtocol[selectedChain][fromProtocol][_fromToken]
                : erc20Address[0].address;
        const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
        const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
        const eoaBalance = await getErc20Balanceof(erc20, address);
        const fromTokendecimal = await getErc20Decimals(erc20);
        setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
        setSafeState(setFromTokenBalanceForSCW, BigNumber.from(scwBalance), BIG_ZERO);
        setSafeState(setFromTokenBalanceForEOA, BigNumber.from(eoaBalance), BIG_ZERO);
    };

    const onChangeToToken = async (_toToken: any) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        // if (selectedChain != "polygon") {
        if (!(selectedChain == "polygon" || selectedChain == "base")) {
            toast.error("Batching is only supported on polygon as of now");
            return;
        }
        setToToken(_toToken);
    };

    const onChangeAmountIn = async (_amountIn: any) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        // if (selectedChain != "polygon") {
        if (!(selectedChain == "polygon" || selectedChain == "base")) {
            toast.error("Batching is only supported on polygon as of now");
            return;
        }
        if (_amountIn && fromTokenDecimal) {
            let amountInByDecimals = bg(_amountIn.toString());
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(fromTokenDecimal));
            // if (typeof _amountIn !== 'undefined' && amountInByDecimals.eq(0)) {
            // const amountInString = _amountIn.toString();
            // const amountInString = Number.isNaN(_amountIn) ? '0' : _amountIn.toString();
            // console.log('amountInString-', amountInString)
            setAmountIn(_amountIn);
            // } else {
            //     console.log('amountInByDecimals-', amountInByDecimals.toString())
            //     // const amountInByDecimalsString = amountInByDecimals.toString(10);
            //     const amountInByDecimalsString = amountInByDecimals.toFixed(fromTokenDecimal); // 18 decimal places, adjust as needed
            //     console.log('amountInByDecimalsString-', amountInByDecimalsString)
            //     setAmountIn(BigNumber.from(amountInByDecimalsString.toString()));
            // }
        } else {
            // setAmountIn(BIG_ZERO);
            setAmountIn("");
        }
    };

    const sendBatch = async (isSCW: any) => {
        try {
            if (isSCW) {
                setAddToBatchLoading(true);
            } else {
                // setSendtxLoadingForEoa(true);
            }
            if (fromToken == toToken) {
                toast.error("fromToken and toToken should not same-");
                return;
            }
            // if (selectedChain != "polygon") {
            if (!(selectedChain == "polygon" || selectedChain == "base")) {
                toast.error("Batching is only supported on polygon as of now");
                return;
            }
            if (addToBatchLoading) {
                toast.error("wait, tx loading");
                return;
            }
            if (!fromProtocol) {
                toast.error("select from protocol");
                return;
            }
            if (!fromToken) {
                toast.error("select fromToken");
                return;
            }
            if (!toProtocol) {
                toast.error("select to protocol");
                return;
            }
            if (!toToken) {
                toast.error("select toToken");
                return;
            }
            if (!amountIn) {
                toast.error("select amountIn");
                return;
            }
            if (!fromTokenDecimal) {
                toast.error("select amountIn");
                return;
            }
            const provider = await getProvider(selectedChainId);
            console.log(
                "refinanceamoynt",
                amountIn.toString(),
                bg(amountIn).multipliedBy(bg(10).pow(fromTokenDecimal)).toString()
            );
            const _tempAmount = BigNumber.from(bg(amountIn).multipliedBy(bg(10).pow(fromTokenDecimal)).toString());
            const txHash = await refinance({
                isSCW: isSCW,
                fromProtocol: fromProtocol,
                toProtocol: toProtocol,
                tokenIn: "",
                tokenInName: fromToken,
                tokenOut: "",
                tokenOutName: toToken,
                // amount: amountIn,
                amount: _tempAmount,
                address: isSCW ? smartAccount.address : address,
                provider,
            });
            onUpdate(txHash, {
                fromProtocol,
                toProtocol,
                fromToken,
                toToken,
                amountIn: amountIn,
                // fromTokenDecimal &&
                // bg(BigNumber.from(amountIn).toString()).dividedBy(bg(10).pow(fromTokenDecimal)).toString(),
            });
            setAddToBatchLoading(false);
            // setSendtxLoadingForEoa(false);
        } catch (error: any) {
            setAddToBatchLoading(false);
            // setSendtxLoadingForEoa(false);
            toast.error(error);
            console.log("sendBatch-error", error);
        }
    };
    return (
        <>
            <div className="w-full">
                <span className="text-black font-semibold text-xs md:text-sm lg:text-base">From</span>
                <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow rounded-md overflow-hidden mt-1">
                    <div className="w-48 relative">
                        <label htmlFor="fromNetwork" className="sr-only">
                            From Protocol
                        </label>
                        <select
                            className="appearance-none w-full outline-none px-3 py-2 font-medium"
                            placeholder="Network"
                            name="networks"
                            id="fromNetwork"
                            onChange={(e: any) => onChangeFromProtocol(e.target.value)}
                            value={fromProtocol ? fromProtocol : ""}
                        >
                            <option value="" disabled selected>
                                Protocols
                            </option>
                            {/* <option value="aaveV2">AAVE V2</option>
                            <option value="aaveV3">AAVE V3</option>
                            <option value="compoundV3">Compound V3</option>
                            <option value="dForce">dForce</option>
                            <option value="erc20">ERC20</option> */}

                            {selectedChain &&
                                protocolNames[selectedChain].key.map((protocol: any, protocolIndex: any) => (
                                    <option value={protocol} key={protocolIndex}>
                                        {protocolNames[selectedChain].value[protocolIndex]}
                                    </option>
                                ))}
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
                            className="appearance-none w-full outline-none px-3 py-2 font-medium"
                            placeholder="Token"
                            name="networks"
                            id="token"
                            value={fromToken ? fromToken : ""}
                            onChange={(e: any) => onChangeFromToken(e.target.value)}
                        >
                            <option value="" disabled selected>
                                From Tokens
                            </option>

                            {fromProtocol && fromProtocol != "erc20"
                                ? protocolByNetwork[selectedChain][fromProtocol].map((token: any, tokenIndex: any) => (
                                      // <option value={token} key={tokenIndex}>{token} {apys[tokenIndex] ? (`(APY: ${apys[tokenIndex]} %)`) : "(APY: Not Available)"}</option>
                                      <option value={token} key={tokenIndex}>
                                          {token}
                                      </option>
                                  ))
                                : tokensData &&
                                  tokensData.map((token: any, tokenIndex: any) => (
                                      // <option value={token} key={tokenIndex}>{token} {apys[tokenIndex] ? (`(APY: ${apys[tokenIndex]} %)`) : "(APY: Not Available)"}</option>
                                      <option value={token.symbol} key={tokenIndex}>
                                          {token.symbol}
                                      </option>
                                  ))}
                        </select>
                        <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                            <BiSolidChevronDown size="20px" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <span className="text-black font-semibold text-xs md:text-sm lg:text-base">To</span>
                <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow rounded-md overflow-hidden mt-1">
                    <div className="w-48 relative">
                        <label htmlFor="toNetwork" className="sr-only">
                            To Protocols
                        </label>
                        <select
                            className="appearance-none w-full outline-none px-3 py-2 font-medium"
                            placeholder="Network"
                            name="networks"
                            id="toNetwork"
                            onChange={(e: any) => onChangeToProtocol(e.target.value)}
                            value={toProtocol ? toProtocol : ""}
                        >
                            <option value="" disabled selected>
                                Protocols
                            </option>
                            {/* <option value="aaveV2">AAVE V2</option>
                            <option value="aaveV3">AAVE V3</option>
                            <option value="compoundV3">Compound V3</option>
                            <option value="dForce">dForce</option>
                            <option value="erc20">ERC20</option> */}

                            {selectedChain &&
                                protocolNames[selectedChain].key.map((protocol: any, protocolIndex: any) => (
                                    <option value={protocol} key={protocolIndex}>
                                        {protocolNames[selectedChain].value[protocolIndex]}
                                    </option>
                                ))}
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
                            className="appearance-none w-full outline-none px-3 py-2 font-medium"
                            placeholder="To Token"
                            name="contractAddresses"
                            id="contractAddresses"
                            onChange={(e: any) => onChangeToToken(e.target.value)}
                            value={toToken}
                        >
                            <option key={"0x"} value="" disabled selected>
                                To Tokens
                            </option>
                            {toProtocol && toProtocol != "erc20"
                                ? protocolByNetwork[selectedChain][toProtocol].map((token: any, tokenIndex: any) => (
                                      <option value={token} key={tokenIndex}>
                                          {token}
                                      </option>
                                      // <option value={token} key={tokenIndex}>{token} {apysTo[tokenIndex] ? (`(APY: ${apysTo[tokenIndex]} %)`) : "(APY: Not Available)"}</option>
                                  ))
                                : tokensData &&
                                  tokensData.map((token: any, tokenIndex: any) => (
                                      // <option value={token} key={tokenIndex}>{token} {apys[tokenIndex] ? (`(APY: ${apys[tokenIndex]} %)`) : "(APY: Not Available)"}</option>
                                      <option value={token.symbol} key={tokenIndex}>
                                          {token.symbol}
                                      </option>
                                  ))}
                        </select>
                        <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                            <BiSolidChevronDown size="20px" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="flex justify-between items-center gap-2 text-black font-semibold text-xs md:text-sm pr-2">
                    <span>Total Amount</span>
                    <span>
                        {`(SmartAccount Balance : ${
                            fromTokenDecimal && fromTokenBalanceForSCW != undefined
                                ? bg(BigNumber.from(fromTokenBalanceForSCW).toString())
                                      .dividedBy(bg(10).pow(fromTokenDecimal))
                                      .toString()
                                : "calculating..."
                        } ${fromToken ? fromToken : ""})
                                    `}
                        {`|| (EOA Balance : ${
                            fromTokenDecimal && fromTokenBalanceForEOA != undefined
                                ? bg(BigNumber.from(fromTokenBalanceForEOA).toString())
                                      .dividedBy(bg(10).pow(fromTokenDecimal))
                                      .toString()
                                : "calculating..."
                        } ${fromToken ? fromToken : ""})
                                    `}
                    </span>
                </div>
                <div className="w-full flex justify-start items-center gap-1 text-secondary-800 bg-white shadow rounded-md overflow-hidden mt-1">
                    <input
                        type="number"
                        min="0"
                        placeholder={!fromTokenDecimal ? "amountIn : (wait for FromToken)" : "amountIn"}
                        disabled={!fromTokenDecimal ? true : false}
                        className="w-full bg-white font-medium outline-none shadow-outline border-2  rounded-md py-2 px-3 block appearance-none leading-normal focus:border-primary-950"
                        value={
                            // fromTokenDecimal && BigNumber.from(amountIn).gt(0)
                            //     ? bg(amountIn.toString()).dividedBy(bg(10).pow(fromTokenDecimal)).toString()
                            //     : amountIn.toString()
                            fromTokenDecimal && amountIn && bg(amountIn).isGreaterThan(0) ? amountIn : amountIn
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
                    {addToBatchLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                    Add Batch to List
                </button>
            </div>
        </>
    );
};

export default IndividualBatch;
