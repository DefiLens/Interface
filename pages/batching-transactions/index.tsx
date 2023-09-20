import * as React from "react";

import { BigNumber as bg } from "bignumber.js";

import { MdDelete } from "react-icons/md";
import { ImSpinner } from "react-icons/im";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { LiaChevronUpSolid, LiaChevronDownSolid } from "react-icons/lia";

import { buildTxHash, shorten } from "../../utils/helper";
import { _nonce, _functionType, BIG_ZERO } from "../../utils/constants";
import { useEoaProvider } from "../../hooks/aaProvider/useEoaProvider";
import { useBiconomyProvider } from "../../hooks/aaProvider/useBiconomyProvider";
import { useBatchingTxnStore, iBatchingTxn } from "../../store/BatchingTxnStore";
import IndividualBatch from "../../components/BatchingComponenets/IndividualBatch";
import ChainContext from "../../Context/ChainContext";

bg.config({ DECIMAL_PLACES: 10 });

const Batching: React.FC<{}> = () => {
    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { selectedChainId } = React.useContext(ChainContext);

    const {
        individualBatch,
        setIndividualBatch,
        showIndividualBatchList,
        setShowIndividualBatchList,
        allTxs,
        setCollectedValues,
        sendTxLoading,
        setSendtxLoading,
        setSendtxLoadingForEoa,
        txhash,
        setTxHash,
    }: iBatchingTxn = useBatchingTxnStore((state) => state);

    const addBatch = () => {
        setIndividualBatch([]);
        setIndividualBatch([
            {
                id: 0,
                txHash: [],
                data: {
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
        // setIndividualBatch((prevInputBars) => prevInputBars.filter((bar) => bar.id !== id));
        const updatedBatch = [...individualBatch];
        updatedBatch.splice(index, 1); // Remove the InputBar at the specified index
        setIndividualBatch(updatedBatch);
    };

    const updateInputValues = (index: number, txHash: string[], data: any) => {
        console.log("data: ", data, individualBatch);
        if (txHash.length < 1) return alert("Please complete the last input before adding a new one.");
        if (individualBatch.length == 0) {
            setIndividualBatch([
                ...individualBatch,
                {
                    id: 0,
                    txHash: [],
                    data: {
                        fromProtocol: "",
                        toProtocol: "",
                        fromToken: "",
                        toToken: "",
                        amountIn: "",
                    },
                },
            ]);
        }
        const updatedBatch = [...individualBatch];
        updatedBatch[index].txHash = txHash;
        updatedBatch[index].data = data;
        setIndividualBatch([
            ...updatedBatch,
            {
                id: updatedBatch.length,
                txHash: [],
                data: {
                    fromProtocol: "",
                    toProtocol: "",
                    fromToken: "",
                    toToken: "",
                    amountIn: "",
                },
            },
        ]);
        // setIndividualBatch((prevInputBars) => prevInputBars.map((bar) => (bar.id === id ? { ...bar, txHash } : bar)));
        // addBatch();
    };

    const sendBatchAll = async (isSCW: any) => {
        try {
            if (isSCW) {
                setSendtxLoading(true);
            } else {
                setSendtxLoadingForEoa(true);
            }
            const mergeArray: any = [];
            await individualBatch.map((bar) => bar.txHash.map((hash) => mergeArray.push(hash)));
            console.log("mergedArray--: ", mergeArray);
            // setCollectedValues(mergeArray);
            let tempTxhash = "";
            if (isSCW) {
                tempTxhash = await sendToBiconomy(mergeArray);
            } else {
                tempTxhash = await sendTxTrditionally(mergeArray);
            }
            if (tempTxhash) {
                setTxHash(tempTxhash);
            }
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
            addBatch();
        } catch (error) {
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
        }
    };

    const toggleShowBatchList = (id: number): void => {
        if (showIndividualBatchList === id) {
            setShowIndividualBatchList(null);
        } else {
            setShowIndividualBatchList(id);
        }
    };

    return (
        <>
            <div className="h-full flex flex-col gap-3">
                <div className="flex justify-between items-center gap-3 py-1">
                    {/* { individualBatch.length < 1 &&
                        <button
                        type="button"
                        onClick={addBatch}
                        className="flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-950 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-slate-600 hover:border-slate-700 transition duration-300"
                        >
                            <RiAddCircleLine size="20px" /> Add New Batch Bar
                        </button>
                    } */}
                    <h1 className="flex justify-center items-center gap-2 hover:bg-slate-950 hover:text-white py-2 px-5 rounded-lg font-medium transition duration-300">
                        Batch transactions
                    </h1>
                    <button
                        type="button"
                        onClick={() => sendBatchAll(true)}
                        className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                    >
                        {sendTxLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                        Execute Batch {!sendTxLoading && <BiSolidRightArrowCircle size="20px" />}
                    </button>
                    {/* <button
                        type="button"
                        onClick={() => sendBatchAll(false)}
                        className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                    >
                        {sendTxLoadingForEoa && <ImSpinner className="animate-spin h-5 w-5" />}
                        Send Batches via EOA
                    </button> */}
                </div>
                <div className="h-full flex flex-col sm:flex-row justify-center items-start gap-4">
                    {true && (
                        <div className="w-full min-h-full bg-gradient-to-t from-gray-200 via-white to-gray-200 flex flex-col gap-5 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                            <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold mb-5">
                                Building Batch No: {individualBatch.length}
                            </h1>

                            {individualBatch.length > 0 && (
                                <IndividualBatch
                                    key={individualBatch[individualBatch.length - 1]?.id}
                                    // values={bar.txHash}
                                    onUpdate={(newValues, data) => {
                                        updateInputValues(
                                            // individualBatch[individualBatch.length - 1].id,
                                            individualBatch.length - 1,
                                            newValues,
                                            data
                                        );
                                    }}
                                />
                            )}
                        </div>
                    )}
                    <div className="w-full min-h-full bg-gradient-to-t from-gray-200 via-white to-gray-200 text-center flex flex-col gap-3 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                        <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold mb-5">
                            Batching List
                        </h1>
                        {txhash != "" && (
                            <div className="flex justify-center items-center gap-3 py-5">
                                <p>
                                    <a
                                        target="_blank"
                                        href={buildTxHash(selectedChainId, txhash, false)}
                                        className="text-lg md:text-xl lg:text-1xl text-center text-lime-700 underline underline-offset-1 font-extrabold mb-5"
                                    >
                                        Success Batch TxHash : {shorten(txhash)}
                                    </a>
                                </p>
                            </div>
                        )}
                        {individualBatch.length > 0 && individualBatch[0].txHash.length > 0 ? (
                            individualBatch.map((bar, inputBarIndex) => (
                                <>
                                    {bar.txHash.length > 0 && (
                                        <div key={bar.id} className="relative">
                                            <div className="simulation-success flex justify-between items-center gap-5 bg-black py-2 px-3 rounded-lg text-primary-100 font-medium   transition duration-300">
                                                <div className="flex justify-start items-baseline gap-2">
                                                    <h1 className="flex justify-center items-center gap-3 text-white font-semibold text-base">
                                                        {inputBarIndex + 1}.
                                                    </h1>
                                                    <div className="flex justify-center items-center gap-2 text-white text-sm">
                                                        <span>
                                                            {`From ${bar.data.fromProtocol} Protocol of ${bar.data.fromToken} token`}
                                                        </span>
                                                        <span>
                                                            {`To ${bar.data.toProtocol} Protocol of ${bar.data.toToken} token`}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center gap-2">
                                                    <div>
                                                        <MdDelete
                                                            color="red"
                                                            size="20px"
                                                            onClick={() => removeBatch(inputBarIndex)}
                                                        />
                                                    </div>
                                                    <span className="flex justify-center items-center gap-2">
                                                        <div onClick={() => toggleShowBatchList(bar.id)}>
                                                            {showIndividualBatchList === bar.id ? (
                                                                <LiaChevronUpSolid size="20px" />
                                                            ) : (
                                                                <LiaChevronDownSolid size="20px" />
                                                            )}
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            {showIndividualBatchList === bar.id && (
                                                <div className="w-full my-1 z-50 flex flex-col justify-center items-start text-start gap-1 bg-gray-700 p-3 rounded-lg">
                                                    <div className="w-full text-base font-bold text-gray-400">
                                                        Old Position
                                                    </div>
                                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                        <div className="w-60 font-medium text-sm">From Protocol</div>
                                                        <div className="w-full font-normal text-xs">
                                                            {bar.data.fromProtocol}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                        <div className="w-60 font-medium text-sm">From Token</div>
                                                        <div className="w-full font-normal text-xs">
                                                            {bar.data.fromToken}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                        <div className="w-60 font-medium text-sm">Amount</div>
                                                        <div className="w-full font-normal text-xs">
                                                            {bar.data.amountIn}
                                                        </div>
                                                    </div>
                                                    {/* <div className="w-full flex justify-start items-baseline gap-1 text-base font-medium text-white">
                                                        <span>Amount :</span>
                                                        <span className="font-normal text-sm">{bar.data.amountIn}</span>
                                                    </div> */}

                                                    <div className="w-full text-md font-semibold text-gray-400 mt-3">
                                                        New Position will be
                                                    </div>
                                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                        <div className="w-60 font-medium text-sm">To Protocol</div>
                                                        <div className="w-full font-normal text-xs">
                                                            {bar.data.toProtocol}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                                        <div className="w-60 font-medium text-sm">To Protocol</div>
                                                        <div className="w-full font-normal text-xs">
                                                            {bar.data.toToken}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ))
                        ) : (
                            <div className="text-black font-semibold text-base md:text-lg">
                                {txhash ? "Last Batches executed, Now create new batches" : "No Batches Found !"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Batching;
