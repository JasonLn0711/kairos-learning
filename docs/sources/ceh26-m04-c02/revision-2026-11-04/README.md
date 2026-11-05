# M04-02 完整供稿抽換 v1.1.0

本次以 supplied.zh-TW.md 為主稿、reference-1.png／reference-2.png 為圖解參考。原檔逐位元組保存；archive-v1.0.0/ 保留正式站前一版雙語稿、解答、雜湊與教材 JSON。新版沿用 CEH26-M04-C02 與正式 m04-02 網址，原發布日 2026-11-04 不變。

## 原稿與採用

中文 teaching.zh-TW.md 由完整原稿加上 editorial-changes.json 明列改動產生。只移除對話自述、不可用的 sandbox 圖連結及追蹤參數；教學 FAQ 保留正文，qa 仍為空；末段的助理評估承諾改為讀者作答提示，合成題目明確標示。Markdown 標題、粗體、行內碼、清單與分隔線轉為既有語意模型。ASCII 圖與程式碼保留原行序及符號，不濃縮成章級摘要。

detailed-section-map.json 對應75個中英章／小節；其中11章、補充第12部分、全課總結及導論各有清楚入口。中文正文673個區塊、英文277個區塊；段落依自然語序整合，逐小節保留用途、原理、案例、命令、數字、表格與限制。兩語各12表、2圖及1個原生收合的四題參考解答。中文69段 code、英文51段 code；部分英文短範例整合在段落中，命令與資料角色保留。四題參考答案為編輯補充，不是學員作答或測驗成績。

`verify-ceh26-m04-c02.py` 獨立核對原稿加明列變更等於採用中文，並核對1162個中文／574個英文原稿單位進入教材的順序；包含程式碼行與表格各格。這項檢查證明來源至資料，瀏覽器另核對資料至頁面全文。

## 圖解與查核

- 圖1保留角色鏈、五組紀錄、四層證據與紀錄格式。授權卡仍保留，圖說與卡片明確說明每一階段均須事先確認授權；箭頭不表示探測後才確認授權。解析器可從快取回答，權威查詢是條件步驟。
- 圖2保留Cache／DNSSEC／DoH與DoT三欄比較、簡化查詢路徑、兩種保護範圍及AXFR／TSIG界線。三卡上下重排不產生相互轉送關係；DNSSEC保護DNS資料，不以鏈路加密表達。
- diagram-models.json 提供HTML、搜尋及SVG共同文字；src/lib/dns-diagram-groups.json 提供受限分組。頁面保留原生文字與容器重排；四個已知路徑才會啟用圖解元件。SVG由產生器經既有sanitizer輸出，保持viewBox限制；下載保留桌面分組，不作手機主要閱讀圖。
- 2026-11-04查核主要文件：[BIND dig／delv](https://bind9.readthedocs.io/en/stable/manpages.html)、[RFC9824](https://www.rfc-editor.org/rfc/rfc9824.html)、[RFC5936](https://www.rfc-editor.org/rfc/rfc5936.html)、[RFC4033](https://www.rfc-editor.org/rfc/rfc4033.html)。保留NOERROR／NODATA的情境界線、AXFR授權及DNSSEC不提供查詢保密性的說明。

維護：修改雙語稿與對照表 → `python3 scripts/ceh26_m04_c02_diagrams.py` → `python3 scripts/ceh26_m04_c02_content.py` → `python3 scripts/verify-ceh26-m04-c02.py` → 既有發布驗證與 `npx playwright test --config playwright.ceh26-m04-c02.config.ts`。前兩支支援 `--check`。正式站設定 CEH_BASE_URL，證據與本機分存。

正式回執見 [v1.1.0發布紀錄](../../../releases/2026-11-04-ceh26-m04-c02-full-replacement.md)。
