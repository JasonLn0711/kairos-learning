"""Parse the complete paired manuscripts without losing interleaved blocks."""
from pathlib import Path
import re,json
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/cs-systems-foundations'
def parse(lang):
 text=(S/f'teaching.{lang}.md').read_text();lines=text.splitlines();sections=[];current={'id':'introduction','heading':'導言' if lang=='zh-TW' else 'Introduction','paragraphs':[],'body':[]};sections.append(current);i=2;sub=0
 while i<len(lines):
  line=lines[i]
  if not line.strip():i+=1;continue
  if line.startswith('## '):
   current={'id':f'section-{len(sections)}','heading':line[3:],'paragraphs':[],'body':[]};sections.append(current);sub=0;i+=1;continue
  if line.startswith('### '):
   sub+=1;current['body'].append({'kind':'heading','id':f'{current["id"]}-sub-{sub}','text':line[4:]});i+=1;continue
  if line.startswith('```'):
   code=[];i+=1
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines),'unclosed code';current['body'].append({'kind':'code','text':'\n'.join(code)});i+=1;continue
  if line.startswith('|'):
   rows=[]
   while i<len(lines) and lines[i].startswith('|'):
    rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
   assert all(len(r)==len(rows[0]) for r in rows)
   current['body'].append({'kind':'table','headers':rows[0],'rows':rows[2:]});continue
  if line.startswith('- '):
   items=[]
   while i<len(lines) and lines[i].startswith('- '):items.append(lines[i][2:]);i+=1
   current['body'].append({'kind':'list','items':items});continue
  paragraph=[]
  while i<len(lines) and lines[i].strip():paragraph.append(lines[i]);i+=1
  current['body'].append({'kind':'paragraph','text':'\n'.join(paragraph)})
 return sections
if __name__=='__main__':
 pair={lang:parse(suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]};assert len(pair['zh'])==len(pair['en'])
 report=[]
 for a,b in zip(pair['zh'],pair['en']):
  def shape(s):return [([x['kind'],len(x['headers']),len(x['rows'])] if x['kind']=='table' else [x['kind'],len(x['items'])] if x['kind']=='list' else [x['kind']]) for x in s['body']]
  report.append({'id':a['id'],'zh':a['heading'],'en':b['heading'],'zhBlocks':len(a['body']),'enBlocks':len(b['body']),'sameShape':shape(a)==shape(b)})
 (S/'body-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'sections':len(report),'sameShape':sum(x['sameShape'] for x in report),'needsReview':[x['id'] for x in report if not x['sameShape']]},ensure_ascii=False))
