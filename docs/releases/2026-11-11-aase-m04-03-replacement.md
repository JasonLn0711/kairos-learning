# AASE M04-03｜資訊架構與視覺優先序完整抽換

本次依使用者完整供稿及六張隨文圖抽換 AASE-M04-C03。正式內容 revision 4／v1.1.0，修訂日 2026-11-11，原發布日 2026-11-05 保留。來源、正文、圖解與驗證由 kairos-learning 持有；其他課次的未提交修改留在原工作樹。

[原稿、六 PNG、前版與逐節採用](../sources/aase/m04-03/replacement-2026-11-11/source-map.md)保存來源與改動理由。兩語各有導言及九節、三表（3／5／6 列）、六張圖及完整六節 wireframe-notes.md 模板。原六個錨點保留；三題全新四選項檢核使用 Q04–Q06，答案 B／C／D，參考解析不儲存作答或宣告學習完成。

## 實作與圖意

- InformationHierarchyDiagram 沿既有 Svelte／HTML／CSS，僅工作流程出現四支方向箭頭；IA 保留巢狀包含，網站地圖保留首頁四平行分支及八個更深層子頁，A/B 平行比較，四狀態以 dl 對照。
- 手機重排保留節點和意義，圖 5 的桌面示例內仍保留 2／3 並排，手機示例為 1／2／3／4。文字直接可讀、選取、搜尋；模擬動作沒有假按鈕控制。
- aase.ts 固定課次、版型、節點數 3／5／2／4／2／5、欄位白名單及樹狀深度；sitemapGroups 拒絕孤立、過深或不合法縮排。
- aase_m0403_content.py 從完整雙語稿、figures.json 與 questions.json 產生 JSON。aase_m0403_svg.py 從正式 JSON 產生 12 份固定元素／屬性白名單 SVG，單圖 1,839–5,981 bytes。搜尋沿同一正文資料。

## 規則與驗收

| 規則 | 範圍與方法 | 本次狀態 |
| --- | --- | --- |
| WRITE-01–06、08–11 | 原稿逐章逐小節、比喻、八項服務、兩組分類、四狀態、五方法、六行業、兩研究方法、模板與三題；雙語深度與形狀；版本日期 | 完成來源／成稿逐節閱讀及對照；詳見 source-map |
| HTML-01–04 | 全文逐區塊順序、320／390／768／1280、200% 文字、局部表格／程式碼捲動、無 JS | 最終整合後兩語通過，包含圖 5 版型修正 |
| FIG-01–06 | 六種關係、同源搜尋與 12 SVG、文字框及重疊、下載位元組 | 最終兩語通過；兩語六圖的手機與桌面共 24 張截圖已逐張檢視 |
| A11Y-01–03 | 語意結構、原生答案收合、Tab／Shift+Tab／Enter／Space、可見焦點、可鍵盤局部捲動 | 最終通過；屬本頁檢查，非全站無障礙認證 |
| INT-01 | 無新增參數互動或運算 | 不適用；圖為可閱讀的靜態教材 |

初輪驗證修正了小節內條列與選項擠在標題的問題。既有英文／短標題歷史測試改以本次保存的前版檢查原遷移，不讓歷史等值檢查阻擋已授權抽換；本次正文另有獨立測試。

## 最終命令與發布證據

- 原件：`sha256sum -c SHA256SUMS`（來源目錄）八件通過。
- 生成器：`python3 scripts/aase_m0403_content.py --check`；`python3 scripts/aase_m0403_svg.py --check`。
- 新測試：`tests/aase-m0403-replacement.test.ts`；瀏覽器：`pnpm exec playwright test --config playwright.aase-m0403.config.ts`。本機證據：隔離工作樹 `.local/aase/m0403/`；正式站以 `AASE_BASE_URL=https://learn.cs-kairos.com` 指定。
- 整合遠端後全套單元 302／302 通過；型別檢查 0 errors／0 warnings。publication-boundary 最終通過草稿、未來日期與英文入口關閉，並重建乾淨正式輸出。
- 最終 `pnpm run validate:content`、`pnpm run validate:release`、`git diff --check` 通過；最終瀏覽器兩語 2／2 通過。`pnpm audit --audit-level=high` 通過，現有 4 low；共用 HTML 六個 Python 測試及六份 MATLAB ZIP 雜湊均通過。
- 原始來源提交 `9779ade`、教材實作 `73bf11f`、保留雙方歷史的整合 `e642b97`。保留同期 M03-05／M04-01／M04-02／M04-04／M04-06 與 CEH 更新；衝突解決後重新執行上述驗證。
- Git 已推送 `origin main`，提交 `012bc42345a9ada8928a675ea2d6ab27d84205b0`；推送後 fetch divergence 為 `0 0`。Pages 工作流程及正式站全文／12 圖回讀見下方追蹤。

尚未進行實際學員、輔助科技或實體手機驗收；教材中的設計候選與靜態草圖不等於真實使用者測試成果。發布也不代表理解或課程完成。

最終本機日誌留在 `/tmp/kairos-m0403-tests.log`、`/tmp/kairos-m0403-check.log`、`/tmp/kairos-m0403-final-boundary.log`、`/tmp/kairos-m0403-final-release.log`、`/tmp/kairos-m0403-final-browser.log`。瀏覽器結構化結果在隔離工作樹 `.local/aase/m0403/results.json`，截圖與 trace 同目錄；正式站驗收會更新該結果。

第二次推送前因遠端新增 M04-06 而遇到 non-fast-forward，已保留雙方內容再整合；型別 0 errors／0 warnings，302 個單元測試通過。共用來源、渲染器與歷史快照測試保留各課次已授權的更新。

## 正式發布追蹤

- 發布提交：`012bc42345a9ada8928a675ea2d6ab27d84205b0`。原稿／實作提交與此提交保持祖先關係，沒有 force push 或改寫歷史。
- [Pages run 42986237850](https://github.com/JasonLn0711/kairos-learning/actions/runs/42986237850)：`success`，全部發布閘門及 Pages 部署通過；部署來源為上述完整 SHA。
- 最新本機型別與 302 單元測試通過；中英瀏覽器 2／2 通過，另明確核對六個舊錨點及表格、程式碼、狀態對照文字至少 16 px／1.7 行高。保留同期 M04-04 修正，不將其他課次的設計更新計為本課成果。
- 本機瀏覽器結果與截圖備份：隔離工作樹 `.local/aase/m0403-local-acceptance/`；正式站結果將留 `.local/aase/m0403/`，避免兩層證據混用。
- 正式頁：https://learn.cs-kairos.com/courses/aase/v1/m04/concepts/m04-03/ ，英文為 `/en/courses/aase/v1/m04/concepts/m04-03/`。
- 正式站完成狀態：2026-11-11 16:22:59–16:23:26（Asia/Taipei）執行同一完整瀏覽器檢查，中英 2／2 通過，0 skipped／0 unexpected／0 flaky。

## 正式站驗收結果

1. 正式中英頁均為 v1.1.0，原發布日與修訂日正確；逐區塊核對全部正文、標題、三表、模板、三題四選項及解析。六個既有錨點各出現一次，前後導覽與同源搜尋可用。
2. 每語在 320／390／768／1280 CSS px 與 100%／200% 文字下核對；頁面無水平溢出，表格／程式碼使用可鍵盤捲動的局部區域。本文、圖說、表格、程式碼與狀態對照符合已檢查的字級與行高條件。關閉 JavaScript 後全文及原生參考答案仍可讀。
3. 實測 Tab／Shift+Tab／Enter／Space、可見焦點、參考解析與下載連結。圖 1 保留三層包含，圖 2 四個平行分支與八個子頁，圖 3 A/B 比較，圖 4 無時序箭頭，圖 5 保留兩種版型的閱讀順序，圖 6 五步四箭頭。
4. 12 份 SVG 均 HTTP 200，下載內容與正式 JSON 產生的本機檔案逐位元組相同，文字框無越界／文字重疊，單圖小於 100000 bytes。工作坊 ZIP 及 SHA256SUMS.txt 同樣回讀一致。
5. 正式站兩語六圖的 390／1280 截圖共 24 張，與已檢視的最終本機截圖逐位元組相同。此處是瀏覽器模擬尺寸與程式檢查，實體裝置、輔助科技與真實學員接受度仍未評估。

[正式部署工作流程](https://github.com/JasonLn0711/kairos-learning/actions/runs/42986237850) 在 `012bc42` 上重新執行全部內容／302 單元／型別／publication-boundary／release／下載雜湊閘門，全部成功。部署 ID 為完整提交 SHA，Pages artifact ID `13839643031`。正式站日誌 `/tmp/kairos-m0403-live-browser.log`；CI 完整日誌 `/tmp/kairos-m0403-pages-complete.log`。詳細結果另見本回執旁的 `2026-11-11-aase-m04-03-checks.json`。
