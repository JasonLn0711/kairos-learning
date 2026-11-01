# NAS 指標生命週期與 MMU 教學 v1.3.0

[中文教學](https://learn.cs-kairos.com/perspectives/nas-cve-patching/#free-pointer) · [英文教學](https://learn.cs-kairos.com/en/perspectives/nas-cve-patching/#free-pointer) · [正式資料](../../content/perspectives/nas-cve-patching.json) · [全站文章規範](../article-standards.md) · [圖解設計規範](../diagram-design-system.md) · [內容採用紀錄](../perspectives/nas-cve-content-design.md) · [前版回執](2026-11-01-nas-memory-foundations.md)

## 交付與第一原理

從「配置物件的生命週期」「位址與內容」「硬體頁面權限」三個不同責任解釋 free。新增四個雙語小節 free-pointer、memory-access、pointer-aliases、process-lifetime，承接原有記憶體基礎，再回到 PHP Worker 的失效參照。全文中英各二十六節、十七圖、八表、兩份可執行 C 範例；三十四份獨立 SVG。增加教學範圍依 WRITE-06 升 v1.3.0、revision 5；原發布日及版本修訂日均為 2026-11-01，品牌署名保持不變。

free 不自動把呼叫端變數設為 NULL；配置器重用區塊與 MMU 檢查頁面權限分開。舊位址位元可能殘留，但 C 物件生命週期結束後的指標值不可當成有效值繼續使用。p 與 q 為不同變數，重設一個不會改寫另一個；Process 結束與同一 Worker 內不同請求也分開說明。

## 圖解與規範

依兩張參考圖新增受限 lifetime、access-path 版型，由 [HTML／CSS 元件](../../src/lib/components/StructuredDiagram.svelte)與 [SVG 匯出器](../../src/lib/structured-diagram-svg.ts)共同讀取正式資料。保留既有版型及章節 ID；新圖編為圖 10、11，後續圖順延。

- free 前後圖：藍色與橘色分區、指標與記憶體、0x1000／0x1000*、ABC／ABC?、實線與紅色虛線、獨立狀態標籤。狀態標籤沒有下一步箭頭；僅釋放後的記憶體目標標記 released。
- 存取圖：Pointer → CPU／MMU → RAM，紫色 MMU、綠色 RAM、下方橘色配置器；以無箭頭虛線連結管理責任，明示不是每次 CPU 讀寫都查詢配置器。

桌面保留參考圖的分區及關係，手機上下重排；獨立 SVG 保留桌面配置。差異為本站字體、文章欄寬、補充解說與留白，不以逐像素複製取代可讀性。兩圖的星號與問號是概念標示，不是讀取已釋放記憶體的實測輸出。

FIG-04／05 的共用規範新增資料結構、線型、狀態徽章、指標值與硬體可達性的區分，以及安全別名範例要求；全站文章規範、內容指南、觀點指南與內容採用紀錄互相連結。

## 來源與程式驗證

核對 [WG14 N1570](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) §§6.2.4、6.5.2.2、7.22.3.3，下載原始 PDF 並擷取文字確認物件生命週期、函式參數傳值及 free 的語意。另核對 [SEI CERT MEM30-C](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/memory-management-mem/mem30-c/)、[Linux 頁表文件](https://docs.kernel.org/mm/page_tables.html)，並連接文章既有 malloc、mmap 與 PHP 修補來源。

別名範例先檢查配置成功，在 free 前使用 q；釋放後直接賦予 p、q 新值，不讀取、比較或解參考舊指標。本機 macOS／Apple Clang 以 `-std=c17 -Wall -Wextra -Werror -fsanitize=address,undefined` 編譯執行，輸出 `Before free: A` 及 `Aliases reset; no access after free.`，結束碼 0，無 sanitizer 診斷。證據 `.local/nas-pointers/c-evidence.json`；本輪未做 Linux 原生執行或實機 NAS 修補。

## 驗收與發布

依 WRITE-01–07、HTML-01–04、FIG-01–05、A11Y-01–03 驗收。雙語涵蓋 320、390、768、1280 CSS px、200% 文字、無 JavaScript、搜尋 free(p)、兩份程式碼及表格鍵盤捲動、十張記憶體圖的鍵盤下載與 SVG 文字邊界，以及正式資料逐位元組比對。發布邊界重建與瀏覽器檢查依序執行。

本機證據位於 `.local/nas-pointers/`，頁面截圖與 trace 位於 `.local/nas-cve/local/`。已目視兩張圖的桌面與手機配置；原生 Safari、實體手機及完整螢幕閱讀器測試另列待驗，不計入本輪完成結果。

本機最終結果：91 項單元測試通過、Svelte 0 error／0 warning、內容驗證與靜態發布檢查通過；draft／future 標記未出現在 524 份部署文字產物。新篇瀏覽器 14 項通過（1.1 分鐘）。三十四份 SVG 為 1766–5023 bytes。MATLAB 原始下載檔六項 SHA-256 核對通過。npm audit 的 high 門檻通過，既有相依套件仍回報五項 low；本次未變更相依版本。

證據：`unit-final.log`、`check-final.log`、`content-final.log`、`boundary-final.log`、`release-final.log`、`browser-final.log`、`previous-final.log`、`audit-final.log`、`c-evidence.json`。正式發布結果另記於下方。

既有 NAS 篇 11 項瀏覽器回歸通過（10.8 秒）。已目視兩份獨立 SVG，確認文字、線型、狀態標籤與圖說完整；預覽存於 `.local/nas-pointers/free-pointer-svg.png` 與 `memory-access-svg.png`。

## 正式發布回執

實作提交 `34e33af`、規範提交 `10b4dc3` 已非強制推送 main。[Pages 41301308480](https://github.com/JasonLn0711/kairos-learning/actions/runs/41301308480) 成功部署 `10b4dc3910c7022b338e02fe10d118d684e9437a`。正式站獨立 Chrome 完整 14 項通過，讀回 v1.3.0、雙語二十六節／十七圖／八表、兩份 C 程式碼、六種響應式版型、鍵盤操作與下載、200% 文字、無 JavaScript、搜尋與閱讀互連；圖檔與正式資料逐位元組一致。

正式證據：`.local/nas-pointers/live.log` 及 `.local/nas-cve/live/` 結果、截圖與 trace。Python HTTP 探測收到 403，未將它當成頁面驗收；以上結果來自實際瀏覽器。正式閱讀入口為本回執首段的雙語 `#free-pointer` 連結。


## Planning 狀態與容量連結

2026-11-01 依 FIRST PRINCIPLE 補齊跨 repo 紀錄：稀缺資源為讀者注意力、查證時間與證據可信度。本站保存來源、採用設計、實作與驗收；[Planning 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/days/2026-11-01.md#kairos-nas-memory-2026-11-01)串接本篇與前版回執，[網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-nas-memory-2026-11-01)提供持續入口。週計畫及整合索引由日誌連出。

本次僅更新文件連結並核對既有 Git 證據；上方測試、macOS 程式執行及正式站結果保留原執行範圍，沒有以文件更新推定重新驗收。Jason 下次閱讀回饋為下一關；維持既有 Red 容量與個人學習 must-win，實體裝置、理解及 NAS 實機處置各自留證。
