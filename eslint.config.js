import pluginPrettier from 'eslint-plugin-prettier'
import pluginReact from 'eslint-plugin-react'
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,css}'],
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { react: pluginReact },
  },
  {
    rules: {
      '@typescript-eslint/array-type': 'off',
    },
  },
]
