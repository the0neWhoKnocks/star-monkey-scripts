module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true, // only used for the export in this file
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2019,
  },
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
      imports: 'always-multiline',
      objects: 'always-multiline',
    }],
    'keyword-spacing': ['error', { after: true, before: true }],
    'no-unused-vars': ['error', { args: 'after-used' }],
    semi: ['error', 'always'],
    'space-before-blocks': ['error', 'always'],
  },
};
