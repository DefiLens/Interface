/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

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

        dark: "#000000",
        light: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
