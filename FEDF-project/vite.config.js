import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/FDFS-PROJECT/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'auth.html')
      }
    }
  }
});
