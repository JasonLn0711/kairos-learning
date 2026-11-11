# M09-01 逐章逐小節採用對照

原文 `original.txt`、兩張 PNG 與舊版 v1.0.2 由 SHA256SUMS 保存。中文 `teaching.zh.md` 與英文 `teaching.en.md` 由 `scripts/aase_m0901_content.py` 產生正式 JSON。正文為導言加十節；表格、命令與圖解依原文次序交錯呈現。原發布日 2026-11-05、六個既有錨點與翻譯發布閘門保留；目前 v1.1.1／revision 5，修訂日 2026-11-11。

以下以 `/courses/aase/v1/m09/concepts/m09-01/` 為中文基底，英文同路徑前加 `/en`。每列兩語對應同一錨點，英文保留相同案例、條件與十段原始指令。

| 原文章／小節 | 正文錨點 | 保留內容與編輯處理 |
| --- | --- | --- |
| 導言 | #intro | M09 主題與路徑更正；刪除追蹤參數與對話式網址說明 |
| 一、先用一句白話理解 | #history | 週一至週四報告案例、四個檔名、選擇性恢復與保留後續工作；補文字／Word 比喻界線 |
| 二、Git 四位置 | #analogy | 出版社編輯比喻、工作區／暫存／本機／遠端四位置，圖 1 三條動作連線 |
| 1. 工作區 | #analogy（h3） | VS Code 編輯、三檔一完兩未完、儲存不自動提交 |
| 2. 暫存區 | #analogy（h3） | A 金額修正／B 登入半成品，只暫存 A |
| 3. Commit | #analogy（h3） | 暫存快照、提交者／作者、時間、訊息、歷史、識別碼；補身分欄位界線 |
| 4. Push | #analogy（h3） | 本機與遠端、GitHub 與部署分開，測試／驗收另有證據 |
| 三、Diff | #diff | SOP 原版／新版及 +/- 完整示例、檢查無關變動；合成案例標示 |
| 兩個易混淆 Diff | #diff（h3） | 三列指令表、工作區對暫存、暫存對 HEAD、status、未追蹤檔限制；補 detached HEAD |
| 四、Commit | #commit | 電商四種變更表、目的分組、好與差兩條 commit 命令、REQ-003、測試紀錄與品質界線 |
| 五、Restore | #restore | 律所 contract／case-notes 案例、先備份、指定路徑命令、四部分語法表、覆蓋風險及 -p |
| Restore／Revert／Reset | #restore（h3） | 四列比較、取消暫存保留內容、新提交抵銷、hard reset 風險；補預設來源／衝突 |
| 六、10 分鐘練習 | #lab | 獨立空目錄、無真實資料、Linux／macOS／WSL Bash；補目錄已存在就停止 |
| A 建立儲存庫 | #lab（h3） | mkdir、cd、init、本機署名、三個 printf 檔案與 ignore 意義 |
| B 首次提交 | #lab（h3） | status、逐檔 add、cached diff、commit、log 與還原基準 |
| C 同時兩項修改 | #lab（h3） | 兩個追加字串、status、兩種 diff、只恢復目標而保留 keep |
| D 備份與局部恢復 | #lab（h3） | cp、restore、status、兩個 diff；圖 2 四項預期條件、備份未追蹤與 add . 風險 |
| 七、跨產業 | #applications | Agent 20 檔與權限檢查、建築材料／核准版本、研究程式／參數與可重現性、文字／二進位界線；三案例各有 h3 |
| 八、三錯誤 | #mistakes | 三個錯誤各保留原 h3 與完整因果說明 |
| 錯誤一：Git 保存全部 | #mistakes（h3） | 已提交歷史與未追蹤／未暫存／未提交工作分開；避免誤述 Git 僅有 commit 才儲存物件 |
| 錯誤二：ignore 清秘密 | #mistakes（h3） | .env 片段、既有歷史不消除、撤銷／輪替、暴露範圍與副本處理 |
| 錯誤三：Agent 重設全部 | #mistakes（h3） | 原始危險要求、先顯示 diff 與保留／還原路徑、覆蓋／改寫／刪除前確認範圍 |
| 九、總表 | #handoff | 九列術語、完整七步習慣、工程交接；承接舊版三切片與下一篇 README |
| 十、理解檢核 | #understanding、#checks | 三題四選項原意／順序，Q04–Q06 答案 B／B／C；原題封存，原生 details 參考解析；移除不存在的送出／批改控制 |

## 技術修正與查核

- HEAD：以目前切換的提交解釋一般與 detached 狀態，避免把所有情境都稱為分支最新提交；依 [git-symbolic-ref 官方說明](https://git-scm.com/docs/git-symbolic-ref)核對符號參照與 detached HEAD（2026-11-11 查核）。
- `--source=HEAD`：來源是 HEAD 指向的版本，不依「昨天」挑選；若預期來源不是 HEAD，須另指定已核對的提交。
- `restore --staged` 預設來源為 HEAD、單用 restore 預設來源為 index；工作區與 index 可分開指定。[git-restore 官方文件](https://git-scm.com/docs/git-restore)（2026-11-11 查核）。
- 兩種 Diff 及未追蹤限制依 [git-diff](https://git-scm.com/docs/git-diff)；抵銷共享歷史與新提交依 [git-revert](https://git-scm.com/docs/git-revert)；hard 模式會覆蓋工作區並可能影響阻擋路徑的未追蹤檔案，依 [git-reset](https://git-scm.com/docs/git-reset)（同日查核）。
- 原稿 favicon、搜尋卡片、未隨附的三張跨產業遠端圖片不採為正文圖片；其案例文字完整保留。兩張實際附件逐位元保留，重製圖由正文資料匯出。

## 圖意對照

圖 1 保留原圖四個縱列位置，第二列淡藍、第三列淡綠；三個向下箭頭分別標示 git add／commit／push 及中文／英文動作。圖說明列這是簡化的正向路徑，省略 checkout、fetch 等其他操作；推送與部署、測試、驗收分開。手機維持相同端點與順序，文字換行。

圖 2 保留四個核對項目與綠色勾號，沒有順序箭頭；檔名與結果可搜尋。圖說明列勾號為「預期條件」，實際成功需核對檔案與歷史。下載 SVG 使用相同節點，為清楚分隔長文字而採每項標題及內容兩行；正文保持緊湊清單，兩者語意相同。

## 驗收證據入口

`tests/aase-m0901-replacement.test.ts` 驗證來源、舊錨點、表格／指令／題目、非法模型拒絕、發布閘門，並在獨立暫存目錄逐條執行 A–D 指令與四項結果斷言。`tests/browser/aase-m0901.spec.ts` 逐節核對兩語正文、表格、命令、問題／解析、圖解、四尺寸／200% 文字、無 JS、鍵盤、搜尋與四份 SVG。實測與發布層分列於 [發布紀錄](../../../../releases/2026-11-11-aase-m09-01-replacement.md)。

## 正式站指令保真修正（v1.1.1）

v1.1.0 的本機全文驗證通過，正式站回讀時發現 Cloudflare Email Address Obfuscation 把 `learner@example.invalid` 改成保護連結，破壞複製文字及無 JavaScript 的指令。`GitHistorySection.svelte` 以固定 `<!--email_off-->`／`<!--/email_off-->` 註解保護本課輸出；只有編譯器中的固定字面值經 @html 輸出，所有供稿仍以文字跳脫，內容模型不接受 HTML。未變更整站 Cloudflare 設定，命令與兩語正文不變。依 [Cloudflare 官方文件](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/)（2026-11-11），新增公開 HTML 註解及無 email-protection 節點的回歸驗證。前版 v1.1.0 完整保留於 ff1ad37 及部署 9a39a965 的 Git 歷史。
