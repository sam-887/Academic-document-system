/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f4', 100: '#fbe3e7', 500: '#b3273f', 600: '#9a1f34', 700: '#7d1a2b',
        },
      },
    },
  },
  plugins: [],
};
