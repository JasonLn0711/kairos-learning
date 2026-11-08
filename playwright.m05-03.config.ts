import {defineConfig} from '@playwright/test';
const remote=process.env.M05_03_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'m05-03.spec.ts',workers:1,timeout:120000,outputDir:'.local/m05-03/browser',reporter:[['list'],['json',{outputFile:remote?'.local/m05-03/live-results.json':'.local/m05-03/local-results.json'}]],use:{baseURL:remote||'http://127.0.0.1:43503',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 43503 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:43503/',reuseExistingServer:false}});
