module.exports = {
  root: true,
  parser: 'esprima',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  extends: 'eslint:recommended',
  plugins: [
  ],
  'rules': {
    indent: ['error',
      2, {
        SwitchCase: 1
      }],
    semi: ['warn',
      'always'
    ],
    'max-len': ['warn', {
      code: 80,
      tabWidth: 2,
      ignoreUrls: true
    }],
    'no-var': ['warn'],
    'no-console': ['warn', {
      allow: ['warn', 'error']
    }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
};
