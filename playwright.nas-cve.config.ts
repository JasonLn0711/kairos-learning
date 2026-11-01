import {defineConfig} from '@playwright/test';
const live=process.env.NAS_CVE_BASE_URL;
const dir=live?'.local/nas-cve/live':'.local/nas-cve/local';
export default defineConfig({testDir:'tests/browser',testMatch:'nas-cve.spec.ts',workers:1,timeout:60000,outputDir:dir+'/traces',reporter:[['list'],['json',{outputFile:dir+'/results.json'}]],use:{baseURL:live||'http://127.0.0.1:4194',headless:true,trace:'retain-on-failure'},webServer:live?undefined:{command:'python3 -m http.server 4194 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4194/',reuseExistingServer:false},projects:[{name:'chrome',use:{browserName:'chromium',channel:'chrome'}}]});
