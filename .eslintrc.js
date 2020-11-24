module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': [
      'error',
      'always'
    ],
    'eol-last': [
      'error',
      'always'
    ],
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'arrow-spacing': [
      'error',
      { 'before': true, 'after': true }
    ],
    'react/prop-types': 0,
    'no-console': [
      'error',
      { 'allow': ["warn", "error"] }
    ]
  }
}
