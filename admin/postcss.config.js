module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("cssnano")({
      preset: "default",
    }),
    require("postcss-preset-env")({
      stage: 1,
      features: {
        "nesting-rules": true,
      },
    }),
  ],
};
