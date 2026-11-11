import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('.local/aase/m0804',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:8584');
 await page.getByRole('textbox',{name:'案件編號'}).fill('SYN-001');
 await page.getByRole('textbox',{name:'申請人代碼'}).fill('DEMO-A');
 await page.getByRole('button',{name:'檢查',exact:true}).click();
 await expect(page.getByText('缺少：文件類型',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'下載報告'})).toHaveCount(0);
 await page.getByRole('textbox',{name:'文件類型'}).fill('合成申請表');
 await page.getByRole('button',{name:'檢查',exact:true}).click();
 await expect(page.getByText('檢查成功',{exact:true})).toBeVisible();
 const download=page.getByRole('button',{name:'下載報告'});await download.focus();
 const promise=page.waitForEvent('download');await page.keyboard.press('Enter');
 const file=await promise;assert.equal(file.suggestedFilename(),'report.json');
 const stream=await file.createReadStream();const chunks=[];for await(const c of stream)chunks.push(c);const data=JSON.parse(Buffer.concat(chunks).toString());
 assert.deepEqual(data,{status:'complete',data:{application_id:'SYN-001',applicant_code:'DEMO-A',document_type:'合成申請表'}});
 await page.getByRole('textbox',{name:'文件類型'}).fill('');await page.keyboard.press('Tab');
 await expect(page.getByText('檢查成功',{exact:true})).toHaveCount(0);await expect(download).toHaveCount(0);
 await page.getByRole('textbox',{name:'文件類型'}).fill('合成申請表');await page.keyboard.press('Tab');
 const check=page.getByRole('button',{name:'檢查',exact:true});await check.focus();await page.keyboard.press('Space');
 await expect(page.getByText('檢查成功',{exact:true})).toBeVisible();
 await check.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(check).toBeFocused();
 writeFileSync('.local/aase/m0804/example-browser.json',JSON.stringify({status:'pass',streamlit:'1.51.0',browser:'Chromium',checks:['missing-data rejection','correction and success','actual report.json download and exact JSON','input change removes stale success and download','Enter/Space buttons and Tab/Shift+Tab'],data},null,2)+'\n');
 console.log('PASS: real Streamlit browser, three stages, downloaded JSON bytes and keyboard.');
}finally{await browser.close();}
