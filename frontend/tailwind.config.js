module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}"],
    mode: "jit",
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Montserrat"]
            },
            colors: {
                purple: "rgba(115, 103, 240, 0.7)",
                "white-light": "#f6f6f6",
            },
            boxShadow: {
                sidebar: "0 0 10px 1px rgba(115, 103, 240, 0.7)",
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
