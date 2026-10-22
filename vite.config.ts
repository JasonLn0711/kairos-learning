import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
// MATLAB's preserved links use /index.html. Static hosts serve build/index.html;
// local Svelte servers use the generated / route instead of an asset homepage.
const legacyHome: Plugin = {
  name: 'legacy-home-development-alias',
  configureServer(server) { server.middlewares.use((req,res,next) => {
    if (req.url?.split('?')[0] !== '/index.html') return next();
    res.writeHead(308,{Location:'/' + (req.url.includes('?') ? '?'+req.url.split('?')[1] : '')}); res.end();
  }); },
  configurePreviewServer(server) { server.middlewares.use((req,res,next) => {
    if (req.url?.split('?')[0] !== '/index.html') return next();
    res.writeHead(308,{Location:'/' + (req.url.includes('?') ? '?'+req.url.split('?')[1] : '')}); res.end();
  }); }
};
export default defineConfig({ plugins: [legacyHome, sveltekit()] });
