module.exports = {
  env: {
    serviceworker: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'xo',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jsdoc',
  ],
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'new-cap': 'off',
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        markers: [
          '/',
        ],
      },
    ],
    'no-undef': 'off',
    'no-unused-vars': 'off',
  },
};
