# M08-03 pytest 與業務規則測試抽換

正式課次：[中文](https://learn.cs-kairos.com/courses/aase/v1/m08/concepts/m08-03/)／[English](https://learn.cs-kairos.com/en/courses/aase/v1/m08/concepts/m08-03/)。本次 v1.1.0、revision 4；原發布 2026-11-05 保留，版本修訂 2026-11-11。

[來源、前版、逐節採用與圖解契約](../sources/aase/m08-03/replacement-2026-11-11/README.md)為本次詳細紀錄。十一節完整雙語、四表、三張可搜尋及重排 HTML 圖解、兩個原生滑桿、六份同源 SVG、十個程式／命令／輸出區塊與四題參考解析進入正文。六個前版錨點維持；供稿原文、三 PNG 與前版有 SHA256SUMS。

WRITE-01–11：逐節來源對照、供稿貼上格式修復及實質修正已列於來源紀錄。pytest 官方來源支援參數化及指定例外斷言；原稿聲稱的八例實測改為示意，編輯執行結果分開保存。中英完整對應同一資料形狀與程式，維持既有來源、公開閘門及原生答案收合。

HTML-01–04、FIG-01–06、INT-01、A11Y-01–03：Playwright 五項檢查通過。雙語全文與表格／程式進入頁面；320、390、768、1280 CSS px 無全頁水平溢出；390px 的 200% 字體無全頁水平溢出；鍵盤 ArrowRight／ArrowLeft、Home／End、Tab／Shift+Tab 與 Enter 展開可用。無 JavaScript 保留十一節與三圖，滑桿停用。所有正文表格另以本課限定樣式維持 16px、行高 1.8；雙語四表均經計算樣式檢查，320px 產業表及390px程式碼區皆實測 ArrowRight 局部捲動。人工檢閱窄版中文與寬版英文圖解截圖，順序、分支、標籤及門檻可讀。

SVG 六檔為 1,446–2,371 bytes，均小於 100000；下載與本機 bytes 相同，瀏覽器 getBBox 檢查標籤在 viewBox 內且互不重疊。固定白名單輸出不接收內容標記。圖 1 PASS／FAIL 互斥，沒有二者相連的流程箭頭；圖 2／3 靜態下載固定預設，與滑桿的執行範圍分開說明。

Python 3／pytest 7.4.4 執行供稿修復後電商範例：8 passed；三欄無效值範例加保留的工作坊契約範例：40 passed。執行時各用獨立暫存目錄與對應 rules.py，沒有改寫工作坊參考實作。此結果證明示例在該環境可執行；教材原工作坊 pytest 8.4.2 的環境契約保留。

驗證入口：scripts/aase_m0803_content.py --check、scripts/aase_m0803_svg.py --check、tests/aase-m0803-replacement.test.ts、playwright.aase-m0803.config.ts。詳細本機截圖及機器結果位於隔離工作樹 .local/aase/m0803/，不作公開來源。全站既有較大 bundle 提示不影響本課檢查，不在本次改動範圍。

稀缺資源為教材編輯、驗證與發布時間；正本與執行證據由 kairos-learning 持有，Planning 僅承接定位與下一閘門，本次未新增排程或學員進度紀錄。範圍限 M08-03，其他工作樹未提交的章節不隨本次發布。整合遠端既有提交，保留雙方歷史。

發布狀態：published。內容提交 8dee40f、表格修正 81de0f1、雙語契約校對 c0ea82e 已保留於 main；整合版本 11844c3 的 [CI 與正式部署](https://github.com/JasonLn0711/kairos-learning/actions/runs/42992845088)成功，375 項單元測試通過，Svelte 0 errors／0 warnings，內容、草稿／未來日期閘門、靜態資產與封存校驗均通過。正式站以 AASE_BASE_URL=https://learn.cs-kairos.com 重跑本課五項 Playwright，結果 5 passed；此回讀涵蓋新版全部正文、四表、十段程式／指令、三圖、兩個滑桿與六 SVG 的實際回應，不以成功部署代替頁面確認。

未執行實體手機、獨立讀者理解或正式醫院系統驗收；互動是規則示範。[機器可讀驗證摘要](2026-11-11-aase-m08-03-checks.json)列出各層證據。
