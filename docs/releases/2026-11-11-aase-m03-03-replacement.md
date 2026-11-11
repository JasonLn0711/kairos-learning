# AASE M03-03｜完整供稿、七圖設計與發布回執

修訂日期：2026-11-11（Asia/Taipei）。正本為本 repo 的 AASE 教材；本次只處理 M03-03。稀缺資源是逐節雙語編輯與圖解驗收容量；Planning 僅承接定位、狀態、驗證、發布證據及下一關，詳細供稿與實作留在此處。

## 內容與來源

[原稿、七圖及前版](../sources/aase/m03-03/replacement-2026-11-11/README.md)逐位元保存，SHA256SUMS.txt 可重驗。[逐節對照](../sources/aase/m03-03/replacement-2026-11-11/source-map.md)記錄全部十節、子節、表格、程式碼、四題及技術／格式調整。原文的 favicon、Mermaid CSS 與控制項殘字由正式圖解和互動承接；原檔保留其原貌。

正式資料 `content/aase/lessons/aase-m03-c03.json` 具有兩語各 12 個章級單位（導言、十節、理解檢核）、五張表、原稿 problem.md 與四題差旅報銷開放檢核。逐段語意核對保留旅行時間的比較界線、工廠六步與例外、人機責任、八術語、五產業案例、泳道／BPMN 範圍及 1,500／15,000 元修改情境。英文為完整對應，原樣中文 code 前另有完整英語解說。

版本為 v1.1.0／revision 4，保留原發布 2026-11-05、兩語發布閘門、URL、六個既有章節錨點與 qa=[]。新版四題使用 Q04–Q07，舊 Q01–Q03 隨前版完整保存，公開片段別名分別導向 same-task／stale-result／layers；它們是編輯理解檢核，不是收到的學習者答案。

## 七張隨文圖示

| 圖 | 成果與關係 | 差異／界線 |
| --- | --- | --- |
| 1 | As-Is → To-Be → User Flow 的餐廳三層描述 | 改善仍為假設；通知不等於供應商接受 |
| 2 | 12 節點、14 條可鍵盤操作的有向出口，含缺漏回填、修改失效、取消及匯出 | 將跨版面繞線改為節點導覽；匯出與任務完成合在一格；每條出口由條件及名稱明示 |
| 3 | 100 萬元／每年 12,000 元／對應原輸入 | 合成值，不提供保費公式 |
| 4 | 原生 radio、更動即失效、重新檢查後才可複製結果 | 僅本地模擬；改回原值也須重查，無真實業務提交 |
| 5 | User Flow／Journey／Architecture 平行比較 | 手機堆疊仍明示並列，無先後箭頭 |
| 6 | 三層分析 → UI/UX 與需求／測試兩平行分支 → 實作 | 箭頭是依賴，不強制瀑布式時程；HTML 重排與 SVG 分支／合流語意一致 |
| 7 | 四情境走讀、前後切換、檢核重點與全部案例原生 details | 原圖只顯示第一情境，後三項依供稿流程補充並明示；不評分或記錄學習進度 |

五張靜態圖共享正式受驗證的 cards／flow 模型、搜尋文字與十個雙語 SVG。SVG 僅由固定安全元素及跳脫文字產生，最大 4,809 bytes，小於 100000 bytes。互動圖有完整靜態退化內容；來源圖另存於本 repo，不以整張圖片縮小代替手機 HTML。

## 本機驗證

獨立工作樹 `/tmp/kairos-aase-m0303` 保留原工作樹的 README、CEH 及其他 AASE 章節同期修改。下列結果是整合遠端前的本次實測；整合、正式站與發布狀態另記於後。

- `python3 scripts/aase_m0303_content.py --check` 與 `python3 scripts/aase_m0303_svg.py --check` 通過；原稿、七圖與 prior-lesson 的 SHA256 通過。
- `pnpm run validate:content` 通過。283／283 單元測試通過；歷史遷移測試改讀本次保留的前版，當前內容由新測試驗證。圖模型變異測試拒絕改變節點數、kind、任意 HTML 欄位與未知互動插槽。
- `pnpm run check`：0 errors、0 warnings；`pnpm run build` 成功。既有大於 500 kB bundle 提示仍存在，本次未調整全站載入架構。
- `node scripts/check-publication-boundary.mjs` 通過隔離 fixture、draft／future、英文課程閘門，最後還原並重建。`pnpm run validate:release` 通過，包含既有全站資產、內容及下載包檢查。
- `pnpm audit --audit-level=high` 通過；目前報告 4 low。共用 HTML unittest：6／6 通過。
- `pnpm exec playwright test --config playwright.aase-m0303.config.ts`：2／2 通過。兩語逐段正文、表格每格、code、圖模型及四題解析到頁面比對；四尺寸 320／390／768／1280 與 200% 文字無頁面水平溢出。實測 radio 的鍵盤修改、失效後輸出停用、改回原值仍失效、重查後實際複製、失敗時可手動複製、再修改清除輸出、四事件切換及前後邊界。另驗證焦點、表格／code 局部捲動、原生 details、無 JavaScript 內容與停用控制項。
- 十個 SVG 經實際瀏覽器文字邊界與文字互相重疊檢查；下載位元組等於本機。雙語桌面／手機截圖已逐圖判讀分組、條件、流向與平行關係，原圖差異如上表。

規則：WRITE-01–11；HTML-01–04；FIG-01–06；INT-01；A11Y-01–03。這些是本篇適用檢查，不宣稱全站改善或完整無障礙認證。

## 主線整合與擴大回歸

已保留來源提交 `e5bb0f5`、內容提交 `c03b402`、剪貼簿／有向連結修正 `bc562f7`，並以 merge 保留同期主線的其他 AASE 與 CEH 工作。共用元件衝突採主線的新分派，再加回本次 M03-03 圖解、互動、段落渲染及舊題片段別名；歷史測試保留各篇前版定位。

- 整合至 `dccd3c4` 後：299／299 單元測試、型別 0 errors／0 warnings、建置及本篇雙語 2／2 通過。較前一輪整合後的 CEH 共用版型 22／22、HCI 新版 2／2 通過。
- 廣域 AASE 雙語回歸使用獨立 4388 埠與 `.local/aase/m0303/regression*` 輸出，63 項中 60 通過；三項失敗為 M02-02、M02-03、M03-01 英文圖卡的 `768px/1 reading` 邊界判斷。部署本篇之前，直接對正式站重跑相同三頁亦重現；這是保留的既有條件，不作本篇通過或全站改善主張。先前第四頁 HCI 差異已隨主線新版消除。
- 最終本篇套件另實測真正剪貼簿寫入／讀回、寫入失敗時顯示可手動複製結果、舊三題片段別名、有向出口鍵盤啟用，以及正文、圖說、列表與表格儲存格的字級／行高與局部捲動。
- `.local/aase/m0303/` 保存原始瀏覽器 JSON、截圖及圖檔幾何證據。早期測試埠被其他工作樹占用、以及廣域報告共用目錄造成的 trace 寫入錯誤，已改用獨立埠與輸出目錄重跑；不將那些未完成的執行算作通過。

## 整合與正式站

完成內容部署與正式站讀回。最終整合主線提交為 `5241d8091216ffbf62071f5a8791c5074d15f0a3`，保留本次來源／實作／修正與所有同期主線歷史；推送後 fetch 確認 divergence 為 `0 0`。較早幾次非 fast-forward 推送已以 fetch＋merge 處理，沒有 force push。

- 最終提交的本機檢查：309／309 單元測試、型別 0 errors／0 warnings、建置、`validate:release`、本篇雙語瀏覽器 2／2 全部通過。共用教材元件以主線新版為基礎增加 M03-03，逐一確認其他元件分派沒有遺漏或重複。
- [Pages run 42986713205](https://github.com/JasonLn0711/kairos-learning/actions/runs/42986713205) 成功，包含 audit、內容、單元、共用 HTML、型別、完整 publication-boundary、release、下載雜湊及正式部署。
- `AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0303.config.ts --output .local/aase/m0303/production/browser`：正式站 2／2 通過，26.3 秒；無 skipped、flaky 或 unexpected。實測 UTC 開始時間為 2026-11-11T08:27:03.206Z（臺灣 16:27:03）。
- [中文正式頁](https://learn.cs-kairos.com/courses/aase/v1/m03/concepts/m03-03/)／[英文正式頁](https://learn.cs-kairos.com/en/courses/aase/v1/m03/concepts/m03-03/) 顯示 v1.1.0；逐段正文、每格表格、原樣 code、圖模型、四題解析與搜尋均比對通過。舊三題片段與 14 個有向出口有效；radio、重查、真實剪貼簿讀寫、注入寫入拒絕後的複製失敗退化、走讀切換與邊界、鍵盤焦點、原生 details、局部捲動均實測。四尺寸、200% 文字與無 JavaScript 通過，十個 SVG HTTP 200、位元組等於本機，文字不越界或互相重疊。
- [機器可讀回執](2026-11-11-aase-m03-03-checks.json) 列出圖檔大小與 SHA256、檢查範圍、時間、部署及剩餘界線；本機／正式站 JSON、截圖與日誌分開保留在 `.local/aase/m0303/local-final/` 與 `production/`。

| 完成要求 | 權威證據 | 結果 |
| --- | --- | --- |
| 原稿、七圖、前版保存 | 原附件逐位元比對、SHA256SUMS、前版 Git blob | 通過 |
| 十節與子節完整抽換 | 逐節／子節 source-map、雙語正式 JSON、全文到正式頁比對 | 通過 |
| 七張隨文圖設計 | 五張原生 HTML 圖、兩互動、桌面／手機截圖、十 SVG 與原圖差異紀錄 | 通過 |
| 雙語、版本、既有入口 | sameShape、原發布日、v1.1.0、六章錨點與三題片段檢查 | 通過 |
| 閱讀、操作與退化 | 正式站兩語四尺寸／200%、鍵盤、無 JavaScript、剪貼簿及下載測試 | 通過 |
| 保留歷史與正式發布 | 非破壞 merge、主線推送、`0 0`、Pages 成功與正式站回讀 | 通過 |
| 詳實紀錄與發現入口 | 原稿／工作稿／前版、子節對照、內容契約、來源索引、本回執 | 通過 |

## 待驗事項

真人學習理解、真實裝置與螢幕閱讀器接受度、實際保費計算、業務效率改善、後端版本一致性及正式業務受理均未評估。正式站讀回已完成；後續真人／業務驗證由各自的授權與證據另行啟動。
