import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/video-compressor/', // GitHub Pages base path
  server: {
    port: 3000,
    open: true
  }
})

