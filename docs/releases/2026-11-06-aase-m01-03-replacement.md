# M01-03｜個人工具與組織系統有什麼不同？v1.1.0

[完整來源與逐段對照](../sources/aase/m01-03/replacement-2026-11-06/README.md) · [正式雙語資料](../../content/aase/lessons/aase-m01-c03.json) · [圖解契約](../diagram-design-system.md#aase-organization-dimensions) · [維護契約](../content-authoring.md#aase-m0103-replacement-2026-11-06)

## 採用範圍

依完整供稿抽換導言及十節，中英各 11 個主 section、身分章四個 step 小節、四圖四表；保留十人辦公室故事、五種失敗、Authentication／Authorization、資源授權、09:00–09:03 更新遺失、持久化／備份／還原、HTTPS、驗收證據、三階段與前三課連結。139 個來源段落逐項記錄，11 個原始選項保留，三題 4／4／3、答案 C／A／C；原生參考答案不提交、批改或記錄成績，qa=[]。

附圖五個平行節點、共同橫線與下方成果以原生 HTML／CSS 重製；權限保留橘色強調，手機改為左側共同母線，各節點與成果仍平行連接，不畫成先後流程。英文長標籤採 1rem，避免單字只剩最後字母換行；橘色略調深，使白字對比約 4.84:1。原 PNG、原稿、v1.0.2 與雜湊完整保存。圖解與搜尋同源，沒有新增 SVG 格式或不穩定外部圖片。

授權模擬明列教學政策：承辦人讀／改／刪自己的文件，唯讀複核者可讀兩份；三身分×兩文件×三操作共 18 組，未知識別字預設拒絕。沒有後端、真實帳號或文件操作。第四節的共同編輯另行授權，公開說明與第三節模擬分開；版本衝突補明由伺服器／資料層保證原子比對與更新。

v1.1.0、revision 4、修訂日 2026-11-06；原發布與翻譯開放日 2026-11-05、stable ID、slug、readingId、summary、目標及練習保留。工作坊 ZIP 僅同步 curriculum.json 的 M01-03 標題，其餘 29 檔位元組相同，不改程式或擴大為正式多人系統。

## 規則與驗證

WRITE-01–08：原稿與前版保全、139 段及 11 選項對照、完整英譯、條件與版本／課次一致。HTML-01–04、FIG-01／03–06：語意文字、參考圖節點與母線、四尺寸／200% 文字、搜尋、無 JavaScript 與目視；沒有新增獨立圖檔，本輪 SVG 下載及 FIG-02 不適用。INT-01、A11Y-01–03：18 組授權、未知值拒絕、原生選單、鍵盤／焦點、預設結果、原生答案與局部表格捲動。

本機 218 項單元全通過；Svelte／TypeScript 0 errors、0 warnings；內容、release 與 30 檔工作坊封裝校驗通過。發布邊界在 764 份部署文字產物中未見 draft／future 標記，英文課程閘門通過並還原後重建。C03 雙語專用瀏覽器 2 項、M01 四篇英文 4 項及 M01-02 互動 2 項回歸通過；四尺寸、200% 文字、18 組授權、無 JavaScript、搜尋及鍵盤皆有檢查。來源 SHA-256、文件連結與 git diff --check 通過。

目視核對中文／英文的手機及桌面母線與節點，英文桌面五標籤維持完整單行；原圖與採用版的字型、補充圖說、顏色及重排差異明列。此輪不新增 SVG 匯出，沒有把原圖縮放或章節統計當成可讀性驗收。工具結果只驗證教材與固定模擬，沒有執行真正多人後端、備份還原或正式授權測試。AI 協助編輯、英譯、圖解與工具驗證；實體裝置、完整螢幕閱讀器與獨立理解仍待證據。

## 發布與正式站

來源 `212c02d`、教材／模擬 `ed21d5f`、工作坊封裝 `f9fc4e7`、契約／驗證 `9dfb779` 分開提交並非強制推送 main，fetch 後 divergence `0 0`。獨立 worktree 保留原 checkout 的無關修改與雙邊既有歷史。

[Pages 42232914939](https://github.com/JasonLn0711/kairos-learning/actions/runs/42232914939) 成功部署 `9dfb779`；正式站兩語專用瀏覽器 2 項通過，包含完整教材、五面向平行母線、18 組授權、原生答案、四尺寸／200% 文字、搜尋、鍵盤及無 JavaScript。部署前首次回讀仍是舊版，部署成功後重跑通過，兩者分開記錄。

正式 checksum 已更新為 `44cab61b94b80b0bcd49d4628e60e424ff5e5659855a032042136db9cc79f182`。加查詢參數的 ZIP 下載為 30,151 bytes，與本機逐位元組相同；舊的無版本 ZIP 網址受 Cloudflare 四小時快取影響，下載頁改從同一份 SHA256SUMS.txt 自動取得雜湊，為 ZIP 與校驗檔加上相同版本參數；保留原下載路徑與檔名。雙語專用測試新增兩個連結、HTTP 200 及逐位元組比較，避免未來封裝更新仍連到舊檔。新版下載頁的正式回讀待該次部署後確認。

本輪日誌與截圖保存在原 checkout 的忽略目錄 `.local/aase/m0103-replacement-2026-11-06/`；發布 worktree 的 `.local/aase/m0103/` 留執行原件。

## 連結與容量

承接 [M01-01 的需求與交接](2026-11-06-aase-m01-01-replacement.md)及 [M01-02 的人／AI 分工與證據](2026-11-06-aase-m01-02-replacement.md)，本課把共用需求轉為身分、權限、資料、協作與維護的驗收條件。

[今日日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/days/2026-11-06.md#aase-m0103-replacement-2026-11-06)、[網站定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#aase-m0103-replacement-2026-11-06)與 [W45](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/weekly-plan.md#aase-m0103-replacement-2026-11-06)只保存定位、狀態、容量及下一關；來源與程式由 Kairos 擁有。Planning 專案 `106948a1`、日／週 `7a8d971c` 分開提交並推送 main，fetch 後 divergence `0 0`；repository validator 通過（44 項既有警告、0 新增）、knowledge 186／186 與日／週 agenda 通過。容量維持 Unknown，不新增本人工時或學習完成；下一關是閱讀中的三題答案與卡點。

## Pages 同步診斷（2026-11-06）

使用者詢問是否檔案過大。本機 build 共 56,135,922 bytes、1,148 檔，最大檔 search-index.json 為 2,996,924 bytes；正式 Actions artifact 約 18.47 MB，遠低於 [Pages 1 GB 上限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)。上傳及全部檢查成功後，部署才停在 syncing_files，十分鐘後逾時，沒有容量超限或 429 訊息。

同 commit 3a5209a 的 [42234691476 第二次工作](https://github.com/JasonLn0711/kairos-learning/actions/runs/42234691476/attempts/2) 在 14:44:41–14:45:08 UTC 以約 18.47 MB 封裝成功部署，耗時 27 秒；固定容量限制不足以解釋此差異。最小推論是 Pages 同步階段有間歇性延遲；平台內部根因仍未確認，當時官方狀態頁沒有公告事故。Cloudflare ZIP max-age=14400 的舊檔快取是另一個已量測問題，不是 Pages 部署失敗原因。

下載雜湊版本修正 3a5209a 已部署；f443c0e 補上校驗檔 data-sveltekit-reload，避免 SvelteKit 接手靜態檔查詢網址，並新增實際點擊檢查。本機雙語 2 項通過。其 [42236969555 工作](https://github.com/JasonLn0711/kairos-learning/actions/runs/42236969555) 首次同樣 syncing_files 逾時，第二次仍待結果；API 曾在 finished_file_sync 與 syncing_files 間變動。尚未把本機通過記成此修正的正式驗收。
