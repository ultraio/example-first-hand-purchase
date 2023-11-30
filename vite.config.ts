import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import BasicSSL from '@vitejs/plugin-basic-ssl';

const isDev = process.argv.includes('--dev');
const plugins = [vue()];

if (isDev) {
    plugins.push(BasicSSL());
}

// https://vitejs.dev/config/
export default defineConfig({
    base: isDev ? '/' : 'example-first-hand-purchase',
    plugins,
});
