import React, { useEffect } from "react";
import Image from "next/image";
import { BiSolidChevronDown } from "react-icons/bi";
import { tSelectInput } from "./types";
import { cn } from "../../lib/utils";
import { tokenData } from "../../modules/transfer/types";
import { TokenData } from "../../store/TransferStore";
import { useChainId } from "@thirdweb-dev/react";

const SelectInput = ({
    inputSearch,
    setInputSearch,
    inputPlaceholder,
    inputClassName,
    selectOptions,
    handleSelectOption,
    showOptionList,
    setShowOptionList,
    selectedOption,
    setSelectedOption,
}: tSelectInput) => {
    // Auto-select if only one token in options
    const usdcData = {
        "137": {
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            name: "USDCoin",
        },
        "42161": {
            address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            name: "USDC",
        },
        "10": {
            address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
            name: "USDC",
        },
        "8453": {
            address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
            name: "USDbC",
        },
    };

    const chainId = useChainId();

    useEffect(() => {
        if (selectOptions.length === 1) {
            const option = selectOptions[0];
            handleSelectOption(option.name, option.address);
            setSelectedOption(option);
            setInputSearch("");
        }
    }, [selectOptions]);

    console.log("selectedOption", selectOptions);

    return (
        <div className="w-full text-font-200 rounded-lg">
            <div className="w-full flex justify-start items-center gap-2 bg-N20 border-2 border-B50 text-B100 rounded-md py-3 px-5 shadow-lg">
                {selectedOption.logoURI && <Image
                    src={selectedOption?.logoURI}
                    alt="logo"
                    width={10}
                    height={10}
                    className="h-8 w-8 bg-font-200 rounded-full cursor-pointer"
                />}
                <input
                    type="text"
                    value={selectedOption.symbol ? selectedOption.symbol : inputSearch}
                    onChange={(e) => {
                        setSelectedOption({} as TokenData);
                        setInputSearch(e.target.value);
                    }}
                    placeholder={inputPlaceholder}
                    className={cn(
                        "w-full text-sm md:text-base outline-none font-semibold !placeholder-font-B75 !bg-N20 text-B100",
                        inputClassName
                    )}
                />
                <BiSolidChevronDown
                    onClick={() => setShowOptionList(!showOptionList)}
                    className={cn(
                        "p-1 h-7 w-7 cursor-pointer text-B100 hover:bg-[rgba(132,144,251,.1)] rounded-full transition-transform duration-300",
                        showOptionList && "rotate-180"
                    )}
                />
            </div>
            {(inputSearch.length > 0 || showOptionList) && (
                <div className="w-full max-h-44 bg-N20 border-2 border-B50 text-B100 overflow-auto px-2 mt-1 rounded-md shadow-lg">
                    {selectOptions.length > 0 &&
                        selectOptions.map((option, optionIndex: number) => {
                            return option.name.toLowerCase().includes(inputSearch.toLowerCase()) ? (
                                <div
                                    key={optionIndex}
                                    onClick={() => {
                                        handleSelectOption(option.name, option.address);
                                        setSelectedOption(option);
                                        setShowOptionList(false);
                                        setInputSearch("");
                                    }}
                                    className="w-full flex justify-start items-center gap-3 hover:bg-[rgba(132,144,251,.1)] py-2 px-3 rounded-lg cursor-pointer my-2"
                                >
                                    <Image
                                        src={option.logoURI}
                                        alt="logo"
                                        width={10}
                                        height={10}
                                        className="h-8 w-8 bg-font-200 rounded-full cursor-pointer"
                                    />
                                    {option.name}
                                </div>
                            ) : null;
                        })}
                </div>
            )}
        </div>
    );
};
export default SelectInput;
