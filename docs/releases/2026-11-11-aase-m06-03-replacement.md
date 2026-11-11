# M06-03｜C4 Container 完整供稿抽換與七圖

正文版本 v1.1.0／revision 4；原發布日 2026-11-05 保留，版本修訂日 2026-11-11。

[完整來源與逐節對照](../sources/aase/m06-03/replacement-2026-11-11/README.md)保留供稿、七 PNG、前版及 SHA-256。中英各 10 節承接原八章、四層小節及 Session State 小節、四表、七圖、完整 architecture.md、可執行 Python 範例及三道三選項題。題目新 ID Q04–Q06，原生參考答案，無作答服務。原六錨點、課次及 URL 保留。

## 實作與範圍

教材 JSON 為 HTML、搜尋與十四份 SVG 的共同資料；C4ViewsDiagram 按固定圖號呈現放大層級、部署映射、系統邊界、程序內責任及盤點列。aase.ts 限制每節圖數、節點數、cards 種類及欄位；SVG 產生器只輸出受審核元素及跳脫文字，檔案小於100000 bytes。不擴張成任意架構繪圖器。

中英目錄標題同步完整供稿，工作坊 ZIP 的 curriculum.json 隨之重建；參考應用程式未改。歷史翻譯／短標題測試改讀已保存前版，新教材另有完整驗證。

本 repo 是來源、執行與發布的 canonical home；Planning 角色為定位、狀態、容量及下一關。本次沒有寫入跨 repo。原目錄其他課次修改保留，使用 `/tmp/kairos-m0603` 由 origin/main 建立隔離工作樹發布。

## 驗證紀錄

| 規則／檢查 | 結果與證據 |
| --- | --- |
| WRITE-01–11 | 逐節閱讀核對，見來源對照表與編輯修正；保留所有原表、子節、案例、判斷條件及限制。中英完整對應；code 模板加雙語註記。 |
| HTML-01–04、A11Y-01–03 | 中英瀏覽器檢查通過：全文／四表／全部程式碼與三題選項／解析；320、390、768、1280 CSS px，各測100%及200%文字；無整頁溢出。無 JS 仍有全文、七圖及原生解析。 |
| FIG-01–06 | 七張參考圖的分組、方向、平行責任與程序嵌套逐圖比對。中英390及1280截圖目視；十四SVG字框／文字重疊／大小、來源資料與下載位元組檢查通過。 |
| A11Y-02 | Tab／Shift+Tab、下載連結 Enter、答案 Enter／Space、表格及程式區塊焦點／方向鍵捲動通過；焦點樣式可見。 |
| INT-01 | 本課為靜態圖與原生答案收合；無參數計算或外部送出服務。 |
| 原件及程式 | SHA256SUMS 核對；Python 3 範例空訂單、零數量、正數量三個 assert 通過，輸出 PASS。 |

瀏覽器入口 `pnpm exec playwright test --config playwright.aase-m0603.config.ts`，兩語2項通過。測試內容逐項核對，不以測試數量代表內容完整性。截圖及完整報告位於隔離工作樹忽略目錄 `.local/aase/m0603/`；`zh/en-N-390.png`、`zh/en-N-1280.png`、`zh/en-N-svg.png`，比較圖為 `zh/en-N-comparison.png`。初測發現320px／200%文字的巢狀框過窄，已減少窄欄內距並重測通過。另將本課表格與 pre 設為1rem／1.8行高，瀏覽器斷言納入 th／td／code，兩語四尺寸及200%文字再次通過。

發布前閘門：`pnpm run validate:content`通過、`pnpm test`341／341通過（已保留發布前遠端同步課次）、`pnpm run check`零錯誤／警告、`python3 -m unittest discover -s scripts -p test_validation_html.py`6／6通過、`node scripts/check-publication-boundary.mjs`通過並重建乾淨產物、`pnpm run validate:release`通過、MATLAB保留下載檔校驗通過、`git diff --check`通過。`pnpm audit --audit-level=high`通過，現有4項low層級套件提醒未在本次教材修改升級處理。

執行程式與圖示已推送至 main：來源提交 `1051308`、正文與七圖 `72d1444`、字級修正 `520aa82`；整合發布 head 為 `6810cac8e4803a40636d122c3ceea474e5421645`。中間 merge commits 保留所有本地及遠端歷史，沒有 force-push。

[正式部署流程](https://github.com/JasonLn0711/kairos-learning/actions/runs/42991324344)成功，job `130424819513` 的全部檢查、靜態產物上傳及 Pages 部署通過。正式站雙語完整瀏覽器回讀2／2通過：全文、四表、兩段程式碼、三題與各選項解析、七圖、四尺寸／200%文字、無JS與鍵盤；十四份SVG直接請求與本次檔案逐位元組一致，並通過字框／重疊檢查。中英 H1 與 v1.1.0 另以瀏覽器DOM核對。[機器可讀驗證摘要](2026-11-11-aase-m06-03-checks.json)連接結構核對、實測與待驗。

## 待驗與界線

瀏覽器為桌面 Chromium 模擬，未做實體手機、完整螢幕閱讀器或真人學習驗收；本次沒有啟動 Streamlit 多人／遠端部署測試。這些不作為教材內容替換的完成證據。正式站已回讀通過；這些待驗項目維持各自的驗收邊界。


## 正式入口與完成核對

- [中文 M06-03](https://learn.cs-kairos.com/courses/aase/v1/m06/concepts/m06-03/)及[English M06-03](https://learn.cs-kairos.com/en/courses/aase/v1/m06/concepts/m06-03/)均顯示本次完整標題與 v1.1.0、原發布2026-11-05及版本修訂2026-11-11。
- 原始供稿、七參考PNG與附件逐位元組相符；前版及課綱entry保留。逐節對照包含原八章、較深子節、四表、完整architecture.md、函式與三題選項。
- 本機中英七圖已逐圖目視比對分組、平行／包含、線端與圖說；正式站28張手機／桌面圖截圖與本機版逐位元組相同。像素及裝飾圖標差異記在來源紀錄。
- 本機部署head的341項測試、型別與release通過；CI再驗發布邊界、套件audit與保留下載檔。實體裝置、完整輔助科技及真人學習驗收留待另行執行。
- 部署前本機證據備份於 `.local/aase/m0603-local/`；正式站結果為 `.local/aase/m0603/production-results.json`及同目錄截圖。各SVG大小及雜湊保存在機器可讀摘要。
- 額外Python urllib探測被HTTP403拒絕；正式頁驗收採成功的Chromium瀏覽器回讀，SVG則以成功的Playwright HTTP請求核對，未將失敗探測列為通過。
