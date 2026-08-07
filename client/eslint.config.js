import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-undef-components': [
        'error',
        {
          ignorePatterns: ['router-view', 'router-link']
        }
      ],
      // Formatting is fully through Prettier. Turned off as these would've been conlficting.
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/attributes-order': 'off'
    }
  },
  eslintConfigPrettier
];
