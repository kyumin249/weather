import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api/weather': {
  //       target: 'https://apihub.kma.go.kr',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api\/weather/, '')
  //     }
  //   }
  // }
});
