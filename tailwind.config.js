module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
