/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00ff00",
        secondary: "#00FF80",
        tertiary: "#80FF00",
      },
    },
  },
  plugins: [],
};
