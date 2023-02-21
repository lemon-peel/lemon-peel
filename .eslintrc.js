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
    'vue/no-v-text-v-html-on-component': 0,
    'unicorn/prefer-module': 0,
    'unicorn/catch-error-name': 0,
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
