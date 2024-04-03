import Image from "next/image";
import { BiSolidChevronDown } from "react-icons/bi";

import { tSelectInput } from "./types";

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
    return (
        <div className="w-full text-font-200 rounded-lg">
            <div className="w-full flex justify-start items-center gap-2 bg-N20 border-2 border-B50 text-B100 rounded-md py-3 px-5 shadow-lg">
                <input
                    type="text"
                    value={selectedOption.symbol ? selectedOption.symbol : inputSearch}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSelectedOption({});
                        setInputSearch(e.target.value);
                    }}
                    placeholder={inputPlaceholder}
                    className={`w-full text-sm md:text-base outline-none font-semibold !placeholder-font-B75 !bg-N20 text-B100 ${inputClassName}`}
                />
                <BiSolidChevronDown
                    size="30px"
                    onClick={() => setShowOptionList(!showOptionList)}
                    className="p-1 cursor-pointer text-B100 hover:bg-[rgba(132,144,251,.1)] rounded-full"
                />
            </div>
            {(inputSearch.length > 0 || showOptionList) && (
                <div className="w-full max-h-44 bg-N20 border-2 border-B50 text-B100 overflow-scroll px-2 mt-1 rounded-md shadow-lg">
                    {selectOptions.length > 0 &&
                        selectOptions.map((option, optionIndex) => {
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
                                        alt=""
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
