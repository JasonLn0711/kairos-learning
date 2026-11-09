"""Generate complete draft M05-05 teaching and matching reviewed diagrams."""
from pathlib import Path
import json,re,sys
from m05_03_content import svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-05'
ANSWERS={
'zh':['缺少兩類證據：一是漏洞是否適用我方資產，包括完整產品版本、設定與修補狀態；二是我方風險情境，包括入口曝露、資產與業務重要性、可能後果及現有防護。因此低 EPSS 和未列 KEV 都不能證明不需處理，應先補齊這兩類資料，再依組織政策決定順序。','EPSS 的 1% 是特定日期對漏洞利用活動的模型預測，並非這台資產被入侵的機率；未列 KEV 只表示查核時未在該清單確認，不能推論沒有利用。CVSS 高分也不能補足本機適用性證據。先核對產品分支、完整安裝與執行版本、功能設定及修補／backport，再確認可接近的入口、敏感資料與中斷影響，以及防護是否真的有效。保留未知項及處理理由；必要驗證遵守授權範圍。'],
'en':['Two categories of evidence are missing: whether the vulnerability applies to our assets, including complete product versions, configuration and patch state; and our risk context, including entry-point exposure, asset and business importance, possible consequences and existing defenses. Low EPSS and absence from KEV therefore cannot establish that no action is needed; obtain both categories before prioritizing under organizational policy.','The 1% EPSS value is a dated model forecast of vulnerability exploitation activity, not the probability that this asset is compromised. Absence from KEV means only that the check did not confirm a listing; it cannot establish absence of exploitation. A high CVSS score cannot supply local applicability evidence either. Check the product branch, full installed and running versions, enabled features and patches/backports, then reachable entry points, sensitive data, interruption consequences and whether defenses actually work. Preserve unknowns and the action rationale; any necessary validation stays within authorized scope.']}
def parse(lang,models):
 blocks=[];section=0;suffix='zh-TW' if lang=='zh' else 'en'
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  if chunk=='{{figure}}':blocks.append(dict(kind='visual',src=f'/images/ceh/m05-05-signals-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[lang]))
  elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0505',summary='參考答案與解釋' if lang=='zh' else 'Reference answer and explanation',paragraphs=ANSWERS[lang]))
  elif chunk.startswith('## '):section+=1;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- ') or re.match(r'^\d+\. ',chunk):blocks.append(dict(kind='list',items=[re.sub(r'^(?:- |\d+\. )','',line).replace('**','') for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk.replace('**','').replace('`','')))
 assert section==8
 return dict(summary='結合技術嚴重度、已知利用、預測與我方證據，提出可複核的漏洞處理順序。' if lang=='zh' else 'Combine technical severity, known exploitation, forecasts and local evidence into a reviewable remediation priority.',sections=[],sourceBody=blocks)
def generate():
 models=json.loads((S/'diagrams.json').read_text());t=dict(id='CEH26-M05-C05',revision=1,contentVersion='1.0.0',date='2026-11-09',status='draft',publishedOn='2026-11-09',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 out={R/'content/concepts/ceh26-m05-c05.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for lang,v in models.items():out[R/f'site/images/ceh/m05-05-signals-{lang}-v1-0-0.svg']=svg('signals',lang,v)
 return out
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
