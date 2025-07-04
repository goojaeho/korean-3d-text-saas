module.exports = {
  root: true,
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  rules: {
    // REQUIREMENTS.md 가이드라인 강제 적용
    
    // 1. 금지된 라이브러리 사용 금지
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['jquery', 'jQuery', '$'],
            message: 'jQuery 사용이 금지되어 있습니다. React를 사용하세요.',
          },
          {
            group: ['bootstrap*'],
            message: 'Bootstrap 사용이 금지되어 있습니다. TailwindCSS를 사용하세요.',
          },
          {
            group: ['moment*'],
            message: 'Moment.js 사용이 금지되어 있습니다. Date-fns를 사용하세요.',
          },
          {
            group: ['lodash*'],
            message: 'Lodash 사용이 금지되어 있습니다. 필요한 함수만 개별 구현하세요.',
          },
          {
            group: ['styled-components*'],
            message: 'Styled-components 사용이 금지되어 있습니다. TailwindCSS를 사용하세요.',
          }
        ],
      },
    ],

    // 2. TypeScript 타입 안전성 강화
    '@typescript-eslint/no-any': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-implicit-any-catch': 'error',

    // 3. React 19 규칙
    'react/react-in-jsx-scope': 'off', // React 19에서는 불필요
    'react/prop-types': 'off', // TypeScript 사용
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 4. 코딩 스타일 규칙
    'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    'complexity': ['warn', { max: 10 }],
    'max-depth': ['warn', { max: 3 }],

    // 5. 네이밍 규칙
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],

    // 6. Import/Export 규칙
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // 7. 중복 코드 방지
    'no-duplicate-imports': 'error',
    'import/no-duplicates': 'error',

    // 8. 코드 품질
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'prefer-const': 'error',
    'no-var': 'error',

    // 9. 접근성 (a11y)
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/aria-role': 'error',

    // 10. Prettier 통합
    'prettier/prettier': 'error',
  },
  settings: {
    react: {
      version: '19',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
  },
  overrides: [
    // 패키지별 설정
    {
      files: ['packages/**/*.ts', 'packages/**/*.tsx'],
      rules: {
        'import/no-relative-parent-imports': 'error',
      },
    },
    // 테스트 파일 설정
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    'coverage/',
    '*.min.js',
  ],
};