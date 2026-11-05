# M04-05 完整替換來源

完整原稿 pasted-text-1.txt、三張 PNG 逐位元組保存，sha256.json 記錄雜湊；before.json 與 teaching.*.md、before-answer.*.md 保存替換前版本。現行採納稿在上一層 teaching.*.md、answer.*.md。

採納 v1.1.0、revision 3；保留原發布日 2026-11-05。38 個章／小節、9 表、37 個程式／文字區塊及三題情境題完整呈現，中英使用同一錨點。主標題、目錄、搜尋與相鄰課次使用 M04-05，stable ID 保留 CEH26-M04-C05，正式 slug 不變。

中文相對供稿僅有四種明列調整：主標題移除 CEH 前綴；移除引用 URL 的 utm_source 追蹤參數；三個 chatgpt-content-reference／sandbox 下載標記替換為正式雙語圖解；結尾「我會…評估」改為靜態文章的作答後展開參考答案提示。其餘原文、數字、命令、章節與順序保留。首個 Markdown H1 由頁面主標題承接，粗體／行內 code 由受限文字模型呈現；未將來源改寫成章級摘要。英文為完整對應翻譯，保留同樣例子、表格、命令、教學關係與判斷界線。

圖 1 參照 image-1.png：NetBIOS、SMB、RPC 三卡平行與底部證據邊界。圖 2 參照 image-2.png：Microsoft RPC／ONC RPC 兩卡並列與 NFSv4.1 例外。圖 3 參照 image-3.png：五階段與向右箭頭，底部停在第 2 關。HTML 依容器寬度改直排、箭頭向下；SVG 保留橫排。與參考圖差異：將長說明合併為可換行文字，不重現 PNG 的逐列固定座標；完整保留比較分組、範例、失敗階段與例外。圖說補明認證時機及固定端點等例外，避免把圖當成每次必要流程。

diagram-models.json 共用於 HTML、搜尋與 SVG；rpc-diagram-groups.json 限定三種已知圖的分組，未引入任意標記。SVG 沿既有 sanitizer。維護依序執行 ceh26_m04_c05_content.py、ceh26_m04_c05_diagrams.py，兩者支援 --check。

2026-11-05 回讀 Microsoft Finding Endpoints、nbtstat、RPC Security Essentials 與 RFC 8881 §2.9.3：確認 TCP／具名管道、固定／動態端點、大小寫選項及 NFSv4.1 預設 2049 與不依賴 rpcbind 的尋址。來源既有引用保留；沒有對主機執行遠端查詢，本文所有測試紀錄為教學合成資料。參考解答為編輯新增，qa=[]，沒有新增學員作答或完成主張。

驗證及部署另見 [發布回執](../../../releases/2026-11-05-ceh26-m04-c05-full-replacement.md)。
