# M04-04 SMB 全文抽換

本次將簡短複習稿換成完整 SMB 教學，中英各十一章、十一個表格、39 段命令或文字範例、兩張圖解與四題理解檢核。課次顯示 M04-04，stable ID 與網址保留。原發布日 2026-11-05 保留，新增教學範圍升 v1.1.0。WRITE-08 記錄後續標題格式。

來源正本與編輯處理：[完整來源](../sources/ceh26-m04-c04/replacement-2026-11-05/README.md)。舊版全文留在來源上層及 Git 歷史。新增參考答案是編輯解答，預設收合；qa 空陣列，無學習者作答／完成聲明。

## 範圍與基準

- 本次網站正本：kairos-learning；來源、實作與驗證均留於本 repo。
- 發布前基準：b73cdec6610dc3c8564ece6ea4fd5ca218baad3d；[成功 Pages run 42004054843](https://github.com/JasonLn0711/kairos-learning/actions/runs/42004054843)。
- 隔離工作樹驗證，不包含同時編輯的 C05；保留其他工作與遠端歷史。
- 圖 1：五個順序關卡、成功範圍與推論界線；圖 2：五筆三欄證據對照。深藍配色及關係沿參考圖，字體沿站內設定；窄欄上下重排。SVG 為固定桌面下載圖，頁面 HTML 承接可搜尋、選取文字。

## 已執行

- WRITE-01–06、08：十一章與原稿逐章核對；三份原始附件雜湊與附件逐位元組相同。英文與中文 408 個區塊類型、順序、錨點及表格維度相同；程式命令、案例身分與操作結果保持。章節指引及 Microsoft 引用修正明載編輯紀錄。
- `python3 scripts/ceh26_m04_c04_content.py --check`：正文與四個 SVG 生成一致。
- `npm run validate:content`：通過；`npm test`：190 項通過；`npm run check`：0 錯誤、0 警告。
- HTML-01–04、FIG-01–06、A11Y-01–03：C04 瀏覽器五項通過；中英 320／390／768／1280 CSS px、200% 根字級、完整正文順序、標題、前後篇、搜尋與 pending 404；兩語關閉 JavaScript 仍可閱讀與展開答案。Tab／Shift+Tab／Enter／Space 驗證原生答案控制，Enter 驗證四個 SVG 下載，下載與來源位元組一致。
- 四個 SVG 皆小於 100000 bytes：stages zh 5332／en 6824；evidence zh 4412／en 5433。瀏覽器文字矩形核對全在 900×675 viewBox 的實際顯示範圍；目視桌面／手機 HTML 與中英下載圖，保留次序、三欄關係及顏色文字提示。本機證據 `.local/c04/`（忽略檔）。
- 首輪 SVG 頂層文件全頁截圖等待逾時，正文四項已通過；改用相同回應 SVG 置於 HTML 頁面進行幾何／截圖驗收後，全套五項通過。版面調整後以完成的乾淨 build 重跑；不引用建置期間的結果。
- publication-boundary：draft／future 標記未進入 744 份部署文字，英文課程 draft／future 閘門皆通過並還原乾淨正式建置。release 全套通過，含舊教材、SVG、MATLAB ZIP 及 AASE workshop；audit 高嚴重度閘門通過，五筆既有 low finding，未改套件。
- C02 共用 SourceBody 瀏覽器回歸：22 項通過。本節記錄本機結果；正式站回讀見下方發布紀錄。

## 遠端整合後複驗

遠端 C05 來源／實作 bd03f73、3c88d24 已發布，採保留雙方意圖合併；共用 SourceBody 同時保留兩篇的圖解、字級與鍵盤程式碼區，content-authoring 保留兩篇契約。C05 正文、圖檔與驗證器保持遠端版本。

整合後 content、完整單元測試、型別、publication-boundary 與 release 均通過；C04 五項、C05 五項、C02 二十二項瀏覽器測試通過。SVG 最後改用既有 m0903_svg sanitizer 與受限 viewBox，固定圖面等比例轉換，並重新生成、建置、release 與三組瀏覽器驗證。正文與圖解資料不變。瀏覽器與截圖為代理操作證據，不代表實體手機、獨立學習者或完整輔助技術認證。INT-01 無計算互動，不適用。

## 正式發布與回讀

- 來源保存 a9bb3ea；教材實作 1112a75；契約／本機回執 780d2ad；合併保留 C05 的 44a9282／bc52e8e；SVG serializer 整合 f294c31；最後瀏覽器型別修正 3a37d40。
- 推送 `origin HEAD:main` 後 fetch，分歧 0／0。初次推送遇到遠端新增 C05 正式回執 7e4c913，已保留該提交及其中僅空白變動的元件；不改寫歷史。
- [Pages run 42005549427](https://github.com/JasonLn0711/kairos-learning/actions/runs/42005549427) success，headSha 為 `3a37d40fd1c1676c1c47d8dd41b10adc3cfb5666`，與推送內容一致。
- 正式頁面：[中文](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-04/)／[English](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-04/)。正式站 `CEH_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.ceh26-m04-c04.config.ts`：五項全通過，22.9 秒。
- 正式站逐項核對完整正文順序、M04-04 主標題、v1.1.0 與日期、四尺寸、200% 文字、無 JavaScript、原生答案鍵盤操作、搜尋、前後篇及 pending 404。320px／200% 兩語 document.scrollWidth 均為 320。
- 四份正式 SVG 回應逐位元組符合來源，實際 Enter 下載成功；下載圖文字位於圖面內。圖解文字／背景配色計算的最低對比為 8.02:1。正式瀏覽器結果與截圖在 `.local/c04/`；本機結果保存在 `.local/c04-local/`，執行 log 為 `/tmp/c04-production.log`（不納入公開 Git）。
- 本回執補記不改教材、圖解資料或產物。實體手機、完整螢幕閱讀器與獨立學員理解仍未驗；不作完成聲明。主工作目錄的 AASE／其他同步修改保留，未納入本次提交。
