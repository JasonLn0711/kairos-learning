# AASE v1｜合成收件完整性檢核工作坊

本包包含學員手冊、教師流程、三次切片起始骨架、可執行參考解答、規則及 AppTest 測試、合成資料與作品工作表。教材正本在 CS Kairos Learn 的 AASE 系列；本包不是原分享對話附件的重製。

適用 Python 3.11／3.12。本次套件固定為 Streamlit 1.51.0、pytest 8.4.2；這是重現組合，不表示最新版本。測試結果與執行環境以 repo 發布回執為準。Agent 品牌可替換，教師需先測試授課版本、帳號與費用。

## 啟動與測試

在解壓後的根目錄執行：

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
python -m streamlit run starter/app.py --server.address 127.0.0.1
```

Windows PowerShell 的啟用指令為 `.venv\Scripts\Activate.ps1`；依系統既有政策操作，不為安裝而降低安全設定。瀏覽器開啟終端機顯示的本機網址，Ctrl+C 停止服務。起始骨架沒有完整規則；依 student-handout.md 將 templates/ 複製到 starter/ 後逐步實作。

教師參考解答在另一個目錄，避免覆蓋學員作品：

```sh
cd reference
python -m pytest -q
python -m streamlit run app.py --server.address 127.0.0.1
```

在瀏覽器輸入 SYN-001、DEMO-A，文件類型空白時應指出缺漏且沒有完整下載。補上「合成申請表」、按檢查後可下載 JSON。接著清空文件類型，舊下載應消失。真實下載位元組及鍵盤流程需另做瀏覽器測試，AppTest 不能取代。

## 契約與限制

三欄皆須為去除首尾空白後非空、且不超過 80 字元的字串。只匯出允許的三個欄位；匯出邊界重新驗證，不依賴舊成功旗標。輸入變更使已檢查快照失效。這些是教學規則，請勿視為機關或醫療正式規範。

本機單人參考解答沒有帳號、多人授權、持久資料庫或正式部署。資料在程序／工作階段及瀏覽器下載中暫存，不宣稱安全刪除。下載的 JSON 由使用者自行管理。使用合成資料，結束後停止服務並刪除不需保留的合成下載。

## 學習與評量

閱讀 student-handout.md，依問題、設計、規格、架構、實作、測試及交接累積作品。教師使用 instructor-guide.md 的 600 分鐘安排與六題評分；case-packs/generic.json 是合成輸入。其他產業只替換合成案例與經確認規則，不維護不同工程流程。

參考來源：Streamlit AppTest 官方文件 <https://docs.streamlit.io/develop/api-reference/app-testing/st.testing.v1.apptest>；Cucumber Gherkin <https://cucumber.io/docs/gherkin/reference/>；C4 <https://c4model.com/diagrams>；NN/G <https://www.nngroup.com/articles/ten-usability-heuristics/>。
