import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react()],
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
