export type ReportForm={name:string;taxId:string;docType:string};
export type ReportMode='bug'|'fixed';
export const completeReportForm=(form:ReportForm):boolean=>[form.name,form.taxId,form.docType].every(v=>v.trim().length>0);
export const checkReport=(form:ReportForm):ReportForm|null=>completeReportForm(form)?{...form}:null;
export function reportAvailable(form:ReportForm,snapshot:ReportForm|null,mode:ReportMode):boolean{
 return snapshot!==null&&(mode==='bug'||(completeReportForm(form)&&form.name===snapshot.name&&form.taxId===snapshot.taxId&&form.docType===snapshot.docType));
}
