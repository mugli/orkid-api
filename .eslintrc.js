module.exports = {
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es6: true,
    'jest/globals': true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'jest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'prettier/prettier': 'error',
    radix: 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-loop-func': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-use-before-define': 'warn',
    'no-continue': 0,
    'no-console': 0,
    'no-await-in-loop': 0
  }
};
