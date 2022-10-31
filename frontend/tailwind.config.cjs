/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007ea7",
        dark: "#00171f",
        secondary: "#00a8e8",
        "secondary-dark": "#003459",
      },
    },
    plugins: [],
  }
};
