# M03-07｜Nmap 完整供稿替換

目前版本 v1.1.0、revision 2；原發布與版本修訂日期均為 2026-11-03（Asia/Taipei）。正文涵蓋十章、理解檢核及所有供稿小節，兩語各 31 個標題、17 個程式／輸出區塊，保留四個原生收合參考答案。

- `supplied-2026-11-03.zh-TW.md`：逐位元保留的使用者供稿。
- `archive-v1.0.0/`：替換前的雙語正文與 JSON；原始 Git 歷史保留。
- `editorial-changes.json`：逐項記錄來源頁面介面殘片、表頭、服務指紋課次、OS 掃描範圍及實驗步驟修正。單元測試依此重建全文，比對供稿是否遺漏。
- `detailed-section-map.json`：31 個雙語章節／小節的標題與穩定錨點；h2 為 heading，h3 沿用帶 id 的 paragraph。
- `M03-07-teaching.*.md`：目前完整雙語教材；`M03-07-answers.*.md` 保留四題答案。
- `diagram-models.json`：四張雙語圖的共用資料。流程圖表達授權至核實順序；來源位置保留共同目標與獨立路徑、掃描層次用資訊細化流程、證據類別用比較卡，保留條件，不把獨立情境畫成流程。

使用者提供的分享頁已透過直接 HTTP 讀取取得三張圖的原始結構，保存在 `reference-figures.txt`，僅截取教學圖標記，不保存分享頁的帳戶、遙測或其他資料。圖 1 保留四步流程；圖 2 保留兩個來源指向同一 NAS、內網實線與外部可能過濾的虛線；圖 3 保留三層資訊與細化箭頭。手機以可換行文字重排，外部探測的虛線不宣稱封包已抵達 NAS。原暫存截圖不在本機；分享頁中的圖結構已足供此次重製與核對。

重製與驗證：依序執行 `python3 scripts/m0307_content.py`、`python3 scripts/m0307_diagrams.py`；兩者皆支援 `--check`。執行內容、單元、型別、發布邊界及 release 檢查後，以 `npx playwright test --config playwright.m0307.config.ts` 檢查雙語四尺寸、200% 文字、鍵盤、無 JavaScript、SVG 幾何及下載位元組。正式站使用 `CEH_BASE_URL=https://learn.cs-kairos.com`。

官方 Nmap 文件於 2026-11-03 核對。網站範例輸出保留為示例；另在本機以 Ubuntu 套件的 Nmap 7.94SVN 執行 TCP 8000／8001 loopback smoke，觀察服務停止前後 open→closed，兩組原始文字／XML 與工具版本留於忽略的 `.local/m0307/lab/`。此檢查只證明本機範例，不代表 NAS、防火牆、Tunnel 驗收或學習完成。

[本次修訂與驗收回執](../../releases/2026-11-03-m03-07-replacement.md)接續[初版回執](../../releases/2026-11-03-m03-07.md)。
