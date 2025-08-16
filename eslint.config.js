// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  expoConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {}
      }
    },
    rules: {
      // Add any specific rules for JSX if needed
    },
    ignores: ['dist/*']
  }
])
