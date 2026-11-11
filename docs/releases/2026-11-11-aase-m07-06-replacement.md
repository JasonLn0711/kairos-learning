# M07-06｜審查 Diff、工具紀錄與決策：供稿抽換

## 交付與來源

正本為 kairos-learning 的 AASE-M07-C06，公開路由 `/courses/aase/v1/m07/concepts/m07-06/` 與 `/en/courses/aase/v1/m07/concepts/m07-06/`。v1.0.2 → v1.1.0，revision 3 → 4，版本修訂 2026-11-11，原發布 2026-11-05 保留。

[逐節對照](../sources/aase/m07-06/replacement-2026-11-11/source-map.md)保存使用者原文、五張 PNG、前版、完整中英稿與雜湊。十節正文完整承接導言、九節及較深小節：廚房案例與產業表、Python 前後與 Diff、Git 三位置／四指令／兩欄狀態／已提交情境、工具紀錄與證據界線、診所外部 API／Scope／最小權限／保留無關工作、五步與決策範例、三決策／餐廳推薦、五誤區與外部副作用、保險三題。三個原始開放問題沿 Q04–Q06 提供逐題參考解析，qa=[]。沒有新建學員提交或評分服務。

五組圖解對照原圖關係：三依據平行匯入人的決策、Git 三位置與 add／commit、證據三欄表、五步流程、完整 review-notes.md 範例。可搜尋的 HTML 為正文，十份同源 SVG 供開啟／下載；單檔小於 100000 bytes。沿既有受限資料型別及 Svelte 跳脫，不接受任意 HTML／SVG。

本次稀缺資源為編輯與驗證容量；來源、實作及證據留在本 repo。Planning 只持定位、狀態、容量及下一閘門。使用最新遠端的獨立工作樹 `/tmp/kairos-m0706-publish`；原工作區其他章節的未提交修改不納入發布。

## 驗收

| 規則 | 範圍 | 實際狀態 |
| --- | --- | --- |
| WRITE-01–11 | 逐小節、來源／前版、技術校正、雙語、版本 | 已完成逐小節編輯對照與雙語全文渲染；正式站回讀待完成 |
| HTML-01–04 | 語意全文、四尺寸、字級、局部捲動 | 本機瀏覽器通過；正式站回讀待完成 |
| FIG-01–06 | 五圖關係、響應式、SVG 同源及下載 | 產生器同步、五圖手機／桌面人工檢視、十份SVG下載及字框通過 |
| A11Y-01–03 | 標題、焦點、鍵盤、原生答案、無JS | 本機瀏覽器通過；正式站回讀待完成 |
| INT-01 | 未新增計算或提交互動 | 不適用 |

已執行 `pnpm test`：320/320 通過；`pnpm run check`：0 errors／0 warnings。`aase_m0706_content.py --check` 與 `aase_m0706_svg.py --check` 由專屬單元同步核對。歷史英譯及短標題遷移測試改讀保存前版，保留歷史驗證意義；當前版由新專屬測試及正式 catalog 驗證。

第一次瀏覽器檢查發現測試預期仍帶 Markdown `###`，而實頁已正確轉為 h3；另一處定位誤把題目當作 summary。修正測試為正文語意比較與題目所屬原生 summary 定位，後續結果另記。未把這輪失敗當成功證據。

## 發布

待完成必要驗收後提交、推送、等待 GitHub Pages 部署並回讀兩語全文及十份圖檔。此紀錄不將本機編輯或建置稱為正式發布。

待驗：真實使用者閱讀與學習理解、實體裝置及獨立無障礙稽核；瀏覽器自動檢查不代表上述項目完成。

## 本機實測補記

- `pnpm run validate:content`：通過。
- `pnpm test`：320 tests、320 pass、0 fail。
- `pnpm run check`：0 errors、0 warnings。
- `node scripts/check-publication-boundary.mjs`：通過，涵蓋隔離第二概念、draft／future、英文課程及翻譯發布閘門；fixtures 移除後重建正式輸出。
- `pnpm run validate:release`：退出碼0，完整既有 release 鏈通過。
- M07-06 專屬瀏覽器：4/4，逐節全文／表格／程式／五圖資料，320／390／768／1280 CSS px、390px下200%文字、無JS、Tab／Shift+Tab／Enter／Space、三答案原生開關及十份 SVG bytes／文字邊界。
- 人工檢視 `.local/aase/m0706/{zh,en}-contact.png`：五圖在390／1280px的全部雙語畫面，分組與順序符合參考，標籤未裁切。圖3手機局部表格維持三欄，不把平行欄位改成有先後關係。

證據在獨立工作樹 `.local/aase/m0706/` 及 `/tmp/m0706-{unit2,check,boundary,release,browser3}.log`；瀏覽器後續加強字級／行高、圖說、SVG文字重疊檢查及共用回歸，結果接續記錄。未變更工作坊程式與學員ZIP，本次專屬驗收以教材呈現為範圍。
