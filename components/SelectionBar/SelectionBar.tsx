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
        className="w-full rounded-lg px-5 py-3 hover:bg-[rgba(132,144,251,.4)] transition"
    >
        <h5 className="text-sm md:text-base lg:text-lg font-medium md:font-semibold text-font-100">
            {titlePlaceholder}
        </h5>
        <div className="flex flex-row justify-start items-center gap-8 py-3">
            {iconCondition ? (
                <div className="relative">
                    <div className="h-12 w-12">
                        <Image
                            src={mainIcon}
                            alt=""
                            className="h-12 w-12 full w-full bg-N60 rounded-full cursor-pointer"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-N60 h-6 w-6 flex justify-center items-center rounded-full p-1">
                        <Image
                            src={subIcon ? subIcon : defaultBlue}
                            alt=""
                            className="h-full w-full rounded-full cursor-pointer"
                        />
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <div className="h-12 w-12 bg-S100 rounded-full cursor-pointer" />
                    <div className="absolute -bottom-1 -right-1  h-7 w-7 flex justify-center items-center rounded-full">
                        <div className="h-5 w-5 bg-S200 rounded-full cursor-pointer" />
                    </div>
                </div>
            )}

            {valueCondition ? (
                <div className="text-font-100">
                    <div className="text-base md:text-lg text-font-100 font-semibold">{mainValue}</div>
                    <div className="text-xs text-font-100 font-medium">
                        {firstSubValue && <span>on {firstSubValue}</span>}
                        {secondSubValue && <span> ({secondSubValue})</span>}
                    </div>
                </div>
            ) : (
                <div className="text-base md:text-lg text-font-100">{valuePlaceholder}</div>
            )}
        </div>
    </div>
);
export default SelectionBar;
