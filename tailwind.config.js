/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1E1B4B',
          purple: '#7C3AED',
          indigo: '#6366F1',
          blue: '#2563EB',
        },
      },
    },
  },
  plugins: [],
};
