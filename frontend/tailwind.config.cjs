/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#991B1B",
        dark: "#00171f",
        secondary: "#00a8e8",
        "secondary-dark": "#003459",
      },
    },
    plugins: [],
  }
};
