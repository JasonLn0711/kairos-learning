/** Reader-facing course codes; persistent AASE IDs remain unchanged in data. */
export function aaseDisplayId(value:string):string {
 const code=value.replace(/^AASE-(M\d{2})-C(\d{2})$/,'$1-$2').toUpperCase();
 if(!/^M\d{2}-\d{2}$/.test(code))throw new Error('Invalid AASE concept identifier');
 return code;
}
export function aaseConceptTitle(concept:{slug:string;title:string}):string {
 return `${aaseDisplayId(concept.slug)} · ${concept.title}`;
}
