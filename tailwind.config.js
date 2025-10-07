/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // ← ADD THIS LINE - CRITICAL FOR DARK MODE
  theme: {
    extend: {},
  },
  plugins: [],
};