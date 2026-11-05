# M08 六篇英文驗證教材與來源核對

2026-11-05，新增六篇 text.en 與 18 題 checks[].text.en。六份 before.json 保存修改前正本。中文目標、導讀、正文、練習、來源、qa、原發布日及答案索引保留。各篇由 v1.0.0／revision 1 升為 v1.0.1／revision 2，版本修訂日為 2026-11-05。

## 來源與採用範圍

- [Agile Alliance TDD](https://agilealliance.org/glossary/tdd/)支持先讓單一需求因缺少行為而失敗、最小修正與保持行為的重構。教材的 tdd-lab 是刻意不完整的單一規則練習，不能取代完整 reference，也不由最終程式倒推開發歷史。
- [pytest 8.4 usage](https://docs.pytest.org/en/8.4.x/how-to/usage.html)、[parametrize](https://docs.pytest.org/en/8.4.x/how-to/parametrize.html)與 [assertions](https://docs.pytest.org/en/8.4.x/how-to/assert.html)支持選定直譯器、參數組合、斷言與預期例外。區分需求 Red、環境與語法失敗；三欄六類無效值、80／81 邊界、白名單、缺鍵與輸入未改寫保留。
- [Streamlit AppTest 1.51.0](https://docs.streamlit.io/1.51.0/develop/api-reference/app-testing/st.testing.v1.apptest)明列模擬與更新 widget 後手動 run；[Session State](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state)支持狀態與回呼。元件／狀態斷言不當作真實下載位元組、鍵盤、排版或真人理解證據。
- [GOV.UK moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing)支持給明確目標、不透露操作答案、事先說明研究與記錄、觀察服務而非評判參與者。[NN/G heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)提供狀態、錯誤與復原觀點。任務卡、空白表及主持人自測都不記成另一位使用者的結果；沒有秒數門檻或改善率主張。
- [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)與 [threat modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)支持資料存取處逐次授權及按資料流／信任邊界分析。單人原型未實作帳號與多人授權，候選 A／B 情境保持未實作／未驗證，不用無關假函式宣稱通過，也不將完整性測試提升為全部資安完成。

上述公開原始文件於本批核對。英文 36 節、六張原生圖（五個流程及一組平行卡片）、四張表格、十份原 code 範本與 18 題逐項解析，依中文數字、條件與結論對照。十份程式、命令、紀錄與任務卡逐位元保留，英文說明對應原中文欄位、例外文字與候選情境。

## 實際程式驗證

從教材 JSON 取出原碼，在忽略目錄獨立執行，使用既有 Python 3.12／Streamlit 1.51.0／pytest 8.4.2 環境。TDD 起點四項因沒有拋出 ValueError 失敗、正常一項通過；同五項在 Green 與 Refactor 通過；再加缺鍵、正規化及輸入未改寫三項，八項通過。三階段程式與原測試另外保存，沒有把 import 或語法失敗當 Red。

第三切片副本加入教材 tests/test_rules_contract.py 與 tests/test_app_contract.py，與原規則／介面測試合計 46 項通過。公開 reference、切片、工作坊 ZIP 均未改。真實瀏覽器的鍵盤、缺漏補正、失效與下載由完整本機 AASE 套件另驗；真人任務觀察未執行。

程式、頁面與正式站證據及待驗事項見[本批回執](../../../releases/2026-11-05-aase-m08-en.md)。
