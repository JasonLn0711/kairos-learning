/** Fixed teaching inputs; this does not measure a tokenizer or call a model. */
export const contextBudgetParts=[1000,2000,4500,1500] as const;
export const contextBudgetLimit=10000;
export function contextBudget(extra:number){
 if(!Number.isInteger(extra)||extra<0||extra>3000)throw new RangeError('Extra logs must be an integer between 0 and 3000');
 const used=contextBudgetParts.reduce((sum,n)=>sum+n,0)+extra;
 return {used,remaining:contextBudgetLimit-used,overflow:Math.max(0,used-contextBudgetLimit),fits:used<=contextBudgetLimit};
}
