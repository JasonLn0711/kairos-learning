import {defineConfig} from '@playwright/test';
const remote=process.env.AASE_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'aase-m0704.spec.ts',workers:1,timeout:120000,outputDir:'.local/aase/m0704/browser',reporter:[['list'],['json',{outputFile:'.local/aase/m0704/results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4298',headless:true},webServer:remote?undefined:{command:'python3 -m http.server 4298 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4298/',reuseExistingServer:false}});
