"""Generate M06-06 from the preserved bilingual manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m06-06/replacement-2026-11-11'
lesson=json.loads((P/'prior-lesson.json').read_text())
lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
figures={
'zh':[
('圖 1｜TLS 建立瀏覽器與伺服器間的保護','雙向連線符號表示兩端協商，不表示已完成業務授權。四步解說見下文。',[('你的瀏覽器','驗證伺服器憑證與網域身分'),('網站伺服器','提出憑證，參與金鑰交換與受保護通訊')]),
('圖 2｜TLS 終結後，下一段另行確認','箭頭表示資料傳輸方向；此為假想架構，未驗證正式部署。',[('顧客的瀏覽器','發起網站連線。\n→ ① HTTPS / TLS 加密'),('反向代理（Reverse Proxy）','例如 Nginx、負載平衡器；TLS 終結點：在這裡解密。\n→ ② 新的一段連線：需要另外確認保護方式'),('後端應用程式','處理會員、訂單及付款邏輯。\n→ ③ 另一段資料庫連線'),('資料庫','該段傳輸保護與存取控制需獨立確認')]),
('圖 3｜沿資料路徑檢查三個信任邊界','箭頭表示示例資料流；A／B／C 為跨界檢查位置，圖線本身不實作控制。',[('不受信任的外部輸入','使用者上傳文件、輸入表單、呼叫 API。\n→ 信任邊界 A'),('後端應用程式','驗證輸入型別、格式、大小、身分及操作權限。\n→ 信任邊界 B'),('內部敏感資料庫','執行資料存取權限及查詢限制。\n→ 信任邊界 C'),('對外匯出與分享','限制可輸出欄位、收件對象及資料範圍')])],
'en':[
('Figure 1 | TLS protects browser-to-server communication','The bidirectional connection represents negotiation between endpoints, not business authorization. Four explanatory steps follow.',[('Your browser','Verifies the certificate and server domain identity'),('Website server','Presents a certificate and participates in key exchange and protected communication')]),
('Figure 2 | Review each connection after TLS termination','Arrows indicate data transmission in this hypothetical architecture, not a verified production deployment.',[('Customer browser','Initiates the website connection.\n→ ① HTTPS / TLS encryption'),('Reverse proxy','For example Nginx or a load balancer. TLS terminates and data is decrypted here.\n→ ② Separate connection: protection must be confirmed'),('Backend application','Handles members, orders and payments.\n→ ③ Separate database connection'),('Database','Verify this connection’s protection and access controls independently')]),
('Figure 3 | Three trust boundaries along the data path','Arrows show example data flow. A/B/C mark checks across boundaries; drawing them implements no controls.',[('Untrusted external input','Uploaded documents, forms and API calls.\n→ Trust boundary A'),('Backend application','Validate type, format, size, identity and operation permissions.\n→ Trust boundary B'),('Internal sensitive database','Enforce data-access permissions and query restrictions.\n→ Trust boundary C'),('External export and sharing','Restrict output fields, recipients and data scope')])]
}
ids=['introduction','overview','channel','hops','secrets','boundaries','integration','record','understanding']
for lang in ['zh','en']:
 raw=(P/f'teaching.{lang}.md').read_text()
 # Fenced Markdown headings belong to the code block, not article sections.
 chunks=[];buf=[];fenced=False
 for line in raw.splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:chunks.append('\n'.join(buf));buf=[]
  buf.append(line)
 chunks.append('\n'.join(buf));assert len(chunks)==9
 sections=[];table=0
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');paras=[];blocks=[];i=0
  def prose(value):
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    number=int(line[-1]);cap,desc,items=figures[lang][number-1]
    blocks.append(dict(kind='cards' if number==1 else 'flow',caption=cap,description=desc,items=[dict(title=a,body=b)for a,b in items]));i+=1;continue
   if line.startswith('### '):
    following=lines[i+2].strip()
    special=following.startswith(('|','```','@figure','###'))
    blocks.append(dict(kind='step',heading=line[4:],paragraphs=[('以下逐項核對。' if lang=='zh' else 'Review each item below.') if special else following]));i+=1 if special else 3;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
    table+=1;blocks.append(dict(kind='table',caption=f'{"表" if lang=="zh" else "Table"} {table}',headers=rows[0],rows=rows[2:]));continue
   if line.startswith('```'):
    code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',heading='architecture.md' if n==7 else ('合成程式範例' if lang=='zh' else 'Synthetic code example'),paragraphs=['僅供教學的假資料與設計分析。' if lang=='zh' else 'Synthetic teaching data and design analysis only.'],code='\n'.join(code).strip()));continue
   value=[]
   while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
   prose('\n'.join(value))
  if not paras:paras=['本節以合成情境說明。' if lang=='zh' else 'This section uses synthetic scenarios.']
  if n==1:blocks.append(dict(kind='step',id='analogy',heading='三項責任一起核對' if lang=='zh' else 'Review three responsibilities together',paragraphs=['以醫院情境分辨通道、秘密與存取控制。' if lang=='zh' else 'Use the hospital example to distinguish channels, secrets and access controls.']))
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
 assert table==4
 lesson['text'][lang]['sections']=sections
# New scenarios receive new stable IDs; prior questions remain in the source snapshot.
lesson['checks']=[]
for i,answer in enumerate([1,2,2]):
 question=dict(id=f'AASE-M06-C06-Q{i+4:02}',answer=answer,text={})
 for lang in ['zh','en']:
  paragraphs=lesson['text'][lang]['sections'][-1]['paragraphs']
  start=next(j for j,p in enumerate(paragraphs) if p.startswith(f'第 {i+1} 題' if lang=='zh' else f'Question {i+1} |'))
  prompt=paragraphs[start];options=[re.sub(r'^[A-D]\. ', '', p)for p in paragraphs[start+1:start+5]]
  assert len(options)==4
  explanations=(
   [['HTTPS 無法證明所有內部通訊均加密。','憑證正確驗證時，保護限於指定 TLS 兩端。','員工資料權限需要獨立授權。','下載後的保存與加密需要另行控制。'],
    ['刪除程式碼無法撤銷已外洩的能力。','重新啟動不會使舊金鑰失效。','撤銷／輪替並調查影響，才能處理舊金鑰的風險。','HTTPS 不會阻止持有外洩金鑰者使用它。'],
    ['外部文件不能取得最高指令權限。','HTTPS 保護通道，無法使文件內指令取得授權。','把外部內容與工具授權分開，並檢查輸出與資料外傳。','.env 保管方式無法代替工具授權與資料控制。']]
   if lang=='zh' else
   [['HTTPS does not prove encryption of every internal connection.','With certificate verification, protection covers the specified TLS endpoints.','Employee permissions require separate authorization.','Retention and encryption after download need separate controls.'],
    ['Deleting code does not revoke a leaked capability.','Restarting does not invalidate the old key.','Revoke or rotate and investigate the impact of the exposed key.','HTTPS does not prevent someone from using a leaked key.'],
    ['External documents do not acquire highest instruction priority.','HTTPS protects transport, not the authority of document instructions.','Separate external content from tool authorization and validate output and data transfers.','.env custody does not replace tool authorization or data controls.']])
  question['text'][lang]=dict(prompt=prompt,options=options,rationales=explanations[i])
 lesson['checks'].append(question)
# Keep question wording in the existing check component, without a duplicate static copy.
for lang in ['zh','en']:
 section=lesson['text'][lang]['sections'][-1]
 section['paragraphs']=[section['paragraphs'][0],section['paragraphs'][-1]]
# The host contract keeps code byte-identical across locales.
for zh,en in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
 for a,b in zip(zh.get('blocks',[]),en.get('blocks',[])):
  if 'code' in a:
   if a['heading']=='architecture.md':
    b['paragraphs']=['The template records: (1) single-user local testing on 127.0.0.1, with production TLS and account authorization absent; (2) hypothetical Browser → HTTPS → Reverse Proxy, with proxy-to-backend and backend-to-database protection pending confirmation; (3) boundary A validates input format, length and content and requires production identity/permission checks, boundary B uses a least-privilege database account and restricts unnecessary access, and boundary C rechecks export authorization and excludes disallowed sensitive fields; (4) real keys stay out of source, production secret storage and its owner are named, and revocation, rotation and exposure response are planned; (5) TLS certificates/configuration, proxy/backend protection, database transport, authentication/authorization and log exposure remain unverified; (6) this is design analysis only, with no completed security test. The code below preserves the shared Traditional Chinese template.']
   b['code']=a['code']
out=ROOT/'content/aase/lessons/aase-m06-c06.json'
data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert out.read_text()==data
else:out.write_text(data)
print('PASS: bilingual nine sections, four tables, three figures and complete code examples')
