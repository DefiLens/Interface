import * as React from "react";
import { useEffect } from "react";

import web3 from "web3";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ethers, BigNumber } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { FiCopy } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { BiSolidChevronDown } from "react-icons/bi";
import { useSigner, useChain, useAddress } from "@thirdweb-dev/react";

import IERC20 from "../abis/IERC20.json";
import ChainContext from "../Context/ChainContext";
import { useGlobalStore, iGlobal } from "../store/GlobalStore";
import { useTransferStore, iTransfer } from "../store/TransferStore";
import { shorten, setSafeState, chooseChianId } from "../utils/helper";
import { getErc20Decimals, getErc20Balanceof } from "../utils/web3Libs/ethers";
import { gasFeesNamesByMainChainId, gasFeesNamesByChainId, BIG_ZERO } from "../utils/constants";

bg.config({ DECIMAL_PLACES: 5 });

const Transfer: React.FC<{}> = () => {
    const { selectedChainId } = React.useContext(ChainContext);

    const {
        smartAccount,
        showTransferFundToggle
    }: iGlobal = useGlobalStore((state) => state);

    const {
        tokenAddress,
        setTokenAddress,
        amountIn,
        setAmountIn,
        amountInDecimals,
        setAmountInDecimals,
        isNative,
        setIsnative,
        isSCW,
        setIsSCW,
        sendTxLoading,
        setSendtxLoading,
        txhash,
        setTxHash,
        tokensData,
        setTokensData,
        scwBalance,
        setScwTokenInbalance,
        eoaBalance,
        setEoaTokenInbalance,
        tokenInDecimals,
        setTokenInDecimals,
        gasCost,
        setGasCost,
    }: iTransfer = useTransferStore((state) => state);

    const address = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address
    const chain = useChain();

    useEffect(() => {
        async function onChangeFromProtocol() {
            if (showTransferFundToggle) {
                const response: any = await axios.get("https://gateway.ipfs.io/ipns/tokens.uniswap.org");
                const tokensWithChain137 = response.data.tokens?.filter((token) => token.chainId === 137);
                const filteredTokens = tokensWithChain137.map((token) => {
                    const { extensions, logoURI, ...filteredToken } = token;
                    return filteredToken;
                });
                setTokensData(filteredTokens);
                console.log("TRANSFER FUND :-  filteredTokens: ", filteredTokens);
            }
        }
        setTokenAddress("");
        onChangeFromProtocol();
    }, [showTransferFundToggle]);

    const onOptionChange = async (e) => {
        try {
          setGasCost(0)
          setAmountIn(0)
          setAmountInDecimals(0)
          setTokenAddress("");
            setIsnative(!isNative);
            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) throw "no provider";
                if (!address) throw "no metamask connected";
                const _scwBalance = await provider.getBalance(smartAccount.address);
                const _eoaBalance = await provider.getBalance(address);
                setScwTokenInbalance(BigNumber.from(_scwBalance));
                setEoaTokenInbalance(BigNumber.from(_eoaBalance));
                setTokenInDecimals(18);
            } else {
                setScwTokenInbalance(BIG_ZERO);
                setEoaTokenInbalance(BIG_ZERO);
                setTokenInDecimals(0);
            }
        } catch (error) {
            console.log("send-error: ", error);
            alert("Error: " + error);
            return;
        }
    };

    const onOptionChangeForWallet = (e) => {
        setGasCost(0)
        setAmountIn(0)
        setAmountInDecimals(0)
        setTokenAddress("");
        setIsSCW(!isSCW);
    };

    const handleTokenAddress = async (_tokenAddress) => {
        try {
            setAmountIn(0);
            setTokenAddress(_tokenAddress);
            const contract = await getContract(_tokenAddress);

            // const provider = await getProvider(fromChainId);
            // const erc20 = await getContractInstance(token.usdc, IERC20, provider);
            const _scwBalance: BigNumber | undefined = await getErc20Balanceof(contract, smartAccount.address);
            const _eoaBalance: BigNumber | undefined = await getErc20Balanceof(contract, address);
            const decimals: number | undefined = await getErc20Decimals(contract);

            console.log("address====" + address, decimals?.toString(), decimals);
            // setTokenInDecimals(BigNumber.from(decimals)?.toNumber());
            // setScwTokenInbalance(BigNumber.from(_scwBalance));
            // setEoaTokenInbalance(BigNumber.from(_eoaBalance));

            setSafeState(setTokenInDecimals, decimals, 0);
            setSafeState(setScwTokenInbalance, BigNumber.from(_scwBalance), BIG_ZERO);
            setSafeState(setEoaTokenInbalance, BigNumber.from(_eoaBalance), BIG_ZERO);

            if (!contract) {
                alert("Not valid Token address");
            }
        } catch (error) {
            console.log("handleTokenAddress-error", error);
        }
    };
    const handleAmountIn = async (_amountIn) => {
        console.log("hello");
        setAmountInDecimals(_amountIn);
        if (isNative) {
            let amountInByDecimals = bg(_amountIn);
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(18));
            if (amountInByDecimals.eq(0)) {
                setAmountIn(_amountIn);
            } else {
                setAmountIn(amountInByDecimals.toString());
            }
            console.log("amountInByDecimals-native", amountInByDecimals.toString());
        } else {
            const contract = await getContract(tokenAddress);
            if (!contract) {
                alert("Not valid token address");
                return;
            }
            let decimal = await contract.decimals();
            let amountInByDecimals = bg(_amountIn);
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(decimal.toString()));
            console.log("amountInByDecimals", amountInByDecimals.toString(), _amountIn.toString());
            if (amountInByDecimals.eq(0)) {
                setAmountIn(_amountIn);
            } else {
                setAmountIn(amountInByDecimals.toString());
            }
            console.log("amountInByDecimals-erc20", amountInByDecimals.toString());
        }

        const biconomyGasInfo = await axios.get(
            `https://sdk-relayer.prod.biconomy.io/api/v1/relay/feeOptions?chainId=${chain?.chainId}`
        );
        console.log("biconomyGasInfo: ", biconomyGasInfo);

        if (biconomyGasInfo && biconomyGasInfo.data && biconomyGasInfo.data.data) {
            if (biconomyGasInfo.data.data.response.length > 0) {
                const firstObject: any = biconomyGasInfo.data.data.response[0];
                if (firstObject.tokenGasPrice && firstObject.feeTokenTransferGas) {
                    const tokenGasPrice = new bg(firstObject.tokenGasPrice.toString());
                    const feeTokenTransferGas = new bg(firstObject.feeTokenTransferGas.toString());
                    const divisor = new bg("1e18");
                    const result = tokenGasPrice.times(feeTokenTransferGas).dividedBy(divisor);
                    const formattedResult = result.toFixed(15);
                    console.log("Token Gas Price in ETH:", formattedResult.toString());
                    setGasCost(bg(formattedResult).toNumber());
                } else {
                    setGasCost(0);
                }
            }
        }
    };
    const getContract = async (_tokenAddress) => {
        try {
            let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
            if (!provider) return;
            const signer = await provider.getSigner();
            if (!signer) return;
            const contract = await new ethers.Contract(_tokenAddress, IERC20, signer);
            return contract;
        } catch (error) {
            console.log("getContract-error", error);
        }
    };
    const send = async () => {
        try {
            setSendtxLoading(true);
            setTxHash("");
            if (!BigNumber.from(amountIn).gt(0)) {
                alert("Enter valid Amount");
                throw "Enter valid Amount";
            }
            let tx;
            const _fromAddress = isSCW ? smartAccount.address : address;
            const _toAdress = isSCW ? address : smartAccount.address;
            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) throw "no provider";

                const balance = await provider.getBalance(_fromAddress);
                console.log("balance", balance.toString());
                if (!BigNumber.from(balance).gte(amountIn)) {
                    alert("Not native enough balance-");
                    throw "Not native enough balance";
                }
                tx = { to: _toAdress, value: amountIn, data: "0x" };
                console.log("tx", tx);
            } else {
                const contract = await getContract(tokenAddress);
                if (!contract) {
                    alert("add valid Token address first");
                    throw "add valid Token address first";
                }
                const balance = await contract.balanceOf(_fromAddress);
                if (!BigNumber.from(balance).gte(amountIn)) {
                    alert("Not erc20 enough balance");
                    throw "Not erc20 enough balance";
                }
                console.log("erc20", address, amountIn.toString());
                const data = await contract.populateTransaction.transfer(_toAdress, amountIn);
                tx = { to: tokenAddress, data: data.data };
                console.log("tx", tx);
            }

            if (isSCW) {
                console.log("biconomySmartAccount-----------2: ", smartAccount, tx);
                const userOp = await smartAccount.buildUserOp([tx]);
                userOp.paymasterAndData = "0x";
                console.log("userOp: ", userOp);

                const userOpResponse = await smartAccount.sendUserOp(userOp);
                console.log("userOp hash: ", userOpResponse);

                const txReciept = await userOpResponse.wait();
                console.log("Tx hash: ", txReciept?.receipt.transactionHash);

                // const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({
                //   transactions: [tx],
                // });
                // const txReciept = await txResponseOfBiconomyAA?.wait();
                // console.log("userOp hash", txResponseOfBiconomyAA?.hash);
                // console.log("Tx hash", txReciept?.transactionHash);
                setTxHash(txReciept?.receipt.transactionHash);
                setSendtxLoading(false);
                toast.success(`Tx Succefully done: ${txReciept?.receipt.transactionHash}`);
            } else {
                if (!signer) {
                    alert("Please connect wallet or refresh it!");
                }
                const txReciept = await signer.sendTransaction(tx);
                await txReciept?.wait();
                setTxHash(txReciept?.hash);
                setSendtxLoading(false);
                toast.success(`Tx Succefully done: ${txReciept?.hash}`);
            }
        } catch (error) {
            console.log("send-error: ", error);
            alert("Transaction Failed");
            setSendtxLoading(false);
            return;
        }
    };
    const copyToClipboard = (id: any) => {
        navigator.clipboard.writeText(id);
        // Alert the copied text
        toast.success("Transaction Hash Copied");
    };
    return (
        <div className="w-full h-full overflow-scroll bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 flex flex-col gap-5 shadow-md shadow-primary-950 cursor-pointer p-5">
            {!smartAccount && (
                <div className="flex justify-center items-center border-2 border-gray-500 shadow-sm shadow-primary-950 rounded-lg cursor-pointer">
                    <h3 className="font-semibold text-lg md:text-2xl text-gray-200 py-4 bg-transparent">
                        Login First!
                    </h3>
                </div>
            )}
            {smartAccount && (
                <div className="w-full flex flex-col justify-center items-center gap-3">
                    <h3 className="font-semibold text-lg md:text-2xl text-white">Transfer Fund</h3>

                    <div className="w-full flex flex-col justify-start items-start gap-1 bg-gray-300 rounded-lg py-3 px-5">
                        <div className="flex justify-start items-center gap-2">
                            <label className="relative inline-flex items-center mr-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="wallet"
                                    checked={isSCW}
                                    onChange={onOptionChangeForWallet}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 rounded-full peer bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">SmartAccount to EOA</span>
                            </label>
                        </div>

                        <span className="w-full font-bold pl-24">( Or )</span>

                        <div className="flex justify-start items-center gap-2">
                            <label className="relative inline-flex items-center mr-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="wallet"
                                    id="eoa"
                                    checked={!isSCW}
                                    onChange={onOptionChangeForWallet}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 rounded-full peer bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">EOA to SmartAccount</span>
                            </label>
                        </div>
                    </div>

                    <div className="w-full flex flex-col justify-start items-start gap-1 bg-gray-300 rounded-lg py-3 px-5">
                        <div className="flex justify-start items-center gap-2">
                            <label className="relative inline-flex items-center mr-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="tokens"
                                    id="native"
                                    checked={isNative}
                                    onChange={onOptionChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 rounded-full peer bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">Native Token transfer</span>
                            </label>
                        </div>

                        <span className="w-full font-bold pl-24">( Or )</span>

                        <div className="flex justify-start items-center gap-2">
                            <label className="relative inline-flex items-center mr-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="tokens"
                                    id="erc20"
                                    checked={!isNative}
                                    onChange={onOptionChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 rounded-full peer bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-red-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">ERC20 Token Transfer</span>
                            </label>
                        </div>
                    </div>

                    <div className="w-full flex flex-col justify-center items-center gap-3 mt-3">
                        {isSCW ? (
                            <div className="w-full flex flex-col justify-center items-start px-2 mb-2">
                                <h3 className="text-gray-100 font-bold text-sm md:text-base">
                                    From
                                    <span className="px-1 font-semibold text-xs md:text-sm">SmartAccount Address</span>
                                </h3>
                                <h6 className="text-gray-300 font-medium text-xs md:text-sm">
                                    {shorten(smartAccount.address)}
                                </h6>
                                <h3 className="text-gray-100 font-bold text-sm md:text-base mt-2">
                                    To
                                    <span className="px-1 font-semibold text-xs md:text-sm">EOA Address</span>
                                </h3>
                                <h6 className="text-gray-300 font-medium text-xs md:text-sm">{shorten(address)}</h6>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col justify-center items-start px-2 mb-2">
                                <h3 className="text-gray-100 font-bold text-sm md:text-base">
                                    From
                                    <span className="px-1 font-semibold text-xs md:text-sm">EOA Address</span>
                                </h3>
                                <h6 className="text-gray-300 font-medium text-xs md:text-sm">{shorten(address)}</h6>
                                <h3 className="text-gray-100 font-bold text-sm md:text-base mt-2">
                                    To
                                    <span className="px-1 font-semibold text-xs md:text-sm">SmartAccount Address</span>
                                </h3>
                                <h6 className="text-gray-300 font-medium text-xs md:text-sm">
                                    {shorten(smartAccount.address)}
                                </h6>
                            </div>
                        )}

                        {!isNative && (
                            <div className="w-full relative rounded-md overflow-hidden">
                                <label htmlFor="tokenAddresses" className="sr-only">
                                    Token Address
                                </label>
                                <select
                                    className="w-full bg-white font-medium outline-none shadow-outline border-2 rounded-md py-2 px-3 block appearance-none leading-normal focus:border-transparent"
                                    placeholder="Token Address"
                                    id="tokenAddresses"
                                    value={tokenAddress}
                                    onChange={(e: any) => handleTokenAddress(e.target.value)}
                                >
                                    <option key={"0x"} value="" disabled selected>
                                        Token Address
                                    </option>
                                    {tokensData.length > 0 &&
                                        tokensData.map((token: any, tokenIndex: any) => (
                                            <option value={token.address} key={tokenIndex}>
                                                {token.symbol}
                                            </option>
                                        ))}
                                </select>
                                <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                    <BiSolidChevronDown size="20px" />
                                </div>
                            </div>
                        )}

                        <div className="w-full">
                            <div className="flex justify-between items-center gap-2 text-white font-semibold text-xs md:text-sm px-1">
                                <span>Amount :</span>
                                <span>
                                    {isSCW
                                        ? `( SmartAccount Balance : ${
                                              !scwBalance.isZero()
                                                  ? bg(BigNumber.from(scwBalance).toString())
                                                        .dividedBy(bg(10).pow(tokenInDecimals))
                                                        .toString()
                                                  : "0"
                                          } )`
                                        : `( EOA Balance : ${
                                              !eoaBalance.isZero()
                                                  ? bg(BigNumber.from(eoaBalance).toString())
                                                        .dividedBy(bg(10).pow(tokenInDecimals))
                                                        .toString()
                                                  : "0"
                                          } )`}
                                    {/* ( SCW Balance : {scwBalance} || EOA Balance : {eoaBalance} ) */}
                                </span>
                            </div>
                            <div className="w-full flex justify-start items-center gap-1 text-black shadow rounded-md overflow-hidden mt-1">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount"
                                    className="w-full bg-white font-medium outline-none shadow-outline border-2  rounded-md py-2 px-3 block appearance-none leading-normal focus:border-primary-950"
                                    value={amountInDecimals}
                                    onChange={(e: any) => handleAmountIn(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-center gap-2 border-2 border-gray-400 rounded-lg my-2 px-3 py-2">
                            <div className="flex justify-between items-center gap-1">
                                <h3 className="text-gray-100 font-bold text-sm md:text-base">
                                    Gas
                                    <span className="px-1 text-gray-300 font-medium text-xs">(estimated)</span>
                                </h3>
                                <h6 className="text-gray-200 font-medium text-xs md:text-sm">
                                    {gasCost && chain ? `${gasCost} ${gasFeesNamesByMainChainId[chain?.chainId]}` : "0"}
                                </h6>
                            </div>
                            <div className="flex justify-between items-center gap-1">
                                <h3 className="text-green-400 font-bold text-xs">Likely in &#60; 30 seconds</h3>
                                <h6 className="text-gray-100 font-semibold text-sm">
                                    Max fee :<span className="px-1 text-gray-300 font-medium text-xs">0 Matic</span>
                                </h6>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e: any) => send()}
                            className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300 mt-3"
                        >
                            {sendTxLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                            {isSCW ? "Send SmartAccount to EOA" : "Send EOA to SmartAccount"}
                        </button>

                        {txhash && (
                            <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                                <FiCopy onClick={() => copyToClipboard(txhash)} />
                                <p>TxHash : {shorten(txhash)}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transfer;