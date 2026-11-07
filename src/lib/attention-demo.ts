/** Two scalar values illustrate weighting; this does not execute a language model. */
export function attentionDemo(a:number,b:number) {
 if (![a,b].every(x=>Number.isFinite(x)&&x>=-4&&x<=4)) throw new RangeError('Attention scores must be finite and between -4 and 4');
 const shift=Math.max(a,b);
 const ea=Math.exp(a-shift),eb=Math.exp(b-shift);
 const weights=[ea/(ea+eb),eb/(ea+eb)];
 return {weights,value:weights[0]*2+weights[1]*6};
}
