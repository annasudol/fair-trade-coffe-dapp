module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  variants: {
    opacity: ({ after }) => after(["disabled"]),
  },
  plugins: [require("@tailwindcss/forms")],
};
