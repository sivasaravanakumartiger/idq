import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../backend/static'),
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false, // 🚫 disable in prod (security: hides code structure)
    minify: 'esbuild', // ✅ fast + secure minification
    cssCodeSplit: true, // ✅ split CSS for smaller bundles
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // ✅ separate vendor bundle
        }
      }
    }
  },
  server: {
    strictPort: true, // ✅ avoids accidental random ports
    host: '0.0.0.0', // ✅ required for Databricks App container
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false, // ⚠️ only keep false in dev
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  preview: {
    port: 4173, // ✅ standard preview port
    strictPort: true
  }
})
