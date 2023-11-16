import React from 'react';

import Image from 'next/image';
import { tSelectInput } from './types';
import { BiSolidChevronDown } from 'react-icons/bi';

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
    setSelectedOption
}: tSelectInput) => {

  return (
    <div className="w-full !bg-backgound-100 text-font-200 rounded-lg">
        <div className="w-full flex justify-start items-center gap-2 !bg-backgound-300 text-font-200 py-3 px-5 border-2 border-backgound-600 rounded-lg shadow">
            <input
                type="text"
                value={selectedOption.symbol ? selectedOption.symbol : inputSearch}
                onChange={(e: any) => {
                    setSelectedOption({})
                    setInputSearch(e.target.value)
                }}
                placeholder={inputPlaceholder}
                className={`w-full text-sm md:text-base outline-none font-semibold !placeholder-font-300 !bg-backgound-300 text-font-100 ${inputClassName}`}
            />
            <BiSolidChevronDown
                size="30px"
                onClick={() => setShowOptionList(!showOptionList)}
                className="p-1"
            />
        </div>
        {(inputSearch.length > 0 || showOptionList) && (
            <div className="w-full max-h-44 bg-backgound-500 overflow-scroll px-2">
                {selectOptions.length > 0 && selectOptions.map((option: any, optionIndex: number) => {
                    return option.name.toLowerCase().includes(inputSearch.toLowerCase()) ? (
                        <div
                            key={optionIndex}
                            onClick={() => {
                                handleSelectOption(option.name, option.address)
                                setSelectedOption(option)
                                setShowOptionList(false)
                                setInputSearch("")
                            }}
                            className="w-full flex justify-start items-center gap-3 hover:bg-backgound-200 active:bg-backgound-100 py-2 px-3 rounded-lg cursor-pointer my-2"
                        >
                            <Image
                                src={option.logoURI}
                                alt=""
                                width={10}
                                height={10}
                                className="h-7 w-7 bg-font-200 rounded-full cursor-pointer"
                            />
                            {option.name}
                        </div>
                    ) : null}
                )}
            </div>
        )}
    </div>
  );
}
export default SelectInput;