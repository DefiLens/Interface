import Image from "next/image";
import { tSelectionBar } from "./types";
import { defaultBlue } from "../../assets/images";
import { useTradingStore } from "../../store/TradingStore";
import clsx from "clsx";

const SelectionBar: React.FC<tSelectionBar> = ({
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
    showBg = true,
}) => {
    const { addToBatchLoading } = useTradingStore((state) => state);

    return (
        <div
            onClick={handleSelectionMenu}
            aria-disabled={addToBatchLoading}
            className={clsx(
                "w-full rounded-lg px-3 py-1 transition cursor-pointer",
                showBg && "bg-[rgba(132,144,251,.4)]"
            )}
        >
            <h5 className="text-sm lg:text-sm text-font-100">
                {titlePlaceholder}
            </h5>
            <div className="flex flex-row justify-start items-center gap-4 py-3">
                {iconCondition ? (
                    <div className="relative">
                        <div className="h-10 w-10">
                            <Image
                                src={mainIcon}
                                alt=""
                                className="h-10 w-10 full bg-N60 rounded-full cursor-pointer"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-N60 h-5 w-5 flex justify-center items-center rounded-full">
                            <Image
                                src={subIcon ? subIcon : defaultBlue}
                                alt=""
                                className="h-4 w-4 rounded-full cursor-pointer"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="h-10 w-10 bg-S100 rounded-full cursor-pointer" />
                        <div className="absolute -bottom-1 -right-1  h-5 w-5 flex justify-center items-center rounded-full">
                            <div className="h-5 w-5 bg-S200 rounded-full cursor-pointer" />
                        </div>
                    </div>
                )}

                {valueCondition ? (
                    <div className="text-font-100">
                        <div className="text-base lg:text-base text-font-100 font-semibold">{mainValue}</div>
                        <div className="text-[0.65rem] text-font-100 font-medium">
                            {firstSubValue && <span>on {firstSubValue}</span>}
                            {secondSubValue && <span> ({secondSubValue})</span>}
                        </div>
                    </div>
                ) : (
                    <div className="text-sm lg:text-base text-opacity-65 text-font-100">{valuePlaceholder}</div>
                )}
            </div>
        </div>
    );
};

export default SelectionBar;
