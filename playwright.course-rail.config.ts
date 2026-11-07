import {defineConfig} from '@playwright/test';
const remote=process.env.RAIL_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'course-rail.spec.ts',workers:2,timeout:60000,outputDir:'.local/aase/rail-fix/browser',reporter:[['list'],['json',{outputFile:'.local/aase/rail-fix/results.json'}]],use:{baseURL:remote||'http://127.0.0.1:4221',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4221 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4221/',reuseExistingServer:false}});
