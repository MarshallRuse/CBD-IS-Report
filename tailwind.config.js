/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                official: {
                    50: "#33547c",
                    100: "#2a4b76",
                    200: "#21436f",
                    300: "#173a69",
                    400: "#0c3263",
                    500: "#002A5C",
                    600: "#002755",
                    700: "#00234e",
                    800: "#002047",
                    900: "#001d40",
                },
            },
        },
    },
    plugins: [],
};
