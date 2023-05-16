import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            keepNames: true
        }
    },
    base: '/jooby-gui',
    root: './src',
    build: {
        outDir: '../dist',
        emptyOutDir: true
    },
    plugins: [react()],
    esbuild: {
        keepNames: true
    }
});
