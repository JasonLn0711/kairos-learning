import {defineConfig} from '@playwright/test';
const remote=process.env.AASE_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'aase-m0604.spec.ts',workers:1,timeout:120000,outputDir:'.local/aase/m0604/browser',reporter:[['list'],['json',{outputFile:'.local/aase/m0604/results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4294',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4294 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4294/',reuseExistingServer:false}});
