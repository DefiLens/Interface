export type tSelectInput = {
    inputSearch: string;
    setInputSearch: (inputSearch: any) => void;
    inputPlaceholder: string;
    inputClassName: string;
    selectOptions: any[];
    handleSelectOption: (tokenName: string, selectOption: string) => void;
    showOptionList: boolean;
    setShowOptionList: (showOptionList: boolean) => void;
    selectedOption: any;
    setSelectedOption: (selectedOption: any) => void;
};
