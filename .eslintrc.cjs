module.exports = {
  root: true,
  env: { es2021: true, node: true, browser: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
    // Intentionally omit `project` to avoid type-aware (slow) rules
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-var': 'off',
    'no-prototype-builtins': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'import/order': ['warn', { 'newlines-between': 'always' }]
  },
  settings: { 'import/resolver': { typescript: {} } }
};
