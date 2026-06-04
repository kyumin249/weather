import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api-weather'로 시작하는 모든 요청을 가로챔
      '/api-weather': {
        target: 'https://apihub.kma.go.kr', // 기상청 API 허브 서버
        changeOrigin: true,
        // rewrite를 제거하거나, 아래와 같이 상황에 맞게 조정하세요.
        // 기상청은 주소가 https://apihub.kma.go.kr/api/typ01/... 식이므로
        // 요청 시 /api-weather/api/typ01/... 로 보내면 
        // 결과적으로 https://apihub.kma.go.kr/api/typ01/... 가 됩니다.
        rewrite: (path) => path.replace(/^\/api-weather/, '') 
      }
    }
  }
})
