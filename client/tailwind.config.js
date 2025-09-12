/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#192f4a',
        secondary: '#003366',
        accent: '#005691',
        highlight: '#0077b6',
        light: '#add8e6',
      },
    },
  },
};