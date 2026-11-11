/** Fixed synthetic domain: four defective products and two good products. */
export function successMetrics(blocked:number,falseBlocked:number){
 if(!Number.isInteger(blocked)||blocked<0||blocked>4||!Number.isInteger(falseBlocked)||falseBlocked<0||falseBlocked>2)throw new RangeError('Expected blocked 0–4 and falseBlocked 0–2 integers');
 return {blockingRate:blocked*25,releaseRate:(2-falseBlocked)*50,missed:4-blocked,falseBlocked};
}
