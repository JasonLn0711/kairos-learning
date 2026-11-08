# 資工底層原理觀點：內容與驗收回執

文章：`/perspectives/cs-systems-foundations/`，英文 `/en/perspectives/cs-systems-foundations/`。版本 v1.0.0，原發布／版本修訂日期 2026-11-08。正式部署及回讀已完成，結果見文末。

## 內容與來源

完整來源、修正理由及歷次證據見[編輯紀錄](../sources/cs-systems-foundations/README.md)。原稿 SHA-256 為 `f75145428ec4844f509cff7147c6a10e2b1acbae2ed07b9b429e750ce45c94e6`，八張參考 PNG 保存在忽略來源目錄，雜湊見 source-checksums.json。

兩語各 20 個內容區段（導言、十五章、三個原稿圖標題及末段）、52 個小節、23 段程式碼、六表、八圖，共 514 個依序正文區塊。中文保留原稿全部教學，明列修正為獨立文章導言、Python 換行、跨平台工具條件、雜湊分支、清理步驟與無線上批改說明；英文逐區塊對應相同例子、數字、條件及判讀界線。數量與形狀比對只用來找漏項；來源／教學深度依原稿及已列修正核對。

## 規則與實測

- WRITE-01–07、09–11：完整雙語與來源／修正追溯；署名 CS Kairos Learn；語意版本與日期成對。原稿十五章及 A–F 保留，未提供未要求的答案或虛構學習成果。
- HTML-01–04：語意正文，具名可鍵盤捲動 code／table；中英 320／390／768／1280 無整頁溢出，全文逐區塊可見文字比對通過，200% 根字級無整頁溢出，無 JS 基本檢查通過。
- FIG-01–06：受限八版型、同源雙語 JSON／搜尋／SVG，下載逐位元組比對；16 SVG 的 Chrome 字框邊界與文字重疊檢查通過。桌面 Git DAG 保留菱形，手機分支卡片明列端點；硬連結匯聚與 symlink 虛線條件分開。字型、留白、圓角、手機重排及部分圖示筆畫與原圖有差異；保留節點、分組、關係及文字資訊。
- A11Y-01–03：可見圖說與正文、原生標題／表格，裝飾箭頭隱藏朗讀；Tab 到圖檔下載、可見焦點、Enter 下載、Shift+Tab 與 code 鍵盤焦點通過。實體手機與完整螢幕閱讀器認證未執行。
- 第十四章的兩段 Shell 程式碼在 macOS／zsh 逐段執行（含清理），exit 0；Linux 未實機驗收。先前 Python 標準函式庫實驗確認 device＋inode 相同、nlink=2、SHA-256 相同與 symlink 獨立 inode。

檢查工具：`scripts/check-cs-systems-browser.mjs`、`scripts/check-cs-systems-svg.mjs`、`scripts/generate-cs-systems.py --check`；證據存 `.local/cs-systems-browser/`、`.local/cs-systems-svg/`、`.local/cs-systems-shell-lab.log`。

268 項單元測試通過；型別檢查 0 errors／0 warnings。publication-boundary 通過（draft／future、英文課程閘門與乾淨正式重建）；validate:release 通過，396 HTML、語言配對、連結與 567 static assets 通過。正式站全文、搜尋、圖檔回讀已通過，見正式驗收。

## Git 與部署啟動

內容／元件／八圖與追溯資料已提交為 `4af35804d86107c191963dbac00a35d939d1f685`，非強制推送至 origin/main，遠端 ref 已核對一致。Pages run [42442489203](https://github.com/JasonLn0711/kairos-learning/actions/runs/42442489203) 已啟動；本次觀察仍為 in_progress，尚未取得正式部署成功或頁面回讀證據。後續以 `CS_SYSTEMS_BASE_URL=https://learn.cs-kairos.com node scripts/check-cs-systems-browser.mjs` 執行正式站全文、四寬度、圖檔 bytes 與鍵盤驗收，輸出到 `.local/cs-systems-live/`。


## 正式驗收與完成審核

Pages run **42442489203** 已 completed／success，部署內容提交為 `4af35804d86107c191963dbac00a35d939d1f685`。正式網址：

- [中文文章](https://learn.cs-kairos.com/perspectives/cs-systems-foundations/)
- [完整英文](https://learn.cs-kairos.com/en/perspectives/cs-systems-foundations/)

`CS_SYSTEMS_BASE_URL=https://learn.cs-kairos.com node scripts/check-cs-systems-browser.mjs` exit 0：兩語全部正文區塊可見文字與正式 JSON 對應；每語八圖；320／390／768／1280 無整頁溢出；200% 根字級無整頁溢出；16 份公開 SVG bytes 與已驗證 build 相同；兩語無 JS 基本閱讀與圖解檢查；Tab／Shift+Tab、可見焦點、Enter 下載、code 焦點檢查通過。證據為 `.local/cs-systems-live/results.json` 與逐圖截圖。

另以 Chrome 確認中英觀點列表各有一筆正確文章連結，正式 `/search-index.json` 與本機正式 build 逐結構相同（`.local/cs-systems-live/discovery.json`）。SVG 重建 `--check` 通過，16 圖字框無 viewBox 超界或文字重疊；本輪目視補核對硬體、連結、Git DAG 與 Git 區域的最終下載圖。原圖的關係、節點及文字已保留；網頁重排、字型與裝飾圖示差異如前述記錄。

本次範圍已達成：供稿完整採入雙語觀點、八張參考圖重製為 16 份雙語 SVG、來源／修正／規則／檢查／發布詳實記錄並可追溯。原始材料、514 個正文區塊的模型與頁面比對、發布閘門、部署提交、公開頁面與公開資產各有對應證據。未新增學員成績、假送出或理解完成狀態。

Linux 實機、實體手機、完整螢幕閱讀器認證屬尚未執行的額外驗收，不把瀏覽器模擬稱為上述認證；本次沒有以這些未測項支持已完成主張。以上正式驗收取代先前「部署啟動」段落的當時等待狀態，保留歷程供追溯。
