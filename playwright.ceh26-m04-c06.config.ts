import {defineConfig} from '@playwright/test';
const remote=process.env.CEH_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'ceh26-m04-c06.spec.ts',workers:1,timeout:90000,outputDir:'.local/nfs/browser',reporter:'list',use:{baseURL:remote||'http://127.0.0.1:4246',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4246 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4246/',reuseExistingServer:false}});
