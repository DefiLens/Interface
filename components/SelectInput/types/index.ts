import { tokenData } from "../../../modules/transfer/types";

export type tSelectInput = {
    inputSearch: string;
    setInputSearch: (inputSearch: string) => void;
    inputPlaceholder: string;
    inputClassName: string;
    selectOptions: tokenData[];
    handleSelectOption: (tokenName: string, selectOption: string) => void;
    showOptionList: boolean;
    setShowOptionList: (showOptionList: boolean) => void;
    selectedOption: tokenData;
    setSelectedOption: (selectedOption: tokenData) => void;
};
