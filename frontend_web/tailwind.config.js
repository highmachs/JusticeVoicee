/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: '#a855f7',       // Soft purple
                secondary: '#ec4899',     // Soft pink
                accent: '#f59e0b',        // Warm amber
                sage: '#86efac',          // Soft green
                lavender: '#c4b5fd',      // Lavender
                peach: '#fda4af',         // Peach
                cream: '#fef3c7',         // Cream
                'primary-light': '#e9d5ff',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 8s ease-in-out 2s infinite',
            },
        },
    },
    plugins: [],
}
