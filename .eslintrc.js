module.exports = {
  root: true,
  extends: [
    '@lemonbot.fun/eslint-config-vue',
    'plugin:markdown/recommended',
  ],
  plugins: ['markdown'],
  rules: {
    '@typescript-eslint/no-shadow': 0,
    'import/no-extraneous-dependencies': 0,
    'no-shadow': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-v-text-v-html-on-component': 0,
    'vue/prefer-import-from-vue': 0,
    'unicorn/prefer-module': 0,
    'unicorn/catch-error-name': 0,
  },
  overrides: [
    {
      files: ['**/docs/**/*.vue', '**/docs/**/*.js', '**/docs/**/*.ts'],
      rules: {
        'import/no-unresolved': 0,
        'unused-imports/no-unused-imports': 0,
        'unused-imports/no-unused-vars': 0,
      },
    },
    {
      files: ['*.vue'],
      rules: {
        'unused-imports/no-unused-imports': 0,
        'unused-imports/no-unused-vars': 0,
      },
    },
    {
      files: ['**/*.md'],
      processor: 'markdown/markdown',
    },
    {
      files: [
        '**/*.md/*.js',
        '**/*.md/*.jsx',
        '**/*.md/*.ts',
        '**/*.md/*.tsx',
        '**/*.md/*.vue',
      ],
      rules: {
        'no-console': 0,
        'import/no-unresolved': 0,
        'unused-imports/no-unused-imports': 0,
        'unused-imports/no-unused-vars': 0,
        'vue/no-unused-components': 0,
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: [
        ['@composables', 'docs/.vitepress/vitepress/composables'],
      ],
    },
  },
};
