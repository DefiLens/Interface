import React, { useRef } from "react";

import { tButton } from "./types";
import { CgSpinner } from "react-icons/cg";

const Button = ({ handleClick, isLoading = false, customStyle, innerText, disabled }: tButton) => (
    <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`${
            isLoading ? "bg-button-1100 hover:bg-button-1100" : "bg-button-100 hover:bg-button-100"
        }  w-full flex justify-center items-center gap-2  py-3 px-5 rounded-lg text-base md:text-lg text-font-100 font-bold transition duration-300 ${customStyle}`}
    >
        {isLoading && <CgSpinner className="animate-spin h-7 w-7" />}
        {innerText}
    </button>
);
export default Button;
