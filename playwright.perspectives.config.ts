import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'tests/browser',testMatch:'perspectives.spec.ts',fullyParallel:false,workers:1,timeout:30000,
 outputDir:'.local/perspectives-browser/artifacts',
 reporter:[['list'],['json',{outputFile:'.local/perspectives-browser/results.json'}]],
 use:{baseURL:'http://127.0.0.1:4186',headless:true,screenshot:'only-on-failure',trace:'retain-on-failure'},
 webServer:[
  {command:'python3 -m http.server 4186 --bind 127.0.0.1 --directory .local/perspectives-preview/build',url:'http://127.0.0.1:4186/perspectives/',reuseExistingServer:false},
  {command:'python3 -m http.server 4187 --bind 127.0.0.1 --directory build',url:'http://127.0.0.1:4187/perspectives/',reuseExistingServer:false}
 ],
 projects:[{name:'chromium',use:{browserName:'chromium',channel:'chrome'}}]
});
