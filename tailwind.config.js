/** @type {import("tailwindcss").Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        "primary-hover": "#46486f",
        "secondary-hover": "#2b3679",
        tertiary: "#2c6a85",
        quaternary: "#64b0c8",
      },
      grey: {
        primary: "#f7f7f7",
        secondary: "#6b7280",
        tertiary: "#4b5563",
        quaternary: "#d4d4d4",
        "primary-hover": "#e2e2e2",
      },
      red: {
        primary: "#a52326",
        secondary: "#f1685e",
        "primary-hover": "#c7433f",
        "secondary-hover": "#bf3c38",
        tertiary: "#cd3764",
      },
      green: {
        primary: "#62e2b4",
      },
      yellow: {
        primary: "#ffb961",
        secondary: "#e5a34f",
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
      fontFamily: {
        code: ["Source Serif Variable", ...defaultTheme.fontFamily.serif],
        sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
        branding: ["Source Serif Semibold", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
