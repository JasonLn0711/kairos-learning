import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applicationReport,applicationScenarios} from '../src/lib/application-check-demo.ts';
test('synthetic report requires all three fields, including whitespace-only omissions',()=>{
 assert.equal(applicationReport(applicationScenarios.missing),null);
 for(const field of ['applicationId','applicantCode','documentType'])assert.equal(applicationReport({...applicationScenarios.complete,[field]:'   '}),null);
 const report=JSON.parse(applicationReport(applicationScenarios.complete)!);
 assert.equal(report.applicationId,'SYN-001');assert.equal(report.documentType,'合成申請表');assert.match(report.scope,/not official approval/);
});
