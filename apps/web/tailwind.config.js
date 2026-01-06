/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1f1a14',
        sand: '#f7f1e6',
        sun: '#f6c647',
        amber: '#e2a93b',
        dusk: '#3b342b',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'ui-sans-serif', 'system-ui'],
        body: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
