"""Generate full bilingual M05-08 draft and reviewed same-model SVGs."""
from pathlib import Path
import json,re,sys
from m05_03_content import svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-08'
ANSWERS={
'zh':['不能寫「修正完成且驗證通過」。目前應分開記錄：外部入口限制已完成、更新安裝回報成功，但後續必要檢查因登入失敗尚未完成，因此驗證仍未完成。入口限制與更新回報不能替代複驗結果。','應補上三類證據：適用修正已安裝且於執行中生效的證據、必要檢查成功完成的紀錄，以及正常服務仍能運作的結果。先釐清並依核准流程處理登入問題，再在授權範圍複驗。若只驗證部分資產、功能或入口，結論及剩餘限制也須限定在該範圍，未驗證部分保留待確認。'],
'en':['Do not report “remediation complete and verification passed.” Record the states separately: external entry restriction is complete, update installation is reported successful, but required follow-up checks did not complete because authentication failed. Verification therefore remains incomplete. Neither entry restrictions nor an update report substitute for revalidation results.','Obtain three categories of evidence: the applicable fix is installed and effective in the running system; the required checks completed successfully; and normal service continues to work. Investigate and address the authentication issue through the approved process, then revalidate within authorized scope. If only some assets, features or entry points can be verified, limit the conclusion and remaining constraints to that scope and retain the rest as unconfirmed.']}
def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';blocks=[];section=0
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  m=re.fullmatch(r'\{\{figure:(workflow|status)\}\}',chunk)
  if m:
   name=m[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-08-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk=='{{answer}}':blocks.append(dict(kind='answer',id='answer-m0508',summary='參考答案與解釋' if lang=='zh' else 'Reference answer and explanation',paragraphs=ANSWERS[lang]))
  elif chunk.startswith('## '):section+=1;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('- ') or re.match(r'^\d+\. ',chunk):blocks.append(dict(kind='list',items=[re.sub(r'^(?:- |\d+\. )','',line).replace('**','') for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk.replace('**','').replace('`','')))
 assert section==8
 return dict(summary='把確認發現轉成有理由的排序、有負責人的修正與可複查的結果，分清緩解、更新回報與驗證結案。' if lang=='zh' else 'Turn confirmed findings into reasoned priorities, owned actions and reviewable outcomes, distinguishing mitigation, update reports and verified closure.',sections=[],sourceBody=blocks)
def generate():
 models=json.loads((S/'diagrams.json').read_text());t=dict(id='CEH26-M05-C08',revision=1,contentVersion='1.0.0',date='2026-11-10',status='draft',publishedOn='2026-11-10',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 out={R/'content/concepts/ceh26-m05-c08.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():out[R/f'site/images/ceh/m05-08-{name}-{lang}-v1-0-0.svg']=svg('evidence' if name=='workflow' else 'status',lang,v)
 return out
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
