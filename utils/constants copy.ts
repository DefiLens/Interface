
export const ReactSelectStyles = {
    control: (styles: any) => ({
        ...styles,
        border: "2px solid #293347",
        background: "#15223D",
        color: "#cccccc !important",
        padding: "5px",
        borderRadius: "10px",
        outline: "none",
        boxShadow: styles.isFocused ? 0 : 0,
        "&:hover": {
            boxShadow: styles.isFocused ? 0 : 0,
        },
    }),
    placeholder: (styles: any) => ({
        ...styles,
        color: "#ffffff !important",
    }),
};

export const buttonStyle =
    "bg-button-100 hover:bg-primary-700 py-1 px-5 rounded-lg text-primary-100 font-medium border-b-4 border-primary-800 hover:border-primary-900 transition duration-300";

export const inputContainer = "w-full relative float-label-input shadow-md rounded-md";

export const inputBoxStyle =
    "w-full bg-white focus:outline-none focus:shadow-outline border-2  rounded-md p-2 block appearance-none leading-normal focus:border-primary-950";

export const inputLabelStyle =
    "absolute top-2 left-0 text-secondary-800 text-md pointer-events-none rounded-full transition duration-200 ease-in-outbg-white px-3";

export const selectContainer =
    "w-full relative border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md";

export const selectBoxStyle = "appearance-none w-full p-2 bg-white rounded-md";

export const selectAppearanceStyle =
    "pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-3 text-secondary-500 border-l-2";
