/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary: "#991B1B",
        primary: "#007ea7",
        dark: "#00171f",
        secondary: "#00a8e8",
        "secondary-dark": "#003459",
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
        ,
        progress: {
          '0%': { width: '0%' },
          '50%': { width: '50%' },
          '100%': { width: '100%' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        progress: 'progress 5s infinite linear',
      }
    },
    plugins: [],
  }
};
