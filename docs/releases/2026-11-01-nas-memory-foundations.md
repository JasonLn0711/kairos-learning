# NAS 記憶體基礎與結構化圖解 v1.2.0

[中文教學](https://learn.cs-kairos.com/perspectives/nas-cve-patching/#memory-address) · [英文教學](https://learn.cs-kairos.com/en/perspectives/nas-cve-patching/#memory-address) · [正式資料](../../content/perspectives/nas-cve-patching.json) · [圖解設計規範](../diagram-design-system.md) · [內容採用紀錄](../perspectives/nas-cve-content-design.md) · [前版回執](2026-11-01-nas-memory-lifecycle.md)

## 交付範圍

依使用者提供的完整教學及四張參考圖，在正常記憶體生命週期之後、兩種 PHP 缺陷之前，新增六個雙語小節：位址／內容／使用權、配置與重用、配置器與核心、可執行 C 範例、失效參照、三項原則及理解檢查。保留原有章節 ID、閱讀互連與來源；新增四張圖編為圖 6–9，後續圖依序重編號。

文章新增教學範圍，依 WRITE-06 升為 v1.2.0、revision 4，原發布日與版本修訂日均為 2026-11-01。整篇中英各二十二節、十五圖、七表，三十份 SVG；作者維持 WRITE-07 的品牌署名。

## 圖解與規範

使用者希望接近原圖的結構，這次新增受限 `layout`：`cells`、`stages`、`layers`、`reference`，以及文字 cells、released 狀態。由 [StructuredDiagram.svelte](../../src/lib/components/StructuredDiagram.svelte)呈現可搜尋 HTML／CSS，以 [structured-diagram-svg.ts](../../src/lib/structured-diagram-svg.ts)產生相同資料的獨立 SVG，既有純流程及卡片不變。無新增依賴、任意 HTML、外部圖片或事件字串。

- 四個位址格保留 0x1000–0x1003、65–68 與 ASCII A–D。
- 三階段保留藍／橘／綠卡、ABC → XYZ、釋放階段的虛線小格與時間箭頭。
- 分層圖保留 User Space／Kernel Space、上層雙卡、下層單卡與按需跨層的灰色虛線。
- 失效參照圖保留左側指標與錯誤說明、右側記憶體，以及紅色折線虛線。

桌面使用文章欄寬內的橫排與分層，手機轉為依序上下排列；獨立 SVG 保留桌面配置。與截圖的差異是本站字體、圖說、容器留白及窄欄重排；補充「虛擬位址」「同一 Process 內重用」「釋放後內容不保證維持」等精確範圍。未把截圖或整張縮小 SVG 當成唯一可讀正文。

新增 FIG-04／05，並連接全站規範、內容指南、觀點指南及撰稿工作表。規則包含參考圖關係盤點、受審核資料模型、桌面與手機配置、文字大小、線型語意、雙語技術值一致、搜尋／SVG 同源、下載與鍵盤驗收，以及安全 C 範例。

## 來源與可執行範例

查核 Linux man-pages 的 [malloc(3)](https://man7.org/linux/man-pages/man3/malloc.3.html)、[mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html)，及 Linux Kernel 的[頁表](https://docs.kernel.org/mm/page_tables.html)、[核心參數](https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html)。區分同一 Process 配置器重用、新匿名映射的清零保證、檔案／共享映射及 PHP Worker 內的請求；核心 init_on_alloc／init_on_free 不寫成應用程式 free 的普遍保證。

C 範例檢查 malloc／calloc 失敗、初始化後才讀取，包含字串結尾，驗證 calloc 的位元組清零並釋放資源；不讀取已釋放記憶體，也不假設再次得到同一位址。程式直接寫入 XYZ，未先將 q 清零。正文含編譯、執行、預期輸出、結束碼與清理。

本機實測環境為 macOS／Apple Clang，使用 `-std=c17 -Wall -Wextra -Werror -fsanitize=address,undefined`；兩行輸出 `Original data: ABC`、`New data: XYZ`，結束碼 0，無 sanitizer 診斷。證據 `.local/nas-foundations/c-evidence.json`。本輪沒有宣稱 Linux 原生執行、實機 NAS 修補或跨 Process 資料抹除實驗。

## 驗收

依 WRITE-01–07、HTML-01–04、FIG-01–05、A11Y-01–03 驗收。單元測試涵蓋版型結構、無效欄位、雙語格值、標記跳脫、同源搜尋及三十份 SVG 精確匯出；瀏覽器涵蓋雙語四尺寸、桌面並排／手機上下幾何、文字 200%、無 JavaScript、八張記憶體圖的鍵盤下載及 SVG 文字邊界、程式碼與表格鍵盤水平捲動、搜尋 calloc 與閱讀互連。

本機證據存 `.local/nas-foundations/`；頁面截圖與 trace 存 `.local/nas-cve/local/`。已目視參考圖對應的中文桌面卡片、手機重排及獨立分層／失效參照 SVG。原生 Safari、實體手機、完整螢幕閱讀器驗收另列，未計入本輪完成結果。

本機結果：90 項單元測試通過，Svelte 0 error／0 warning，draft／future 標記未出現在 524 份部署文字產物，release 檢查通過。新篇最終瀏覽器 14 項通過（49.5 秒），既有 NAS 篇 11 項回歸通過（10.2 秒）。最終驗證器再限制版型對應的 flow／cards 與 cells 欄位，避免 HTML／SVG 線型不一致；重跑單元、型別、乾淨發布邊界與靜態驗收通過。三十份 SVG 為 1766–4926 bytes。

證據：`unit-final.log`、`check-final.log`、`boundary-final.log`、`release-final.log`、`browser-delivery.log`、`previous-accepted.log`、`c-evidence.json`；獨立 SVG 目視預覽亦存於 `.local/nas-foundations/`。本輪先完成建置，再執行瀏覽器驗收，未並行覆寫 build。
