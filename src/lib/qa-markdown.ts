export type QABlock = {kind:'heading'|'paragraph'|'code';text:string}|{kind:'table';headers:string[];rows:string[][]}|{kind:'quiz';options:string[];button:string};
// Small, escaped-text format for supplied answers, not executable Markdown/HTML.
export function parseQA(source:string):QABlock[]{
 const lines=source.split('\n');const blocks:QABlock[]=[];
 for(let i=0;i<lines.length;){
  const line=lines[i].trim();if(!line){i++;continue;}
  if(line==='```'){const code:string[]=[];i++;while(i<lines.length&&lines[i].trim()!=='```')code.push(lines[i++]);if(i===lines.length)throw Error('Unclosed Q&A code');i++;blocks.push({kind:'code',text:code.join('\n')});continue;}
  if(line.startsWith('|')){const rows:string[][]=[];while(i<lines.length&&lines[i].trim().startsWith('|')){const row=lines[i++].trim().slice(1,-1).split('|').map(s=>s.trim());if(!row.every(c=>/^:?-+:?$/.test(c)))rows.push(row);}const headers=rows.shift()!;if(rows.some(r=>r.length!==headers.length))throw Error('Uneven Q&A table');blocks.push({kind:'table',headers,rows});continue;}
  if(/^A\. /.test(line)){const options:string[]=[];for(const letter of ['A','B','C','D']){while(!lines[i]?.trim()&&i<lines.length)i++;if(!lines[i]?.startsWith(letter+'. '))throw Error('Incomplete Q&A choices');options.push(lines[i++]);}while(!lines[i]?.trim()&&i<lines.length)i++;const button=lines[i++];if(!/^(提交答案|Submit answer)/.test(button))throw Error('Missing Q&A submit label');blocks.push({kind:'quiz',options,button});continue;}
  blocks.push({kind:/^#{1,3} /.test(line)?'heading':'paragraph',text:line.replace(/^#{1,3} /,'')});i++;
 }
 return blocks;
}
