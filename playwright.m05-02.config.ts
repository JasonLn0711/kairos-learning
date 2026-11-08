import {defineConfig} from '@playwright/test';
const remote=process.env.M05_02_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'m05-02.spec.ts',workers:1,timeout:120000,outputDir:'.local/m05-02/browser',reporter:[['list'],['json',{outputFile:remote?'.local/m05-02/live-results.json':'.local/m05-02/local-results.json'}]],use:{baseURL:remote||'http://127.0.0.1:43252',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 43252 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:43252/',reuseExistingServer:false}});
