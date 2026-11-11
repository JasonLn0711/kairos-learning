# AASE M05-05 完整供稿抽換

本次將 OpenSpec 與輕量 Markdown 的既有短篇換成完整供稿，保留公開網址、原發布日 2026-11-05、六個舊 section 錨點及 Git 歷史。內容版本 v1.0.2 → v1.1.0，revision 3 → 4，修訂日 2026-11-11。

[來源、逐節對照與修正](../sources/aase/m05-05/replacement-2026-11-11/source-map.md)持有原文、兩 PNG、前版、雙語稿及 SHA256SUMS。正式正文兩語各九節，十三個原小節、四表、七段完整文件範例、兩圖、四題原開放問題與新增參考解析。餐廳保留訂單的期限、資格、不得送廚房、規格重複風險、負向測試與後端邊界均保留。

兩圖依附件重製為可選取、搜尋、原生重排的 HTML，並提供四個同源 SVG。三命令圖明示候選差異更新目前規格；五步循環保留 Explore、Propose、Review、Apply + Verify、Archive 與下一變更的回返。版本查核、工具操作、實際驗證、團隊接受與正式部署各自記錄。

## 規則與驗證

| 規則 | 範圍 | 結果 |
| --- | --- | --- |
| WRITE-01–11 | 來源、完整正文、雙語、日期與新題 ID | 逐節成稿核對；來源到正文的技術修正列於 source-map |
| HTML-01–04 | 兩語全文、四尺寸、200%、局部捲動 | 本機兩語全文與次序、320／390／768／1280px、200%、局部鍵盤捲動通過 |
| FIG-01–06 | 兩 HTML 圖、四 SVG、方向、分組與匯出 | 模型拒絕測試、四 SVG bytes／字框／重疊通過；桌面及手機截圖已檢視 |
| A11Y-01–03 | 語意標題、鍵盤、無JS、答案收合 | 本機兩語無JS、Enter／Space 展開收合、下載鍵盤操作通過 |
| INT-01 | 無計算器、提交或評分 | 不適用；靜態閱讀與原生答案收合 |

## 實測紀錄

首次 scoped 瀏覽器檢查發現專屬 renderer 尚未接到目前元件分派，已修正；第二次發現三欄門檻高於實際文章欄寬，已改為容器 36rem。這兩項均在發布前處理。修正後與最後四文件邊框樣式調整後，兩語全文、四尺寸、200%、無JS、局部鍵盤捲動、答案與下載、搜尋及 SVG 字框／重疊檢查均通過（2/2 browser tests）。已檢視中英桌面、手機及 SVG 截圖，未見標籤裁切或錯誤箭頭方向。

單元 311/311 通過。型別檢查曾發現歷史測試保存版本變成 any，已補上 AaseLesson 型別；最終型別檢查 0 errors／0 warnings。歷史雙語及標題遷移測試改查保存前版，沒有以改寫現行教材充當歷史不變證明。

## 發布

尚待必要閘門、提交推送、Pages 成功及正式頁與圖檔回讀。工作位於隔離工作樹 `/tmp/kairos-aase-m0505`，原工作目錄的其他教材修改保持原樣。

實機、讀者理解、真實 OpenSpec CLI 操作與真實餐廳／醫療／銀行系統行為未驗；本次交付為教材抽換與網站發布。

### 發布前命令結果

- `pnpm run validate:content`：通過。
- `pnpm test`：311/311 通過。
- `pnpm run check`：0 errors／0 warnings。
- `node scripts/check-publication-boundary.mjs`：draft／future、英語課程與翻譯閘門通過，移除 fixtures 後重建乾淨 production。
- `pnpm run validate:release`：通過。
- `pnpm exec playwright test --config playwright.aase-m0505.config.ts`：2/2 通過。
- `python3 scripts/aase_m0505_content.py --check`、`python3 scripts/aase_m0505_svg.py --check`：通過。
- `git diff --check`：通過。

四個 SVG 大小依序：
- `m05-05-1-en.svg`：3548 bytes。
- `m05-05-1-zh.svg`：2982 bytes。
- `m05-05-2-en.svg`：3053 bytes。
- `m05-05-2-zh.svg`：2736 bytes。
