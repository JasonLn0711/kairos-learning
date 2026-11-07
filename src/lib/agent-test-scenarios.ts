import {applicationScenarios} from './application-check-demo.ts';
export const agentTestScenarios={
 complete:applicationScenarios.complete,
 missing:applicationScenarios.missing,
 whitespace:{...applicationScenarios.complete,documentType:'   '},
 cleared:{...applicationScenarios.complete,documentType:''}
} as const;
