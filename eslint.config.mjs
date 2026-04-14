export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "coverage/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    rules: {
      "no-console": "off",
    },
  },
]
