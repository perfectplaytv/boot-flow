import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Usar paths absolutos para que APIs funcionem corretamente
  // Quando carregar de file://, usar './'; quando de https://, paths absolutos funcionam
  base: '/',
  server: {
    port: 5173,
    host: true,
    open: mode !== 'electron', // Don't open browser when running with Electron
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
        },
      },
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
}))
