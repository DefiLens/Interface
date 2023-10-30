import React from 'react';
import { tExecuteBatchModel } from './types';
import { iGlobal, useGlobalStore } from '../../store/GlobalStore';
import { iTrade, useTradeStore } from '../../store/TradeStore';
import { base, closeNarrow, downLine, polygon, sideLine } from '../../assets/images';
import Image from 'next/image';
import { error, loading, success } from '../../assets/gifs';
import { BsArrowRight } from 'react-icons/bs';
import { buildTxHash } from '../../utils/helper';

const ExecuteBatchModel = ({
}: tExecuteBatchModel) => {

  const {
    scwBalance,
  }: iGlobal = useGlobalStore((state) => state);

  const {
    selectedFromNetwork,
    selectedToNetwork,
    individualBatch,
    setShowExecuteBatchModel,
    hasExecutionSuccess,
    setHasExecutionSuccess,
    hasExecutionError,
    setHasExecutionError,
    txhash,
    setTxHash,
    setIndividualBatch,
  }: iTrade = useTradeStore((state) => state);

  const closeExecuteBatchModel = () => {
    setShowExecuteBatchModel(false);
    // if (!hasExecutionError) {
    //   setIndividualBatch([
    //     {
    //         id: 0,
    //         txArray: [],
    //         data: {
    //             fromNetwork: "",
    //             toNetwork: "",
    //             fromProtocol: "",
    //             toProtocol: "",
    //             fromToken: "",
    //             toToken: "",
    //             amountIn: "",
    //         },
    //         simulation: {
    //             isSuccess: false,
    //             isError: false,
    //         }
    //       },
    //   ]);
    // }
    setTxHash('');
    setHasExecutionSuccess('');
    setHasExecutionError('');
  }

  return (
    <div className="fixed w-full h-full flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 text-black backdrop-brightness-50 p-5 md:p-10">
      <div className="h-auto w-[600px] flex flex-col justify-center items-center gap-2 bg-white border-2 border-gray-300 rounded-2xl p-3">
        {txhash || hasExecutionError ? (
          <button
            type="button"
            onClick={() => closeExecuteBatchModel()}
            className="w-8 h-8 place-self-end p-2 bg-slate-50 hover:bg-slate-200 active:bg-slate-100 rounded-xl cursor-pointer outline-none"
          >
            <Image
              src={closeNarrow}
              alt=""
              />
          </button>
        ) : null}
        <div className="h-full w-full flex flex-col justify-center items-center gap-2 p-5">
          <Image
            src={txhash ? success : hasExecutionError ? error : loading}
            alt=""
            className="w-20 h-20 md:w-28 md:h-28 !bg-green-400"
          />
          <div
            className="w-full text-center text-xl md:text-2xl text-black font-bold cursor-pointer m-2"
          >
            {txhash ? 'Execute Batches Successfully' : hasExecutionError ? 'Execution Error' : 'Executing All Batches'}
          </div>
          <div className="w-full overflow-auto">
            {!hasExecutionError && (
              individualBatch.length > 0 && individualBatch[0].txArray.length > 0 ? (
                  <div className="w-full max-h-60 flex flex-col justify-start items-center text-sm md:text-base py-5">
                    {individualBatch.map((bar: any, index: number) => (
                      bar.txArray.length > 0 && (
                        <div
                          key={bar.id}
                          className="w-full flex justify-start items-center gap-5 py-2"
                        >
                          <div className="w-full flex justify-start items-center gap-3">
                            <span className="text-base md:text-lg font-semibold">
                              {index + 1}.
                            </span>
                            <div className="relative">
                              <Image
                                src={polygon}
                                alt=""
                                className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-white h-4 w-4 flex justify-center items-center rounded-full">
                                <Image
                                  src={polygon}
                                  alt=""
                                  className="h-3 w-3 bg-slate-200 rounded-full cursor-pointer"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-sm md:text-base font-semibold text-slate-700">
                                {bar.data.fromProtocol}
                              </span>
                              <span className="text-xs md:text-sm font-semibold text-slate-700">
                                {bar.data.amountIn} {bar.data.fromToken}
                              </span>
                            </div>
                          </div>

                          <BsArrowRight className="w-10 h-10" />

                          <div className="w-full flex justify-start items-center gap-3">
                            <div className="relative">
                              <Image
                                src={base}
                                alt=""
                                className="h-8 w-8 bg-slate-200 rounded-full cursor-pointer"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-white h-4 w-4 flex justify-center items-center rounded-full">
                                <Image
                                  src={base}
                                  alt=""
                                  className="h-3 w-3 bg-slate-200 rounded-full cursor-pointer"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <span className="text-sm md:text-base font-semibold text-slate-700">
                                {bar.data.toProtocol}
                              </span>
                              <span className="text-xs md:text-sm font-semibold text-slate-700">
                                {bar.data.amountIn} {bar.data.toToken}
                              </span>
                            </div>
                          </div>
                        </div>
                      )))}
                  </div>
              ) : null
            )}
          </div>
          <div
            className="w-full break-words text-center text-base md:text-lg text-teal-500  font-semibold m-2"
          >
            {txhash ? (
              <span className="flex flex-col justify-center items-center gap-2">
                <a
                  target="_blank"
                  href={buildTxHash(selectedFromNetwork.chainId, txhash, false)}
                  className="cursor-pointer bg-teal-500 text-white rounded-lg px-5 py-1"
                >
                  View on Explorer
                </a>
                {selectedFromNetwork.chainId !== selectedToNetwork.chainId && (
                  <a
                    target="_blank"
                    href={buildTxHash(selectedFromNetwork.chainId, txhash, true)}
                    className="cursor-pointer bg-blue-700 text-white rounded-lg px-6 py-0.5"
                  >
                    View on SocketScan.io
                  </a>
                )}
              </span>
            ) : hasExecutionError ? (
              <span className="text-red-500">
                {hasExecutionError.includes('code=ACTION_REJECTED') 
                  ? "MetaMask Tx Signature: User denied Transaction Signature."
                  : "Something went wrong."}
              </span>
            ) : (
              <span>
                Proceed in your wallet
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExecuteBatchModel;