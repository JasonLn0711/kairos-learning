"""Generate complete M05-06 draft sourceBody and paired reviewed SVGs."""
from pathlib import Path
import json,re,sys
from m05_03_content import svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-06'
ANSWERS={
'zh':['不能；必要的套件清單沒有取得，「零個套件漏洞」缺少完整檢查覆蓋的證據。應補查兩項：一、在可用且經核准的權限下，是否取得完整套件與修補清單；二、相關套件檢查是否實際完成，並查看失敗、略過或權限不足的項目。取得證據後，再依廠商或發行商公告核對受影響條件。','登入成功只證明目標接受該身分，不證明必要檢查成功或套件都安全。保留原發現為待確認，核對套件完整修訂號、修補／backport 與相關執行狀態；若仍有資料缺口，明列範圍與下一步，由有權人員核准調整後再驗證，不自行提高權限或重試至帳號鎖定。'],
'en':['No. The required package inventory was not obtained, so “zero package vulnerabilities” lacks evidence of complete check coverage. Obtain two pieces of evidence: first, whether a complete package and patch inventory was retrieved with available, approved privileges; second, whether the relevant package checks actually completed, including failures, skipped items or permission errors. Then compare the evidence with vendor or distributor advisories to determine the affected conditions.','Successful authentication proves only that the target accepted the identity. It does not prove completion of required checks or that every package is safe. Keep the original finding unconfirmed and verify full package revisions, patches/backports and relevant running state. If gaps remain, state their scope and next steps; an authorized owner must approve adjustments before validation. Do not independently increase privileges or retry until an account locks out.']}
def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';blocks=[];section=0
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  m=re.fullmatch(r'\{\{figure:(views|gates)\}\}',chunk)
  if m:
   name=m[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-06-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0506',summary='參考答案與解釋' if lang=='zh' else 'Reference answer and explanation',paragraphs=ANSWERS[lang]))
  elif chunk.startswith('## '):section+=1;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('- ') or re.match(r'^\d+\. ',chunk):blocks.append(dict(kind='list',items=[re.sub(r'^(?:- |\d+\. )','',line).replace('**','') for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk.replace('**','').replace('`','')))
 assert section==8
 return dict(summary='區分未登入與核准身分的觀察視角，以設定、認證與必要檢查證據判斷掃描覆蓋。' if lang=='zh' else 'Distinguish unauthenticated and authorized-identity perspectives, using configuration, authentication and required-check evidence to judge coverage.',sections=[],sourceBody=blocks)
def generate():
 models=json.loads((S/'diagrams.json').read_text());t=dict(id='CEH26-M05-C06',revision=1,contentVersion='1.0.0',date='2026-11-09',status='draft',publishedOn='2026-11-09',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 out={R/'content/concepts/ceh26-m05-c06.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():out[R/f'site/images/ceh/m05-06-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return out
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
