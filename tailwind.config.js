/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#8b5cf6",
        accent: "#06d6a0",
        tertiary: "#0c0f1a",
        textPrimary: "#e2e8f0",
        textSecondary: "#7c8db5",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(139, 92, 246, 0.15)',
        'glow-accent': '0 0 30px rgba(6, 214, 160, 0.15)',
      },
    },
  },
  plugins: [],
}
