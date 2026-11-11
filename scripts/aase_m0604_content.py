"""Build M06-04 from its complete paired manuscripts and fixed figure data."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m06-04/replacement-2026-11-11'
IDS=['introduction','analogy','roles','http','outcomes','streamlit','validation','applications','record','synthesis','understanding']

def build():
 l=json.loads((P/'prior-lesson.json').read_text());l.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 l['sourceIds']=['mdn-http','streamlit-architecture','mdn-http-status','owasp-input-validation']
 figures=json.loads((P/'figures.json').read_text())
 for lang in ['zh','en']:
  chunks=re.split(r'^## ',(P/f'teaching.{lang}.md').read_text(),flags=re.M);assert len(chunks)==11
  sections=[]
  for n,chunk in enumerate(chunks):
   lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ')
   if n==0:heading='從按鈕追到真正完成的結果' if lang=='zh' else 'Trace a button to the completed outcome'
   blocks=[];run=[];i=0;table=0;code=0
   def flush():
    if run:blocks.append(dict(kind='prose',paragraphs=['\n'.join(run).strip()]));run.clear()
   while i<len(lines):
    line=lines[i]
    if line.startswith('@figure'):
     flush();blocks.append(figures[lang][int(line[-1])-1]);i+=1
    elif line.startswith('```'):
     flush();i+=1;body=[]
     while i<len(lines) and not lines[i].startswith('```'):body.append(lines[i]);i+=1
     i+=1;code+=1
     names={3:[['HTTP 請求範例','HTTP 回應範例'],['HTTP request example','HTTP response example']],4:[['業務驗證失敗的回應'],['Response with failed business validation']],5:[['Streamlit 姓名檢查範例'],['Streamlit name-check example']]}
     title=names[n][0 if lang=='zh' else 1][code-1]
     blocks.append(dict(kind='step',heading=title,paragraphs=['假想教學訊息，並非本站端點。' if lang=='zh' else 'A hypothetical teaching message, not an endpoint on this site.'] if n!=5 else ['僅檢查姓名是否非空；不包含正式身分驗證與授權。' if lang=='zh' else 'This checks only for a nonblank name; it does not implement production authentication or authorization.'],code='\n'.join(body)))
    elif line.startswith('|'):
     flush();rows=[]
     while i<len(lines) and lines[i].startswith('|'):rows.append([s.strip() for s in lines[i].strip().strip('|').split('|')]);i+=1
     table+=1
     titles={2:['表 1｜網站角色與餐廳類比','Table 1 | Web roles and restaurant analogies'],3:['表 2｜常見 HTTP Method','Table 2 | Common HTTP methods'],4:['表 3｜常見 HTTP 狀態碼','Table 3 | Common HTTP status codes'],6:['表 4｜驗證責任的邊界','Table 4 | Validation boundaries'],7:['表 5｜跨產業結果驗證','Table 5 | Verify outcomes across industries']}
     blocks.append(dict(kind='table',caption=titles[n][0 if lang=='zh' else 1],headers=rows[0],rows=rows[2:]))
    else:run.append(line);i+=1
   flush();assert blocks and blocks[0]['kind']=='prose'
   section=dict(id=IDS[n],heading=heading,paragraphs=blocks.pop(0)['paragraphs'])
   if blocks:section['blocks']=blocks
   if n in [2,3]:section['sourceIds']=['mdn-http']
   if n==4:section['sourceIds']=['mdn-http-status']
   if n==5:section['sourceIds']=['streamlit-architecture']
   if n==6:section['sourceIds']=['owasp-input-validation']
   sections.append(section)
  l['text'][lang]['sections']=sections
  l['text'][lang].pop('openChecks',None)
 questions=json.loads((P/'checks.json').read_text());l['checks']=questions
 return l

def main():
 data=json.dumps(build(),ensure_ascii=False,indent=2)+'\n';out=ROOT/'content/aase/lessons/aase-m06-c04.json'
 if '--check' in sys.argv:assert out.read_text()==data,'M06-04 differs from paired manuscripts'
 else:out.write_text(data)
 print('PASS: M06-04 complete paired manuscripts, 11 sections, four figures, three questions')
if __name__=='__main__':main()
