import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: true,
        proxy: {
            '/auth': 'http://localhost:8000',
            '/users': 'http://localhost:8000',
            '/trips': 'http://localhost:8000',
            '/notifications': 'http://localhost:8000',
            '/test': 'http://localhost:8000',
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    }
})
