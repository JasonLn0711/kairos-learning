import {defineConfig} from '@playwright/test';
const remote=process.env.M04_08_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'m04-08.spec.ts',workers:1,timeout:60000,outputDir:'.local/m04-08/browser',reporter:[['list'],['json',{outputFile:'.local/m04-08/results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4208',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4208 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4208/',reuseExistingServer:false}});
