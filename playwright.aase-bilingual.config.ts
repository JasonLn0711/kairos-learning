import {defineConfig} from '@playwright/test';
const remote=process.env.AASE_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'aase-bilingual.spec.ts',workers:2,timeout:90000,outputDir:'.local/aase/bilingual/browser',reporter:[['list'],['json',{outputFile:'.local/aase/bilingual/results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4226',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4226 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4226/',reuseExistingServer:false}});
