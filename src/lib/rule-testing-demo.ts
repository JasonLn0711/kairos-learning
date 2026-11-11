export function deliveryFee(total:unknown):number{
 if(typeof total!=='number'||!Number.isInteger(total)||total<0)throw new RangeError('Total must be a nonnegative integer');
 return total>=1000?0:60;
}
export function acceptsLength(length:unknown):boolean{
 if(typeof length!=='number'||!Number.isInteger(length)||length<0)throw new RangeError('Length must be a nonnegative integer');
 return length<=80;
}
