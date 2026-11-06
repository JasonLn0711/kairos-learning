import {defineConfig} from '@playwright/test';
const remote=process.env.AASE_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'aase-m0103.spec.ts',workers:1,timeout:90000,outputDir:'.local/aase/m0103/browser',reporter:'list',use:{baseURL:remote||'http://127.0.0.1:4266',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4266 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4266/',reuseExistingServer:false}});
