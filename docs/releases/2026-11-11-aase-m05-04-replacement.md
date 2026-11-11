# M05-04 SDD 完整供稿抽換

## 採用與所有權

AASE-M05-C04 revision 4／v1.1.0，原發布日2026-11-05固定，修訂日2026-11-11。正本、供稿、前版及圖檔由kairos-learning持有；[來源保存](../sources/aase/m05-04/replacement-2026-11-11/README.md)與[逐小節對照](../sources/aase/m05-04/replacement-2026-11-11/source-map.md)連接採用理由與正式正文。本次稀缺資源是雙語內容與圖意驗收；Planning角色為定位、驗證、發布狀態及下一步，不複製原稿。

雙語八節完整承接導言、七節全部小節、六項餐廳檢查、六列影響表、兩個候選情境、五列人機分工、三個跨業案例、三種錯誤、完整Markdown範本及三題開放檢核。六個舊錨點、Q01–Q03、練習、發布與翻譯閘門保留；新增Q04–Q06是教學參考題，qa仍空白。第四欄仍為候選；工作坊三欄程式未改。

五步圖依附圖保存次序、四個向下箭頭、最後決策淡綠強調與迭代註記。正文是可選取／搜尋的HTML；獨立SVG從正式JSON以固定元素輸出，沒有外部資源或原始標記注入。中文2586 bytes、英文2542 bytes；固定幾何圖與頁面重排的差異已記入來源對照。NASA SWE-052於本次回讀，正式正文新增直接來源連結。

## 適用規則

WRITE-01–06、08–11：保留來源、舊版、逐小節採用及雙語條件；原日期與新版本成對維護，正文保留合成與候選界線。WRITE-07沿既有品牌署名。

HTML-01–04、FIG-01–06、A11Y-01–03：語意標題、表格、程式碼、可見圖解與原生參考答案；五步順序及決策分組維持。INT-01沒有新增計算或模擬，不啟動額外互動。

## 驗證與發布

目前：來源保存、正文採用與雙語SVG已完成。首次型別檢查0 errors／0 warnings；全測311／311通過。兩項舊版遷移測試改讀本次保存的前版，當前教材由專屬測試驗證。發布邊界完成draft／future及英文閘門，暫時fixture已移除並重建。

瀏覽器初輪在發布邊界重建期間讀到暫時英文關閉頁，不作驗收；後續順序重測。正文列表初輪發現尚未套用既有AaseProse，已加上本課渲染分支，保持其他課次不變。最終瀏覽器、靜態發布檢查、Git與正式頁回讀結果待後續實測追加。

待驗：實體手機、完整螢幕閱讀器及真人理解；瀏覽器與測試不代表學員已完成或正式環境四欄變更已接受。

## 最終本機驗收

Linux／Playwright Chromium，中英文各一項整合檢查通過（2 passed，5.8s）：逐節全文與順序、六／五列兩表、三段程式碼、三題答案、320／390／768／1280 CSS px及200%字級、無JS、頁面無水平溢出、圖中文字至少16px／行高1.8、Tab／Shift+Tab／Enter／Space、局部捲動、搜尋、SVG文字viewBox邊界／互相重疊／下載bytes及工作坊ZIP皆已核對。目視中文390、英文1280及中文SVG截圖，五節點、四箭頭及決策強調符合附圖。截圖與JSON結果在隔離工作樹 `.local/aase/m0504/`。

來源提交d054ab1、教材與驗證提交7b8c708。以origin/main建立隔離工作樹，原工作樹既有修改未攜入；9c68c12合併保留並行發布。合併後311／311單元及型別零錯誤／警告，正式建置與validate:release通過。發布邊界已於本次內容上驗證草稿、未來日期、翻譯與英文課程閘門；沒有改動發布規則。發布前最近成功run為42987098978（de7ce8d），並行run 42987132405當時仍執行中。

可重現：`pnpm test`、`pnpm run check`、`node scripts/check-publication-boundary.mjs`（與全測／瀏覽器依序執行）、`pnpm run validate:release`、`pnpm exec playwright test --config playwright.aase-m0504.config.ts`。正式站回讀加 `AASE_BASE_URL=https://learn.cs-kairos.com`。

## 正式發布與回讀

[d2dcf9e](https://github.com/JasonLn0711/kairos-learning/commit/d2dcf9ed2b365c5538706366863885604a2f016f)保留並行M03-03回執後推送main，fetch確認0 0。[GitHub Pages run 42987636523](https://github.com/JasonLn0711/kairos-learning/actions/runs/42987636523)所有品質閘門與部署成功。

2026-11-11 16:33（Asia/Taipei），`AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0504.config.ts`正式站中英2／2通過（13.2s）。[繁體中文](https://learn.cs-kairos.com/courses/aase/v1/m05/concepts/m05-04/)與[English](https://learn.cs-kairos.com/en/courses/aase/v1/m05/concepts/m05-04/)均實際回讀v1.1.0、逐節全文／順序、兩表、三段程式碼、開放題答案、四尺寸／200%、無JS、鍵盤焦點與局部捲動、搜尋與SVG；兩份正式SVG的下載bytes與提交逐檔相同，文字邊界與重疊均通過。工作坊ZIP與checksum亦維持一致。

機器可讀的[正式站測試摘要](2026-11-11-aase-m05-04-checks.json)保留實測時間、版本、部署commit與兩語結果；詳細截圖／trace／原始JSON在隔離工作樹 `.local/aase/m0504/`。供稿與圖片最後以cmp回比附件，均完全一致。

來源保存、全文採用、圖解設計、驗證、推送與正式站回讀已完成。實體手機、完整螢幕閱讀器及真人理解仍是獨立待驗層；沒有將本次發布寫成第四欄實作或學員通過。原工作樹無關修改保留，未納入本次提交。
