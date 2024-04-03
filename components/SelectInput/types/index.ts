import { iTokenData } from "../../../store/TradingStore";

export type tSelectInput = {
    inputSearch: string;
    setInputSearch: (inputSearch: string) => void;
    inputPlaceholder: string;
    inputClassName: string;
    selectOptions: iTokenData[];
    handleSelectOption: (tokenName: string, selectOption: string) => void;
    showOptionList: boolean;
    setShowOptionList: (showOptionList: boolean) => void;
    selectedOption: iTokenData;
    setSelectedOption: (selectedOption: iTokenData | {}) => void;
};
