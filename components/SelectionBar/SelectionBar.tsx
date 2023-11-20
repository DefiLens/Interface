import React, { useRef } from "react";
import Image from "next/image";

import { tSelectionBar } from "./types";
import { defaultBlue } from "../../assets/images";

const SelectionBar = ({
    handleSelectionMenu,
    titlePlaceholder,
    iconCondition,
    mainIcon,
    subIcon,
    valueCondition,
    valuePlaceholder,
    mainValue,
    firstSubValue,
    secondSubValue,
}: tSelectionBar) => (
    <div
        onClick={handleSelectionMenu}
        className="w-full bg-backgound-100 border border-backgound-300 rounded-lg px-5 py-3"
    >
        <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-font-100">
            {titlePlaceholder}
        </h5>
        <div className="flex flex-row justify-start items-center gap-8 py-3">
            {iconCondition ? (
                <div className="relative">
                    <Image
                        src={mainIcon}
                        alt=""
                        className="h-12 w-12 bg-backgound-300 rounded-full cursor-pointer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-backgound-100 h-6 w-6 flex justify-center items-center rounded-full">
                        <Image
                            src={subIcon ? subIcon : defaultBlue}
                            alt=""
                            className="h-5 w-5 bg-backgound-300 rounded-full cursor-pointer"
                        />
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <div className="h-12 w-12 bg-backgound-300 rounded-full cursor-pointer" />
                    <div className="absolute -bottom-1 -right-1 bg-backgound-100 h-6 w-6 flex justify-center items-center rounded-full">
                        <div className="h-5 w-5 bg-backgound-300 rounded-full cursor-pointer" />
                    </div>
                </div>
            )}

            {valueCondition ? (
                <div className="text-font-100">
                    <div className="text-base md:text-lg text-font-100 font-semibold">
                        {mainValue}
                    </div>
                    <div className="text-xs text-font-300 font-medium">
                        {firstSubValue && <span>on {firstSubValue}</span>}
                        {secondSubValue && <span> ({secondSubValue})</span>}
                    </div>
                </div>
            ) : (
                <div className="text-base md:text-lg text-font-300">
                    {valuePlaceholder}
                </div>
            )}
        </div>
    </div>
);
export default SelectionBar;
