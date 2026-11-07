# M04-03 完整白話教學抽換來源

使用者於 2026-11-05 指定以本目錄原文抽換 M04-03，並提供兩張參考圖；公開標題使用 M04-03，內部 CEH26-M04-C03 與短網址保留。

- pasted-text-1.txt、image-1.png、image-2.png：完整原始附件，sha256.json 核對逐位元組來源。
- before.json：修訂前 v1.0.1 教材；上層目錄保留舊雙語稿、圖解與 ZIP，Git 保留發布歷史。
- teaching.zh-TW.md、teaching.en.md：完整中英公開稿；十一章、第二部分標記、重點整理及理解檢核均保留。
- answer.zh-TW.md、answer.en.md：兩組情境的五段編輯參考答案；預設收合，不代表收到學習者作答。
- diagram-models.json：兩圖雙語共用資料，供 HTML、搜尋與四個下載 SVG 使用。原稿暫存下載連結由正式圖解取代。

圖 1 上半部保留 FTP 用戶端／伺服器及控制／資料雙向通道，下半部保留寄件者 → 提交伺服器 → 收件方伺服器，連線標記 587／465 與 25。控制與資料是兩種連線角色，雙向箭頭不表示連線建立方向；主動／被動模式由正文解釋。圖 2 保留觀察、完成、尚不能推論三張並列卡與證據公式，沒有把三張卡畫成網路操作順序。桌面保留關係，手機依分組重排；淺藍／綠／橘配色沿參考圖，字體沿站內設定。

依 WRITE-06，新增完整教學範圍升 v1.1.0，原發布日 2026-11-04 保留；目前版本修訂日 2026-11-05。圖解只接受四個固定來源路徑，沿既有 visual 結構；固定幾何與文字跳脫後經 m0903_svg sanitizer。沒有任意 HTML／SVG、事件或外部影像。

執行 `python3 scripts/ceh26_m04_c03_content.py --check` 及 `python3 scripts/ceh26_m04_c03_diagrams.py --check` 核對全文與圖檔。[編輯處理](editorial-notes.md)及[發布回執](../../../releases/2026-11-05-ceh26-m04-c03-replacement.md)分開記錄來源採用、本機驗證與正式回讀。

[Planning 連接與 ownership](../../../releases/2026-11-05-ceh26-m04-c03-replacement.md#planning-closeout-2026-11-05)將此來源連至正式回執、日／週紀錄及網站／CEH 專案；Planning 不複製原稿，也不把教材發布當成學習完成。
