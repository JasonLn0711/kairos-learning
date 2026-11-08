"""Generate complete M05-03 bodies and sanitized matching SVG downloads."""
from pathlib import Path
import json,re,sys
from html import escape
from m04_09_content import wrap
from m0903_svg import sanitized_svg,NS
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-03'
COUNTS={'causes':5,'targets':5,'methods':2,'dimensions':5,'evidence':4}
ANSWERS={'zh':[
'問題一答案 B。作業系統已更新不會自動修正網站授權邏輯。A 的設定錯誤在其他情境也可能造成越權，但題目線索最支持設計或實作上的授權缺陷；C 沒有未修補作業系統漏洞的證據。仍須核對原定權限及實際程式，才能判定根因。',
'問題二答案 B。內部網路對應 Internal，主動發送檢查請求對應 Active，核准帳號對應 Authenticated，工具執行重複檢查對應 Automated。A 的三個標籤都與情境不符；C 雖然位置正確，卻把主動且使用帳號的檢查誤寫成被動、未驗證。檢查對象也屬 Host-based。',
'問題三答案 B。這次掃描沒有回報已知版本漏洞，只能支持該工具、範圍及時間下的觀察；設定、權限及業務邏輯仍可能有問題。A 把沒有找到當成不存在，C 把工具更新當成完整安全保證。下一步依資產與授權範圍補足其他檢查。'],
'en':[
'Question 1: B. Operating-system updates do not automatically fix application authorization. Misconfiguration (A) can cause unauthorized access in other circumstances, but the stated clues best support a design or implementation authorization flaw. C has no evidence of an unpatched operating-system flaw. Check intended permissions and the actual program to determine the root cause.',
'Question 2: B. The internal network means Internal; sending inspection requests means Active; an approved account means Authenticated; tool-based repetitive checks mean Automated. All three labels in A contradict the scenario. C gets the position right but incorrectly calls the active, authenticated examination passive and unauthenticated. The target is also Host-based.',
'Question 3: B. No reported known version flaws supports only an observation for this tool, scope and time. Configuration, permissions and business logic may still be flawed. A confuses no finding with no flaw; C mistakes updated tools for a complete security guarantee. Next, fill examination gaps within the asset and authorization scope.']}
def svg(name,lang,v):
 prefix=f'm0503-{name}-{lang}-';parts=[];y=42
 def text(x,y,lines,size):
  for i,line in enumerate(lines):parts.append(f'<text x="{x}" y="{y+i*size*1.6}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#183b59">{escape(line)}</text>')
 title=wrap(v['caption'],944,26);text(28,y,title,26);y+=len(title)*42+24
 description=wrap(v['description'],944,20);text(28,y,description,20);y+=len(description)*32+30
 groups=[[0],[1,2],[3,4]] if name=='targets' else [[0,1]] if name=='methods' else [[i] for i in range(len(v['items']))]
 for rowno,indices in enumerate(groups):
  if rowno and name=='evidence':
   parts.append(f'<path d="M500 {y-14}V{y+14}" fill="none" stroke="#47748e" stroke-width="3" marker-end="url(#{prefix}arrow)"/>');y+=30
  if rowno and name=='targets':
   if rowno==1:parts.append(f'<path d="M500 {y-28}V{y-14}M270 {y}V{y-14}H730V{y}" fill="none" stroke="#47748e" stroke-width="3"/>')
   else:
    for x in [270,730]:parts.append(f'<path d="M{x} {y-28}V{y}" stroke="#47748e" stroke-width="3"/>')
  width=(920-24*(len(indices)-1))/len(indices);rows=[]
  for i in indices:
   item=v['items'][i];tl=wrap(item['title'],width-40,23);bl=wrap(item['body'],width-40,20);rows.append((i,tl,bl))
  height=max(52+len(t)*37+len(b)*32 for _,t,b in rows)
  for col,(i,tl,bl) in enumerate(rows):
   x=40+col*(width+24);colors=['#dbeafe','#e9d5ff','#d1fae5','#fef3c7','#ffe4e6'];fill=colors[i] if name=='targets' else '#f1f6fa'
   parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="16" fill="{fill}" stroke="#47748e" stroke-width="2"/>');text(x+20,y+34,tl,23);text(x+20,y+34+len(tl)*37,bl,20)
  y+=height+28
 height=y+20
 raw=f'<svg xmlns="{NS}" viewBox="0 0 900 {height*.9}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#47748e"/></marker></defs><g transform="scale(0.9)">'+''.join(parts)+'</g></svg>'
 result=(sanitized_svg(raw,prefix)+'\n').encode();assert len(result)<100000;return result

def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';blocks=[];section=sub=0
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  match=re.fullmatch(r'\{\{figure:([a-z]+)\}\}',chunk)
  if match:
   name=match[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-03-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0503',summary='參考答案與解析' if lang=='zh' else 'Reference answers and explanations',paragraphs=ANSWERS[lang]))
  elif chunk.startswith('## '):section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in row.strip().strip('|').split('|')] for row in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- '):blocks.append(dict(kind='list',items=[line[2:] for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk))
 assert section==10
 return dict(summary='分清弱點成因、評估對象與方法，組合五個評估維度，判斷掃描證據與修正優先順序。' if lang=='zh' else 'Separate vulnerability causes, assessment targets and methods; combine five dimensions and judge scanning evidence and remediation priority.',sections=[],sourceBody=blocks)
def generate():
 models=json.loads((S/'diagrams.json').read_text())
 for name,pair in models.items():
  for lang,v in pair.items():assert len(v['items'])==COUNTS[name] and v['kind']==('flow' if name=='evidence' else 'cards')
 t=dict(id='M05-03',revision=1,contentVersion='1.0.0',date='2026-11-08',status='published',publishedOn='2026-11-08',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 targets={R/'content/concepts/m05-03.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():targets[R/f'site/images/ceh/m05-03-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return targets
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
