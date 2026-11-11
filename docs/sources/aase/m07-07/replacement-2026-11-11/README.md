# M07-07 抽換來源與執行紀錄

本次 canonical owner 為 kairos-learning。供稿對應 AASE-M07-C07，公開路徑 `/courses/aase/v1/m07/concepts/m07-07/`。稀缺資源為逐節雙語校訂與瀏覽器驗收時間；Planning 僅承接完成後 locator、驗證及發布狀態。

## 來源保存

`pasted-text-1.txt` 與 `image-1.png` 至 `image-4.png` 逐位元保存；`prior-lesson.json` 保存抽換前 revision 3／v1.0.2。SHA256SUMS 可用 `sha256sum -c SHA256SUMS` 核對。圖一為六階段順序，圖二為可切換 Bug／修復的三欄表單，圖三為 Red → Green → Regression，圖四為四段 Agent 指令與複製操作。

## 採用與編輯邊界

完整採用原稿十節、汽車維修類比、過期報告案例、三層錯誤分類、Given／When／Then／Actual、Python 快照範例、五產業案例、局部復原命令、Agent 範本、受控故障練習與三題三選項檢核。保留原發布日、雙語發布閘門與舊錨點。

原稿開頭 m04→m07 導航更正留在來源，不當成正文情境；搜尋圖示及來源卡雜訊改用正式來源連結。Python 被壓成單行的排版已恢復合法縮排並實際執行，見 example-validation.md。互動教材保留本機合成狀態；三題使用原生參考解析，不宣稱送出、批改或理解完成。舊版 Q01–Q03 在前版保存，新供稿使用新問題 ID。

## 官方核對（2026-11-11）

- https://docs.pytest.org/en/stable/how-to/usage.html ：核對 python -m pytest 與指定測試路徑。
- https://docs.streamlit.io/develop/api-reference/app-testing/st.testing.v1.apptest ：AppTest 模擬輸入與輸出；修改 widget 後需明確 run()。
- https://git-scm.com/docs/git-restore ：核對 --source 與 --patch；選中區塊可能覆蓋未保存修改，維持備份與範圍審查說明。

## 目前狀態與下一關

source preserved；十節雙語正文與四圖實作已完成，正式 JSON／八份 SVG 由本次產生器維護。[逐節對照](source-map.md)記錄採用及實質修正，[發布回執](../../../../releases/2026-11-11-aase-m07-07-replacement.md)維護測試、部署與正式回讀的實際狀態。原工作樹其他章節修改保持原狀；本次使用最新 origin/main 的獨立工作樹。
