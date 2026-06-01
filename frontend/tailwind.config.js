/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        gold: {
          50: "#fdf9ef",
          100: "#f9f0d9",
          200: "#f0dfa8",
          300: "#e4c76a",
          400: "#d4af37",
          500: "#b8860b",
          600: "#96700a",
          700: "#7a5c08",
        },
        cream: {
          50: "#fdfcfa",
          100: "#f9f6f0",
          200: "#f3ede2",
          300: "#ebe3d4",
        },
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(184, 134, 11, 0.12)",
        card: "0 2px 16px -2px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
