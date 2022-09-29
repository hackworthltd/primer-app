/** @type {import("tailwindcss").Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
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
        tertiary: "#2C6A85",
        quaternary: "#64B0C8",
        "primary-hover": "#46486f",
        "secondary-hover": "#2b3679",
      },
      grey: {
        primary: "#f7f7f7",
        secondary: "#6b7280",
        tertiary: "#4b5563",
        "primary-hover": "#e2e2e2",
      },
      red: {
        primary: "#D10700",
        secondary: "#CD3764",
        "primary-hover": "#9E322E",
        "secondary-hover": "#7E213B",
      },
      green: {
        primary: "#62E2B4",
      },
      yellow: {
        primary: "#9FFB961",
        secondary: "#E5A34F",
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
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
