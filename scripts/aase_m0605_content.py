"""Build M06-05 from the complete bilingual manuscripts and fixed figure model."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m06-05/replacement-2026-11-11'

def generate():
 lesson=json.loads((SOURCE/'prior-lesson.json').read_text())
 lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 lesson['sourceIds'].append('streamlit-authentication')
 figures=json.loads((SOURCE/'figures.json').read_text())
 ids=['three','analogy','authentication','controls','session','industries','streamlit','record','negative']
 for lang in ['zh','en']:
  chunks=['']; fenced=False
  for line in (SOURCE/f'teaching.{lang}.md').read_text().splitlines(True):
   if line.startswith('```'):fenced=not fenced
   if line.startswith('## ') and not fenced:chunks.append(line[3:])
   else:chunks[-1]+=line
  assert len(chunks)==9
  sections=[]
  for index,chunk in enumerate(chunks):
   lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');paras=[];blocks=[];i=0
   if index==0:heading='登入後，還需要判斷哪些事？' if lang=='zh' else 'What must be checked after login?'
   def prose(value):
    if not blocks:paras.append(value)
    elif blocks[-1]['kind']=='step' and not blocks[-1]['paragraphs'] and 'code' not in blocks[-1]:blocks[-1]['paragraphs'].append(value)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
    else:blocks.append(dict(kind='prose',paragraphs=[value]))
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if index==8 and line.startswith('1. '):
     break
    if line.startswith('@figure'):
     blocks.append(figures[lang][int(line[-1])-1]);i+=1;continue
    if line.startswith('### '):
     blocks.append(dict(kind='step',id=f'{ids[index]}-{sum(b["kind"]=="step" for b in blocks)+1}',heading=line[4:],paragraphs=[]));i+=1;continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines) and lines[i].strip().startswith('|'):
      rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
     number=sum(b['kind']=='table' for s in sections for b in s.get('blocks',[]))+sum(b['kind']=='table' for b in blocks)
     captions=['三概念對照','合成理賠授權政策','三種權限模型','工作階段生命週期','跨產業比較','Streamlit 能力界線'] if lang=='zh' else ['Three responsibilities','Synthetic claims authorization policy','Three access-control models','Session lifecycle','Industry comparison','Streamlit capability boundaries']
     blocks.append(dict(kind='table',caption=captions[number],headers=rows[0],rows=rows[2:]));continue
    if line.startswith('```'):
     values=[];i+=1
     while i<len(lines) and not lines[i].startswith('```'):values.append(lines[i]);i+=1
     i+=1;blocks.append(dict(kind='step',heading=('候選安全規格' if index==7 else '讀取與匯出 API')if lang=='zh' else ('Candidate security specification' if index==7 else 'Read and export APIs'),paragraphs=['示例尚未執行，不代表已實作安全控制。'if lang=='zh' else 'This example has not been executed and does not establish implemented controls.'],code='\n'.join(values).strip()));continue
    value=[]
    while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
    prose('\n'.join(value).removeprefix('> '))
   sections.append(dict(id=ids[index],heading=heading,paragraphs=paras,**({'blocks':blocks}if blocks else {})))
  sections[-1]['paragraphs'].append('系統必須在真正存取資源的地方，判斷現在是否允許這個人執行這個動作；這是從個人原型走向安全多人系統的門檻。' if lang=='zh' else 'At the actual resource-access point, decide whether this person may perform this action now. This is a necessary step from a personal prototype toward a secure shared system.')
  for section in sections:
   if section['id']=='controls':section['sourceIds']=['owasp-authorization']
   if section['id']=='session':section['sourceIds']=['owasp-session']
   if section['id']=='streamlit':section['sourceIds']=['streamlit-authentication']
  lesson['text'][lang]['sections']=sections
 # The bilingual specification keeps the exact source template and its full translation together.
 templates=[next(b for s in lesson['text'][lang]['sections'] if s['id']=='record' for b in s['blocks'] if b.get('code')) for lang in ['zh','en']]
 shared='\n\n'.join(b['code'] for b in templates)
 for b in templates:b['code']=shared
 # Three new question identities preserve historical question meaning and attempts.
 prompts={
 'zh':[
 ('B 律師將案件網址中的 Y 改成 X，伺服器卻直接回傳 X 的內容。最主要是哪一類安全問題？',['Authentication 缺失','Authorization 缺失','Session Timeout 過長','Cookie 格式錯誤'],['B 已登入；此情境的主要問題是資源授權。','伺服器沒有確認 B 是否有權查看案件 X，造成水平越權。','調短逾時不會補上對案件 X 的授權檢查。','Cookie 格式不能決定 B 是否有權查看 X。'],1),
 ('C 行政人員已登入系統，卻不能下載某份文件。這一定代表系統有問題嗎？',['一定有，登入就應允許下載','不一定，可能是正確的授權限制','一定是 Session 失效','一定是 HTTPS 沒有啟用'],['登入只確認身分，不授予所有下載權限。','必須依 C 與該文件的授權關係及下載動作判斷。','僅從無法下載，無法推定 Session 已失效。','無法下載不能直接證明 HTTPS 狀態。'],1),
 ('A 離職後，原本建立的有效工作階段仍可繼續讀取案件。你最應優先檢查哪個設計？',['UI 配色','檔案命名','Session 及授權撤回機制','網頁響應式排版'],['配色不會撤銷既有工作階段。','檔名不會阻止已撤權者存取。','檢查離職事件是否撤回權限、失效相關工作階段，並在存取時重新核對。','排版不會實作撤權或工作階段失效。'],2)],
 'en':[
 ('B changes Y to X in the case URL and the server returns X. What is the principal security problem?',['Missing authentication','Missing authorization','Excessive session timeout','Incorrect cookie format'],['B is logged in; resource authorization is the primary issue.','The server failed to check permission for case X, enabling horizontal privilege escalation.','A shorter timeout cannot supply the missing case authorization check.','Cookie format does not establish permission for case X.'],1),
 ('C is logged in but cannot download a document. Does this necessarily indicate a fault?',['Yes; login must allow downloading','No; it may be correct authorization enforcement','It must mean the session expired','It must mean HTTPS is disabled'],['Login establishes identity, not every download permission.','Check C’s relationship to the document and the requested download action.','A denied download alone does not establish an expired session.','A denied download does not establish HTTPS status.'],1),
 ('After A leaves the firm, an existing session can still read cases. Which design should you inspect first?',['Interface colors','File naming','Session and permission-revocation mechanisms','Responsive layout'],['Colors do not revoke existing sessions.','File names do not prevent access after permission withdrawal.','Check permission withdrawal, invalidation of relevant sessions and fresh checks at access time.','Responsive layout does not implement revocation or session invalidation.'],2)]}
 lesson['checks']=[]
 for i in range(3):
  check=dict(id=f'AASE-M06-C05-Q{i+4:02}',answer=prompts['zh'][i][3],text={})
  for lang in ['zh','en']:
   prompt,options,rationales,answer=prompts[lang][i];assert answer==check['answer'];check['text'][lang]=dict(prompt=prompt,options=options,rationales=rationales)
  lesson['checks'].append(check)
 return lesson
if __name__=='__main__':
 output=ROOT/'content/aase/lessons/aase-m06-c05.json';data=json.dumps(generate(),ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert output.read_text()==data,'lesson differs from manuscripts'
 else:output.write_text(data)
 print('PASS: complete bilingual M06-05 manuscripts synchronized.')
