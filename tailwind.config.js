/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        gym: {
          // Amarillos/dorados — acción, energía, highlight
          yellow: "#F5C518",
          "yellow-light": "#FFD93D",
          "yellow-dim": "#B8960C",

          // Negros y grises oscuros — fondos
          black: "#0A0A0A",
          "bg-dark": "#111111",
          card: "#1A1A1A",
          "card-2": "#222222",
          border: "#2A2A2A",
          "border-2": "#333333",

          // Grises de texto
          "text-muted": "#666666",
          "text-dim": "#888888",
          "text-base": "#CCCCCC",
          "text-bright": "#F0F0F0",

          // Semáforo (mantener para PRs y estados)
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

