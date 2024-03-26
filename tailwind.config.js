/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./modules/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary-100": "#e0e7ff",
                "primary-600": "#4f46e5",
                "primary-700": "#4338ca",
                "primary-800": "#3730a3",
                "primary-900": "#312e81",
                "primary-950": "#080829",

                "secondary-50": "#f9fafb",
                "secondary-300": "#d1d5db",
                "secondary-400": "#9ca3af",
                "secondary-500": "#6b7280",
                "secondary-600": "#4b5563",
                "secondary-700": "#374151",
                "secondary-800": "#1f2937",

                "success-600": "#16a34a",
                "success-700": "#15803d",
                "success-800": "#166534",
                "success-900": "#14532d",

                "error-600": "#dc2626",
                "error-700": "#b91c1c",
                "error-800": "##991b1b",
                "error-900": "#7f1d1d",

                "button-100": "#3B83F7",
                "button-7700": "#6DDFFF",
                "button-200": "#3575de",
                "button-300": "#2f68c5",
                "button-400": "#295bac",
                "button-1100": "#60a5fa",

                "font-100": "#ffffff",
                "font-200": "#e5e5e5",
                "font-300": "#cccccc",
                "font-400": "#b2b2b2",
                "font-500": "#999999",
                "font-600": "#7f7f7f",
                "font-700": "#666666",
                "font-800": "#4c4c4c",
                "font-900": "#333333",
                "font-1000": "#191919",
                "font-1100": "#000000",

                "backgound-100": "#121A2B",
                "backgound-200": "#172540",
                "backgound-300": "#15223D",
                "backgound-400": "#142139",
                "backgound-500": "#121d33",
                "backgound-600": "#293347",
                "backgound-700": "#414a5b",
                "backgound-800": "#596070",
                "backgound-900": "#707784",


                // Primary (Purple)
                'P75': '#efebf2',
                'P100': '#e3d5ed',
                'P200': '#cdb3e7',
                'P300': '#9f65d9',
                'P400': '#8b5fbc',
                'P500': '#77599d',
                'P600': '#675280',
                'P700': '#5b4c69',
                'P800': '#49434d',
                'P900': '#353c31',

                //Secondary (Cyan)
                'S100': '#bde6e7',
                'S200': '#90d5d7',
                'S300': '#7acccf',
                'S400': '#62c3c6',
                'S500': '#34b1b6',
                'S600': '#069fa5',
                'S700': '#1895ac',


                //Dark (Dark green)
                "D75": "#2b99a1",
                "D100": "#24848b",
                "D200": "#1d7076",
                "D300": "#165d62",
                "D400": "#104a4e",
                "D500": "#0a383c",
                "D600": "#05272a",
                "D700": "#021719",
                "D800": "#010809",
                "D900": "#000101",



                //Black
                "B50": '#e6e7e7',
                "B75": '#9e9999',
                "B100": '#716e76',
                "B200": '#30353b',
                "B300": '#0b0513',
                "B400": '#08040d',
                "B500": '#03070c',

                //White
                "W50": '#fefefe',
                "W75": '#fafafa',
                "W100": '#f8f8f8',
                "W200": '#f5f5f5',
                "W300": '#f3f3f3',
                "W400": '#aaaaaa',
                "W500": '#949494',

                //Neutral
                "N0": '#fefefe',
                "N10": '#fdfdfd',
                "N20": '#fbfbfb',
                "N30": '#f7f7f7',
                "N40": '#f2f2f2',
                "N50": '#e7e7e7',
                "N60": '#e1e1e1',
                "N70": '#dcdcdc',
                "N80": '#d6d6d6',
                "N90": '#d0d0d0',
                "N100": '#cbcbcb',
                "N200": '#c5c5c5',
                "N300": '#bfbfbf',
                "N400": '#bababa',
                "N500": '#b4b4b4',
                "N600": '#afafaf',
                "N700": '#a9a9a9',
                "N800": '#a3a3a3',
                "N900": '#9e9e9e',

                dark: "#000000",
                light: "#FFFFFF",
            },
        },
    },
    plugins: [],
};
