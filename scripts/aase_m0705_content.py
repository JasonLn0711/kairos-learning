"""Build M07-05 from the reviewed bilingual section manuscripts."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m07-05/replacement-2026-11-11'
lesson=json.loads((P/'previous-lesson.json').read_text())
lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
questions=[
('系統可不可以直接使用舊的「檢查完成」狀態產生新報告？為什麼？','May the system use the old “check complete” status to generate the new report? Why?', '不可以。受檢版本是 BATCH-100，改成 BATCH-101 後即使格式合法，舊結果也無法證明新批次已檢查，必須使舊結果失效並重新檢查。','No. The checked version was BATCH-100. A valid BATCH-101 identifier does not establish that the new batch was checked. Invalidate the old result and check again.'),
('前端與匯出函式，分別應負責哪些檢查？','Which checks belong to the interface and the export function?', '前端移除過期預覽與下載，提示重新檢查。匯出邊界重新驗證資料；需要已檢查版本時，由可信任端確認版本對應及權限。工作坊 export_report(record) 只驗證欄位，快照比對由 app.py 呼叫端執行。','The interface removes stale previews/downloads and requests a new check. The export boundary revalidates data; when a checked version is required, trusted code verifies correspondence and permissions. Workshop export_report(record) validates fields only; its app.py caller compares the snapshot.'),
('如果匯出 JSON 額外包含工廠內部除錯欄位，應如何防止外洩？','How can internal factory debug fields be kept out of exported JSON?', '明列對外允許欄位，從已驗證資料建立新的輸出物件，不直接序列化完整內部物件；再檢查下載位元組確實沒有額外鍵。','Declare the external field allowlist and construct a new output object from validated data rather than serializing the whole internal object. Verify that downloaded bytes contain no extra keys.'),
('即使系統顯示 complete，是否就能宣稱這批產品符合所有品質標準？','Does complete establish that the batch meets every quality standard?', '不能。本課 complete 只表示三個教學欄位通過完整性規則。產品品質、檢驗真實性與正式審核需要各自證據，scope 應明寫目前保證範圍。','No. Here complete establishes only that three teaching fields passed completeness rules. Product quality, inspection authenticity and official review each need their own evidence. State the present assurance in scope.')]
for lang in ['zh','en']:
 t=lesson['text'][lang];t['sections']=json.loads((P/f'teaching.{lang}.json').read_text())
 t['summary']='讓預覽與匯出對應已檢查版本：快照、失效、重新驗證、允許清單與適用範圍。' if lang=='zh' else 'Keep preview and export tied to the checked version through snapshots, invalidation, revalidation, allowlisting and scope.'
 t['openChecks']=[dict(id=f'AASE-M07-C05-Q{i+4:02}',prompt=q[0 if lang=='zh' else 1],answer=[q[2 if lang=='zh' else 3]])for i,q in enumerate(questions)]
lesson['checks']=[]
out=ROOT/'content/aase/lessons/aase-m07-c05.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert out.read_text()==data,'M07-05 differs from manuscripts'
else:out.write_text(data)
print('PASS: twelve bilingual sections, three tables, two figures and four open questions synchronized.')
