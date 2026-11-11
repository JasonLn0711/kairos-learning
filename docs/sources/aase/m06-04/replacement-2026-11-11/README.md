# M06-04 供稿抽換來源紀錄

原始供稿與四張 PNG 逐位元保存；prior-lesson.json 保存編輯前正式資料。SHA256SUMS 核對來源與前版。

正本擁有者：kairos-learning。範圍為 AASE-M06-C04，正式網址沿用 /courses/aase/v1/m06/concepts/m06-04/；原發布日 2026-11-05 保留。其他章節進行中修改保留。

## 已採用的完整內容對照

| 原稿 | 正文目標 | 必須保留 |
| --- | --- | --- |
| 導言、一 | introduction、analogy | 按鈕背後工作、牛肉麵訂餐、六步概念流程及限制 |
| 二 | roles | 五角色餐廳類比表、HTTP/API差別、API不限REST |
| 三 | http | Request四部分、完整POST與201回應、五種Method表、建立與煮好差別 |
| 四 | outcomes | 200加success:false、422選項、三層結果、八個狀態碼 |
| 五 | streamlit | 不推定/api/check、可執行Python排版、HTTP/WebSocket、兩條架構、函式與網路邊界 |
| 六 | validation | 四個驗證邊界、八位數統編、stale data、修改使驗證失效與匯出重驗 |
| 七 | applications | 六產業案例與Agent結果回查 |
| 八 | record | F12/Network、合成orders與session、四種觀察欄位、敏感資料界線 |
| 九 | synthesis | 五個架構分析問題、architecture.md |
| 十 | understanding | 三題全部選項、答案與解釋，以既有靜態檢核呈現 |

## 圖解設計

1. image-1：六節點五箭頭表示概念順序，末端結果區清楚標示；不是實測封包。
2. image-2：三個平行判讀層次；不畫成保證成立的因果鏈。
3. image-3：自訂HTTP API與Streamlit兩條獨立架構；不把程序內validate()畫成HTTP端點。
4. image-4：Developer Tools模擬紀錄，orders 200/fetch與session 101/websocket；明示不是網站擷取證據。

## 編輯修正與下一關

原稿Streamlit程式碼因貼上而失去換行，正文恢復Python縮排。移除來源卡favicon與「提交答案並請你批改」的對話介面殘留；保留三題本身與全部選項。原稿網址m04→m06的更正留在來源紀錄，正式課次使用M06-04。

目前狀態：source preserved、正文與完整雙語已採用；本機驗證通過。發布狀態由[發布回執](../../../../releases/2026-11-11-aase-m06-04-replacement.md)記錄。

## 實際採用與逐節核對

`teaching.zh.md` 保留原文的十節與導言，`teaching.en.md` 為相同深度的完整英文；`figures.json` 保存從原圖移入的節點、說明與 Network 資料格，`checks.json` 保存原三題題目與十二個選項，並增加逐選項解析。產生器依原稿順序交錯正文、程式、表格與圖解；原有 roles、analogy、http、streamlit、validation、record 六錨點全部保留。完整選項移至既有 checks 區，使用新 Q04–Q06，避免沿用舊題 ID 語意。

逐節閱讀原稿與成稿後確認：第一節六步完整，第二節五角色與 HTTP/API/REST 區別完整，第三節兩個 HTTP 訊息、四個請求部分及五方法完整，第四節 200/false/422、三層判讀與八狀態完整，第五節範例與兩架構完整，第六節四邊界與舊結果失效案例完整，第七節六產業與 Agent 回查完整，第八節 F12、四觀察欄位及模擬表完整，第九節五問題與 architecture.md 完整，第十節三題全部選項進入正式檢核。導言與章末結論保留。雙語段落、表格、例子、限制與答案逐節對應；英文程式保留中文 UI 識別字並解釋標籤。

技術補充：加入 Streamlit 本機執行、預期結果及清理；101 為 HTTP/1.1 升級示意而非任務成功；文件／程式／觀察分層記錄。MDN HTTP 概覽與狀態表、Streamlit 架構、OWASP Input Validation 於本次查核；採用網址見正式 sourceIds。這些補充與原文保存分開，不改寫來源檔。

圖解差異：圖一保留六步與末端綠底，圖二保留無箭頭的三平行層次；圖三將原圖的行內鏈展為兩條獨立四節點鏈，手機各自轉直排；圖四保留 Developer Tools、標籤與兩列合成記錄，頁籤是靜態示意，沒有虛構互動。下載 SVG 的裝飾簡化，所有標籤、順序、箭頭與限制與 HTML 同源；不將固定尺寸 SVG 縮小當成手機文字。

## 維護與驗證

- `python3 scripts/aase_m0604_content.py --check`：成稿與正式 JSON 同步。
- `python3 scripts/aase_m0604_svg.py --check`：八份 SVG 與同源資料同步、固定元素及屬性白名單、小於 100000 bytes。
- `tests/aase-m0604-replacement.test.ts`：身份、舊錨點、表格內容、原始選項、搜尋同源、錯誤關係／多餘節點／markup／偽 Network 值拒絕、draft/future 閘門、Python UI stub 四分支。
- `pnpm exec playwright test --config playwright.aase-m0604.config.ts`：兩語全文順序、表格與程式、原題、四尺寸／200%、鍵盤、無 JS、搜尋與八圖下載、SVG 字框與重疊。正式站指定 `AASE_BASE_URL=https://learn.cs-kairos.com`。

來源 SHA256SUMS 僅列原始供稿、四 PNG 與前版；成稿與衍生檔由可重現產生器檢查。實測細節、Git 與 Pages 執行由發布回執承接。未執行真人學習、實體手機、實際 Streamlit 封包觀察；模擬範例不宣稱為環境執行證據。
