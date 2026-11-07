"""Deterministically build the complete bilingual M04-10 draft; no renderer changes."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1]; S=R/'docs/sources/m04-10'
ANSWERS={
'zh':'目前不能結案：訪客逾時只表示沒有收到回應，尚不能證明是指定防護規則生效；核准監控主機也讀不到必要狀態，表示允許案例未符合政策。下一步先核對來源、目標、時間及查詢條件，取得對應防火牆／服務紀錄和有效設定，查明兩種失敗各自的原因；由有權限的管理者按核准流程修正，再重測允許與拒絕案例。不要先假定兩者同一原因，也不要用「全部擋住」取代正常功能驗收。',
'en':'The issue cannot yet be closed. A guest timeout establishes only that no response arrived, not that a particular protective rule worked. The approved monitoring host also cannot read necessary status, so the allowed case does not meet policy. Next, confirm sources, targets, times and query conditions, then obtain corresponding firewall/service records and effective settings to determine the cause of each failure. An authorized administrator should correct the configuration through the approved process and retest allowed and denied cases. Do not assume both failures have the same cause or substitute blocking everything for verification of normal functionality.'}
def parse(lang):
 suffix='zh-TW' if lang=='zh' else 'en';chunks=re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:];blocks=[];section=sub=0
 for chunk in chunks:
  if chunk.startswith('## '):
   section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):
   sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('- '): blocks.append(dict(kind='list',items=[line[2:] for line in chunk.splitlines()]))
  elif re.match(r'^1\. ',chunk): blocks.append(dict(kind='list',items=chunk.splitlines()))
  else: blocks.append(dict(kind='paragraph',text=chunk))
 assert section==10
 blocks.append(dict(kind='answer',id='answer-m0410-check',summary='參考答案與解析' if lang=='zh' else 'Reference answer and explanation',paragraphs=[ANSWERS[lang]]))
 return dict(summary='以政策、允許／拒絕案例及交叉證據，驗證服務可用性、資訊揭露與最小權限。' if lang=='zh' else 'Use policy, allowed and denied cases, and corroborating evidence to verify service availability, information disclosure and least privilege.',sections=[],sourceBody=blocks)
t=dict(id='CEH26-M04-C10',revision=1,contentVersion='1.0.0',date='2026-11-07',status='draft',publishedOn='2026-11-07',qa=[],text={lang:parse(lang) for lang in ['zh','en']})
a=t['text']['zh']['sourceBody'];b=t['text']['en']['sourceBody']
assert [(x['kind'],x.get('id'),len(x.get('items',[]))) for x in a]==[(x['kind'],x.get('id'),len(x.get('items',[]))) for x in b]
value=json.dumps(t,ensure_ascii=False,indent=2)+'\n'; p=R/'content/concepts/ceh26-m04-c10.json'
if '--check' in sys.argv: assert p.read_text()==value, 'C10 generated content differs'
else:p.write_text(value)
print(f'M04-10: {len(a)} paired blocks, 10 sections, 6 service subsections, 1 closed answer; draft gate retained')
