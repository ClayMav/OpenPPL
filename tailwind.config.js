/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind");
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app.d.ts"
  ],
  theme: {
    extend: {}
  },
  darkMode: "class",
  presets: [nativewind]
};
