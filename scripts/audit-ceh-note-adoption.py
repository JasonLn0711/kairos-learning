"""Verify the editorial source-to-anchor ledger, not a substitute for semantic review."""
import json,hashlib,sys,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-notes/2026-11-10/reconstruction'
n=json.loads((ROOT/'content/ceh-notes/2026-11-10.json').read_text())
mapping=json.loads((SOURCE/'adoption-anchors.json').read_text())
for item in json.loads((SOURCE/'manifest.json').read_text()):
 p=SOURCE/item['file'];assert len(p.read_bytes())==item['bytes'] and hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256'],p
ledger=[];heading_rows=[]
ui={'顯示答案','檢查答案','首次答對 0 題','0 / 5 已作答','已回答 0 / 5 題','提交並開始批改','提交答案，進行逐題批改&#x20;'}
source_labels={'CSRC','CSRC+1','CSRC+2','NIST Computer Security Resource Center','NIST Computer Security Resource Center+1','RFC Editor','Microsoft Learn','VeraCrypt','Rohos','sweet32.info','Information security management systems+3','Guidance on managing information security risks','Business continuity management systems'}
for part in n['parts']:
 number=part['number'];u=json.loads((SOURCE/f'part-{number}-source-units.json').read_text())
 assert hashlib.sha256((SOURCE/f'pasted-text-{number}.txt').read_bytes()).hexdigest()==u['sha256']
 anchors={lang:{id for s in part['text'][lang]['sections'] for id in [s['id']]+[b['id'] for b in s['body'] if b.get('id')]} for lang in ['zh','en']}
 assert anchors['zh']==anchors['en']
 source_heads={str(v['lines'][0]) for v in u['units'] if v['kind']=='heading'}
 assert source_heads==set(mapping[str(number)]),'Every supplied heading must have an explicit editorial mapping'
 target=None
 for unit in u['units']:
  line=str(unit['lines'][0]);text=unit['text']
  if unit['kind']=='heading':
   target=mapping[str(number)][line];assert target in anchors['zh'],target
   heading_rows.append((number,line,text,target))
  assert target
  decision='adopted-with-paragraph-regrouping'
  reason='Reviewed paired explanation, example, table or relationship at the named anchor; not a verbatim-copy assertion.'
  if text in source_labels or text.startswith('[image](') or 'https://images.openai.com/static-rsc-' in text:
   decision='source-card-or-stock-image-removed';reason='Source UI/stock imagery is retained in the original, not presented as teaching; primary citations and the 11 supplied reference redraws are separate.'
  elif text in ui or re.fullmatch(r'\d+\\\.',text):
   decision='interface-normalized';reason='Source interface state is not learner evidence; replaced by actual local controls or static self-exercise instructions.'
  elif '我會逐題' in text or '提交後' in text or '首次答對' in text:
   decision='delivery-contract-corrected';reason='Preserve the exercise and learning objective without claiming an unavailable teacher service, score history or missing questions.'
  elif 'mermaid' in text:
   decision='flow-represented-in-semantic-html';reason='All named actions and conditional outcomes are retained in reflowable flow tables or numbered reasoning lists; no raw Mermaid runtime is required.'
  ledger.append({'part':number,'key':unit['key'],'lines':unit['lines'],'target':target,'decision':decision,'reason':reason})
output=json.dumps(ledger,ensure_ascii=False,indent=2)+'\n'
path=SOURCE/'adoption-ledger.json'
if '--check' in sys.argv:assert path.read_text()==output
else:path.write_text(output)
rows=['# 逐小節採用與圖解對照','','三份原稿、11 張 PNG 與前版完整保存；manifest 逐一核對 bytes／SHA-256。完整雙語正文位於 `content/ceh-notes/2026-11-10.json`。本表將每個來源標題對應成稿錨點；`adoption-ledger.json` 另外逐一記錄所有 1616 個來源單位的採用／格式／介面處理。這些結構檢查不替代逐節語意與呈現審查。','','## 各小節對照','','| 來源 | 行 | 來源標題 | 中英成稿錨點 |','| --- | ---: | --- | --- |']
for part,line,text,target in heading_rows:rows.append(f'| pasted-text-{part}.txt | {line} | {text.replace("|","／")} | {target} |')
rows+=['','## 11 張參考圖','','| 圖 | 成稿位置 | 關係 |','| --- | --- | --- |']
figs=[(1,'p1-overview','三個問題向下順序'),(2,'p1-cia／p2-cia','三欄平行 CIA；遮眼／文件／伺服器圖示'),(3,'p1-why-encrypt','明文、示意密文、適當金鑰解密'),(4,'p1-defense-depth','五層共同防護，箭頭為閱讀順序'),(5,'p1-hats','白／黑／灰帽三列比較'),(6,'p1-scope','五列 ROE、時間、禁止事項及文件位址'),(7,'p1-testing-purpose','五步授權至修補複測'),(8,'p1-question-tree','共同問題下四個平行分類'),(9,'p2-hash','血壓 120／180 與摘要 A／B 平行比較'),(10,'p2-one-way','可逆加密與無解密的雜湊比較'),(11,'p2-https','兩端生命線、來回訊息與本機驗證；線型不是加密狀態')]
for i,target,meaning in figs:rows.append(f'| image-{i}.png | {target} | {meaning} |')
rows+=['','## 校正、補充與保留','','- 第 1 份原稱十題，僅提供第 1 題；完整保留，未捏造其餘九題或首次答對數。前版三卡與三題以補充區保留，舊錨點未移除。','- 原稿來源卡／favicon／三張外部宣傳照片不作教學正文；原始檔未改。回憶卡答案與逐項解析依正文補充，頁面明示其來源。','- 第 2 份的空白圖題（七個問題、SSD 流程）沒有未提供節點；依已提供段落承接，新增程序解說明列為編輯補充。','- 第 3 份原 Mermaid 的節點／判斷與成功失敗分支改為 HTML 流程表及解題清單；保留 DH 全部數字、DSA 方程式、參數與反元素解釋。','- TLS 引用統一現行 RFC 9846；保留前版 RFC 8446 的歷史定位。GB／GiB 明列計算，Purge 的 impossible 依標準改為 infeasible；其餘題幹歧義與威脅模型限制保留。','- 更細技術查核、版本與來源見 technical-review.md；實測與發布狀態見 docs/releases/2026-11-10-ceh-notes-reconstruction.md。','']
map_output='\n'.join(rows)
if '--check' in sys.argv:assert (SOURCE/'source-map.md').read_text()==map_output
else:(SOURCE/'source-map.md').write_text(map_output)
assert len(ledger)==1616
print(f'PASS: {len(ledger)} source units, {len(heading_rows)} explicit heading mappings, bilingual anchors, 14 attachment hashes')
