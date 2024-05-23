import React from "react";
import { FiCheck } from "react-icons/fi";

type CustomCheckboxProps = {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => {
    return (
        <label className="inline-flex items-center relative h-3.5 w-3.5 rounded border border-B100 overflow-hidden">
            <input
                type="checkbox"
                className="form-checkbox rounded h-4 w-4 border"
                checked={checked}
                onChange={onChange}
            />
            <div className="absolute form-checkbox h-4 w-4 bg-N0 rounded text-success-600 active:text-B200 font-extrabold flex items-center justify-center cursor-pointer">
                {checked && <FiCheck />}
            </div>
        </label>
    );
};

export default CustomCheckbox;
