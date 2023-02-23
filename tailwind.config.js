/** @type {import('tailwindcss').Config} */
const nativewind = require('nativewind/tailwind')
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './{screens,components,assets,constants,data,hooks,navigation}/*.{js,jsx,ts,tsx}', './app.d.ts'],
  theme: {
    extend: {}
  },
  presets: [nativewind]
}
