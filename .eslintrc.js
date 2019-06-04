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
    radix: 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-loop-func': 0
  }
};
