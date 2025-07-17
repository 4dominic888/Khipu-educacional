import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude],
  },
})
