import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 0,
      'no-dupe-else-if': 0,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-unused-vars': 0,
      'react/jsx-no-useless-fragment': 0,
      'react-hooks/exhaustive-deps': 0,
      'react/no-unescaped-entities': 0,
      'react/jsx-no-target-blank': 0,
      'jsx-a11y/accessible-emoji': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'react/react-in-jsx-scope': 0,
      'array-callback-return': 0,
      'no-case-declarations': 0,
      'react/display-name': 0,
      'jsx-a11y/alt-text': 0,
      'no-empty-function': 0,
      'no-control-regex': 0,
      'react/prop-types': 0,
      'no-script-url': 0
    }
  }
)
