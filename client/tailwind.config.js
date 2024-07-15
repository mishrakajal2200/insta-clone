/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "108px": "108px",
        "108%": "108%",
        "30%": "30%",
      },

      height: {
        "108px": "108px",
      },
      borderRadius: {
        "80px": "80px",
      },
      margin: {
        "18px": "18px",
      },
      maxWidth: {
        "550px": "550px",
      },
    },
  },
  variants: {},
  plugins: [],
};
