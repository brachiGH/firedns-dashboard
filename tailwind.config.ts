import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      fontFamily: {
        sans: [
          "Roobert",
          "Inter",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        blackbg: {
          10: "#E0E0E2",
          50: "#A2A7B0",
          100: "#232325",
          200: "#101113",
          300: "#39393B",
          400: "#131517",
          500: "#111214",
          600: "#17191c",
          700: "#000000",
        },
        black: "#000814",
        yellow: {
          400: "#FFD60A",
          500: "#FFC300",
        },
        orange: {
          400: "#fc772f",
          450: "#ff8f00",
          500: "#f96616",
          600: "#fd5901",
          700: "#ff4d00",
        },
        blue: {
          400: "#2589FE",
          500: "#003566",
          600: "#001D3D",
        },
        red: { 500: "#A32E43", 400: "#EF1923" },
        green: {
          300: "#61e786",
          400: "#7EC3A6",
          500: "#346667",
          600: "#013C1E",
        },
      },
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
