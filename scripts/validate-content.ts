import { allLessons, modules, sources, allTerms as terms } from '../src/lib/server/catalog.ts';
import { validateContent } from '../src/lib/validate.ts';
console.error('Checking bilingual content, answer keys, source links and prerequisite graph.');
const errors = validateContent(allLessons,modules,sources,terms);
if(errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`PASS: ${allLessons.length} bilingual lessons, ${allLessons.reduce((n,l)=>n+l.questions.length,0)} original questions, ${terms.length} terms.`);
