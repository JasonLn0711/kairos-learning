# M05-04 新供稿完整抽換追溯

本次來源：original.zh-TW.md 與五張 PNG 的雜湊見 source-checksums.json。原始 PNG 在忽略目錄 `.local/sources/m05-04-new/`。前版 `6c770c5` 為八節／單圖、尚未公開的草稿，previous-draft.json 保存其完整資料；Git 歷史已以 fast-forward 接續保留，未重寫或刪除既有來源。正式目標維持 CEH26-M05-C04 與 m05-04 URL；目前新稿仍在工作目錄，尚未採入正式正文。

| 新供稿 | 必須保留的教學內容／圖解 | 工作狀態 |
| --- | --- | --- |
| 導言 | 掃描警告、漏洞存在、入侵事實的區別 | 中文完整稿已保存 |
| 一、汽車召回 | Toyota 比喻、三個問題、角色比較表、圖1的三角色共同支援現場判斷、共同語言 | 中文完整稿與雙語圖資料已保存 |
| 二、CVE | 三廠商命名混亂例、Log4Shell 真實編號三段／年份界線、四項不能推論、三狀態表、CNA | 同上；圖2承接原稿匯出錯置的大標題 |
| 三、CWE | 三車類比、CWE-79 留言文字與指令混淆、預防方式、未有 CVE 也可能有 CWE 缺陷 | 中文完整稿已保存 |
| 四、CPE | 車型年份類比、2.3／2.5／2.7 與2.4～2.6範圍表、完整虛構 CPE、五欄解讀、設備身分與適用性界線 | 中文完整稿已保存 |
| 五、NVD | NIST、四來源查證順序與圖3、真實 Log4Shell／log4j-core、2026-04-15風險導向補充政策、資料缺漏界線 | 中文完整稿、雙語圖資料及官方查核已保存 |
| 六、完整模擬 | Orange 五欄圖4；版本/banner、功能條件、backport、更新與執行證據；三種結論表 | 中文完整稿與雙語圖資料已保存 |
| 七、報告證據 | 四層圖5及各層證據、非強制利用測試、八欄紀錄表、完整報告示範 | 同上，圖5不畫成必然發展或入侵流程 |
| 八、知識整理 | 七列問題／查核來源表與官方資源 | 中文完整稿已保存 |
| 九、理解檢核 | Ubuntu Nginx 合成情境、兩個原問題、不預填本人回答、最後主張 | 中文完整稿已保存；不新增假送出或批改 |

格式修正：去除 favicon 卡片、tracking query、錯置標題；圖中文字由受限模型承接全部資訊。將對話式「我再幫你批改」改為後續討論說明，不改問題或填造回答。先前草稿答案保留在封存，新供稿答案狀態依原稿保留。

查核 2026-11-08：讀取 NIST April 15 NVD operations、MITRE CWE-79、Apache Logging security、Red Hat backporting；NVD CPE 主頁回傳無可讀文字，須改查正式 CPE 2.3 規格或其他官方可讀來源後才記完成。CVE 狀態與日期仍需引用正式說明。前版回執的 Linux browser／HTTP 403 是該次環境的歷史邊界；本次尚未執行新頁面的瀏覽器或正式站測試，不以歷史靜態結果取代新稿驗收。

下一步：完整英文、五圖固定版型／十 SVG、正式正文產生器／驗證器與測試、逐節／瀏覽器驗收，依 repo 本次授權接續提交推送與正式部署回讀。尚未完成時保持 draft，既有發布閘門不變。

## 正文與圖解接入

完整英文已完成；兩語各九節、十小節、六表、五圖。`scripts/m05_04_replacement.py` 生成 revision 2／v1.0.0 draft 正式資料與十 SVG；初版尚未發布，因此保留首次候選 v1.0.0，前版完整資料另存 previous-draft.json。IdentificationDiagram 接入五個受限圖名；驗證器核對課程 ID、種類與 5／3／4／5／4 節點，lookup 才是 flow。理解題保留兩個開放問題，未新增答案或學員進度。

本輪 M05-04 單元兩項、型別 0 errors／0 warnings、產生器 `--check`、whitespace 通過。初次測試誤將六表寫成五表，依兩語正式資料核對修正；沒有刪除原稿表格以迎合測試。尚待逐圖幾何／目視、完整來源引用、瀏覽器與發布後回讀。


## 本機閱讀驗收

完整原生圖解已比照參考圖補角色圖示、CVE 三段與分隔、查證箭頭、五欄發現紀錄與四層編號／垂直線。十 SVG 字框全部在 viewBox 內，無文字互疊；已目視 roles-zh、identifier-zh、finding-zh、evidence-en。字型／留白與部分圖示筆畫有差異，固定下載圖與窄版原生重排分開。

Chrome 隔離新稿通過雙語全文區塊、五圖、320／390／768／1280 無整頁溢出、200% 字級、十份下載 bytes、無 JS 基本閱讀、Tab／Shift+Tab／Enter 下載、CPE code 焦點。結果在 `.local/m05-04-browser/`，SVG 在 `.local/m05-04-svg/`。這不是實體手機或完整輔助科技認證。CPE 已補查 NIST IR7695 正式規格；CVE glossary 的無 JS 回應僅說明需 JS，改引用官方舊站 FAQ，未聲稱該 glossary 已完整讀取。

## 來源到成稿的逐單位保留檢查

原稿只經明列格式／編輯修正產生 normalized-source.zh-TW.md；131 個完整單位逐一依序出現在 teaching.zh-TW.md，adoption-map.json 保存對應 offset。引用補入而未刪除單位。圖解 placeholder 各指向五組雙語模型，模型保留原圖資訊；136 個正式 sourceBody 區塊再由瀏覽器逐項核對。此鏈分別證明原稿採用與頁面呈現，並配合逐節語意核對。prepare-m05-04-replacement.py 現在只產生 normalized-source，不再覆寫已補引用的 reviewed teaching 稿。
