"""Generate the draft M05-04 complete bilingual sourceBody and reviewed SVGs."""
from pathlib import Path
import json,re,sys
from m05_03_content import svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-04'
ANSWERS={
'zh':'不能；CPE／CVE 只是初步匹配，需核對產品與完整版本分支、功能啟用、修補／backport、實際執行狀態及曝露條件，例如先查預覽功能設定與已安裝且執行中的套件修訂號，必要時才在授權範圍內驗證可利用性。初步匹配也不能證明已遭入侵。',
'en':'No: CPE/CVE provide only a preliminary match; verify the product and full version branch, enabled features, patches/backports, actual running state and exposure conditions—for example, check preview settings and the installed and running package revision—then validate exploitability within authorized scope if necessary. A preliminary match also does not establish compromise.'}
def generate():
 models=json.loads((S/'diagrams.json').read_text());text={}
 for lang in ['zh','en']:
  blocks=[];section=0
  for chunk in re.split(r'\n\s*\n',(S/('teaching.zh-TW.md' if lang=='zh' else 'teaching.en.md')).read_text().strip())[1:]:
   if chunk=='{{figure}}':blocks.append(dict(kind='visual',src=f'/images/ceh/m05-04-roles-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[lang]))
   elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0504',summary='參考答案' if lang=='zh' else 'Reference answer',paragraphs=[ANSWERS[lang]]))
   elif chunk.startswith('## '):section+=1;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
   elif re.match(r'^1\. ',chunk):blocks.append(dict(kind='list',items=[re.sub(r'^\d+\. ','',line) for line in chunk.splitlines()]))
   else:blocks.append(dict(kind='paragraph',text=chunk.replace('**','').replace('`','')))
  assert section==8
  text[lang]=dict(summary='以識別碼、產品條件與現場證據，判斷公開漏洞是否適用自己的系統。' if lang=='zh' else 'Use identifiers, product conditions and local evidence to judge whether a disclosed vulnerability applies to your system.',sections=[],sourceBody=blocks)
 t=dict(id='CEH26-M05-C04',revision=1,contentVersion='1.0.0',date='2026-11-08',status='draft',publishedOn='2026-11-08',qa=[],text=text)
 targets={R/'content/concepts/ceh26-m05-c04.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for lang,v in models.items():targets[R/f'site/images/ceh/m05-04-roles-{lang}-v1-0-0.svg']=svg('roles',lang,v)
 return targets
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
