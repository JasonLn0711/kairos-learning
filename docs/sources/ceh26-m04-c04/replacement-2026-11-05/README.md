# M04-04 全文抽換來源

2026-11-05 使用者要求以本目錄完整原稿抽換 M04-04，並參考兩張隨文圖示。原始附件逐位元組保存，雜湊見 sha256.json；公開稿的格式與技術校對見 [編輯紀錄](editorial-notes.md)。

- pasted-text-1.txt：完整提供原文，含十一章、表格、指令、理解檢核與原始引用。
- image-1.png：Transport、Negotiate、Session Setup、Tree Connect、File Operation 五階段流程；每階段各有已確認結果與推論界線。
- image-2.png：觀察／能確定／不能直接推論三欄五列；底部區分能力、政策與實際使用。
- teaching.zh-TW.md、teaching.en.md：完整配對公開稿。answer.zh-TW.md、answer.en.md 為四題編輯參考解答。
- diagram-models.json：兩圖雙語共用資料；頁面文字、搜尋及四個下載 SVG 由相同資料產生。

讀者可見課次使用 M04-04，內部 stable ID 保留 CEH26-M04-C04。原稿 ChatGPT 控制標記與 sandbox 暫存連結由正式圖解取代。參考 PNG 保留來源用途，不直接縮小當作手機正文。圖 1 保留五階段順序、編號、箭頭與判讀界線；圖 2 保留三欄五列比較及底部規則。深藍底、淺藍標示、綠色確認與紅色推論限制沿參考圖，頁面字體沿站內設定；窄欄依序重排。

舊版完整稿保留在上層目錄，Git 歷史保留原發布。新版 v1.1.0 增加教學範圍，原發布日 2026-11-05 不變。執行 `python3 scripts/ceh26_m04_c04_content.py --check` 核對生成結果。[驗證與發布回執](../../../releases/2026-11-05-ceh26-m04-c04-replacement.md) 分開記錄本機與正式站證據。
