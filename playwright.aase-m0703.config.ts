import {defineConfig} from '@playwright/test';
const remote=process.env.AASE_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'aase-m0703.spec.ts',workers:1,timeout:180000,outputDir:'.local/aase/m0703/browser',reporter:[['list'],['json',{outputFile:'.local/aase/m0703/results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4303',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4303 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4303/',reuseExistingServer:false}});
