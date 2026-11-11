# M07-06 供稿抽換紀錄

狀態：source preserved／implemented／validated／published。中英正文、五組圖解及正式站回讀均完成；精確證據見回執。

來源：使用者於本次任務提供的原稿及五張 PNG，原文逐位元組保存在 source-original.txt；待替換正文保存在 prior-lesson.json。SHA256SUMS 涵蓋來源與前版。

## 正文對照

| 原稿 | 正式正文錨點 | 採用的教學內容 |
| --- | --- | --- |
| 導言、一、生活案例 | review、analogy | 三項驗收依據、廚房三要求、五產業表、負責人決策 |
| 二、Diff | diff-example | Python 前後程式、刪除驗證的 Diff、行數與風險 |
| 三、Git 三位置及兩小節 | diff | 三位置比喻、未追蹤檔案、四指令表、status 範例、完整審查命令、已提交情境 |
| 四、工具紀錄 | evidence | 假設日誌、四術語表、證據強度表、研究比喻 |
| 五、範圍 | decision | 診所日期與外部 API、最小權限、破壞性命令及保留無關工作 |
| 六、審查流程及紀錄 | record | 五步流程、review-notes.md 完整示例、示例界線 |
| 七、三決策 | decisions | 接受／要求修正／延後表、訂位與會員推薦案例 |
| 八、五誤區 | misconceptions | 五列誤區、Git 外部副作用界線 |
| 九、理解檢核 | understanding | 保險合成案例、三道開放題及逐題解析；沿用既有原生答案機制 |

## 參考圖的關係契約

1. 三項依據平行匯入人的審查，不畫成規格→Diff→證據的先後流程。
2. 工作區→暫存區→版本紀錄，分別標示 git add／git commit；補明此為簡化操作圖，HEAD 為參照而非儲存區本身。
3. 證據強度採三欄語意表格，保留三列主張、證據、可支持判斷。
4. 五步依序，手機保留順序與步驟內容。
5. 決策紀錄為完整示例，清楚標示未實測；不建立假的提交或評分按鈕。

## 編輯修正與範圍

原稿中的 favicon、複製按鈕殘文與聊天式網址說明保存在來源層，正文排除。壓成一行的 Python 程式需恢復有效縮排。公開路由維持 M07-06；不得據原稿提到的 M04 建立新路由。原發布日保留。正式正文維持中英對等，來源、實作、驗證及發布分開記錄。

本次資源為編輯與驗證容量；正本在 kairos-learning。Planning 僅在發布後記錄定位、驗證、發布證據及下一閘門。其他章節的未提交修改保留，不納入本次發布。

## 實際採用與校正

正式正文為 content/aase/lessons/aase-m07-c06.json，編輯稿 teaching.zh.md／teaching.en.md 與 figures.json 由 scripts/aase_m0706_content.py 編譯；前版 v1.0.2／revision 3 更新為 v1.1.0／revision 4，原發布 2026-11-05 保留。

來源各節及小節均在正文承接：導言 review；生活案例 analogy；Diff 定義、兩段 Python 與差異 diff-example；三位置比喻、四指令表、實際操作及提交例外 diff；工具日誌、四術語、證據強度及研究比喻 evidence；診所、Scope、Least Privilege、破壞性還原與保留工作 decision；五步及完整紀錄示例 record；三決策表及餐廳推薦案例 decisions；五誤區及 Git 外部副作用 misconceptions；保險題組 understanding，三題以 openChecks Q04–Q06 承接並新增逐題參考解析。練習與 readingGuide 沿既有學習契約保留。

- 原稿「Repository / HEAD（版本紀錄）」修正為 Repository 與 HEAD：前者保存物件與歷史，後者是參照而非儲存區。Git 圖保留操作方向，補明工作區及 index 可以分別有修改。
- 供稿壓成一行的 Python 恢復有效縮排；本節的程式與日誌屬教學片段，未聲稱執行了未定義的 validate／create_report。
- 三道原始開放題完整保留問題方向，新增原生參考解析；移除「提交回答」的介面殘文，頁面不假裝有後端評分。
- 來源聊天說明、favicon 與複製按鈕殘文不進正文；追蹤參數自引用 URL 移除。
- 五圖沿參考的低彩度、外框、資料關係重製；圖1 三項平行核對後供人決策，圖2 為簡化操作圖，圖3 保留三欄三列，圖4 五步，圖5 六欄紀錄（決策與理由同欄）。SVG 為固定下載版，正文 HTML 依可用寬度重排。表格在320px使用有名稱的局部捲動。

## 查核依據

2026-11-11 開啟 Git 官方 git-diff、git-status 與 OWASP AI Agent Security Cheat Sheet，核對比較範圍、兩欄短狀態、工具最小權限、人工核准、資料保護及可觀測性。正文來源連結沿原 sourceIds，未把教學合成紀錄當作實測證據。

## 驗收及發布

詳見 [本次回執](../../../../releases/2026-11-11-aase-m07-06-replacement.md)。適用 WRITE-01–11、HTML-01–04、FIG-01–06、A11Y-01–03；INT-01 不適用（未新增計算或提交互動）。自我檢核不等於學員作答或實作通過。
