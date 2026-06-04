import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  // 1. 브라우저용 설정 (기존)
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['api/**/*.js'], // api 폴더는 여기서 제외
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // 2. 서버용 설정 추가 (api 폴더 전용)
  {
    files: ['api/**/*.js'],
    languageOptions: {
      globals: globals.node, // process 등을 정의된 전역변수로 인식
    },
  },
])
