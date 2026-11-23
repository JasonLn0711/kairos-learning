import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
export default defineConfig({optimizeDeps:{entries:['tests/visual-gallery/index.html']},plugins:[svelte()],server:{host:'127.0.0.1',port:4613,strictPort:true}});
