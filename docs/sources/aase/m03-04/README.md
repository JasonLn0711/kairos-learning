# M03-04｜MVP、範圍與不做清單來源索引

- [2026-11-11 十節與六圖抽換](replacement-2026-11-11/source-map.md)：完整供稿、六張原圖、前版、雙語成稿、圖意與逐節採用對照。
- [本次來源與編輯核對](replacement-2026-11-11/source-review.md) · [本次驗證與發布回執](../../../releases/2026-11-11-aase-m03-04-six-figures.md)。
- [2026-11-09 前次抽換](replacement-2026-11-09/source-map.md)：兩圖版本與原始來源維持保存。

六圖的固定模型依序是 flow 5、cards 2、cards 3、cards 4、cards 5、flow 6。aase.ts 驗證節點種類／數量；MvpScopeDiagram 從已驗證的圖形推導版型，沿用共用呼叫介面。圖 5 的是／否在同一替代分支群組，整組再連向共同確認，手機不把是 → 否串接。圖 3 是並列範圍；圖 4 的錯誤與正確是處理比較。SVG 由 aase_m0304_svg.py 同源生成／核對。

AaseProse 將供稿小節標題、引文、清單與 HTTPS 連結呈現為語意 HTML。舊 comparison 錨點保留在四名詞標題；其他舊章節錨點維持。七表與完整 problem.md 的中英結構一致，英文另逐欄解讀共用 code；Q05–Q08 為物流開放題與原生參考解析，不建立提交／評分／學習狀態。

修改雙語稿或 figures.json 後，執行 `python3 scripts/aase_m0304_content.py`、`python3 scripts/aase_m0304_svg.py`；兩者均支援 `--check`。專屬測試為 `tests/aase-m0304-six-figures.test.ts`、`playwright.aase-m0304.config.ts`，正式站使用 `AASE_BASE_URL`。完整規則、實測範圍與待驗事項以發布回執為準。

2026-11-11 正式狀態：v1.2.0／revision 5 已發布；中英正式站與十二份 SVG 已回讀核對。真人理解與實體手機驗收維持未執行。
