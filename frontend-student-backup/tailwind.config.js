/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff', 100: '#dbe6ff', 500: '#3b5bdb', 600: '#2f4bc7', 700: '#263ba0',
        },
      },
    },
  },
  plugins: [],
};
