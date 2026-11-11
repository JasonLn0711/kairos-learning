# AASE M08｜來源與新編範圍

日期：2026-11-05。六篇繁中初版均 v1.0.0、revision 1；依已貼課綱、M07 與本 repo 原型續編。來源網址與查核日期集中於 content/aase/sources.json，不宣稱恢復遺失 ZIP。

| 概念 | 官方／原始來源 | 新編範圍與限制 |
| --- | --- | --- |
| M08-01 驗證層次 | pytest、Streamlit AppTest 1.51.0、GOV.UK、OWASP Authorization | 原創主張—證據表；啟動、規則、介面、任務與多人控制各自驗證。 |
| M08-02 TDD | Agile Alliance TDD、pytest assertions／parametrize | 原創單一文件類型規則練習；故意不完整起點不是公開 reference 的真實缺陷。 |
| M08-03 規則測試 | pytest 8.4 assertions／parametrize／usage | 原創完整測試檔，對照現有三欄、80／81、型別、空白、匯出允許欄位及非突變契約。 |
| M08-04 AppTest | Streamlit 1.51.0 AppTest、Session State、pytest | 原創可執行測試；缺漏、補正及變更三階段。元件狀態不當作真實下載證據。 |
| M08-05 易用性任務 | GOV.UK moderated usability testing、NN/G heuristics | 原創合成任務卡與空白觀察表；同儕不是所有領域使用者，觀察與推論分欄。 |
| M08-06 負向與回歸 | OWASP Authorization／Threat Modeling、pytest、AppTest | 原型資料完整性及輸出邊界可驗；多人授權僅候選需求，保持未實作。 |

六篇各六節，具類比、用途明確的流程或平行圖、誤解、最小實作與三題四選項解析，共十八題。qa 為空，不產生假學員問題、真人結果或英文。沿用 CEH 共用欄位與版型，未新增模型、元件、SVG 或外部框架；既有 39 篇及工作坊檔案保留。

程式驗證從教材 JSON 的 code 區塊直接取出，在忽略目錄 .local/aase/m08/ 執行，沒有手工維護另一份不同範例。TDD Red 四個負向案例因未拋出 ValueError 失敗，正常一例通過；Green 與 Refactor 均五例通過。依練習另加缺鍵、首尾空白、原輸入不變三例後，兩階段均八例通過。M08-03 範例二十二項、M08-04 範例一項通過；放入原 reference 副本後全套四十六項通過。

這些是受控教材與程式驗證，不是實證研究、真人任務測試或指定品牌 Agent 全程操作。GOV.UK 的原則用於任務目標、避免透露操作答案、主持與觀察；合成收件情境及表格由本課設計，未引用未取得的內部 SOP。Session State 一般文件只支持通用原理，實際相容性由固定 1.51.0 執行佐證。多人授權、正式部署及完整安全認證均未宣稱完成。

2026-11-11：[M08-04 完整供稿抽換與三張參考圖](../m08-04/README.md)接續本課原始發布；前版另保存在該次抽換目錄，保留本次歷史來源。
