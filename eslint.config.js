import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from 'eslint-plugin-prettier'


export default tseslint.config({
  extends: [pluginJs.configs.recommended, ...tseslint.configs.recommended],
  files: ['**/*.ts'],
  ignores: ['dist'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    quotes: ['error', 'single'],
    'prettier/prettier': 'error',
  },
});