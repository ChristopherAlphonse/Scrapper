/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        primary: ['1.25rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};
