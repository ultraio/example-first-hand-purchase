/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                neutral: {
                    50: '#e6e6ea',
                    100: '#e6e6ea',
                    200: '#e6e6ea',
                    300: '#e6e6ea',
                    400: '#a9a7b4',
                    500: '#676374',
                    600: '#514d5b',
                    700: '#403c48',
                    800: '#33313a',
                    900: '#2c2b31',
                    950: '#201F24',
                },
                purple: {
                    50: '#f9f5fc',
                    100: '#f6edfc',
                    200: '#e6d2f7',
                    300: '#d3b6f2',
                    400: '#a984e8',
                    500: '#7855de',
                    600: '#6244c7',
                    700: '#482ea6',
                    800: '#331e85',
                    900: '#201163',
                    950: '#100740',
                },
            },
        },
        fontFamily: {
            sans: 'Inter',
        },
    },
    plugins: [],
};
