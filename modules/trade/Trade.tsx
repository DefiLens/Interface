import { startCase } from "lodash";
import { BigNumber as bg } from "bignumber.js";

import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { CiCircleChevDown } from "react-icons/ci";
import { MdDelete, MdOutlineArrowBack } from "react-icons/md";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { tTrade, tTradeProtocol } from "./types";
import Button from "../../components/Button/Button";
import { protocolNames } from "../../utils/data/protocols";
import SelectionBar from "../../components/SelectionBar/SelectionBar";
import { ChainIdDetails, NETWORK_LIST } from "../../utils/data/network";
import ExecuteBatch from "../../components/Models/ExecuteBatch/ExecuteBatch";
import ExecuteMethod from "../../components/Models/ExecuteMethod/ExecuteMethod";
import { iTokenData, iTrading, useTradingStore } from "../../store/TradingStore";
import { defaultBlue, downLine, gas, optimism, swap, warning } from "../../assets/images";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import SearchInput from "../../components/common/SearchInput";

bg.config({ DECIMAL_PLACES: 10 });


interface TokenListProps {
    erc20: boolean;
    filterValue: string;
    setFilterValue: (value: string) => void;
    tokens: any[];
    onItemClick: (tokenName: string) => void;
}

const TokenList: React.FC<TokenListProps> = ({ erc20, filterValue, setFilterValue, tokens, onItemClick }) => {
    return (
        <>
            <div className="border border-[rgba(132,144,251)] text-B200 rounded-lg p-3 my-1.5">
                <SearchInput
                    value={filterValue}
                    onChange={setFilterValue}
                    placeholder="Search by Token"
                />
                {tokens.map((token: any, index: number) => {
                    const isErc20 = erc20 ? token.symbol.toLowerCase().includes(filterValue.toLowerCase()) : token.name.toLowerCase().includes(filterValue.toLowerCase());
                    return (
                        isErc20 && (
                            <div
                                key={index}
                                onClick={() => onItemClick(erc20 ? token.symbol : token.name)}
                                className="w-full flex justify-start items-center gap-3 hover:bg-[rgba(132,144,251,.1)] py-2 px-3 rounded-lg cursor-pointer my-2"
                            >
                                {erc20 && (
                                    <Image
                                        src={
                                            token.logoURI.includes("s2.coinmarketcap.com")
                                                ? optimism
                                                : token.logoURI
                                        }
                                        alt=""
                                        width={10}
                                        height={10}
                                        className="h-10 w-10 bg-font-200 rounded-full cursor-pointer"
                                    />
                                )}
                                {/* {token.name} */}
                                {erc20 ? token.symbol : token.name}
                            </div>
                        )
                    );
                })}

            </div>
        </>
    );
};


const ProtocolSelection: React.FC<any> = ({
    showMenu,
    onChangeProtocol,
    selectedNetwork,
    filterToken,
    setFilterToken,
    filterAddress,
    setFilterAddress,
    tokensData,
    selectedProtocol,
    onChangeToken,
    protocolNames,
}) => {
    return (
        showMenu && selectedNetwork.chainName && (
            <div className="w-full max-h-96">
                {protocolNames[selectedNetwork.chainId]?.key.map((item: tTradeProtocol, protocolIndex: number) => {
                    return protocolNames[selectedNetwork.chainId].value[protocolIndex].toLowerCase().includes(filterToken.toLowerCase()) ? (
                        <div key={item.name} className="w-full py-0.5">
                            <div
                                key={item.name}
                                onClick={() => onChangeProtocol(item.name)}
                                className="w-full flex justify-between items-center gap-3 text-B300 bg-[rgba(132,144,251,.0.9) border border-[rgba(132,144,251)] hover:bg-[rgba(132,144,251,.1)] py-2 px-3 my-1 rounded-lg cursor-pointer"
                            >
                                <div className="w-full flex justify-start items-center gap-3">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        className="h-8 w-8 bg-N40 rounded-full cursor-pointer"
                                    />
                                    <div>
                                        {protocolNames[selectedNetwork.chainId].value[protocolIndex]}
                                    </div>
                                </div>
                                <CiCircleChevDown
                                    size="30px"
                                    className="text-[rgba(132,144,251)] h-7 w-7"
                                />
                            </div>

                            {selectedProtocol === item.name && selectedProtocol !== "erc20" && (
                                <TokenList
                                    erc20={false}
                                    filterValue={filterAddress}
                                    setFilterValue={setFilterAddress}
                                    tokens={item.tokenList}
                                    onItemClick={onChangeToken}
                                />
                            )}
                            {item.name === "erc20" && selectedProtocol === "erc20" && tokensData && (
                                <TokenList
                                    erc20={true}
                                    filterValue={filterAddress}
                                    setFilterValue={setFilterAddress}
                                    tokens={tokensData}
                                    onItemClick={onChangeToken}
                                />
                            )}
                        </div>
                    ) : null;
                })}
            </div>
        )
    );
};


const Trade: React.FC<any> = ({
    handleSelectFromNetwork,
    handleSelectToNetwork,
    onChangeFromProtocol,
    onChangeFromToken,
    onChangeToProtocol,
    onChangeToToken,
    onChangeAmountIn,
    handleSwap,
    removeBatch,
    toggleShowBatchList,
    sendSingleBatchToList,
    handleExecuteMethod,
    ExecuteAllBatches,
    closeFromSelectionMenu,
    closeToSelectionMenu,
    createSession,
    erc20Transfer,
}: tTrade) => {
    const {
        maxBalance,
        ismaxBalanceLoading,
        selectedFromNetwork,
        selectedFromProtocol,
        selectedFromToken,
        selectedToNetwork,
        selectedToProtocol,
        selectedToToken,
        showFromSelectionMenu,
        setShowFromSelectionMenu,
        showToSelectionMenu,
        setShowToSelectionMenu,
        fromTokensData,
        toTokensData,
        amountIn,
        fromTokenDecimal,
        filterFromToken,
        setFilterFromToken,
        filterToToken,
        setFilterToToken,
        filterFromAddress,
        setFilterFromAddress,
        filterToAddress,
        setFilterToAddress,
        addToBatchLoading,
        showBatchList,
        showIndividualBatchList,
        txhash,
        sendTxLoading,
        individualBatch,
        showExecuteBatchModel,
        totalfees,
        showExecuteMethodModel,
    }: iTrading = useTradingStore((state) => state);


    return (
        <div className="w-full h-full flex flex-col justify-center items-center py-5">
            <div
                className={`${showBatchList ? "!w-full" : "!w-[50%]"
                    } h-full flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start gap-4`}
            >
                <div className="w-full md:max-w-xl h-full flex flex-col justify-start items-center">
                    {showFromSelectionMenu || showToSelectionMenu ? (
                        <div className="w-full max-h-full bg-W100 flex flex-col gap-2 rounded-lg cursor-pointer p-3 shadow-2xl">
                            <MdOutlineArrowBack
                                onClick={
                                    showFromSelectionMenu
                                        ? () => closeFromSelectionMenu()
                                        : () => closeToSelectionMenu()
                                }
                                className="rounded-full h-10 w-10 p-2 hover:bg-N40 active:bg-N60 text-B200"
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
                                                className={`h-14 w-14 flex justify-center items-center gap-3 bg-font-100 hover:bg-font-200 active:bg-font-400 border-2 border-font-200 hover:border-font-300 shadow-sm rounded-md cursor-pointer  ${showFromSelectionMenu
                                                    ? selectedFromNetwork.chainName === item.chainName
                                                        ? "bg-gradient-to-br from-[#7339FD] to-[#4DD4F4]"
                                                        : ""
                                                    : selectedToNetwork.chainName === item.chainName
                                                        ? "bg-gradient-to-br from-[#7339FD] to-[#4DD4F4]"
                                                        : ""
                                                    }`}
                                            >
                                                <Image src={item.icon} alt="" className="h-10 w-10 rounded-full" />
                                            </div>
                                        );
                                    })}
                                </div>
                                <SearchInput
                                    value={showFromSelectionMenu ? filterFromToken : filterToToken}
                                    onChange={showFromSelectionMenu
                                        ? setFilterFromToken
                                        : setFilterToToken}
                                    placeholder="Search by Protocol"
                                />

                                <div className="w-full overflow-auto flex flex-col justify-center items-center py-1">
                                    <div className="w-full overflow-auto flex flex-col justify-center items-center py-1">
                                        <ProtocolSelection
                                            showMenu={showFromSelectionMenu}
                                            onChangeProtocol={onChangeFromProtocol}
                                            selectedNetwork={selectedFromNetwork}
                                            filterToken={filterFromToken}
                                            setFilterToken={setFilterFromToken}
                                            filterAddress={filterFromAddress}
                                            setFilterAddress={setFilterFromAddress}
                                            tokensData={fromTokensData}
                                            selectedProtocol={selectedFromProtocol}
                                            onChangeToken={onChangeFromToken}
                                            protocolNames={protocolNames}
                                        />

                                        <ProtocolSelection
                                            showMenu={showToSelectionMenu}
                                            onChangeProtocol={onChangeToProtocol}
                                            selectedNetwork={selectedToNetwork}
                                            filterToken={filterToToken}
                                            setFilterToken={setFilterToToken}
                                            filterAddress={filterToAddress}
                                            setFilterAddress={setFilterToAddress}
                                            tokensData={toTokensData}
                                            selectedProtocol={selectedToProtocol}
                                            onChangeToken={onChangeToToken}
                                            protocolNames={protocolNames}
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-gradient-to-br from-[#7339FD] via-[#56B0F6] to-[#4DD4F4] flex flex-col gap-1 rounded-2xl cursor-pointer shadow-2xl">
                            <div className="w-full flex flex-col gap-5">
                                <div className="px-5 pt-7">
                                    <div
                                        className={`w-full relative flex justify-center bg-[rgba(225,225,225,.4)] border rounded-xl px-5 py-3 items-center gap-5 ${selectedToNetwork.chainName &&
                                            selectedToProtocol &&
                                            selectedToToken &&
                                            selectedFromNetwork.chainName &&
                                            selectedFromProtocol &&
                                            selectedFromToken
                                            ? "flex-row"
                                            : "flex-col"
                                            }`}
                                    >
                                        {/* ---------- FROM Section START ---------- */}
                                        <SelectionBar
                                            handleSelectionMenu={() => setShowFromSelectionMenu(true)}
                                            titlePlaceholder="From"
                                            iconCondition={selectedFromNetwork.chainName && selectedFromProtocol}
                                            mainIcon={selectedFromNetwork?.icon}
                                            subIcon={
                                                protocolNames[selectedFromNetwork.chainId]?.key.find(
                                                    (entry: any) => entry.name == selectedFromProtocol
                                                )?.icon
                                            }
                                            valueCondition={selectedFromNetwork.chainName}
                                            valuePlaceholder="Select Chain and token"
                                            mainValue={selectedFromNetwork.key}
                                            firstSubValue={selectedFromProtocol}
                                            secondSubValue={selectedFromToken}
                                        />
                                        {/* ---------- FROM Section END ---------- */}

                                        {selectedToNetwork.chainName &&
                                            selectedToProtocol &&
                                            selectedToToken &&
                                            selectedFromNetwork.chainName &&
                                            selectedFromProtocol &&
                                            selectedFromToken &&

                                            <div
                                                onClick={handleSwap}
                                                className="absolute flex justify-center items-center border-2 bg-N60 hover:bg-font-100 active:bg-font-400 rounded-full p-1"
                                            >
                                                <HiOutlineArrowsRightLeft
                                                    size="25px"
                                                    className="rotate-90 sm:rotate-0 text-B100"
                                                />
                                            </div>
                                        }

                                        {/* ---------- To Section START ---------- */}
                                        <SelectionBar
                                            handleSelectionMenu={() => setShowToSelectionMenu(true)}
                                            titlePlaceholder="To"
                                            iconCondition={selectedToNetwork.chainName}
                                            mainIcon={selectedToNetwork?.icon}
                                            subIcon={
                                                protocolNames[selectedToNetwork.chainId]?.key.find(
                                                    (entry: any) => entry.name == selectedToProtocol
                                                )?.icon
                                            }
                                            valueCondition={selectedToNetwork.chainName}
                                            valuePlaceholder="Select Chain and token"
                                            mainValue={selectedToNetwork.key}
                                            firstSubValue={selectedToProtocol}
                                            secondSubValue={selectedToToken}
                                        />
                                        {/* ---------- To Section END ---------- */}
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-5 px-5 py-7 bg-W100 rounded-xl">

                                    {/* ---------- YOU PAY Section START ---------- */}
                                    <div className={`border ${bg(maxBalance).isLessThan(amountIn) ? 'border-error-600' : 'border-[#A9A9A9]'} rounded-lg px-5 py-3`}>
                                        <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-B200">
                                            You Pay
                                        </h5>
                                        <div className="relative flex flex-row justify-start items-center gap-8 py-3">
                                            {selectedFromNetwork.chainName && selectedFromProtocol ? (
                                                <div className="relative">
                                                    <Image
                                                        src={selectedFromNetwork.icon}
                                                        alt=""
                                                        className="h-12 w-12 bg-N40 rounded-full cursor-pointer"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 border-[3px] border-W100 bg-N50 h-6 w-6 flex justify-center items-center rounded-full">
                                                        <Image
                                                            src={
                                                                protocolNames[selectedFromNetwork.chainId].key.find(
                                                                    (entry: any) => entry.name == selectedFromProtocol
                                                                )?.icon || defaultBlue
                                                            }
                                                            alt=""
                                                            className="h-5 w-5 rounded-full cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <div className="h-12 w-12 bg-N50 rounded-full cursor-pointer" />
                                                    <div className="absolute -bottom-1 border-[3px] border-W100 -right-1 bg-N50 h-6 w-6 flex justify-center items-center rounded-full">
                                                        <div className="h-5 w-5 rounded-full cursor-pointer" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-B200">
                                                <input
                                                    min="0"
                                                    type="number"
                                                    placeholder="0"
                                                    value={
                                                        fromTokenDecimal && amountIn && bg(amountIn).isGreaterThan(0)
                                                            ? amountIn
                                                            : amountIn
                                                    }
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        onChangeAmountIn(e.target.value)
                                                    }
                                                    className="w-full text-xl bg-W100 md:text-2xl text-B100 placeholder:text-slate-400 font-bold outline-none"
                                                />
                                                <div className="text-xs md:text-sm text-B100 font-medium">$0.00</div>
                                                <div className="absolute right-0 bottom-0 flex flex-col justify-center items-end gap-1">
                                                    {maxBalance !== amountIn && maxBalance !== "0" ? (
                                                        <span
                                                            onClick={() =>
                                                                onChangeAmountIn(maxBalance ? maxBalance.toString() : "0")
                                                            }
                                                            className="text-xs md:text-sm text-S600 font-medium bg-[rgba(109,223,255,.4)] rounded-xl px-3 py-1"
                                                        >
                                                            Max
                                                        </span>
                                                    ) : maxBalance == "0" ? (
                                                        <span className="text-xs md:text-sm text-N0 font-medium bg-red-700 rounded-xl px-3 py-1">
                                                            No Balance
                                                        </span>
                                                    ) : null}
                                                    <span className="flex gap-2 text-xs md:text-sm text-B100 font-semibold">
                                                        Balance:
                                                        {ismaxBalanceLoading ? (
                                                            <BiLoaderAlt className="animate-spin h-4 w-4" />
                                                        ) : (
                                                            <span className="text-B100">
                                                                {maxBalance ? maxBalance : 0}{" "}
                                                                {selectedFromToken && selectedFromToken}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {bg(maxBalance).isLessThan(amountIn) && (
                                            <div className="text-sm md:text-base text-error-600 font-semibold">
                                                Insufficient Balance
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full flex flex-col justify-center items-center gap-3">
                                        <Button
                                            handleClick={() => sendSingleBatchToList(true)}
                                            isLoading={addToBatchLoading}
                                            customStyle=""
                                            innerText="Add Batch to List"
                                        />

                                        <Button
                                            handleClick={() => handleExecuteMethod()}
                                            isLoading={sendTxLoading}
                                            customStyle=""
                                            innerText="Execute Batch"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

                {showExecuteMethodModel && (
                    <ExecuteMethod
                        ExecuteAllBatches={ExecuteAllBatches}
                    />
                )}

                {showExecuteBatchModel && <ExecuteBatch />}

                {selectedFromNetwork.chainId && showBatchList && (
                    <div className="w-full md:max-w-2xl max-h-full bg-W100 flex flex-col justify-start items-center gap-1 rounded-2xl cursor-pointer shadow-2xl">
                        <div className="w-full flex justify-between items-center gap-1 px-5 pt-7">
                            <h1 className="text-B200 text-lg md:text-xl lg:text-2xl text-center font-bold rounded-t-2xl ">
                                Batching List...
                            </h1>
                            {selectedFromNetwork.chainId && totalfees.gt(0) && (
                                <div className="w-auto flex justify-between items-center text-green-400 gap-4 md:gap-6 bg-[rgba(109,223,255,.2)] border border-green-400 rounded-xl px-4 py-2">
                                    <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-sm">
                                        <Image
                                            src={gas}
                                            alt="gas"
                                            className="h-5 w-5 mr-1 sm:mr-2"
                                        />
                                        <span>
                                            Total Gas
                                        </span>
                                    </h3>

                                    <div className="flex justify-between items-center gap-1">
                                        <Image
                                            src={ChainIdDetails[selectedFromNetwork.chainId].networkLogo}
                                            alt="gas"
                                            className="h-5 w-5 rounded-full"
                                        />
                                        <h6 className="font-semibold text-sm">
                                            {Number(totalfees).toPrecision(4).toString()}
                                        </h6>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full max-h-full overflow-auto flex flex-col gap-5 px-5 py-7">
                            {selectedFromNetwork.chainId &&
                                individualBatch.length > 0 &&
                                individualBatch[0].txArray.length > 0 ? (
                                individualBatch.map((bar: any, inputBarIndex) => (
                                    <>
                                        {bar.txArray.length > 0 && (
                                            <div key={bar.id} className="relative">
                                                <div className="simulation-success flex flex-col justify-center items-start gap-1 border-2 border-B50 rounded-lg bg-N0 p-5 text-black font-medium transition duration-300">
                                                    <div className="w-full flex justify-between items-center gap-2 border-b border-B50">
                                                        <h1 className="flex justify-center items-center gap-3 text-B100 font-extrabold text-base text-transparent bg-clip-text bg-gradient-to-br from-[#7339FD] via-[#56B0F6] to-[#4DD4F4]">
                                                            {inputBarIndex + 1}.
                                                            <span>
                                                                {startCase(bar.data.fromNetwork)} To{" "}
                                                                {startCase(bar.data.toNetwork)}
                                                            </span>
                                                        </h1>
                                                        <MdDelete
                                                            size="40px"
                                                            onClick={() => removeBatch(inputBarIndex)}
                                                            className="hover:bg-N60 active:bg-N60 p-2 rounded-full text-B100"
                                                        />
                                                    </div>
                                                    <div
                                                        className="w-full flex flex-col justify-between items-start gap-2 p-3 rounded-xl bg-[rgba(132,144,251,.1)] mt-4"
                                                        onClick={() => toggleShowBatchList(bar.id)}
                                                    >
                                                        <div className="w-full flex justify-between items-center gap-2">
                                                            <div className="flex justify-start items-start gap-5">
                                                                <div className="relative">
                                                                    <Image
                                                                        src={
                                                                            ChainIdDetails[selectedFromNetwork.chainId]
                                                                                .networkLogo
                                                                        }
                                                                        alt=""
                                                                        className="h-10 w-10 bg-font-200 rounded-full cursor-pointer"
                                                                    />
                                                                    <div className="absolute -bottom-1 -right-1 bg-font-100 h-5 w-5 flex justify-center items-center rounded-full">
                                                                        <Image
                                                                            src={
                                                                                protocolNames[
                                                                                    selectedFromNetwork.chainId
                                                                                ].key.find(
                                                                                    (entry: any) =>
                                                                                        entry.name ==
                                                                                        bar.data.fromProtocol
                                                                                )?.icon || defaultBlue
                                                                            }
                                                                            alt=""
                                                                            className="h-4 w-4 bg-font-200 rounded-full cursor-pointer"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col justify-start items-start">
                                                                    <span className="text-md md:text-lg lg:text-xl font-bold text-B200">
                                                                        {bar.data.amountIn} {bar.data.fromToken}
                                                                    </span>
                                                                    <span className="text-sm md:text-base font-semibold text-font-400">
                                                                        {bar.data.fromProtocol} on{" "}
                                                                        {bar.data.fromNetwork} {" ... "}
                                                                        {bar.data.toProtocol} on {bar.data.toNetwork}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-center items-center border border-[rgba(132,144,251)] hover:bg-[rgba(132,144,251,.1)] rounded-full">
                                                                {showIndividualBatchList === bar.id ? (
                                                                    <MdKeyboardArrowUp
                                                                        size="30px"
                                                                        className="text-[rgba(132,144,251)]"
                                                                    />
                                                                ) : (
                                                                    <MdKeyboardArrowDown
                                                                        size="30px"
                                                                        className="text-[rgba(132,144,251)]"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        {showIndividualBatchList === bar.id && (
                                                            <div className="flex flex-col justify-start items-start gap-1 pl-10 pt-3">
                                                                {bar.batchesFlow.length > 0 &&
                                                                    bar.batchesFlow.map((item: any, index: number) => (
                                                                        <div
                                                                            key={item.action}
                                                                            className="flex flex-col justify-start items-start gap-1"
                                                                        >
                                                                            <div
                                                                                key={item.action}
                                                                                className="flex justify-center items-center gap-3"
                                                                            >
                                                                                <div className="relative">
                                                                                    <Image
                                                                                        src={
                                                                                            ChainIdDetails[
                                                                                                item.fromChainId
                                                                                            ].networkLogo
                                                                                        }
                                                                                        alt=""
                                                                                        className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                                                                                    />
                                                                                    <div className="absolute -bottom-1 -right-1 bg-font-100 h-4 w-4 flex justify-center items-center rounded-full">
                                                                                        <Image
                                                                                            src={
                                                                                                protocolNames[
                                                                                                    item.fromChainId
                                                                                                ].key.find(
                                                                                                    (entry: any) =>
                                                                                                        entry.name ===
                                                                                                        item.protocol
                                                                                                )?.icon || defaultBlue
                                                                                            }
                                                                                            alt=""
                                                                                            className="h-3 w-3 bg-font-200 rounded-full cursor-pointer"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col justify-start items-start">
                                                                                    <span className="text-sm md:text-base font-semibold text-B200 break-all">
                                                                                        {item.action} on {item.protocol}
                                                                                    </span>
                                                                                    <span className="text-xs md:text-sm font-semibold text-font-400">
                                                                                        {item.amount.toString()}{" "}
                                                                                        {item.tokenIn} for{" "}
                                                                                        {item.tokenOut}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            {bar.batchesFlow.length - 1 > index ? (
                                                                                <PiDotsThreeOutlineVertical
                                                                                    size="32px"
                                                                                    className="text-B200"
                                                                                />
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}
                                                        {showIndividualBatchList === bar.id && (
                                                            <div className="w-full flex justify-between items-center gap-1 rounded-lg px-2 mt-3">
                                                                <div className="w-auto flex justify-between items-center text-green-400 gap-4 md:gap-6 bg-[rgba(109,223,255,.2)] border border-green-400 rounded-xl px-4 py-2">
                                                                    <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-sm">
                                                                        <Image
                                                                            src={gas}
                                                                            alt="gas"
                                                                            className="h-5 w-5 mr-1 sm:mr-2"
                                                                        />
                                                                        <span>
                                                                            Gas Used
                                                                        </span>
                                                                    </h3>

                                                                    <div className="flex justify-between items-center gap-1">
                                                                        <Image
                                                                            src={ChainIdDetails[selectedFromNetwork.chainId].networkLogo}
                                                                            alt="gas"
                                                                            className="h-5 w-5 rounded-full"
                                                                        />
                                                                        <h6 className="font-semibold text-sm">
                                                                            {Number(bar.data.fees).toPrecision(3).toString()}
                                                                        </h6>
                                                                    </div>
                                                                </div>

                                                                {Number(bar.data.extraValue) ? (
                                                                    <div className="w-auto flex justify-between items-center text-green-400 gap-4 md:gap-6 bg-[rgba(109,223,255,.2)] border border-green-400 rounded-xl px-4 py-2">
                                                                        <h3 className="flex justify-start items-center gap-1 font-bold text-xs md:text-xs">
                                                                            <Image
                                                                                src={gas}
                                                                                alt="gas"
                                                                                className="h-5 w-5 mr-1 sm:mr-2"
                                                                            />
                                                                            <span>
                                                                                Extra Native Gas
                                                                            </span>
                                                                        </h3>

                                                                        <div className="flex justify-between items-center gap-1">
                                                                            <Image
                                                                                src={ChainIdDetails[selectedFromNetwork.chainId].networkLogo}
                                                                                alt="gas"
                                                                                className="h-5 w-5 rounded-full"
                                                                            />
                                                                            <h6 className="font-semibold text-sm">
                                                                                {Number(bar.data.extraValue).toPrecision(3).toString()}
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ))
                            ) : (
                                <div className="text-center text-font-700 font-semibold text-base md:text-lg">
                                    {txhash ? "Last Batches executed, Now create new batches" : "No Batches Found !"}
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
