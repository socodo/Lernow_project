// import js from '@eslint/js'
// import tseslint from '@typescript-eslint/eslint-plugin'
// import tsparser from '@typescript-eslint/parser'
// import globals from 'globals'

// export default [
//   {
//     files: ['**/*.{ts,js}'],
//     ignores: ['node_modules', 'dist'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       sourceType: 'module',
//       parser: tsparser,
//       parserOptions: {
//         project: './tsconfig.json'
//       },
//       globals: {
//         ...globals.node,
//         ...globals.es2020
//       }
//     },
//     plugins: {
//       '@typescript-eslint': tseslint
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...tseslint.configs.recommended.rules,

//       // TypeScript specific rules
//       '@typescript-eslint/no-explicit-any': 'warn',
//       '@typescript-eslint/explicit-module-boundary-types': 'off',
//       '@typescript-eslint/no-unused-vars': ['warn', {
//         argsIgnorePattern: '^_',
//         varsIgnorePattern: '^_'
//       }],

//       // Code quality rules
//       'no-console': 'off', // Allow console.log in server
//       'no-lonely-if': 'warn',
//       'no-trailing-spaces': 'warn',
//       'no-multi-spaces': 'warn',
//       'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],

//       // Formatting rules
//       'space-before-blocks': ['error', 'always'],
//       'object-curly-spacing': ['warn', 'always'],
//       'indent': ['warn', 2, { SwitchCase: 1 }],
//       'semi': ['warn', 'never'],
//       'quotes': ['error', 'single'],
//       'array-bracket-spacing': 'warn',
//       'linebreak-style': 'off',
//       'no-unexpected-multiline': 'warn',
//       'keyword-spacing': 'warn',
//       'comma-dangle': 'warn',
//       'comma-spacing': 'warn',
//       'arrow-spacing': 'warn'
//     }
//   }
// ]
