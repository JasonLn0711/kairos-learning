import {defineConfig} from '@playwright/test';
const remote=process.env.AASE_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'aase-m0806.spec.ts',workers:1,timeout:120000,outputDir:'.local/m0806/browser',reporter:[['list'],['json',{outputFile:'.local/m0806/results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4286',headless:true},webServer:remote?undefined:{command:'python3 -m http.server 4286 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4286/',reuseExistingServer:false}});
