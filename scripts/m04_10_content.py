"""Generate the paired M04-10 body and bounded diagram exports."""
from pathlib import Path
import json,re,sys
from m04_09_content import svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m04-10'
ANSWERS={
'zh':['不同意。核准監控主機無法取得狀態，已顯示正常功能未符合政策；訪客逾時也尚未證明是政策正確拒絕。','已知是兩種來源的本次測試都未取得預期資訊，且目前缺少可關聯日誌。防火牆阻擋、服務停止、路由故障或測試設定錯誤都仍是假設。','要求提供來源／目的地、測試時間與查詢內容、對應防火牆規則及命中紀錄、服務健康與授權設定、服務日誌。確認監控主機允許案例成功，訪客拒絕案例可歸因於政策，再保存修正後重測證據。'],
'en':['Disagree. The approved monitoring host cannot obtain status, so legitimate functionality already fails policy. A guest timeout also does not establish a correct policy denial.','Known facts: neither source obtained the expected information in these tests, and correlated logs are unavailable. Firewall blocking, service failure, routing failure and incorrect test configuration remain hypotheses.','Request source and destination, test time and query, matching firewall rules and hit records, service health and authorization settings, and service logs. Verify successful approved monitoring and a guest denial attributable to policy, then retain evidence of the corrected retest.']}
def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';chunks=re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:];blocks=[];section=sub=0
 for chunk in chunks:
  figure=re.fullmatch(r'\{\{figure:([a-z]+)\}\}',chunk)
  if figure:
   name=figure[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m04-10-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0410',summary='參考答案與解析' if lang=='zh' else 'Reference answer and explanation',paragraphs=ANSWERS[lang]))
  elif chunk.startswith('## '):
   section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):
   sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('```'):
   assert chunk.endswith('```');blocks.append(dict(kind='code',text='\n'.join(chunk.splitlines()[1:-1])))
  elif chunk.startswith('- ') or re.match(r'1\. ',chunk):blocks.append(dict(kind='list',items=[line[2:] if line.startswith('- ') else line for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk))
 assert section==9
 return dict(summary='依政策分開管理資訊揭露、資料權限與傳輸保護，以允許及拒絕測試保留正當服務。' if lang=='zh' else 'Manage disclosure, data permissions and transport protection separately, using positive and negative tests to preserve legitimate service.',sections=[],sourceBody=blocks)
def generate():
 models=json.loads((S/'diagrams.json').read_text());assert set(models)=={'rights','controls','acceptance'}
 t=dict(id='CEH26-M04-C10',revision=1,contentVersion='1.0.0',date='2026-11-07',status='published',publishedOn='2026-11-07',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 result={R/'content/concepts/ceh26-m04-c10.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():result[R/f'site/images/ceh/m04-10-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return result
if __name__=='__main__':
 for path,data in generate().items():
  if '--check' in sys.argv:assert path.read_bytes()==data,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
