import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // Rutas relativas para integración
  build: {
    outDir: 'docs'
  }
})
