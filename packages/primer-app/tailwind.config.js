const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
      serif: ["Source Serif Pro", ...defaultTheme.fontFamily.serif],
      mono: ["Source Code Pro", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      animation: {
        "spin-slow": "spin 10s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
