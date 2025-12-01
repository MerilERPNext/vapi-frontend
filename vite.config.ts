import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react()],
        // apply proxy for / url
        server: {
            proxy: {
                "/api": {
                    target: "https://merilcardio-develop.bilakhiagroup.com",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/api'),
                }
            }
        },
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name]-[hash].js',
                    assetFileNames: '[name].[ext]',
                },
                target: 'es2015',
            },
            emptyOutDir: true,
            target: 'es2015',
        }
    }
})
