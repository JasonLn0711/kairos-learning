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
- 四個 SVG 皆小於 100000 bytes：stages zh 5199／en 6691；evidence zh 4265／en 5286。瀏覽器 getBBox 核對文字全在 1600×1200 viewBox；目視桌面／手機 HTML 與中英下載圖，保留次序、三欄關係及顏色文字提示。本機證據 `.local/c04/`（忽略檔）。
- 首輪 SVG 頂層文件全頁截圖等待逾時，正文四項已通過；改用相同回應 SVG 置於 HTML 頁面進行幾何／截圖驗收後，全套五項通過。版面調整後以完成的乾淨 build 重跑；不引用建置期間的結果。
- publication-boundary：draft／future 標記未進入 744 份部署文字，英文課程 draft／future 閘門皆通過並還原乾淨正式建置。release 全套通過，含舊教材、SVG、MATLAB ZIP 及 AASE workshop；audit 高嚴重度閘門通過，五筆既有 low finding，未改套件。
- C02 共用 SourceBody 瀏覽器回歸：22 項通過。正式站頁面與圖檔回讀尚待完成；本節不宣稱已部署。
