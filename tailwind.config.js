module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },

      minWidth: {
        xxs: "17.5rem",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
