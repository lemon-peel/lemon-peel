module.exports = {
  root: true,
  extends: ['@lemonbot.fun/eslint-config-vue'],
  rules: {
    '@typescript-eslint/no-shadow': 0,
    'no-shadow': 0,
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
    'vue/multi-word-component-names': 0,
    'vue/prefer-import-from-vue': 0,
    'vue/prefer-import-from-vue': 0,
    'unicorn/prefer-top-level-await': 0,
    'unicorn/no-array-callback-reference': 0,
    'unicorn/no-array-for-each': 0,
    'unicorn/no-array-reduce': 0,
    'unicorn/no-nested-ternary': 0,
    'unicorn/no-null': 0,
    'unicorn/prefer-spread': 0,
    'unicorn/prevent-abbreviations': 0,
    'unicorn/consistent-destructuring': 0,
    'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
  },
  overrides: [
    {
      files: '**/*.vue',
      rules: {
        'unused-imports/no-unused-imports': 0,
        'unused-imports/no-unused-vars': 0,
      },
    },
  ],
};
