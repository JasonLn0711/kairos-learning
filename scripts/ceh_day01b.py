"""Build the Day01-B article and reviewed SVGs from its adopted text model."""
import json,re,sys
from pathlib import Path
from ceh_notes_svg import render
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-day01-b/2026-11-13'
def save(path,value):
 data=(json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode() if not isinstance(value,bytes) else value
 if '--check' in sys.argv: assert path.read_bytes()==data,str(path)
 else:path.write_bytes(data)
def main():
 figures=json.loads((SOURCE/'figures.json').read_text())
 raw=(SOURCE/'pasted-text-1.txt').read_text()
 text=raw.replace('\\*\\*','**')
 # Replace source diagram transcripts with one same-position, searchable figure.
 spans=[('密碼學系統的概念關係','這個架構就是今天的主軸。'),('**對稱式加密**','#### **為什麼需要非對稱式密碼學？**'),('AES-256 的兩個重要參數','依 NIST FIPS 197'),('NIST AES 決選演算法','這段歷史由 NIST'),('基本流程如下：','數位簽章通常支持三種安全目標：'),('**Root CA（信任錨）**','當瀏覽器或其他驗證程式'),('**1. 確認合作方身分**','其中 AES-GCM'),('**總時間：180 分鐘**','建議現在直接進行')]
 for i,(start,end) in enumerate(spans):
  a=text.index(start);b=text.index(end,a)
  text=text[:a]+f'@@FIGURE{i+1}@@\n\n'+text[b:]
 text=text.replace('這些原則可對應 RFC 5280 §6 的憑證路徑驗證。','憑證路徑驗證參考 RFC 5280 §6；服務身分名稱比對另參考 RFC 9525，兩者需共同配合。')
 text=text.replace('建議現在直接進行原附件的 13 題閉卷作答。','若另持有原題庫，可進行對應 13 題閉卷作答。')
 text=text.replace('提交理解檢核，逐題批改&#x20;','這四題提供靜態自我檢核；可自行記下推理，再與教師討論。')
 noise={'NIST Computer Security Resource Center','NIST Computer Security Resource Center+1','Schneier on Security+2','CSRC','veracrypt.io','RFC Editor','CEH-Day01-B-2026-11-13(1).md','6'}
 def clean(s):
  s=s.replace('**','')
  s=s.replace('\\\\[','').replace('\\\\]','').replace('\\\\(','').replace('\\\\)','')
  for a,b in [('\\operatorname{Enc}','Enc'),('\\operatorname{Dec}','Dec'),('\\pmod q',' (mod q)'),('k^{-1}','k⁻¹'),('r^{-1}','r⁻¹')]:s=s.replace(a,b)
  return s.strip()
 lines=text.splitlines();sections=[{'id':'p1-introduction','heading':'閱讀範圍','body':[]}];current=sections[0];ledger=[];i=1;n=0
 current['body'].append({'kind':'paragraph','text':'本頁依 CEH Day01-B（2026-11-13）供稿完整整理 L01–L12。供稿標示 13 題、52 個選項，實際附件未包含完整原題、選項及官方答案；本文保留題號對照、技術歧義與四道不公布答案的理解檢核。'})
 while i<len(lines):
  line=i+1;s=lines[i].strip();i+=1
  if not s:continue
  if s in noise or s.startswith('[image](') or s.startswith('[VeraCrypt下载') or s.startswith('[Erstellung') or s.startswith('[How to Encrypt'):
   ledger.append({'line':line,'treatment':'移除來源卡、未附文件標籤或第三方圖片連結；原文保留'});continue
  if s.startswith('@@FIGURE'):
   num=int(re.search(r'\d+',s)[0]);current['body'].append(figures[num-1]);ledger.append({'line':line,'treatment':f'採用圖{num}'});continue
  if s.startswith('## '):
   current={'id':f'p1-section-{len(sections):02d}','heading':clean(s[3:]),'body':[]};sections.append(current);continue
  if s.startswith('###'):
   n+=1;current['body'].append({'kind':'heading','id':f'p1-subsection-{n:02d}','text':clean(s.lstrip('# '))});continue
  if s.startswith('|'):
   rows=[s]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   cells=lambda r:[clean(c) for c in r.strip('|').split('|')]
   current['body'].append({'kind':'table','headers':cells(rows[0]),'rows':[cells(r) for r in rows[2:]]});continue
  if s.startswith('- '):
   items=[clean(s[2:])]
   while i<len(lines) and lines[i].strip().startswith('- '):items.append(clean(lines[i].strip()[2:]));i+=1
   current['body'].append({'kind':'list','items':items});continue
  current['body'].append({'kind':'paragraph','text':clean(s)})
 sources=json.loads((SOURCE/'references.json').read_text())
 result={'title':'CEH M20｜密碼學博士班白話精讀：從加密、金鑰管理到數位簽章','summary':'Day01-B · L01–L12：以跨國晶片設計協作案例，理解密碼學機制的用途、前提與失效邊界。','status':'published','publishedOn':'2026-11-13','revisedOn':'2026-11-13','revision':1,'contentVersion':'1.0.0','sections':sections,'sources':sources}
 assert len(figures)==8
 assert all(any(f'L{i:02d}｜' in b.get('text','') for s in sections for b in s['body']) for i in range(1,13))
 assert sum(b['kind']=='diagram' for s in sections for b in s['body'])==8
 save(ROOT/'content/ceh-day01-b.json',result)
 for f in figures:save(ROOT/f'site/images/ceh-notes/2026-11-13-part-20-{f["name"]}-zh.svg',render(f,'zh'))
 print('Day01-B: full adopted body, L01–L12, 8 figures')
if __name__=='__main__':main()
