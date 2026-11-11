# M09-01 完整供稿抽換與圖解驗收

本次由 `kairos-learning` 保存來源、正文、圖解、測試與發布證據。原稿要求將 Git、Diff、Commit、Restore 完整教學及兩張隨文圖抽換至正式課次。公開課次維持 M09-01，原發布日 2026-11-05；本次 v1.1.1／revision 5，修訂日 2026-11-11。原本十節內容完整採入導言加十個 section，六個既有錨點保留。

來源正本與逐節採用：[來源對照](../sources/aase/m09-01/replacement-2026-11-11/source-map.md)。原始文字、兩張 PNG、前版 JSON 及 SHA256SUMS 保留，雙語成稿與生成器分開。正文有五張表格、十段原始命令、三題原四選項 B／B／C，使用原生參考解析；沒有送出、評分或學習完成服務。

四位置圖保留四列、三條有標籤的動作箭頭、暫存淡藍與本機淡綠；四項結果圖為並列清單，勾號只表示預期條件。HTML 可搜尋、可換行，四份中英 SVG 由正式模型產生。補充 HEAD／日期來源、署名、Word 比喻及研究重現界線，逐項記於來源對照。

## 規則與本機實測

| 規則／驗證 | 實測與範圍 |
| --- | --- |
| WRITE-01–04、09–11 | 逐節核對原稿與中英成稿，包含四位置四小節、Diff 表、兩類 Commit 訊息、Restore 兩表、A–D 全命令、三產業、三錯誤、九列總表與三題選項。格式／技術修正另列來源對照 |
| WRITE-05、06、08 | 雙語相同 section／block／表格與指令結構，保留課次、原發布、六錨點；新版 1.1.0 與修訂日一致 |
| FIG-03–06 | 受限四位置 flow／四條件 cards，非法種類、節點數、action 順序與 markup 拒絕；四 SVG 同源與白名單檢查通過，均小於 100000 bytes |
| Git 操作 | `tests/aase-m0901-replacement.test.ts` 在獨立合成目錄實跑文章 A–D；斷言目標基準、keep 新修改、完整備份、單一原 Commit、暫存未變及只剩預期 status，全數通過 |
| 全部單元 | `pnpm test` 初次 325／325；最終修正版與遠端整合後 375／375 通過，正式部署 CI 同為 375／375；舊翻譯與短標題遷移測試改讀本次封存前版，現版由新測試驗證 |
| 型別 | `pnpm run check`：0 errors、0 warnings（正文成稿與原生圖解元件） |
| 發布閘門 | `node scripts/check-publication-boundary.mjs` 通過：第二課 fixture、draft／future 隔離、English draft／future routes／search／payload 關閉，finally 重建乾淨輸出 |
| 發布驗證 | `pnpm run validate:release` 通過；`pnpm audit --audit-level=high` 通過（4 low，無 high）；`git diff --check` 通過 |
| 共用 HTML | `python3 -m unittest discover -s scripts -p test_validation_html.py`：6／6 通過 |
| HTML-01–04、FIG-01–04、A11Y-01–03 | 本機兩語瀏覽器 2／2 通過：逐節全文、五表、十段命令、三題及解析，320／390／768／1280 px × 100%／200% 文字，無 JS、Tab／Shift+Tab／Enter／Space、局部捲動、可見焦點、搜尋全文及四 SVG 下載位元組／字框／重疊。390／1280 截圖已人工檢視，流程端點、淡藍／淡綠與並列勾號清楚。 |

完整驗證入口：`python3 scripts/aase_m0901_content.py --check`、`python3 scripts/aase_m0901_svg.py --check`、`pnpm exec playwright test --config playwright.aase-m0901.config.ts`；正式站同入口加 `AASE_BASE_URL=https://learn.cs-kairos.com`。畫面與報告保存在忽略的 `.local/aase/m0901/`。

## 發布狀態與邊界

v1.1.1 已正式部署並完成兩語全文與圖檔回讀。初版正式站的合成 email 改寫問題已透過本課固定 email_off 註解修正；實際開啟／關閉 JavaScript 都保留完整指令。主工作樹包含其他文章修改，本次在 `/tmp/kairos-m0901` 從遠端 main 建立隔離工作樹，只提交本課及必要共用接點；保留原工作樹與遠端歷史。

本機 Git 練習證明本課命令在此環境的行為，瀏覽器驗收只證明所列尺寸與操作；未將它們解讀為學員能力、真實裝置觸控驗收或全站改善。

## 正式站發現與局部修正

第一次部署 [9a39a965／42992145430](https://github.com/JasonLn0711/kairos-learning/actions/runs/42992145430) 成功，CI 368／368；正式站逐節回讀在兩語的初始化命令發現 `learner@example.invalid` 被換成 `/cdn-cgi/l/email-protection` 連結。此結果列為發現差距，未以本機通過代替完成。v1.1.1 只在本課輸出加入固定 email_off 註解，保留原始命令與站點設定，並驗證內容文字仍跳脫、無保護連結、無 JavaScript 可複製；原始失敗報告保留在忽略的 `.local/aase/m0901/initial-production-results.json`。

## 正式發布與回讀完成

- 來源提交 `d602f6f`，完整正文／圖解提交 `ff1ad37`，CDN 保真修正 `063e209`；歷史保留合併後，以 `9e28652` 推送 `origin HEAD:main`，立即 fetch 的差異為 `0 0`。原主工作樹的其他修改保持原樣。
- [GitHub Pages 部署 42993094803](https://github.com/JasonLn0711/kairos-learning/actions/runs/42993094803) 為包含修正提交的後續整合版本 `726c2b94794c269cd8ea042f635b8ca59d2c3f38`；祖先關係已核對，部署在 2026-11-11 17:14:20（Asia/Taipei）成功，CI 375／375。
- [中文正式頁](https://learn.cs-kairos.com/courses/aase/v1/m09/concepts/m09-01/)與[英文正式頁](https://learn.cs-kairos.com/en/courses/aase/v1/m09/concepts/m09-01/)均已回讀。原發布 2026-11-05、v1.1.1、修訂 2026-11-11 三項資訊一致。
- `AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0901.config.ts`：兩語 2／2 通過（21.2 秒）。逐節全文、表格、十段命令、三題及原生解析、四種寬度／200%、無 JS、鍵盤、同源搜尋、四份 SVG 字框／重疊／下載位元組均通過；初始化指令中的合成 email 完整保留，沒有保護連結節點。
- 正式頁 390／1280 px 截圖已檢視；四位置與三動作箭頭、暫存淡藍／本機淡綠、四項並列核對結果保持參考圖語意。圖檔大小 1659–2505 bytes，完整雜湊與範圍見 [機讀驗收紀錄](2026-11-11-aase-m09-01-checks.json)。
- 本機證據為 `.local/aase/m0901/patch-local-results.json`，正式站證據為 `production-results.json`，部署 log 為 `patch-deployment.log`；第一次正式站差距保留在 `initial-production-results.json`。這些執行細節由本 repo 保存，未複製到 Planning。

WRITE-05、09–11、HTML-01–04、FIG-01–06、A11Y-01–03 的本篇驗收已完成；INT-01 不適用，沒有新增計算互動。實體裝置觸控驗收與學員理解未評估。本次完成範圍為 M09-01 內容、兩張參考圖、來源紀錄及正式發布。
