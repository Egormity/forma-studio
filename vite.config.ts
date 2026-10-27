import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { runtimePort } from './scripts/runtime-config';

export default defineConfig(({ mode }) => {
  const port = runtimePort(process.env.PORT ?? loadEnv(mode, process.cwd(), 'PORT').PORT);
  return {
    plugins: [react()],
    base: './',
    server: { host: '0.0.0.0', port: port ?? 4398, strictPort: true },
    preview: { host: '0.0.0.0', port: port ?? 4399, strictPort: true },
    build: { rollupOptions: { output: { manualChunks: { three: ['three'] } } }, chunkSizeWarningLimit: 900 },
  };
});
