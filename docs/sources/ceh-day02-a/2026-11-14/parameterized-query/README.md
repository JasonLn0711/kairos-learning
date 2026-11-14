# Day02-A 參數化查詢完整補充來源

2026-11-14供稿；原文`pasted-text-1.txt`及參考圖`image-1.png`保持原樣，SHA256SUMS記錄原始位元組。`published-v1.1.0.json`保存補充前正式模型。公開正文使用一般教學語氣，版本升為1.2.0／revision 4，原發布日、13章、舊錨點與每個既有正文區塊保留。

## 逐節採用

本補充放在第七章SQL Injection原理解說「這叫作 Code/Data Separation」正下方，原有CEH解題提醒仍在補充之後。所有八節、四個細分小節、16段程式／SQL／輸出、兩表、兩道開放題進入正式正文，不以原稿下載代替。

| 原文 | 成稿錨點 | 採用內容 |
| --- | --- | --- |
| 開頭核心概念 | p1-binding-intro | 指令與資料分離及防禦用途 |
| 一、生活案例 | p1-binding-section-01 | 銀行櫃員、正常與惡意輸入及兩種設計 |
| 二、程式碼 | p1-binding-section-02 | 拼接完整片段、SQL逐字表、OR恆真與完整查詢 |
| 惡意內容分支 | p1-binding-subsection-01 | 相同payload改變查詢條件的推導 |
| 三、參數化 | p1-binding-section-03 | execute兩個參數、固定SQL、佔位符及tuple |
| 關鍵差異 | p1-binding-subsection-02 | 圖8上下對照、安全組SQL與參數並列、精確字串比較及driver責任 |
| 四、Python細節 | p1-binding-section-04 | API及資料表前置條件 |
| 問號 | p1-binding-subsection-03 | 兩個位置參數、具名參數、不同driver的%s |
| 逗號 | p1-binding-subsection-04 | 字串括號與單元素tuple的區別 |
| 五、動手驗證 | p1-binding-section-05 | 記憶體SQLite、兩筆假資料、完整可執行程式及兩行預期輸出 |
| 六、特殊字元 | p1-binding-section-06 | O'Brien合法姓名、allowlist識別字、認證及授權界線 |
| 七、考試對應 | p1-binding-section-07 | 四列對照與其他注入類比的適用界線 |
| 八、理解檢核 | p1-binding-section-08 | f-string程式及兩道未公布答案的開放問題 |

`line-adoption.json`涵蓋原文首行標題以外168個非空來源行，記錄來源位置、成稿錨點及處置；標題在新增補充導言保留。`adopted-body.json`是實際插入正式JSON的正文；測試逐區塊比較並核對舊版全部區塊仍依序存在。

## 編輯修正與執行條件

`code-repairs.json`記錄六段黏合程式的原文、換行／縮排修復與理由，保留查詢與資料語意。`editorial-replacements.json`記錄學位標籤改為一般用語，以及對話式批改承諾改為靜態自我檢核。來源匯出的favicon及來源卡移除，官方來源沿正式sources記錄。原稿始終保留。

另外明列：片段假設已有cursor；雙參數例假設users有age欄位，與完整範例username／role資料表分開；完整程式存成parameterized_query_demo.py後以python3執行，僅記憶體資料庫、兩筆假資料與自行保存的程式檔。AI／命令／範本注入僅為信任邊界類比，不宣稱SQL參數化能完整防禦。既有40／30／15／15是前一份四重點供稿的閱讀配置，非新增後整頁字數或官方配分。兩題與原五題、四道選擇題及缺件23題分列，不建立提交、批改或學習完成狀態。

## 參考圖重繪

`figure.json`固定六項資料。上方SQL片段及惡意輸入依序排列，以紅色向下箭頭連至查詢邏輯改變；下方SQL結構與同一輸入左右並列，綠色向下箭頭連至資料值比較。手機保持兩項同組並依DOM順序上下重排，不在兩項之間加先後箭頭。原圖的灰色程式底、水平分隔、紅／綠結果語意保留；補上片段說明與綁定解說。正文是可選取HTML；下載SVG由同一模型與受審核serializer生成，原PNG留在來源。

## 技術查核與重跑

Python官方sqlite3文件核對位置／具名參數與單元素tuple；Psycopg官方文件核對%s由driver綁定；OWASP SQL Injection Prevention Cheat Sheet核對參數化與識別字allowlist。查核日2026-11-14，沿正文sources連結，不沿用來源卡顯示的Python版本作驗證環境。

`python3 scripts/ceh_day02a.py --check`核對正式模型、採用紀錄及八SVG。`python3 scripts/check-day02a-parameterized.py`直接取正式正文程式：完整程式輸出不安全兩列／參數化零列；另驗正常查詢、兩個位置／具名參數、tuple、f-string、O'Brien及確實存在的SQL形姓名。所有資料在記憶體，沒有外部系統。`example.py`與正文完整程式一致。

完整結果及正式回讀見[發布回執](../../../../releases/2026-11-14-ceh-day02-a-parameterized.md)。
