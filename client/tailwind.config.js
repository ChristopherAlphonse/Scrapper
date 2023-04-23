/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      phone: '320px',
      tablet: '480px',
      laptop: '768px',
      desktop: '992px',
      ultraWide: '1200px',
    },
    fontSize: {
      base: '1.25rem',
      md: '1.150rem',
    },
    extend: {},
  },
  plugins: [],
};
