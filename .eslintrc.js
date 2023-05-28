module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    "prettier",
    // Extends two more configuration from "import" plugin
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"]
  },
  plugins: ["react"],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    // turn on errors for missing imports
    "import/no-unresolved": "error",
    // 'import/no-named-as-default-member': 'off',
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Built-in imports (come from NodeJS native) go first
          "external", // <- External imports
          "internal", // <- Absolute imports
          ["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
          "index", // <- index imports
          "unknown" // <- unknown
        ],
        "newlines-between": "always",
        alphabetize: {
          /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
          order: "asc",
          /* ignore case. Options: [true, false] */
          caseInsensitive: true
        }
      }
    ]
  },
  settings: {
    react: {
      version: "detect"
    },
    "import/ignore": ["node_modules/react-native/index\\.js$"]
  }
};
