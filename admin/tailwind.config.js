const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@windmill/react-ui/config");

module.exports = windmill({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/@windmill/react-ui/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.900"),
            maxWidth: "none",
            h1: { color: theme("colors.gray.900") },
            h2: { color: theme("colors.gray.900") },
            h3: { color: theme("colors.gray.900") },
            h4: { color: theme("colors.gray.900") },
            p: { color: theme("colors.gray.800") },
            li: { color: theme("colors.gray.800") },
            strong: { color: theme("colors.gray.900") },
            blockquote: {
              color: theme("colors.gray.900"),
              borderLeftColor: theme("colors.gray.300"),
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
        dark: {
          css: {
            color: theme("colors.gray.300"),
            h1: { color: theme("colors.gray.100") },
            h2: { color: theme("colors.gray.100") },
            h3: { color: theme("colors.gray.100") },
            h4: { color: theme("colors.gray.100") },
            p: { color: theme("colors.gray.300") },
            li: { color: theme("colors.gray.300") },
            strong: { color: theme("colors.gray.100") },
            blockquote: {
              color: theme("colors.gray.300"),
              borderLeftColor: theme("colors.gray.600"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
});
