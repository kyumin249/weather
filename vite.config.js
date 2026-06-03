import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-weather': {
        target: 'https://apihub.kma.go.kr/', // 공공데이터포털 도메인
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-weather/, '') // 경로 프리픽스 제거
      }
    }
  }
})
