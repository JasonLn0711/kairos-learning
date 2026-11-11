# M05-02 供稿抽換｜2026-11-11

正本：本 repo，`content/aase/lessons/aase-m05-c02.json`。範圍：M05-02 全文九節、所有小節、三題理解檢核與五張隨文圖；既有其他章節修改保留。

## 原始來源

- `supplied.zh.txt`：使用者供稿逐位元組保存。
- `image-1.png`–`image-5.png`：五張參考圖逐位元組保存。
- `prior-lesson.json`：本次編輯前中英文教材。
- `manifest.json`：上述七個檔案的 bytes 與 SHA-256。
- `teaching.zh.md`／`teaching.en.md`：九節完整雙語編輯稿，由 `scripts/aase_m0502_content.py` 編譯到正式教材。

## 採用與差異

保留供稿的例子、表格、50 位模擬同時使用者／95%／2 秒示範值、合成資料限制、正常與異常 GWT、修改輸入後舊檢查失效、規格模板及三題選項。移除聊天介面的網站 favicon／來源卡殘留與「已找到正確教材」開場。將「提交答案並取得解析」改為原生參考解析，延用網站不提交、不記錄學習成績的契約。NASA Appendix C 的 TBR 確認為 To Be Resolved，原文保留。

## 逐節對照與圖意

| 供稿內容 | 正文錨點 | 保留範圍／呈現 |
| --- | --- | --- |
| 開場四類需求與 SDD | introduction | 使用者目的與完成條件的差距；四個名詞 |
| 一、餐廳點餐 | analogy | 午餐問題、廚師追問、五層關係；圖 1 |
| 二、User Story／最常見的錯誤 | story | 句型、五產業表格、工具選擇與使用者價值、藍色按鈕反例、收件正例、故事不是完整規格 |
| 三、FR | functional | 掛號故事、四條需求表、拒絕行為、最後一個名額的同時預約問題 |
| 四、NFR／銀行 A／銀行 B | quality | 品質差異比較圖 2；六面向表 |
| 四、為什麼「系統要很快」不是好的需求 | examples | 模糊與可驗證需求圖 3；設備、資料集、50 人、95%、2 秒、量測起訖、p95、TBR 與 NASA |
| 五、Constraints | types | 學生資料限制、離線／硬體／預算／外部服務限制；授權病歷跨分類例子 |
| 六、整合規格 | specification | S-01、FR-01、FR-02、NFR-01、C-01 圖 4；鍵盤要求與尚待實測 |
| 六、需求連到驗收測試 | acceptance | 兩段 GWT；輸入改變使舊結果失效，重新檢查後才能完整匯出 |
| 七、AI Coding Agent 與 Traceability | workflow | 五步協作圖 5；穩定 ID 與 S-01 → FR-01 → AC-01 → TEST-01 → PASS / FAIL |
| 八、動手練習 | review | 完整 spec.md 模板、驗證待驗、規則與負責人；小範圍可獨立驗收 |
| 九、理解檢核 | checks | 三題四選項、逐選項解析；答案 B／C／C |

圖 1：Story 在上，FR／NFR 並列，Constraints 獨立一層，AC 在下；箭頭為需求具體化，不表示時間或 FR 先於 NFR。
圖 2：銀行 A／B 為並列比較，沒有因果箭頭。
圖 3：上下兩段對比，同時保留示範數值尚非正式門檻。
圖 4：五列規格條款，ID、標題與全文，不縮成摘要。
圖 5：有順序的五步協作；測試結果仍需實際執行。

## 技術查核

2026-11-11 回讀 [NASA Appendix C](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/)：C.3 的 TBR、責任與期限；C.4 的清楚、一致、可追溯及可驗證。查閱 [WCAG 2.2](https://www.w3.org/TR/WCAG22/)：鍵盤、無鍵盤陷阱與可見焦點為分開條款，教學規格不等於產品符合性。

## 狀態與下一關

來源保存、完整中英文正式採用與五圖 HTML／SVG：完成；來源逐行核對及雙語小節校對已執行。本機與正式站測試、Git 及部署狀態見[發布回執](../../../../releases/2026-11-11-aase-m05-02-replacement.md)。

適用規則：WRITE-01–06、WRITE-09–11、FIG-01–06、HTML-01–04、A11Y-01–03。共享元件已有其他未提交修改；發布前採隔離工作樹或只帶入本次必要差異，避免將其他章節一併發布。稀缺資源為編輯與實測容量；Planning 僅需定位、狀態、驗證與下關，全文與來源留在本 repo。
