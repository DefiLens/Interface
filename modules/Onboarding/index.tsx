import { LiaWalletSolid } from "react-icons/lia";
import { Button, ConnectWalletWrapper } from "../../components/Button";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTransfer, useTransferStore } from "../../store/TransferStore";
import { useAddress, useChain, useSigner } from "@thirdweb-dev/react";
import { gas } from "../../assets/images";
import { HiOutlineArrowsRightLeft, HiOutlineInformationCircle } from "react-icons/hi2";
import CopyButton from "../../components/common/CopyButton";
import SelectInput from "../../components/SelectInput/SelectInput";
import { copyToClipboard, decreasePowerByDecimals, shorten } from "../../utils/helper";
import { BigNumber } from "ethers";
import Image from "next/image";
import { MdKeyboardArrowUp } from "react-icons/md";
import { ChainIdDetails } from "../../utils/data/network";
import { FiCopy } from "react-icons/fi";
import { handleAmountIn, send, setBalance } from "./utils";
import { BigNumber as bg } from "bignumber.js";

bg.config({ DECIMAL_PLACES: 5 });

const OnboardingPage = () => {
    const { smartAccount, smartAccountAddress }: iGlobal = useGlobalStore((state) => state);
    const signer = useSigner(); // Detect the connected address

    const {
        tokenAddress,
        amountIn,
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
        setGasCost,
        setAmountIn,
        setAmountInDecimals,
        setIsGasCostExpanded,
        searchToken,
        setSearchToken,
        showTokenList,
        setShowTokenList,
        selectedToken,
        setSelectedToken,
        setSendtxLoading,
        setTxHash,
    }: iTransfer = useTransferStore((state) => state);

    const address = useAddress(); // Detect the connected address
    const chain = useChain();
    return (
        <div className="w-full h-full overflow-scroll flex flex-col justify-start items-center gap-5">
            {!smartAccount && (
                <div className="max-w-6xl w-full h-fit flex flex-col justify-center mt-10 items-center gap-5 rounded-3xl px-5 py-20 bg-N20 text-B200 shadow-xl">
                    <LiaWalletSolid className="w-10 h-10 text-black" />
                    <ConnectWalletWrapper />
                    <h6 className="text-base md:text-lg font-bold text-center">To Transfer Fund</h6>
                </div>
            )}
            {smartAccount && (
                <div className="w-full lg:max-w-xl flex flex-col justify-center items-center mt-10 gap-3 shadow-2xl rounded-2xl bg-GR2 overflow-hidden">
                    <div className="w-full p-5">
                        <h3 className="font-semibold text-lg md:text-2xl text-N20 mb-3">Transfer Fund</h3>
                        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-4 bg-[rgba(225,225,225,.4)] rounded-xl text-B100 p-3">
                            <div className="flex-1 md:w-40 flex flex-col justify-center items-center gap-2">
                                <div className="flex flex-col justify-center gap-2">
                                    <span className="font-bold text-base text-N40">From</span>
                                    <div className="flex items-center justify-center gap-2 bg-[rgba(225,225,225,.6)] rounded-lg py-3 px-5">
                                        <span className="font-bold text-xl text-N10">EOA</span>
                                        <div className="group relative flex justify-center bg-N0 rounded-full">
                                            <HiOutlineInformationCircle
                                                size="25px"
                                                className="text-B300 cursor-pointer"
                                            />
                                            <span className="w-fit absolute z-50 top-7 -right-[65px] scale-0 transition-all group-hover:scale-100 rounded shadow-lg bg-N0 px-3 py-1 font-medium text-start text-xs text-B100">
                                                <button className="w-full relative flex justify-between items-center gap-3 py-2 px-2">
                                                    <div className="flex flex-col justify-center items-start text-B100 text-sm">
                                                        {smartAccount &&
                                                            address &&
                                                            address.slice(0, 13) + "..." + address.slice(-3)}
                                                    </div>
                                                    <CopyButton copy={address} />
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 md:w-40 flex flex-col justify-center items-center gap-2">
                                <div className="flex flex-col justify-center gap-2">
                                    <span className="font-bold text-base text-N40">To</span>
                                    <div className="flex items-center justify-center gap-2 bg-[rgba(225,225,225,.6)] rounded-lg py-3 px-5">
                                        <span className="font-bold text-xl text-N20">SCW</span>
                                        <div className="group relative flex justify-center bg-N0 rounded-full">
                                            <HiOutlineInformationCircle
                                                size="25px"
                                                className="text-B300 cursor-pointer"
                                            />

                                            <span className="w-fit absolute z-50 top-7 -right-[65px] scale-0 group-hover:scale-100 transition-all rounded shadow-lg bg-N0 px-3 py-1 font-medium text-start text-xs text-B100">
                                                <button className="w-full relative flex justify-between items-center gap-3 py-2 px-2">
                                                    <div className="flex flex-col justify-center items-start text-B100 text-sm">
                                                        {smartAccount &&
                                                            smartAccountAddress &&
                                                            smartAccountAddress.slice(0, 13) +
                                                                "..." +
                                                                smartAccountAddress.slice(-3)}
                                                    </div>
                                                    <CopyButton copy={smartAccountAddress} />
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-N20 rounded-2xl p-5">
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

                        <div className="w-full lg:max-w-xl flex flex-col justify-center items-center gap-3 my-1">
                            <div className="w-full">
                                <div className="flex justify-end items-center gap-2 text-B100 font-semibold text-xs md:text-sm p-1">
                                    <div className="text-B200 text-sm">
                                        SmartAccount Balance :
                                        <span className="font-bold text-B100 text-base px-1">
                                            {!scwBalance.isZero()
                                                ? decreasePowerByDecimals(
                                                      BigNumber.from(scwBalance).toString(),
                                                      tokenInDecimals
                                                  )
                                                : "0"}
                                        </span>
                                    </div>
                                    <div className="text-B200 text-sm">
                                        EOA Balance :
                                        <span className="font-bold text-B100 text-base px-1">
                                            {!eoaBalance.isZero()
                                                ? decreasePowerByDecimals(
                                                      BigNumber.from(eoaBalance).toString(),
                                                      tokenInDecimals
                                                  )
                                                : "0"}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full flex justify-start items-center gap-1 bg-N20 border-2 border-B50 text-B10 shadow-lg rounded-lg overflow-hidden mt-1 px-3">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Amount"
                                        className="w-full bg-N20 text-B100 font-extrabold text-xl outline-none shadow-outline p-3 pr-5 block appearance-none leading-normal"
                                        value={amountInDecimals}
                                        onChange={(e) =>
                                            handleAmountIn(
                                                e.target.value,
                                                setAmountIn,
                                                setAmountInDecimals,
                                                isNative,
                                                chain,
                                                tokenAddress,
                                                setGasCost,
                                                bg
                                            )
                                        }
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
                                                      ),
                                                setAmountIn,
                                                setAmountInDecimals,
                                                isNative,
                                                chain,
                                                tokenAddress,
                                                setGasCost,
                                                bg
                                            )
                                        }
                                        className="w-20 font-bold text-center bg-[rgba(109,223,255,.4)] text-S600 rounded-lg py-1"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            <div className="w-full flex flex-col justify-center gap-3 border-2 border-B50 rounded-lg my-3 p-4">
                                <div
                                    role="presentation"
                                    onClick={() => setIsGasCostExpanded(!isGasCostExpanded)}
                                    className="flex justify-between items-center gap-1"
                                >
                                    <h3 className="flex justify-center items-center gap-1 text-B100 font-bold text-sm md:text-base">
                                        <Image src={gas} alt="gas icon" className="h-7 w-7 mr-2" />
                                        <span>Gas</span>
                                        <span className="text-B200 font-medium text-xs">(estimated)</span>
                                    </h3>
                                    <div className="flex justify-center items-center gap-3">
                                        <h6 className="text-B100 font-bold text-base md:text-lg">
                                            {gasCost && chain
                                                ? `${gasCost} ${ChainIdDetails[chain?.chainId].gasFeesName}`
                                                : "0"}
                                        </h6>
                                        <MdKeyboardArrowUp
                                            size="25px"
                                            className={`${
                                                isGasCostExpanded ? "!rotate-0" : "!rotate-180"
                                            } hover:bg-[rgba(132,144,251,.1)] text-B100 rounded-full duration-150 transition-all delay-150 cursor-pointer`}
                                        />
                                    </div>
                                </div>

                                {isGasCostExpanded && (
                                    <div className="flex justify-between items-center gap-1">
                                        <h3 className="text-green-400 font-bold text-xs">Likely in &#60; 30 seconds</h3>
                                        <h6 className="text-B100 font-semibold text-sm">
                                            Max fee :<span className="px-1 text-B100 font-medium text-xs">0 Matic</span>
                                        </h6>
                                    </div>
                                )}
                            </div>

                            <Button
                                handleClick={() =>
                                    send(
                                        amountIn as string,
                                        address as string,
                                        isNative,
                                        tokenAddress as string,
                                        signer,
                                        smartAccount,
                                        smartAccountAddress,
                                        setAmountIn,
                                        setAmountInDecimals,
                                        setSendtxLoading,
                                        setTxHash
                                    )
                                }
                                isLoading={sendTxLoading}
                                customStyle="sm:w-[65%]"
                                innerText={"Send EOA to SmartAccount"}
                            />

                            {txhash && (
                                <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                                    <FiCopy onClick={() => copyToClipboard(txhash, "Transaction Hash Copied")} />
                                    <p>TxHash : {shorten(txhash)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingPage;
