import {defineConfig} from '@playwright/test';
const remote=process.env.AASE_BASE_URL;
export default defineConfig({testDir:'tests/browser',testMatch:'aase-m0102.spec.ts',workers:1,timeout:90000,outputDir:'.local/aase/m0102/browser',reporter:'list',use:{baseURL:remote||'http://127.0.0.1:4256',headless:true,trace:'retain-on-failure'},webServer:remote?undefined:{command:'python3 -m http.server 4256 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4256/',reuseExistingServer:false}});
