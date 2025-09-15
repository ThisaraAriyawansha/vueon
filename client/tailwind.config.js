/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#192f4a', // Dark blue for backgrounds
        secondary: '#003366', // Deeper blue for borders
        accent: '#005691', // Medium blue for buttons
        highlight: '#0077b6', // Lighter blue for hover effects
        light: '#add8e6', // Light blue for text/backgrounds
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Minimalist, Apple-inspired font
        orbitron: ['Orbitron', 'sans-serif'], // Tech-inspired, robotic font
      },
    },
  },
  plugins: [],
};