# M06-01｜User Flow 與系統架構完整抽換

本次依使用者完整供稿及五張參考圖，抽換 `AASE-M06-C01` 為 v1.1.0／revision 4。原發布日 2026-11-05、網址、六個原錨點、英文發布閘門及歷史Git保留；版本修訂日2026-11-11。來源與前版位元組保存，兩語各九節（導言＋原八節）、三表、五圖、兩Python程式碼區及三道三選項檢核進入正式正文。

- [繁中正式頁](https://learn.cs-kairos.com/courses/aase/v1/m06/concepts/m06-01/)
- [英文正式頁](https://learn.cs-kairos.com/en/courses/aase/v1/m06/concepts/m06-01/)
- [原稿、前版與逐節採用](../sources/aase/m06-01/replacement-2026-11-11/source-map.md)
- [圖意契約](../sources/aase/m06-01/replacement-2026-11-11/figure-contract.md)、[技術查核](../sources/aase/m06-01/replacement-2026-11-11/technical-review.md)

## 實作與範圍

沿既有 AASE sections／prose／step／table／cards／flow，不新增依賴。`FlowArchitectureDiagram.svelte`限定本課revision>=4，資料驗證拒絕錯誤位置、種類、節點數與額外欄位；文字由Svelte跳脫。五圖節點數5／5／7／6／4：餐廳流程、餐廳平行分工、收件缺漏回圈、Streamlit主機及同程序分組、C4縮放。

`aase_m0601_content.py --check`核對雙語稿／正式JSON；`aase_m0601_svg.py --check`核對十份同源SVG、固定元素／屬性白名單及小於100000 bytes。新題使用Q04–Q06，三題答案均B；原Q01–Q03封存。參考答案沿原生details，沒有假提交或學習進度。

## 規則及本輪證據

| 規則 | 驗收範圍 | 結果 |
| --- | --- | --- |
| WRITE-01–04、09–10 | 原文／前版保存、14小節及圖意逐項對照、技術修正 | 已完成來源與成稿編輯逐節對照，見source-map；SHA256SUMS核對原件；verify-aase-m0601-source.py核對106個段落單位及所有明列例外。 |
| WRITE-05–08 | 雙語深度、版本日期、課次及發布閘門 | 兩語同結構、同程式碼、同答案；原日期與網址保留。 |
| WRITE-11、HTML-01–04 | 全文與實際頁面順序、四尺寸、200%、無JS | 通過兩語全文順序、320／390／768／1280px各1×與2×字級、無JS及無頁面溢出。 |
| FIG-01–06 | 五圖分組、平行、分支、程序邊界及十SVG | 通過同源模型／大小／白名單、全部十SVG字框與文字重疊檢查及下載位元組；已目視手機／桌面圖意。 |
| A11Y-01–03 | 語意、下載、焦點、原生收合、局部捲動 | 通過Tab／Shift+Tab下載焦點、Enter開圖、Enter／Space原生解析、表格／程式碼局部捲動及無JS原生解析。 |
| INT-01 | 參數互動 | 不適用；本課無模擬器或分數計算。 |

已通過：原基線283項、推送前整合版343項單元測試，正式部署CI另通過348項；內容驗證；svelte-check零錯誤／零警告；publication-boundary的第二概念、draft／future與英文課程關閉實際建置；validate:release。另通過三項AASE雙語回歸（本課、英文目錄／搜尋與下載、CEH共用框架計算樣式）、共用HTML單元與高嚴重度依賴稽核。另通過22項CEH雙語、無JS、原生答案、舊路由及圖檔回歸。合併修正後重跑內容／型別／全單元、完整publication-boundary、release與本課瀏覽器。

瀏覽器入口：`pnpm exec playwright test --config playwright.aase-m0601.config.ts`。正式站設定`AASE_BASE_URL=https://learn.cs-kairos.com`；證據存於執行工作樹`.local/aase/m0601/`。整合後本機瀏覽器兩項測試通過，本機結果保存在`.local/aase/m0601-local-final/results.json`，正式站結果見`.local/aase/m0601/results.json`及對應圖檔。SVG共十份均小於100000 bytes；尺寸與SHA256見[檢查清單](2026-11-11-aase-m06-01-checks.json)。已修正320px／200%時主機巢狀內距造成的文字擠壓，並重新通過全部尺寸。手機的規則／狀態連線各明列Python程序，保留平行關係。正式站兩語驗收亦通過，詳見下方部署回執。

## 正式發布與回讀

- 原件與成稿保存提交：`1e81e12`；正文與五圖實作：`06372f4`；本次完整整合推送：`9b04e076bf97468e9c6b9e2409bc6c4152565c96`。後續合併保留遠端與本次全部歷史，未強制推送。推送後曾確認分歧`0 0`。
- Pages成功：[run 42991605640](https://github.com/JasonLn0711/kairos-learning/actions/runs/42991605640)，部署提交`e8e6fe97ae6615102dc41aa124a61e6799e1430d`包含本次推送；2026-11-11 17:02:48 Asia/Taipei回報成功。來源／單元348項／型別／publication-boundary／release／原下載雜湊及實際Pages部署步驟全部成功。先前待部署排程因佇列更新而取消，未把取消當成正式上線。
- 正式站指令：`AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0601.config.ts`，兩語2項通過、0失敗（24.0秒）。核對實際v1.1.0、完整正文順序、三表、兩段程式碼、三題及逐選項解析、五圖、搜尋文字與十份SVG位元組；包含320／390／768／1280px、100%／200%、鍵盤、無JS與局部捲動。工作坊下載維持原雜湊。
- 200%目視驗收另檢查主機／程序內標籤；窄版使用較小固定內距，保留至少4em文字欄寬，字級維持放大。標籤仍可換行，沒有縮字或隱藏內部節點。
- 部署前正式頁仍為v1.0.2；部署後以一般瀏覽器回讀確認v1.1.0。Python urllib的預設請求曾回403，正式驗收使用正常瀏覽器及Playwright API實際成功，不以該403推定網站未上線。

## 所有權與後續界線

稀缺資源為完整供稿逐小節與五圖實測所需的編輯／驗收時間。教材、來源、實作及詳細證據由kairos-learning持有；Planning如需同步，僅承接locator、狀態、驗證／發布回執與下一關。使用隔離工作樹`/tmp/kairos-m0601-20261111`，不納入原工作目錄其他章節的未提交修改。本次來源保存、正文／圖解採用、靜態／瀏覽器驗證、Git發布、Pages部署及雙語正式頁／十圖回讀均完成。後續如有讀者回饋，再依指定範圍修訂。實體手機、螢幕閱讀器完整認證與學員理解未驗。
