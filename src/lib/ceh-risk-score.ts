/** Illustrative ordinal scoring, not a quantitative loss estimate. No persistence. */
export const controlCounts = [37,8,14,34] as const;
export function riskScore(likelihood:number,impact:number):{score:number;level:'low'|'medium'|'high'} {
  if (![likelihood,impact].every(n=>typeof n==='number'&&Number.isInteger(n)&&n>=1&&n<=5)) throw new RangeError('L and I must be integers from 1 to 5');
  const score=likelihood*impact;
  return {score,level:score>=10?'high':score>=5?'medium':'low'};
}
