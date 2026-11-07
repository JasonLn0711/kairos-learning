export const applicationScenarios = {
  missing: {applicationId:'SYN-001',applicantCode:'DEMO-A',documentType:''},
  complete: {applicationId:'SYN-001',applicantCode:'DEMO-A',documentType:'合成申請表'}
} as const;
export function applicationReport(data:{applicationId:string;applicantCode:string;documentType:string}):string|null {
  if (![data.applicationId,data.applicantCode,data.documentType].every(value=>value.trim())) return null;
  return JSON.stringify({scope:'synthetic required-field check only; not official approval',...data},null,2);
}
