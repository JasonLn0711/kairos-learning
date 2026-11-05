# M04-03 FTP／SMTP 完整白話教材抽換

M04-03 改用完整供稿，保留十一章、SMTP 第二部分標記、重點整理及兩組理解檢核。中英各 330 區塊，包括 6 表、22 段命令／文字範例、兩張重製圖及五段編輯參考解答。公開課次依 WRITE-08 使用 M04-03，內部 CEH26-M04-C03／短網址保留；v1.1.0 擴充教學深度與範例，原發布日 2026-11-04 不變，版本修訂日 2026-11-05。

## 來源與範圍

[來源目錄](../sources/ceh26-m04-c03/replacement-2026-11-05/README.md)保留三個原始附件、前版 JSON、完整中英稿、圖解模型、雜湊與編輯處理。原始檔與本次附件逐位元組一致；中文採用稿以五項明列格式／靜態語氣調整逐字核對，沒有以摘要取代小節。英文 330 個區塊類型、順序、章節錨點與表格維度相同，純 ASCII 命令範例逐字相同。

第一張圖保留 FTP 用戶端／伺服器、兩條雙向通道及 SMTP 三角色／兩段單向傳送；雙向線表示交換，不表示連線發起方向。第二張圖三張卡並列呈現觀察、已完成與尚不能推論，底部保留證據公式。HTML 可選取、搜尋、重排；SVG 為同模型的固定桌面下載版，使用既有 sanitizer。參考 PNG 保留在來源用途，不作手機縮圖正文。

舊稿、SVG 與原 ZIP 保留原位及 Git 歷史。正文與圖解直接可見；只有新增參考答案採原生收合，qa=[]。本次沒有真實 FTP／SMTP 權限、郵件轉送或學習者作答證據。

## 本機實測

- WRITE-01–06、08：原始附件與採用稿雜湊核對；來源／版本／公開課次／雙語條件核對通過。RFC 與 OpenSSH 來源校對範圍見 source-review.md。
- `npm run validate:content`：通過；`npm test`：196 項通過；`npm run check`：0 錯誤、0 警告。兩個產生器 `--check` 以正式來源核對正文及四個 SVG，成功後回報實際產物數。
- publication-boundary：draft／future 標記未出現在 752 份部署文字，英文課程 draft／future 閘門通過並還原乾淨正式建置。`npm run validate:release` 全套通過，含既有封裝檔及教材邊界；本次沒有重製舊 ZIP。
- HTML-01–04、A11Y-01–03：C03 五項瀏覽器檢查通過，中英完整正文順序、14 個主標題（11 章及部分／整理／檢核）、320／390／768／1280 CSS px、200% 根字級、無 JavaScript、答案 Enter／Space、Tab／Shift+Tab 焦點、搜尋、前後篇與 pending 404。兩語 320px／200% document.scrollWidth 均為 320。
- FIG-01–06：桌面／手機 HTML 及四張下載圖已目視；四個 SVG 文字矩形位於圖面內，實際 Enter 下載與來源位元組一致。文字／色底最低對比 5.83:1；不用顏色作唯一區分。protocols zh 5513／en 6070 bytes，evidence zh 3578／en 4576 bytes，皆低於 100000。
- 共用 SourceBody 的 C02 瀏覽器回歸：22 項通過。INT-01 無計算互動，不適用。
- 首輪無 JavaScript 測試把三個非 section-* 主標題誤算入該前綴選取器；已改為 11 個章節加逐一核對部分／整理／檢核，兩語全套五項通過，未刪除正文來配合測試。

Linux ARM64／Playwright Chromium 代理驗收證據在 `.local/c03/`（忽略檔）。真人手機、完整螢幕閱讀器與獨立理解仍待驗，不作完整無障礙或學習完成聲明。

## 發布基準與下一關

隔離工作樹以 7f4293e 起稿，保留主工作目錄既有 CEH／AASE 修改；同期遠端 543730a 只更新 C05 文件，合併保留。C01／C02／C04／C05 與待發布閘門保持。本次源稿、實作與文件分開提交並以 HEAD:main 推送；正式站兩語全文與四份圖檔須於實際 Pages 成功後回讀，結果接續記錄。

最後目視下載圖後，增加英文角色卡底部留白；產生器以具命名群組的五張角色卡輸出，瀏覽器另核對每段文字均落在自己的卡片內，不只檢查整張 viewBox。catalog 對四個固定路徑另拒絕少節點、錯版型及缺證據行的資料，避免直接編輯 JSON 時繞過來源產生器。

## 正式發布與回讀

- 來源保存 `5a0aafc`；完整教材／圖解／測試 `f44571b`；契約與本機紀錄 `dc10644`；保留同期遠端 C05 文件的 merge `7925ae7`；最後圖文邊界與模型驗證 `a25a07e`。以 `git push origin HEAD:main` 發布後 fetch，分歧 0／0，沒有 force push 或重寫歷史。
- [Pages run 42016258995](https://github.com/JasonLn0711/kairos-learning/actions/runs/42016258995) success，headSha 為 `a25a07e4fb76e0244c98baa6cd05f6f2e801ce06`，與本次內容提交完全一致。
- 正式頁面：[中文](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-03/)／[English](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-03/)。執行 `CEH_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.ceh26-m04-c03.config.ts`：五項通過，22.4 秒。
- 正式站核對完整來源順序、M04-03 主標題、v1.1.0、原發布／修訂日期、四種寬度、200% 根字級、關閉 JavaScript、鍵盤答案及下載、搜尋、C02／C04 導覽與 pending 404；320px／200% 兩語 document.scrollWidth 都是 320。
- 四份正式 SVG 位元組與來源一致，實際 Enter 下載成功；文字位於完整圖面及各自角色卡內。正式站結果／截圖在 `.local/c03/`，本機結果保存在 `.local/c03-local/`；執行 log `/tmp/c03-production.log` 為本機忽略證據，不納公開 Git。
- 另外核對三份原始附件逐位元組、採用稿與模型雜湊，以及前版中英稿／原 ZIP 與起始提交一致。主工作目錄只同步本次 C03 檔案與既有共用入口；其餘 CEH／AASE 與未追蹤工作保留，沒有混入本次提交。

本節只補記已觀察發布，不改正文或圖解。真人手機、完整螢幕閱讀器與獨立學習理解保持待驗；網站發布不新增本人教學交付、學習分數、實作完成、排程或工時。

<a id="planning-closeout-2026-11-05"></a>
## FIRST PRINCIPLE 與 Planning 連接

稀缺資源為閱讀注意力、審稿時間與可信發布證據。Jason 提供完整供稿、兩張參考圖與公開課次要求；代理完成來源保存、雙語／圖解、工程驗證與發布。Kairos Learning 持原文、模型及詳細證據；Planning 持定位、狀態、容量及下一關：

- [11/5 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/days/2026-11-05.md#kairos-m0403-closeout-2026-11-05)：貢獻、結果與接手關卡。
- [網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-m0403-closeout-2026-11-05)：與 M04-04／05、WRITE-08 及共用渲染契約連接，各篇來源與回執保留。
- [CEH 專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-07-ceh-cehp-certification-training.md#kairos-m0403-closeout-2026-11-05)：網站修訂與私人交付、作答／理解分開。
- [W45 回顧入口](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/weekly-plan.md#kairos-m0403-closeout-2026-11-05)：已完成維護成果，不新增週輸出或容量。

Planning 最新 C06 交付後接 C07 的路線保持；不回填本人答案、不重排進度、不新增時段或把代理時間計為個人工時。下一關由 Jason 於下次正常閱讀回報兩組情境題答案／卡點；實機、完整螢幕閱讀器與獨立理解仍待證。來源與實作維持本回執前述已發布版本，本輪只補導航並按 repo／邏輯分開提交。
