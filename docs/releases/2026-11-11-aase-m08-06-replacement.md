# AASE M08-06 完整抽換回執

本次以[來源與逐小節對照](../sources/aase/m08-06/replacement-2026-11-11/README.md)為驗收範圍，發布 v1.1.0／revision 4，原發布日 2026-11-05 保留。來源、編輯、實作、驗證、發布分開記錄；不宣稱多人授權或學習完成。

## 已完成內容

- 導言及原九節完整雙語進正文；ATM 五列、三案例、授權三名詞、Given／When／Then、回歸案例、完整程式、四測試層次、九欄證據模板、六產業與 30 位老師情境。
- 三題原選項 4／4／3、答案 B／C／B；新 stable IDs Q04–Q06；qa=[]。
- 參考圖五步、四個向下箭頭及最後淡綠保留；HTML 可搜尋／重排，兩語同源 SVG 2090／2333 bytes。
- 壓成單行及截斷的 Python 程式補完；獨立教學示範三例 `3 passed in 0.04s`（Python venv，pytest 9.2.0），不當作工作坊或多人控制驗收。

## 驗證

WRITE-01–11：逐小節對照、雙語同深度與相同資料結構、原發布日與舊錨點保留。anti-ai-rhetoric-lint 保守修訂保留所有技術界線。

- `pnpm run validate:content`：通過。
- `node --experimental-strip-types --test tests/aase-m0806-replacement.test.ts`：3／3 通過（包含非法圖資料拒絕）。
- `pnpm run check`：通過。
- `python3 scripts/aase_m0806_content.py --check`、`python3 scripts/aase_m0806_svg.py --check`：通過。
- `pnpm test`：初版 325／325、整合遠端後 336／336 通過；舊翻譯與短標題快照改讀原件，維持歷史驗證。
- `node scripts/check-publication-boundary.mjs`：通過；雙語 fixture、draft／future、英文課程雙閘門及乾淨正式重建。
- `pnpm run validate:release`：通過，含本機目標、錨點、資產及既有範例核對。
- `pnpm exec playwright test --config playwright.aase-m0806.config.ts`：兩語 2／2 通過；逐段正文與每表／程式／圖解、320／390／768／1280、200% 文字、鍵盤、無 JS、搜尋、SVG 下載位元組與文字邊界／無重疊。人工檢視兩語手機與桌面圖解，順序及五步關係正確（HTML-01–04、FIG-01–06、A11Y-01–03）。截圖與機器結果於隔離工作樹 `.local/m0806/`。
- `pnpm audit --audit-level high`：通過 high 門檻，4 low 保留；共享 HTML 檢查 6／6 通過；`git diff --check` 通過。
- 正式站回讀：待下方發布證據。

## 發布與後續驗收

本機必要檢查已完成，整合遠端後重跑發布閘門、靜態輸出及雙語瀏覽器（2／2），型別檢查 0 errors／0 warnings。下一步沿既有 Pages 工作流發布並回讀兩語正文及兩份圖檔。原始工作樹的其他章節與 dirty 修改保留；隔離工作樹以當時 origin/main 為基礎。

未驗事項：真人閱讀與理解、真實手機／螢幕閱讀器接受度、工作坊完整 runtime、多使用者授權與正式系統資安。下一閘門為本次頁面與圖檔的正式站實測，不擴充多人功能。
