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
        "button-200": "#3575de",
        "button-300": "#2f68c5",
        "button-400": "#295bac",

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

        dark: "#000000",
        light: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
