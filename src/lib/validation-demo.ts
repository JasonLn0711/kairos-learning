// Match Python str.strip() whitespace and len(str) code-point counting.
export function validationIssue(value:string):'blank'|'length'|null {
 const cleaned=value.replace(/^[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+|[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/gu,'');
 return !cleaned?'blank':Array.from(cleaned).length>80?'length':null;
}
