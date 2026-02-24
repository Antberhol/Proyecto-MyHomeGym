/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        gym: {
          primary: "#E63946",
          secondary: "#1D3557",
          accent: "#FFD700",
          success: "#06D6A0",
          warning: "#F77F00",
          danger: "#D62828",
          bgLight: "#F8F9FA",
          bgDark: "#0A0E27",
          cardDark: "#1E2749",
        },
      },
    },
  },
  plugins: [],
}

