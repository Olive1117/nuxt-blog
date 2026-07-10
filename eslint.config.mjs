// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'

export default withNuxt({
  // options here
  rules: {
    'vue/attributes-order': ['warn', { alphabetical: true }],
    'vue/multi-word-component-names': 'off',
  },
}).append(eslintConfigPrettier)
