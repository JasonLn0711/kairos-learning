export const previewFields=['application_id','applicant_code','document_type'] as const;
export type PreviewRecord=Record<typeof previewFields[number],string>;
export function validPreviewRecord(value:unknown):value is PreviewRecord {
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 return previewFields.every(key=>typeof (value as PreviewRecord)[key]==='string'&&(value as PreviewRecord)[key].trim().length>0&&(value as PreviewRecord)[key].trim().length<=80);
}
export function checkedPreviewReport(record:unknown,snapshot:unknown){
 if(!validPreviewRecord(record)||!validPreviewRecord(snapshot)||!previewFields.every(key=>record[key]===snapshot[key]))throw new Error('Current data must match a valid checked snapshot');
 return JSON.stringify({status:'complete',scope:'僅代表教學欄位完整性，不代表正式受理',data:Object.fromEntries(previewFields.map(key=>[key,record[key].trim()]))},null,2);
}
