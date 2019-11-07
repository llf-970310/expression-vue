module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 0,
    'semi': 0,
    'space-before-function-paren': 0,
    'object-curly-spacing': 0,
    'comma-dangle': 0,
    'quotes': 0,
    'object-property-newline': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
