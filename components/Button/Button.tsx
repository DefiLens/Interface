import React from "react";
import { tButton } from "./types";
import { CgSpinner } from "react-icons/cg";

const Button = ({ handleClick, isLoading = false, customStyle, innerText, disabled }: tButton) => (
    <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`${disabled ? "bg-[rgba(132,144,251,.3)] cursor-not-allowed" : "bg-[rgba(132,144,251,.08)] hover:bg-[rgba(132,144,251,.1)]"} border border-[rgba(132,144,251)] w-full flex justify-center items-center gap-2  py-2.5 px-4 rounded-lg text-xs md:text-sm text-[rgba(132,144,251)] font-bold transition duration-300 ${customStyle}`}
    >
        {isLoading && <CgSpinner className="animate-spin h-6 w-6" />}
        {innerText}
    </button>
);

export default Button;
