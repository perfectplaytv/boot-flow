import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      host: true,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // Desativa sourcemaps em produção
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          },
        },
      },
      // Adiciona um hash ao nome dos arquivos para evitar cache
      manifest: true,
      // Melhora a divisão de código
      chunkSizeWarningLimit: 1600,
      // Otimizações para produção
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console.log em produção
        },
      },
    },
    preview: {
      port: 3000,
      host: true,
      strictPort: true,
      // Configuração adicional para o servidor de preview
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
    // Configuração para o servidor de desenvolvimento
    define: {
      'process.env': {}
    },
    // Configuração para o ambiente de produção
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : []
    },
    // Configuração de cache
    cacheDir: '.vite',
  }
})
