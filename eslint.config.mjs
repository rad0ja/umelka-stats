import next from "eslint-config-next";

export default [
  ...next,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**"
    ],
    rules: {
      // Allow setting state in effects for data fetching patterns
      "react-hooks/set-state-in-effect": "off"
    }
  }
];