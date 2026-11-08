import {defineConfig} from '@playwright/test';
const remote=process.env.M05_01_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'m05-01.spec.ts',workers:1,timeout:120000,outputDir:'.local/m05-01/browser',reporter:[['list'],['json',{outputFile:remote?'.local/m05-01/live-results.json':'.local/m05-01/local-results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4211',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4211 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4211/',reuseExistingServer:false}});
