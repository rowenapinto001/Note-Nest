/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: '#ff7f9f',
        cream: '#fff0c9',
        lavender: '#eadcff',
        peach: '#ffc4a8',
      },
      boxShadow: {
        note: '0 18px 35px rgba(74, 48, 26, 0.14)',
      },
    },
  },
  plugins: [],
};
