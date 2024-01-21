import { BigNumber } from "ethers";

import Image from "next/image";
import { FiCopy } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useAddress, useChain } from "@thirdweb-dev/react";

import { tTransfer } from "./types";
import Button from "../../components/Button/Button";
import { change, gas, info } from "../../assets/images";
import { ChainIdDetails } from "../../utils/data/network";
import { decreasePowerByDecimals } from "../../utils/helper";
import { copyToClipboard, shorten } from "../../utils/helper";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import SelectInput from "../../components/SelectInput/SelectInput";
import { iTransfer, useTransferStore } from "../../store/TransferStore";

const Transfer: React.FC<any> = ({
    onOptionChangeForWallet,
    onOptionChange,
    setBalance,
    handleAmountIn,
    send,
}: tTransfer) => {
    const { smartAccount, smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

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
        isGasCostExpanded,
        setIsGasCostExpanded,
        searchToken,
        setSearchToken,
        showTokenList,
        setShowTokenList,
        selectedToken,
        setSelectedToken,
    }: iTransfer = useTransferStore((state) => state);

    const address = useAddress(); // Detect the connected address
    const chain = useChain();

    return (
        <div className="w-full h-full overflow-scroll bg-backgound-100 flex flex-col items-center gap-5 cursor-pointer px-8 py-2">
            {!smartAccount && (
                <div className="w-full lg:w-[50%] flex justify-center items-center border-2 border-backgound-800 rounded-lg cursor-pointer my-10">
                    <h3 className="font-semibold text-lg md:text-2xl text-font-200 py-4 bg-transparent">
                        Login First!
                    </h3>
                </div>
            )}
            {smartAccount && (
                <div className="w-full flex flex-col justify-center items-center gap-3">
                    <h3 className="font-semibold text-lg md:text-2xl text-font-100 p-5 pt-10">Transfer Fund</h3>
                    <div className="w-full lg:w-[50%] flex flex-col sm:flex-row justify-center items-center gap-5 md:gap-10 bg-backgound-200 text-font-100 p-5 rounded-md">
                        <div className="w-auto md:w-40 flex justify-center items-baseline gap-3">
                            <span className="font-bold text-xs text-font-300">From</span>
                            <span className="font-bold text-xl text-font-100">{isSCW ? "SCW" : "EOA"}</span>
                            <div className="w-4 h-7 group relative flex justify-center">
                                <Image
                                    src={info}
                                    alt="icon"
                                    className="w-4 h-4 bg-font-100 rounded-full cursor-pointer"
                                />
                                <span className="w-60 absolute z-50 top-7 -right-[65px] scale-0 transition-all group-hover:scale-100 rounded shadow-lg bg-backgound-600 border-2 border-backgound-700 px-3 py-1 font-medium text-start text-xs text-font-100">
                                    <button className="w-full relative flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start text-font-200 text-sm">
                                            {isSCW
                                                ? smartAccount &&
                                                  smartAccountAddress &&
                                                  smartAccountAddress.slice(0, 13) +
                                                      "..." +
                                                      smartAccountAddress.slice(-3)
                                                : smartAccount &&
                                                  address &&
                                                  address.slice(0, 13) + "..." + address.slice(-3)}
                                        </div>
                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() => {
                                                if (isSCW) {
                                                    copyToClipboard(
                                                        smartAccountAddress,
                                                        "Smart account address Copied"
                                                    );
                                                } else {
                                                    copyToClipboard(address, "EOA address Copied");
                                                }
                                            }}
                                        />
                                    </button>
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onOptionChangeForWallet()}
                            className="w-10 h-10 rounded-full"
                        >
                            <Image
                                src={change}
                                alt="icon"
                                className="w-full h-full p-2  rotate-90 sm:rotate-0 text rounded-full cursor-pointer"
                            />
                        </button>
                        <div className="w-auto md:w-40 flex justify-center items-baseline gap-3">
                            <span className="font-bold text-xs text-font-300">To</span>
                            <span className="font-bold text-xl text-font-100">{isSCW ? "EOA" : "SCW"}</span>
                            <div className="w-4 h-7 group relative flex justify-center">
                                <Image
                                    src={info}
                                    alt="icon"
                                    className="w-4 h-4 bg-font-100 rounded-full cursor-pointer"
                                />
                                <span className="w-60 absolute z-50 top-7 -right-[65px] scale-0 transition-all group-hover:scale-100 rounded shadow-lg bg-backgound-600 border-2 border-backgound-700 px-3 py-1 font-medium text-start text-xs text-font-100">
                                    <button className="w-full relative flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start text-font-200 text-sm">
                                            {isSCW
                                                ? smartAccount &&
                                                  address &&
                                                  address.slice(0, 13) + "..." + address.slice(-3)
                                                : smartAccount &&
                                                  smartAccountAddress &&
                                                  smartAccountAddress.slice(0, 13) +
                                                      "..." +
                                                      smartAccountAddress.slice(-3)}
                                        </div>
                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() => {
                                                if (isSCW) {
                                                    copyToClipboard(address, "EOA address Copied");
                                                } else {
                                                    copyToClipboard(
                                                        smartAccountAddress,
                                                        "Smart account address Copied"
                                                    );
                                                }
                                            }}
                                        />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>

                    <SelectInput
                        inputSearch={searchToken}
                        setInputSearch={setSearchToken}
                        inputPlaceholder="Search by Token name"
                        inputClassName=""
                        selectOptions={tokensData}
                        handleSelectOption={setBalance}
                        showOptionList={showTokenList}
                        setShowOptionList={setShowTokenList}
                        selectedOption={selectedToken}
                        setSelectedOption={setSelectedToken}
                    />

                    <div className="w-full lg:w-[50%] flex flex-col justify-center items-center gap-3 my-1">
                        <div className="w-full">
                            <div className="flex justify-end items-center gap-2 text-font-100 font-semibold text-xs md:text-sm p-1">
                                {isSCW ? (
                                    <div className="text-font-300 text-sm">
                                        SmartAccount Balance :
                                        <span className="font-bold text-font-100 text-base px-1">
                                            {!scwBalance.isZero()
                                                ? decreasePowerByDecimals(
                                                      BigNumber.from(scwBalance).toString(),
                                                      tokenInDecimals
                                                  )
                                                : "0"}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-font-300 text-sm">
                                        EOA Balance :
                                        <span className="font-bold text-font-100 text-base px-1">
                                            {!eoaBalance.isZero()
                                                ? decreasePowerByDecimals(
                                                      BigNumber.from(eoaBalance).toString(),
                                                      tokenInDecimals
                                                  )
                                                : "0"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex justify-start items-center gap-1 bg-backgound-200 text-font-1100 border border-backgound-600 rounded-lg overflow-hidden mt-1 px-3">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount"
                                    className="w-full bg-backgound-200 text-font-100 font-extrabold text-xl outline-none shadow-outline p-3 pr-5 block appearance-none leading-normal"
                                    value={amountInDecimals}
                                    onChange={(e: any) => handleAmountIn(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAmountIn(
                                            isSCW
                                                ? decreasePowerByDecimals(
                                                      BigNumber.from(scwBalance).toString(),
                                                      tokenInDecimals
                                                  )
                                                : decreasePowerByDecimals(
                                                      BigNumber.from(eoaBalance).toString(),
                                                      tokenInDecimals
                                                  )
                                        )
                                    }
                                    className="w-20 font-bold text-center text-font-100 bg-button-100 rounded-lg py-1"
                                >
                                    Max
                                </button>
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-center gap-3 border-2 border-gray-600 rounded-lg my-3 p-4">
                            <div
                                role="presentation"
                                onClick={() => setIsGasCostExpanded(!isGasCostExpanded)}
                                className="flex justify-between items-center gap-1"
                            >
                                <h3 className="flex justify-center items-center gap-1 text-font-100 font-bold text-sm md:text-base">
                                    <Image src={gas} alt="" className="h-7 w-7 mr-2" />
                                    <span>Gas</span>
                                    <span className="text-font-300 font-medium text-xs">(estimated)</span>
                                </h3>
                                <div className="flex justify-center items-center gap-3">
                                    <h6 className="text-font-100 font-bold text-base md:text-lg">
                                        {gasCost && chain
                                            ? `${gasCost} ${ChainIdDetails[chain?.chainId].gasFeesName}`
                                            : "0"}
                                    </h6>
                                    <MdKeyboardArrowUp
                                        size="25px"
                                        className={`${
                                            isGasCostExpanded ? "!rotate-0" : "!rotate-180"
                                        } bg-backgound-600 rounded-full text-font-300 duration-150 transition-all delay-150`}
                                    />
                                </div>
                            </div>

                            {isGasCostExpanded && (
                                <div className="flex justify-between items-center gap-1">
                                    <h3 className="text-green-400 font-bold text-xs">Likely in &#60; 30 seconds</h3>
                                    <h6 className="text-font-100 font-semibold text-sm">
                                        Max fee :<span className="px-1 text-font-300 font-medium text-xs">0 Matic</span>
                                    </h6>
                                </div>
                            )}
                        </div>

                        <Button
                            handleClick={() => send()}
                            isLoading={sendTxLoading}
                            customStyle="sm:w-[65%]"
                            innerText={isSCW ? "Send SmartAccount to EOA" : "Send EOA to SmartAccount"}
                        />

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
