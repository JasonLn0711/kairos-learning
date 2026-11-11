"""Audit every supplied paragraph against adopted Chinese teaching and named edits."""
import hashlib,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m04-04/replacement-2026-11-11'
def strings(value):
 if isinstance(value,str):return [value]
 if isinstance(value,list):return [s for v in value for s in strings(v)]
 if isinstance(value,dict):return [s for v in value.values()for s in strings(v)]
 return []
def norm(s):return re.sub(r'\s+','',re.sub(r'[`\\#*|]','',s))
def audit():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m04-c04.json').read_text())
 sections=lesson['text']['zh']['sections'];all_text=norm(''.join(strings(lesson['text']['zh'])))
 edits={0:('AASE M04-04','標題沿既有課程目錄與短課次呈現；原標題保存於原稿。'),4:('本課根據','移除本文對自己的來源連結，保留四項學習目標。'),78:('出貨資料檢查','圖3改以具名狀態轉換呈現。'),79:('chatgpt-mermaid','貼文CSS與黏連圖文由附件圖3及十一條轉換重建。'),80:('這張圖中的菱形','依附件實際形狀改稱判斷節點。'),93:('How to use wireframe','代理圖URL由自製圖4與Balsamiq正式來源取代。'),94:('balsamiq.com','來源卡改為正式Balsamiq來源。'),97:('balsamiq.com','獨立網域標籤併入正式來源。'),150:('提交答案並請 AI 批改','貼文操作提示不當作網站提交功能；原三題與參考解析保留。')}
 rows=[]
 for index,paragraph in enumerate(re.split(r'\n\s*\n',(P/'pasted-text-1.txt').read_text().strip())):
  value=norm(paragraph);targets=[s['id']for s in sections if value in norm(''.join(strings(s)))]
  reason='逐字教學內容保留；僅正規化空白與Markdown格式。'
  if targets:status='adopted'
  elif paragraph.startswith('[image](https://www.google.com/s2/favicons'):
   status='format-only';reason='移除favicon來源卡，正式引用另列。'
  elif index in edits:
   prefix,reason=edits[index];assert prefix in paragraph,(index,paragraph);status='documented-edit'
  elif paragraph.startswith('|'):
   cells=[cell.strip()for line in paragraph.splitlines()if not re.fullmatch(r'[| :\-]+',line)for cell in line.strip('|').split('|')]
   assert all(norm(cell)in all_text for cell in cells),(index,cells);status='adopted-table';reason='每個標頭與資料格核對正式語意表格。'
  elif re.match(r'^\d\\\. ',paragraph):
   question=re.sub(r'^\d\\\. ','',paragraph);assert norm(question)in all_text;status='adopted-question';targets=['understanding','checks'];reason='移除題號貼文跳脫；完整原題進入openChecks。'
  else:raise AssertionError(f'Unmapped supplied paragraph {index}: {paragraph[:100]}')
  rows.append(dict(sourceParagraph=index,sha256=hashlib.sha256(paragraph.encode()).hexdigest(),excerpt=paragraph[:100],status=status,targets=targets,reason=reason))
 assert len(rows)==151
 return rows
if __name__=='__main__':
 out=P/'source-coverage.json';data=json.dumps(audit(),ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert out.read_text()==data,'Source adoption ledger differs'
 else:out.write_text(data)
 print('PASS: all 151 supplied paragraphs mapped to adopted teaching or explicit editorial treatment.')
