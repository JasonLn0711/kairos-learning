"""Generate M05-01 semantic bodies and bounded, escaped SVG exports."""
from pathlib import Path
import json,re,sys
from m04_09_content import wrap
from m0903_svg import sanitized_svg,NS
from html import escape
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-01'
ANSWERS={'zh':['問題一答案 C。先核對產品、修補及漏洞成立條件；進一步測試須取得授權。A 超出目前授權；B 把掃描警告誤當入侵證據；D 把尚未看到外洩誤當沒有風險。','問題二：若政策明定帳號不可讀取該筆資料，成功讀取能證明本次帳號、環境及請求條件下發生越權存取。不能因此推論所有資料都可讀取、正式環境同樣受影響或過去曾遭入侵。保存請求／回覆、帳號、時間、合成資料與預期政策，修補後同時複測合法讀取成功及越權讀取被拒絕。'],'en':['Question 1: C. Verify the product, patch status and required conditions; obtain authorization for further testing. A exceeds current authorization. B mistakes a scanner alert for incident evidence. D mistakes no observed leak for no risk.','Question 2: If policy prohibits this account from reading that record, successful reading demonstrates unauthorized access for this account, environment and request conditions. It does not establish access to all data, the same impact in production or a past intrusion. Retain request/response evidence, account, time, synthetic data and expected policy; after remediation, retest both successful legitimate access and denied unauthorized access.']}
def svg(name,lang,v):
 prefix=f'm0501-{name}-{lang}-';parts=[];y=42
 def text(x,y,lines,size):
  for i,line in enumerate(lines):parts.append(f'<text x="{x}" y="{y+i*size*1.6}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#183b59">{escape(line)}</text>')
 lines=wrap(v['caption'],944,26);text(28,y,lines,26);y+=len(lines)*42+24
 groups=[[0],[1],[2,3],[4],[5]] if name=='terms' else [[0,1],[2],[3]] if name=='access' else [[i] for i in range(len(v['items']))]
 for rowno,indices in enumerate(groups):
  if rowno and name=='workflow':parts.append(f'<path d="M500 {y-12}V{y+15}" fill="none" stroke="#47748e" stroke-width="3" marker-end="url(#{prefix}arrow)"/>');y+=30
  width=(920-24*(len(indices)-1))/len(indices);rows=[]
  for i in indices:
   item=v['items'][i];tl=wrap(item['title'],width-40,23);bl=wrap(item['body'],width-40,20);rows.append((i,tl,bl))
  height=max(52+len(t)*37+len(b)*32 for _,t,b in rows)
  for col,(i,tl,bl) in enumerate(rows):
   x=40+col*(width+24);fill='#fcf2ef' if name=='terms' and i==5 else '#f1f6fa'
   parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="16" fill="{fill}" stroke="#47748e" stroke-width="2"/>')
   text(x+20,y+34,tl,23);text(x+20,y+34+len(tl)*37,bl,20)
  y+=height+28
 lines=wrap(v['description'],944,20);text(28,y+12,lines,20);height=y+len(lines)*32+40
 raw=f'<svg xmlns="{NS}" viewBox="0 0 900 {height*.9}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#47748e"/></marker></defs>'+'<g transform="scale(0.9)">'+''.join(parts)+'</g></svg>'
 result=(sanitized_svg(raw,prefix)+'\n').encode();assert len(result)<100000;return result

def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';blocks=[];section=sub=0
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  match=re.fullmatch(r'\{\{figure:([a-z]+)\}\}',chunk)
  if match:
   name=match[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-01-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0501',summary='參考答案與解析' if lang=='zh' else 'Reference answers and explanations',paragraphs=ANSWERS[lang]))
  elif chunk.startswith('## '):section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in row.strip().strip('|').split('|')] for row in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- '):blocks.append(dict(kind='list',items=[line[2:] for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk))
 assert section==8
 return dict(summary='分清掃描線索、已確認弱點、可利用性與入侵證據，依授權安排驗證、修補及複測。' if lang=='zh' else 'Separate scanner clues, confirmed vulnerabilities, exploitability and incident evidence; plan authorized validation, remediation and retesting.',sections=[],sourceBody=blocks)
def generate():
 models=json.loads((S/'diagrams.json').read_text());counts={'terms':6,'scan':3,'access':4,'workflow':5}
 for name,pair in models.items():
  for lang,v in pair.items():assert len(v['items'])==counts[name] and v['kind']==('flow' if name=='workflow' else 'cards')
 t=dict(id='M05-01',revision=1,contentVersion='1.0.0',date='2026-11-08',status='published',publishedOn='2026-11-08',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 targets={R/'content/concepts/m05-01.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():targets[R/f'site/images/ceh/m05-01-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return targets
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
