// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Regras de nomenclatura
      '@typescript-eslint/naming-convention': [
        'error',
        // Interfaces com prefixo I
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        // Tipos com prefixo T
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        // Variáveis em camelCase
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        // Funções em camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // Parâmetros em camelCase
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Propriedades em camelCase (permite snake_case e PascalCase para APIs externas)
        {
          selector: 'property',
          format: ['camelCase', 'snake_case', 'PascalCase'],
        },
        // Métodos em camelCase
        {
          selector: 'method',
          format: ['camelCase'],
        },
        // Classes em PascalCase
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // Enums em PascalCase
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
      ],

      // Alertar para código não utilizado (variáveis, funções, interfaces, tipos, etc)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: false,
        },
      ],

      // Alertar para imports/exports não utilizados
      'no-unused-vars': 'off', // Desabilita regra base em favor da versão TypeScript
      '@typescript-eslint/no-unused-expressions': 'warn',
    },
  },
);
