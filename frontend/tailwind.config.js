/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#D0BB95",
        "background-light": "#f7f7f6",
        "background-dark": "#1d1a15",
        "muted-sage": "#70BF8E",
        secondary: "#70BF8E", // Same as muted-sage
        "warm-beige": "#BFAAA1",
        "card-light": "#F7F2ED",
        "surface-light": "#F7F2ED", // Same as card-light
      },
      fontFamily: {
        sans: ["Noto Sans SC", "Source Han Sans SC", "PingFang SC", "system-ui", "sans-serif"],
        display: "Font Unspecified",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
