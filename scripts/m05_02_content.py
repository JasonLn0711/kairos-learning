"""Generate M05-02 semantic bodies and bounded, escaped SVG exports."""
from pathlib import Path
import json,re,sys
from m04_09_content import wrap
from m0903_svg import sanitized_svg,NS
from html import escape
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-02'
ANSWERS={'zh': ['問題一：不可以。授權僅限 A 的作業系統版本與安全設定；發現 B 或知道其歸屬不會擴張授權。先記錄依賴並透過有權責者確認新增範圍及 ROE，取得授權後才執行指定測試。', '問題二：在清冊將 B 記為正式影像資料庫、C 記為外部身分服務，標示與 A 的依賴、已知管理者、環境、查核時間及待確認欄位。報告明列 B、C 未納入本次測試，不宣稱它們安全或存在弱點；第三方條款與同意另行確認。', '問題三：依 ROE 立即停止相關操作，避免繼續瀏覽、複製或散布影像；只保留必要的非敏感時間與操作紀錄，循約定程序通知負責人，依事件及資料處理規則決定後續。'], 'en': ['Question 1: No. Authorization covers only OS version and security settings on A. Discovery or ownership of B does not extend permission. Record the dependency and ask the proper authority to approve added scope and ROE before any specified testing.', 'Question 2: Record B as a production imaging database and C as an external identity service. Include dependencies on A, known owners, environment, verification time and fields awaiting confirmation. State explicitly that B and C were not tested; claim neither security nor a vulnerability. Confirm third-party terms and consent separately.', 'Question 3: Stop the relevant activity under the ROE. Avoid further viewing, copying or distributing images. Retain only necessary nonsensitive timing and activity records, notify the agreed contact and follow incident and data-handling procedures.']}
def svg(name,lang,v):
 prefix=f'm0502-{name}-{lang}-';parts=[];y=42
 def text(x,y,lines,size):
  for i,line in enumerate(lines):parts.append(f'<text x="{x}" y="{y+i*size*1.6}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#183b59">{escape(line)}</text>')
 lines=wrap(v['caption'],944,26);text(28,y,lines,26);y+=len(lines)*42+24
 groups=[[0],[1,2]] if name=='scope' else [[i] for i in range(len(v['items']))]
 if name=='inventory':
  for i in range(100):parts.append(f'<rect x="{40+(i%10)*92}" y="{y+(i//10)*24}" width="86" height="18" rx="3" fill="{"#20877f" if i<30 else "#e6e8e8"}"/>')
  y+=270
 if name=='coverage':
  parts.append(f'<rect x="40" y="{y}" width="920" height="24" rx="12" fill="#e6e8e8"/><rect x="40" y="{y}" width="736" height="24" rx="12" fill="#20877f"/>');y+=50
 for rowno,indices in enumerate(groups):
  if rowno and name=='workflow':parts.append(f'<path d="M500 {y-12}V{y+15}" fill="none" stroke="#47748e" stroke-width="3" marker-end="url(#{prefix}arrow)"/>');y+=30
  if rowno and name=='scope':
   parts.append(f'<path d="M500 {y-28}V{y}" fill="none" stroke="#47748e" stroke-width="3" /><path d="M500 {y}H270V{y+25}" fill="none" stroke="#47748e" stroke-width="3" marker-end="url(#{prefix}arrow)"/><path d="M500 {y}H730V{y+25}" fill="none" stroke="#47748e" stroke-width="3" marker-end="url(#{prefix}arrow)"/>');y+=40
  width=(920-24*(len(indices)-1))/len(indices);rows=[]
  for i in indices:
   item=v['items'][i];tl=wrap(item['title'],width-40,23);bl=wrap(item['body'],width-40,20);rows.append((i,tl,bl))
  height=max(52+len(t)*37+len(b)*32 for _,t,b in rows)
  for col,(i,tl,bl) in enumerate(rows):
   x=40+col*(width+24);fill='#edf6f4' if name=='scope' and i==0 else '#f1f6fa'
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
   name=match[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-02-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0502',summary='參考答案與解析' if lang=='zh' else 'Reference answers and explanations',paragraphs=ANSWERS[lang]))
  elif chunk.startswith('## '):section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in row.strip().strip('|').split('|')] for row in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('1. '):blocks.append(dict(kind='list',items=[re.sub(r'^\d+\. ','',line) for line in chunk.splitlines()]))
  elif chunk.startswith('- '):blocks.append(dict(kind='list',items=[line[2:] for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk))
 assert section==8
 return dict(summary='分清資產盤點、評估範圍與執行規則，依證據交代實際完成覆蓋率及結論界線。' if lang=='zh' else 'Distinguish asset inventory, assessment scope and rules of engagement; report actual coverage and the limits of the evidence.',sections=[],sourceBody=blocks)
def generate():
 models=json.loads((S/'diagrams.json').read_text());counts={'inventory':2,'scope':3,'workflow':5,'coverage':1}
 for name,pair in models.items():
  for lang,v in pair.items():assert len(v['items'])==counts[name] and v['kind']==('flow' if name=='workflow' else 'cards')
 t=dict(id='M05-02',revision=1,contentVersion='1.0.0',date='2026-11-08',status='published',publishedOn='2026-11-08',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 targets={R/'content/concepts/m05-02.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():targets[R/f'site/images/ceh/m05-02-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return targets
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
