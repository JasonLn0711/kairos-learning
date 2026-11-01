# NAS 第二篇：配置器教學 v1.4.0 本機驗收

[文章資料](../../content/perspectives/nas-cve-patching.json) · [採用設計](../perspectives/nas-cve-content-design.md#v140配置器的軟體身分與實作) · [前版](2026-11-01-nas-pointer-lifetime.md)

## 本次交付

新增七個雙語章節，說明配置器的軟體身分、CPU／MMU／RAM 分工、256 Bytes 空間切割、Bump Allocator、ZendMM、課程與 OSTEP 閱讀路徑，以及三題理解檢查與對照思路。全篇兩語各 33 節、19 圖、11 表、3 份 C 範例。版本為 v1.4.0、revision 6；原發布日保留，修訂日為 2026-11-01。

供稿原文含原 SVG 與 C 程式完整保存在忽略目錄 `.local/sources/`；採用設計記錄整合與補充差異。C 程式保持原文，中英使用同一份程式。公開正文補充 malloc 的位元組單位、靜態陣列不能交給 free、對齊與同步限制；圖 2 的缺圖部分採明確標示的合成模型補足。AI 協助編輯、翻譯與工具驗證；尚未取得獨立讀者驗收。

兩張圖沿用既有受驗證的 HTML／CSS／SVG 資料模型；未增加依賴、元件或版型。瀏覽器測試發現英文長標題在 200% 字級時超出窄欄，因此在既有 h1／h2／h3 排版規則補上 `overflow-wrap:anywhere`，讓必要時可斷行；原標題文字與字級保留。原圖的固定座標與條件虛線改以可換行分組和文字呈現，保留角色與條件語意。38 份雙語 SVG 均由產生器匯出，每檔 1766–5023 bytes；既有圖號因插入而順延。

## 來源與範例

核對 [malloc(3)](https://man7.org/linux/man-pages/man3/malloc.3.html)、[Linux 頁表](https://docs.kernel.org/mm/page_tables.html)、[OSTEP](https://research.cs.wisc.edu/wind/OSTEP/)、[第 17 章](https://research.cs.wisc.edu/wind/OSTEP/vm-freespace.pdf)、[ZendMM](https://www.phpinternalsbook.com/php7/memory_management/zend_memory_manager.html)、[Zend 教學](https://www.zend.com/resources/php-extensions/php-memory-management)及 [PHP stale global state 公告](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)。來源支持配置與生命週期解說；本次未重新核對所有 NAS 套件版本。

本機 Linux 使用 `cc -std=c17 -Wall -Wextra -Werror -fsanitize=address,undefined` 編譯原範例，實際輸出：

```text
A B
Allocated: 150 bytes
```

結束碼 0、無 sanitizer 診斷。獨立 assert 檢查 100／50 Bytes 後剩 106、107 與 SIZE_MAX 申請失敗且 next 不變、106 填滿、再申請 1 失敗、零長度不移動 next。程式及結果在 `.local/nas-allocator/tiny-*.c`、`c-evidence.json`。這是教學程式驗證，不是效能實驗或 NAS 實機驗收。

## 規則與驗證

- WRITE-01–07：供稿與編輯版分層、技術來源核對、雙語相同數字與程式、版本與日期一致。
- FIG-01–05：沿用受審核模型，HTML 與 SVG 同源，圖說交代按需關係及合成範例；圖檔逐位元組核對與大小檢查通過。
- 內容驗證通過；91 項單元測試通過；Svelte 檢查 0 errors／0 warnings。
- 發布邊界檢查通過：draft／future 標記未出現在 524 份部署文字產物；移除 fixture 後重建。靜態發布驗證通過。
- 最初並行單元測試誤讀邊界檢查的暫存 fixture，出現 81／80 差異；移除後依序重跑全部通過。起初缺少已宣告的 Playwright 套件，以 `npm ci --ignore-scripts` 補齊，未修改 lockfile。

HTML-01–04／A11Y-01–03：使用本機 Google Chrome for Testing 151.0.7922.34，驗證 `/perspectives/nas-cve-patching/` 與 `/en/perspectives/nas-cve-patching/` 的 320、390、768、1280px、鍵盤焦點與下載、程式碼／表格捲動、無 JavaScript、200% 文字、搜尋與雙向閱讀連結。首次 14 項中 13 項通過，英文放大測試發現長標題溢出；修正換行後，雙語該項重跑 2 項通過。其餘已通過項目未無故重跑。共用標題規則另以 390px／200% 抽查前篇 NAS 與 M04-01 中英四頁，標題均無溢出；最終重建與靜態發布驗證再度通過。

已目視兩張新增圖的手機及桌面截圖，確認中英角色、箭頭、分組與數字可讀。下載與 SVG 文字邊界檢查包含兩張新圖，兩語搜尋資料皆含 tiny_alloc。供稿 C 程式與兩語刊載內容逐字比對通過；文件本機連結與 `git diff --check` 通過。

證據位於 `.local/nas-allocator/` 的 `unit.log`、`check.log`、`content.log`、`boundary.log`、`release-final.log`、`browser.log`、`browser-retest.log`、`heading-regression.log` 與 `c-evidence.json`；截圖在 `.local/nas-cve/local/`。測試設定以忽略目錄中的覆寫指定既有本機瀏覽器，未更動正式 Chrome 設定或個人瀏覽器。

## 範圍與下一關

上述為發布前本機驗證。使用者已授權分開提交與發布；Git、整合檢查與正式站結果見[共同發布回執](2026-11-01-allocator-network-publication.md)。實體手機、完整螢幕閱讀器、獨立讀者理解與 NAS 實機修補尚待驗證。


## Planning 連結

[當日日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/days/2026-11-01.md#kairos-allocator-network-2026-11-01)與[網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-allocator-network-2026-11-01)保存狀態、容量與下一關；詳細來源、教學與驗證留在本 repo。
