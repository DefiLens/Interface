import { TokenData } from "../../../store/TransferStore";

export type tSelectInput = {
    inputSearch: string;
    setInputSearch: (inputSearch: string) => void;
    inputPlaceholder: string;
    inputClassName: string;
    selectOptions: TokenData[];
    handleSelectOption: (tokenName: string, selectOption: string) => void;
    showOptionList: boolean;
    setShowOptionList: (showOptionList: boolean) => void;
    selectedOption: TokenData;
    setSelectedOption: (selectedOption: TokenData) => void;
};
