import { BigNumber } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { FiCopy } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { BiSolidChevronDown } from "react-icons/bi";
import { useChain, useAddress } from "@thirdweb-dev/react";

import { tTransfer } from "./types";
import { shorten, copyToClipboard } from "../../utils/helper";
import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { gasFeesNamesByMainChainId } from "../../utils/constants";
import { useTransferStore, iTransfer } from "../../store/TransferStore";

const Transfer: React.FC<any> = ({
    onOptionChangeForWallet,
    onOptionChange,
    handleTokenAddress,
    handleAmountIn,
    send,
}: tTransfer) => {

    const {
        smartAccount,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        tokenAddress,
        amountInDecimals,
        isNative,
        isSCW,
        sendTxLoading,
        txhash,
        tokensData,
        scwBalance,
        eoaBalance,
        tokenInDecimals,
        gasCost,
    }: iTransfer = useTransferStore((state) => state);

    const address = useAddress(); // Detect the connected address
    const chain = useChain();

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
                                    <FiCopy onClick={() => copyToClipboard(txhash, "Transaction Hash Copied")} />
                                    <p>TxHash : {shorten(txhash)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
    );
};
export default Transfer;
