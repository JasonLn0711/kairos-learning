"""Preserve the full Day02-A manuscript as validated prose and three reviewed figures."""
import json,re,sys,hashlib
from pathlib import Path
from ceh_notes_svg import render
from ceh_day02a_supplement import adopt_supplement
from ceh_day02a_parameterized import adopt_parameterized
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-day02-a/2026-11-14'
def save(path,value):
 data=(json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode() if not isinstance(value,bytes) else value
 if '--check' in sys.argv:assert path.read_bytes()==data,str(path)
 else:path.write_bytes(data)
def main():
 figures=json.loads((SOURCE/'figures.json').read_text());raw=(SOURCE/'pasted-text-1.txt').read_text()
 # Every content line retains an explicit adoption record, including the removed source cards.
 lines=raw.splitlines();sections=[dict(id='p1-introduction',heading='閱讀範圍與原題缺件',body=[dict(kind='paragraph',text='本頁依 CEH Day02-A（2026-11-14）供稿完整整理 K01–K13。供稿標示23題（20題首讀、3題複習），本次附件未包含完整原題、選項及題庫答案；本文保留題號對照、七題待核註記與五道未公布解答的整合情境題。')])];current=sections[0];ledger=[];i=1;n=0
 replacements={
 '博士班程度的提升：':'延伸思考：','博士班要更進一步分清五個證據層級':'進一步分清五個證據層級','博士班程度的思考':'深入理解的重點',
 '附件保留了全部 23 題的原文、原始題號、題庫答案與查證註記。':'供稿提到另有全部 23 題原文、原始題號、題庫答案與查證註記；這些完整原題未隨本次附件提供，以下保留供稿的題型與題號整理。',
 '附件本身已經把下列七題標成「待核」':'供稿將下列七題標成「待核」',
 '其他 16 題在附件的限定情境下，已被教材整理為與原答案一致。這代表附件的查證狀態，並非宣稱取得 EC-Council 官方題庫標準答案。':'供稿記載其餘 16 題與原答案一致；因本次未附完整原題及答案，本文無法獨立重現此項逐題查證，也不將其稱為 EC-Council 官方題庫標準答案。',
 '提交作答，逐題批改':'五道情境題供靜態自我檢核；可自行記下推理，再與教師討論。',
 '完成理解檢核後，就可以直接進入附件的 23 題閉卷練習；不需要再擴充今天的學習範圍。':'若另持有原題庫，完成理解檢核後可進行對應的 23 題閉卷練習；本頁不新增題量或記錄學習完成。',
 '閉卷作答原始 23 題':'閉卷作答原始 23 題（需另持原題庫）',
 '自 2025 年 1 月 28 日起，RDAP 已成為 ICANN 管轄的通用頂級網域（gTLD）註冊資料正式查詢來源。':'自 2025 年 1 月 28 日起，RDAP 成為 gTLD 註冊資料的主要查詢協定；WHOIS 的提供義務依 ICANN 合約與政策而定，.com、.name、.post 等仍有例外。',
 }
 def clean(s):
  s=s.replace('**','').replace('\\@','@').replace('\\.','.')
  for a,b in replacements.items():s=s.replace(a,b)
  return re.sub(r'\?utm_source=chatgpt.com','',s).strip()
 noise={'NIST Computer Security Resource Center','ICANN','implementation and specification','RFC Editor','Nmap Network Scanning','Nmap Network Scanning+1','GitHub','General','CEH-Day02-A-2026-11-14.md'}
 spans={'**寄件端郵件伺服器**':('請特別注意：',0),'TCP 一般連線建立流程示意圖':('白話來說：',1),'證據到決策模型（Evidence-to-Decision）':('以剛才的醫院 AI 服務為例：',2)}
 while i<len(lines):
  start=i;s=lines[i].strip();i+=1
  if not s:continue
  treatment='正文';target=current['id']
  if s in spans:
   end,num=spans[s]
   while i<len(lines) and lines[i].strip()!=end:i+=1
   current['body'].append(figures[num]);treatment=f'同位置圖{num+1}'
  elif s in noise or s.startswith('[image](') or s.startswith('[How to Find') or s.startswith('[Cybersecurity Analyst'):
   treatment='移除來源卡／外部照片連結／檔名，原稿保留'
  elif s.startswith('## '):
   current=dict(id=f'p1-section-{len(sections):02d}',heading=clean(s[3:]),body=[]);sections.append(current);target=current['id']
  elif s.startswith('###'):
   n+=1;target=f'p1-subsection-{n:02d}';current['body'].append(dict(kind='heading',id=target,text=clean(s.lstrip('# '))))
  elif s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;current['body'].append(dict(kind='code',text='\n'.join(code)))
  elif s.startswith('|'):
   rows=[s]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   cells=lambda r:[clean(c) for c in r.strip('|').split('|')]
   current['body'].append(dict(kind='table',headers=cells(rows[0]),rows=[cells(r) for r in rows[2:]]))
  elif s.startswith('- '):
   items=[clean(s[2:])]
   while i<len(lines) and lines[i].strip().startswith('- '):items.append(clean(lines[i].strip()[2:]));i+=1
   current['body'].append(dict(kind='list',items=items))
  else:current['body'].append(dict(kind='paragraph',text=clean(s.removeprefix('> '))))
  for j in range(start,i):
   if lines[j].strip():ledger.append(dict(line=j+1,source=lines[j],anchor=target,treatment=treatment,adopted=clean(lines[j])))
 result=dict(title='CEH Day02-A｜情報蒐集、DNS 與網路掃描白話精讀',summary='K01–K13：從授權、OSINT 與 DNS，到 TCP、Nmap 與密碼學複習，練習辨認每一項證據能支持的結論。',status='published',publishedOn='2026-11-14',revisedOn='2026-11-14',revision=2,contentVersion='1.0.1',sections=sections,sources=json.loads((SOURCE/'references.json').read_text()))
 assert len(sections)==14;assert sum(b['kind']=='diagram' for s in sections for b in s['body'])==3
 figures+=adopt_supplement(result,save)
 figures+=adopt_parameterized(result,save)
 save(ROOT/'content/ceh-day02-a.json',result);save(SOURCE/'line-adoption.json',ledger)
 save(SOURCE/'editorial-replacements.json',replacements)
 for f in figures:save(ROOT/f'site/images/ceh-notes/2026-11-14-part-20-{f["name"]}-zh.svg',render(f,'zh'))
 print(f'Day02-A: {len(sections)-1} chapters, {n} original subsections, {len(ledger)} original source lines, {len(figures)} figures')
if __name__=='__main__':main()
