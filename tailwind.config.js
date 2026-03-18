/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./{components,pages,crm,src}/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
