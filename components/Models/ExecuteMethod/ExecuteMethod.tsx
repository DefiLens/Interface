import React from "react";

import Image from "next/image";

import { tExecuteMethod } from "./types";
import Button from "../../Button/Button";
import { loading01, payClick } from "../../../assets/gifs";
import { ExecutionMethodsList } from "../../../utils/data/constants";
import { closeNarrow } from "../../../assets/images";
import { iTrading, useTradingStore } from "../../../store/TradingStore";

const ExecuteMethod = ({
    ExecuteAllBatches
}: tExecuteMethod) => {
    const {
        sendTxLoading,
        setShowExecuteMethodModel,
    }: iTrading = useTradingStore((state) => state);

    const closeExecuteMethodModel = () => {
        setShowExecuteMethodModel(false);
    };

    return (
        <div className="fixed w-full h-full flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 text-black backdrop-brightness-50 p-5 md:p-10">
            <div className="h-auto w-[600px] flex flex-col justify-center items-center gap-2 bg-white border-2 border-gray-300 rounded-2xl p-3">
                <button
                    type="button"
                    onClick={() => closeExecuteMethodModel()}
                    className="w-8 h-8 place-self-end p-2 bg-slate-50 hover:bg-slate-200 active:bg-slate-100 rounded-xl cursor-pointer outline-none"
                >
                    <Image
                        src={closeNarrow}
                        alt="close"
                    />
                </button>
                <div className="h-full w-full flex flex-col justify-center items-center gap-2 p-5">
                    <Image
                        src={sendTxLoading ? loading01 : payClick}
                        alt={sendTxLoading ? 'loading' : 'click'}
                        className="w-14 h-14"
                    />
                    <div className="w-full text-center text-xl md:text-2xl text-black font-extrabold cursor-pointer">
                        Execute Batch in Single Click
                    </div>
                    <div className="w-[75%] max-h-96 overflow-auto flex flex-col justify-start items-center gap-5 px-5 py-2 mt-5">
                        {ExecutionMethodsList.length > 0 && ExecutionMethodsList.map((item: any) => (
                            <div
                                key={item.title}
                                role="presentation"
                                className="w-full flex flex-col justify-between items-center gap-3 p-4 border rounded-lg shadow cursor-pointer"
                            >
                                <div className="w-full flex justify-center items-center">
                                    {item.icons.length > 0 && item.icons?.map((logo: any) => (
                                        <Image
                                            key={logo.name}
                                            src={logo.icon}
                                            alt={logo.name}
                                            className={`h-12 w-12 p-0.5 bg-black rounded-full cursor-pointer ${logo.style ?? ''}`}
                                        />
                                    ))}
                                </div>
                                <Button
                                    handleClick={() => ExecuteAllBatches(true, item.providerName)}
                                    customStyle="!w-auto"
                                    innerText={item.title}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ExecuteMethod;
