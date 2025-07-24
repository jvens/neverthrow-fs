import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';

export default tseslint.config(
  // Base JavaScript rules
  js.configs.recommended,
  
  // TypeScript configuration
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': ['error', { allowObjectTypes: 'always' }],
    },
  },

  // Test files configuration
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.js',
      '*.cjs',
      '*.mjs',
      '!eslint.config.js',
    ],
  },
);