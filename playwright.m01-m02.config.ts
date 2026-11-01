import {defineConfig} from '@playwright/test';
const live=process.env.CEH_READING_BASE_URL;
const evidence=live?'.local/m01-m02/live':'.local/m01-m02';
export default defineConfig({testDir:'tests/browser',testMatch:'m01-m02.spec.ts',workers:2,timeout:90000,outputDir:evidence+'/browser',reporter:[['list'],['json',{outputFile:evidence+'/results.json'}]],use:{baseURL:live||'http://127.0.0.1:4192',headless:true,trace:'retain-on-failure'},webServer:live?undefined:{command:'python3 -m http.server 4192 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4192/',reuseExistingServer:false},projects:[{name:'chrome',use:{browserName:'chromium',channel:'chrome'}}]});
