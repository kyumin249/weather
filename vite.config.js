import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-weather': {
        target: 'https://apihub.kma.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-weather/, ''),
        configure: (proxy) => { // _options를 삭제하고 인자를 정리
          proxy.on('proxyReq', (proxyReq) => { // _req, _res를 제거
            proxyReq.setHeader('Referer', 'https://apihub.kma.go.kr/');
          });
        }
      }
    }
  }
});
