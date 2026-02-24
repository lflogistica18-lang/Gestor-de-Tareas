/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'pulse-subtle': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.85', transform: 'scale(1.01)' },
                }
            },
            animation: {
                'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
