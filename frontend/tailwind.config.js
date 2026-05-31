/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#edfcf4',
          100: '#d3f8e4',
          200: '#aaf0cc',
          300: '#72e3ae',
          400: '#38ce8c',
          500: '#14b574',
          600: '#0a9460',
          700: '#09764f',
          800: '#0a5d40',
          900: '#094d36',
          950: '#042b1e',
        },
        dark: '#0b1120',
      },
    },
  },
  plugins: [],
}