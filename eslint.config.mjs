// eslint.config.mjs
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

export default [
  {
    files: ['**/*.js', '**/*.vue'],
    ignores: ['**/node_modules/**', '**/.git/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      vue,
    },
    rules: {
      'no-unused-vars': 'warn', // Warns about variables declared but not used
      'no-undef': 'off',        // Turns off the undefined variable checks
      indent: ['warn', 4],      // Enforces consistent indentation of 4 spaces
      semi: ['warn', 'always'], // Requires semicolons at the end of statements
      quotes: ['warn', 'double'], // Enforces the use of double quotes for strings
      'space-before-function-paren': ['warn', 'always'], // Requires a space before function parentheses
      camelcase: ['warn', { properties: 'always' }], // Enforces camelCase for variable and property names
      'space-infix-ops': 'warn', // Requires spaces around infix operators
      'no-use-before-define': 'error', // Disallows using variables before they are defined
    },
  },
];
