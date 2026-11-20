"""Adopt the complete Day02-B source; preserve every nonempty source line in a ledger."""
import json,re,sys
from pathlib import Path
from ceh_notes_svg import render
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-day02-b/2026-11-15'
REPLACEMENTS={
 '本次教材：23 題，涵蓋 12 個知識點（K01–K12）。':'供稿標示23題、12個知識點（K01–K12）；本次未附完整23題題幹、選項及題庫答案。以下保留完整教學、題號對照與技術待核註記。',
 '附件明確將三題標記為技術待核':'供稿明確將三題標記為技術待核',
 '附件中的 `smtp-enum-users` 命令參數是題庫原文，不能直接當成現行版本的正確用法。':'供稿提及另份附件中的 `smtp-enum-users` 命令參數；本次未附該原題命令，無法逐字核對，不能將轉述當成現行版本的正確用法。',
 '提交作答並進行批改':'以上六題供靜態自我檢核：自行記錄觀察、推論與還缺的證據，再與教師討論。本頁未提供提交、批改或學習完成紀錄。',
 '沿用附件的半天節奏':'沿用供稿建議的半天節奏',
 '23 題閉卷作答':'23 題閉卷作答（需另持原題庫）',
 '下一步建議先完成附件第 06–16 題':'若另持原題庫，下一步建議先完成第 06–16 題',
 '真實性（Authenticity）':'真實性（Authenticity）',
}
def clean(value):
 value=value.replace('**','').replace('\\&','&')
 for a,b in REPLACEMENTS.items():value=value.replace(a,b)
 return value.strip()
def save(path,value):
 data=(json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode() if not isinstance(value,bytes) else value
 if '--check' in sys.argv:assert path.read_bytes()==data,f'Outdated: {path}'
 else:path.write_bytes(data)
def main():
 lines=(SOURCE/'pasted-text-1.txt').read_text().splitlines();figures=json.loads((SOURCE/'figures.json').read_text())
 current=dict(id='p1-introduction',heading='閱讀範圍與證據判讀',body=[]);sections=[current];ledger=[];i=1;n=0
 additions={'### **2.3':figures[0],'### **4.2':figures[1],'### **4.3':figures[2]}
 while i<len(lines):
  start=i;line=lines[i].strip();i+=1
  if not line:continue
  target=current['id'];treatment='正文'
  for prefix,f in additions.items():
   if line.startswith(prefix):current['body'].append(f)
  if line=='UDP 探測結果判斷' or line=='**掃描者發送 SYN**':
   num=3 if line=='UDP 探測結果判斷' else 4
   endpoint='這是 Nmap UDP Scan' if num==3 else 'SYN Scan 因為'
   while i<len(lines) and not lines[i].startswith(endpoint):i+=1
   current['body'].append(figures[num]);treatment=f'同位置圖{num+1}，分支／層次完整保留'
  elif line.startswith('[image](') or line in {'IANA','IANA+1','Nmap Network Scanning','Nmap Scripting Engine documentation','RFC Editor','CEH-Day02-B-2026-11-14(1).md'}:
   treatment='移除重複來源卡／檔名；原稿保留，一手來源列於文末'
  elif line.startswith('## '):
   current=dict(id=f'p1-section-{len(sections):02d}',heading=clean(line[3:]),body=[]);sections.append(current);target=current['id']
  elif line.startswith('###') or re.match(r'問題 [1-6]｜',line):
   n+=1;target=f'p1-subsection-{n:02d}';current['body'].append(dict(kind='heading',id=target,text=clean(line.lstrip('# '))))
  elif line.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;current['body'].append(dict(kind='code',text='\n'.join(code)))
  elif line.startswith('|'):
   rows=[line]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   cells=lambda r:[clean(c) for c in r.strip('|').split('|')]
   # The final scenario uses a two-column key/value table without a header row.
   if len(rows)>1 and re.fullmatch(r'[\s|:\-]+',rows[1]):
    headers=cells(rows[0]);body=[cells(r) for r in rows[2:]]
    if headers==['ICMP Echo','沒有回應']:
     headers=['觀察項目','測試紀錄（假設資料）'];body.insert(0,cells(rows[0]));treatment='重建語意表頭，ICMP Echo保留為第一資料列'
   else:headers=['項目','內容'];body=[cells(r) for r in rows]
   assert all(len(row)==len(headers) for row in body),(start,body)
   current['body'].append(dict(kind='table',headers=headers,rows=body))
  elif line.startswith('- '):
   items=[clean(line[2:])]
   while i<len(lines) and lines[i].strip().startswith('- '):items.append(clean(lines[i].strip()[2:]));i+=1
   current['body'].append(dict(kind='list',items=items))
  else:current['body'].append(dict(kind='paragraph',text=clean(line)))
  for j in range(start,i):
   if lines[j].strip():ledger.append(dict(line=j+1,source=lines[j],anchor=target,treatment=treatment,adopted=clean(lines[j])))
 result=dict(title='CEH Day02-B｜網路掃描、TCP／UDP、服務列舉與安全判讀',summary='從封包回應判讀主機、連接埠與服務：完整保留K01–K12教學、23題對照、三題待核與六道情境練習。',status='published',publishedOn='2026-11-15',revisedOn='2026-11-15',revision=1,contentVersion='1.0.0',sections=sections,sources=json.loads((SOURCE/'references.json').read_text()))
 assert len(sections)==15,len(sections)
 assert len(ledger)==sum(bool(s.strip()) for s in lines[1:])
 assert sum(b['kind']=='diagram' for s in sections for b in s['body'])==5
 save(ROOT/'content/ceh-day02-b.json',result);save(SOURCE/'line-adoption.json',ledger);save(SOURCE/'editorial-replacements.json',REPLACEMENTS)
 for f in figures:save(ROOT/f'site/images/ceh-notes/2026-11-15-part-20-{f["name"]}-zh.svg',render(f,'zh'))
 print(f'Day02-B: {len(sections)} sections, {n} subsections/questions, 5 figures, {len(ledger)} adopted source lines')
if __name__=='__main__':main()
