# AASE M03-01｜從模糊要求寫出問題陳述 v1.1.0

本次依使用者供稿抽換正式雙語正文，涵蓋導言及十節、七組隨文圖、兩表、原樣十節 problem.md 範例、三題三選項與一題開放追問。保留 stable ID、原發布日 2026-11-05、URL、閱讀進度識別及英文翻譯閘門；修訂日期為 2026-11-07、revision 6。新題 Q04–Q07 與舊題分開，qa 保持空陣列。本站提供原生參考解答，不提供送交教師或保存成績。

正本：[教材 JSON](../../content/aase/lessons/aase-m03-c01.json)。[來源包](../sources/aase/m03-01/replacement-2026-11-07/README.md)保存完整供稿、七 PNG、v1.0.4 與 SHA-256；[逐節對照](../sources/aase/m03-01/replacement-2026-11-07/source-map.md)列出每個教學細項與七圖差異。來源、解讀、實作、驗證與發布各自留證。稀缺資源是編輯與閱讀者驗收時間；詳細教材、來源與測試由 kairos-learning 維護，Planning 若需引用僅記定位、版本、驗證與下一閘門。

## 規則與證據

| 規則 | 本次落實 |
| --- | --- |
| WRITE-01–04、09–11 | 完整來源獨立保存，逐章與細項對照；保留人工漏看、補件與 To-Be 仍待驗證的界線。NN/G 原則僅支援介面檢查，沒有把合成情境當現場結果。 |
| WRITE-05 | 中英十一個章節 ID、段落數、表格、圖節點、條件、題目與答案鍵對應；十節範例共用可複製繁中原稿，英文逐項解說。 |
| WRITE-06–08 | 原發布日固定，版本與修訂日配對；沿用 M03-01 顯示課次與現有署名。 |
| HTML-01–04 | 四種寬度、200% 根字級、無 JS 全文、局部捲動與頁面無溢出實測。 |
| FIG-01–06 | 七 PNG 分別重製，HTML／搜尋／十四 SVG 共用 JSON；兩類比較無箭頭，舊／新流程分開，文件鏈保留端點。SVG 僅固定元素及 escaped text。 |
| A11Y-01–03 | 圖說、語意文字、表頭及原生參考答案；Tab／Shift+Tab／Enter 下載、Enter／Space 答案與可見焦點實測。 |
| INT-01 | 靜態教學與原生答案；未新增評分、提交或學員進度。 |

## 本機驗證

隔離工作樹 `/tmp/kairos-aase-m0301`，基底 `bb445be`。共享工作區其他課次的修改不納入本次提交。來源前版改從 Git `dba4c0f` 取得，避開其他工作執行發布邊界驗證時短暫出現的 future fixture。

- `npm run validate:content`：通過。
- `npm test`：251／251 通過；新增來源、身分／閘門、舊錨點、原稿十節範例、原選項、圖資料拒絕及 SVG 同步檢查。歷史遷移測試改核對歸檔前版，保留其原本保真驗證。
- `npm run check`：0 errors、0 warnings。
- `node scripts/check-publication-boundary.mjs`：draft／future、英文課程閘門及乾淨正式產物重建通過。
- `npm run validate:release`：通過，含站內連結、錨點、公開資產與現有各課驗證。
- `npm audit --audit-level=high`：通過，5 項 low，沒有 high／critical；套件沒有因本次改動新增。
- `npx playwright test --config playwright.aase-m0301.config.ts`：雙語 2／2 通過，逐節全文、表格、模板、三題選項解析與開放題；320／390／768／1280 與 200% 字級；無 JS；鍵盤焦點／捲動／答案；搜尋；十四圖文字無越界或重疊、下載 bytes 比對。
- 桌面繁中七圖、手機英文七圖及流程 SVG 已目視核對；圖 4 保留兩組獨立流程，圖 6 寬版兩層及窄版順序一致。目視發現 SVG 圖 6 第一箭頭被下一卡遮擋，已縮短箭頭至兩卡間隙並重新驗證。
- `python3 scripts/aase_m0301_svg.py --check`、來源 `sha256sum -c SHA256SUMS.txt` 及 `git diff --check`：通過。十四圖 1458–3588 bytes，均小於 100000 bytes。

截圖與測試 JSON 留在忽略的 `.local/aase/m0301/`；原始圖保存於來源包。前一成功部署為 [Pages 42338489004](https://github.com/JasonLn0711/kairos-learning/actions/runs/42338489004)，commit `513cceae3cf3c90d932f74b05c978ce954e7d4f6`。

## 發布與下一驗證

正式 Git／Pages／站點回讀於實際完成後追加。本回執的本機測試不代替部署結果。實體手機、完整輔助科技驗收與學員理解仍待實際驗證；沒有執行真實收件業務或聲稱效率提升。

## 正式發布確認

- 來源提交 `7e82143`，教材／圖解／驗證提交 `cf632d4`；合併遠端 M02-02 為 `1cb135b5229bb3c03a45b28cd16276f5a0babdc6`。只在 `docs/content-authoring.md` 末尾出現追加文字衝突，兩段維護說明均保留。
- 合併後型別 0 errors／0 warnings、單元 251／251、publication-boundary、release、M03-01 雙語瀏覽器 2／2 均再次通過；M02-06 共用渲染回歸 2／2 通過。
- `git push origin HEAD:main` 成功；推送後 fetch 及 divergence 為 `0 0`，沒有重寫歷史。
- [Pages 42386830191](https://github.com/JasonLn0711/kairos-learning/actions/runs/42386830191) 對應 `1cb135b`，遠端完整 CI 與部署結論為 `success`。
- 2026-11-07 執行 `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0301.config.ts`：**2／2 通過，20.4 秒**。正式站逐節全文、表格、完整模板、題目解析、四種寬度、200% 字級、無 JS、鍵盤、搜尋及十四張 SVG 下載 bytes 均與本次驗證版本一致；SVG 文字無越界或重疊。
- 公開頁：[繁中 M03-01](https://learn.cs-kairos.com/courses/aase/v1/m03/concepts/m03-01/)／[English M03-01](https://learn.cs-kairos.com/en/courses/aase/v1/m03/concepts/m03-01/)。
- 發布後遠端另有其他課次提交，已以 fast-forward 保留整合。這些提交沒有取代本課的來源、正文或圖解。此回執以獨立文件提交保存，使用 `[skip ci]`，不把文件回執宣稱為新的教材部署。

本次教材抽換與正式站驗證完成。待驗界線維持：實體手機、完整輔助科技驗收、學員理解及真實收件工作流程成效；本次沒有新增批改服務或正式業務系統。
