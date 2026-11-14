# 文章同頁補充與正式站驗收規範採納｜2026-11-14

使用者要求：「請將我們今天制定的規則與方式，詳實記錄在我們處理文章等等的相關規範當中，以後我們每次都能參照。請優化。」本次將 Day02-A 新頁及四重點補充的可重用做法納入既有規範、入口及工作表，沒有建立另一套平行規範。

## 採納位置與規則

| 規則／重點 | 維護正本與每次使用方式 |
| --- | --- |
| WRITE-12：一般白話教學、保留深度與原稿 | [文章規範](../article-standards.md#contextual-supplement)預設不用學位／程度標籤；以先備知識與目標定位，原稿原樣保存。 |
| WRITE-13：在對應內容正下方補充 | 同節明列插入對照、清單拆分、原內容／錨點／發布日保留；[內容指南](../content-authoring.md#contextual-supplement-workflow)提供八階段實作及案例入口。 |
| WRITE-14：排序與比例的證據 | 區分建議時間／篇幅、題數頻率、官方配分及領域／子領域；缺原題則保留供稿記載與查核限制。40／30／15／15只屬今天案例，不成為固定配方。 |
| WRITE-15：題目來源、數量與作答狀態 | 原題／轉述／既有情境／新增自檢分開計數；完整保留選項及答案揭露要求，靜態頁不假設已有提交／批改／學習進度。 |
| FIG-07及既有FIG-03–06：依圖意重製 | [圖解規範](../diagram-design-system.md#supplement-figure-patterns)列比例、目錄、有條件流程、雙端訊息及配對清單；量測比例並目視關係，HTML／搜尋／SVG同源且受限；原PNG與公開教學圖檔大小責任分清。 |
| CODE-01：正式採用片段實跑 | 原稿黏合換行／縮排修復、片段與完整程式區分、正常／關鍵邊界結果、假資料與真實環境的分界；CEH淺底深字、16px及至少1.7行高。 |
| PUB-01：正式站完整內容與下載 | [發布規範](../publishing-security.md#article-production-verification)處理CDN改寫、固定email_off註解邊界、無JS全文、實際下載、source／run／attempt與版號；成功部署後仍核對內容。 |
| PUB-02：穩定狀態驗收 | fixture隔離／還原、正式重建、預覽與模型同版、適當初始化條件、舊chunk404與hydration置換的診斷；不以重試隱藏差異。 |
| 每次參照入口 | [AGENTS.md](../../AGENTS.md)明列新增規則與圖解／發布閱讀入口；[工作表](../article-writing-template.md#supplement-checklist)新增15欄供每次填寫，沿用原逐小節對照與驗收結果表。 |

另優化發布規範開頭：授權依AGENTS與當次任務，避免把過去個案的「本次已授權」誤作永久授權或額外確認要求；依當次回執記錄依賴稽核結果，不再把舊的low弱點數稱為目前狀態。

## 證據與適用界線

今日實作正本及驗收仍由[Day02-A初版回執](2026-11-14-ceh-day02-a.md)、[四重點補充回執](2026-11-14-ceh-day02-a-four-topics.md)、原稿／前版／逐節採用與原有測試入口承接。規範以這些已完成案例說明方法；後續各篇保留自己的語言模型、數值、來源、測試與公開版驗收，不複製今天的題數、比例、日期、圖名或測試數量。

本次只修改AGENTS與五份規範／工作表及本回執；未改教材JSON、元件、圖檔、產生器、套件或CI閘門。既有正式頁v1.1.0的source及驗收證據保持原紀錄；本次屬Git規範文件發布，不重做網站部署或宣稱全站文章已符合新規範。

## 本次驗證

- 內容核對：新增8個規則ID，各有規範本文、實作／圖解／發布入口與工作表欄位。逐項對照今天的讀者用語、來源缺件、完整採用、相對插入、比例、題數、程式、圖解及正式回讀方式；不新增固定比例或虛構學習完成要求。
- `workspace-verify check-markdown --root . AGENTS.md docs/article-standards.md docs/content-authoring.md docs/diagram-design-system.md docs/publishing-security.md docs/article-writing-template.md docs/releases/2026-11-14-article-supplement-standards.md`：7份文件的本機Markdown連結與支援的錨點核對通過，`checked_files=7`、`findings=[]`；不包含遠端連結可達性或語意自動認證。
- `git diff --check`與提交索引範圍核對；來源／執行程式無變動，因此未重跑415項網站測試、瀏覽器及Pages部署。這些實測結果仍只屬其原文章發布版本。
- 本機原有三項npm→pnpm文字修正保留在`docs/article-audit.md`、`docs/diagram-design-system.md`及`docs/publishing-security.md`；對後兩檔只提交本次新規範hunk，既有修正維持未提交。

下次文章任務從AGENTS及主規範進入，填補充工作表再按當篇範圍驗收。尚待各篇實際套用的項目，不以本次規範文件發布代替。
