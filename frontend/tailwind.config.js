/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'justice-primary': '#6d28d9', // Deep Purple
        'justice-accent': '#ec4899', // Pink
        'stealth-bg': '#1e293b', // Slate 800
      }
    },
  },
  plugins: [],
}
