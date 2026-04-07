import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 로컬 전용 — FRED CORS 우회 (프로덕션은 /api/fred 서버리스 함수가 처리)
      '/dev-fred': {
        target: 'https://api.stlouisfed.org',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev-fred/, ''),
      },
    },
  },
})
