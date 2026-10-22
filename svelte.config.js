import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    files: { assets: 'site' },
    csp: { mode: 'hash', directives: { 'script-src': ['self'], 'style-src': ['self', 'unsafe-inline'], 'object-src': ['none'], 'base-uri': ['self'] } }
  }
};
