const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: {
        primary: "#ffffff",
      },
      blue: {
        primary: "#34375d",
        secondary: "#4b5097",
        hover1: "#202549",
        hover2: "#2b3679",
        hoverL1: "#46486f",
      },
      grey: {
        primary: "#f7f7f7",
        secondary: "#6b7280",
        tertiary: "#4b5563",
        hover: "#e2e2e2",
      },
      red: {
        primary: "#a52326",
        secondary: "#f1685e",
        hover: "#bf3c38",
        hoverL1: "#c7433f",
      },
    },
    stroke: (theme) => ({
      "blue-primary": theme("colors.blue.primary"),
      "blue-secondary": theme("colors.blue.secondary"),
      "grey-primary": theme("colors.grey.primary"),
      "grey-secondary": theme("colors.grey.secondary"),
      "grey-tertiary": theme("colors.grey.tertiary"),
      "red-primary": theme("colors.red.primary"),
      "red-secondary": theme("colors.red.secondary"),
    }),
    extend: {
      animation: {
        "spin-slow": "spin 10s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
