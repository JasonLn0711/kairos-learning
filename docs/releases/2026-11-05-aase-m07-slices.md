# AASE M07｜三次切片的可執行檢查點

新增工作坊前兩階段獨立快照與測試，第三階段沿用既有 reference/，避免維護另一份完整解答。起始 starter/、原參考程式、32 篇教材及 CEH 共用欄位與頁面元件均未修改。M07 七篇正文仍準備中；本批實作資源不計為新增教材篇數。

## 行為與所有權

正本在 resources/aase/slices/。第一階段具三個可存取名稱的文字欄位及「查看本次輸入（未檢核）」按鈕，明示未檢核，不產生成功或完整報告。第二階段加入 UI 外的 rules.py，拒絕缺少鍵、空白、非字串與去除首尾空白後超過 80 字元的欄位；錯誤指出缺漏，保留已填輸入。成功僅表示當次三欄檢核，沒有預覽或匯出；輸入變更重跑後需重新檢查。第三階段的快照失效、匯出重新驗證與欄位白名單由原 reference/ 提供。

切片 README、學員手冊與教師指南說明獨立目錄執行、保留學員作品、各階段分開執行 pytest、Diff 與交接紀錄。教師快照不覆蓋學員專案。無登入、多人授權、資料庫、外部模型或正式業務規則。

## 規則與本機證據

- WRITE-01–04、HTML-01：臺灣繁中操作指南、合成案例及具名路徑；未修改教材正文或日期，不調整現有出版閘門。
- A11Y-02：新增兩項真實瀏覽器測試，以具名欄位輸入、鍵盤啟動主要按鈕，驗證未檢核預覽、缺漏、補正及輸入變更後結果消失。AppTest 另測顯示內容與狀態，不將模擬器當作下載或真人任務證據。
- 封裝：原 21 檔增加至 30 檔；固定時間戳、CRC、逐檔位元組及 SHA256 核對通過。無 cache 或環境目錄入包。
- 乾淨環境：將 ZIP 解壓到 .local/aase/m07-slices/extracted/，另建 fresh-venv，按 requirements.txt 安裝；實際 Python 3.12.3、Streamlit 1.51.0、pytest 8.4.2。分目錄執行 pytest：切片一 1 項、切片二 24 項、完整參考解答 23 項，全部通過。解壓後 starter、兩個切片及 reference 四個入口也分別啟動，HTTP 健康檢查通過後逐一停止，未遺留本次服務。這次沒有另驗 Python 3.11、Windows 或真人課堂。
- 網站內容驗證、168 項 Node 測試、型別（0 errors／0 warnings）、發布邊界與 release 檢查通過。新測試只增加 Streamlit 環境，網站元件未改。證據存忽略目錄 .local/aase/m07-slices/。

安裝與測試沿用 pip／pytest／Streamlit 原生輸出，沒有新增 CLI 進度協定或百分比。參考 Python venv 官方文件 <https://docs.python.org/3.12/library/venv.html> 與 Streamlit AppTest 官方文件 <https://docs.streamlit.io/develop/api-reference/app-testing/st.testing.v1.apptest>，2026-11-05 回讀；實際相容性以上述固定版本執行為準。

## 發布與待驗

本機完整 AASE 瀏覽器 48 項通過，包含網站四尺寸、200% 文字、鍵盤、無 JavaScript、下載位元組、CEH／AASE 共用版型與原參考程式任務，以及新增兩個切片任務；完整 JSON 保存在 .local/aase/m07-slices/local/results.json。

資源提交 13ebf57 已推送 origin main。正式站發布與回讀結果於驗證後補記。M07 全文、後續 M08／M09、英文、指定品牌 Agent 全程操作、真人試教與完整工作坊驗收仍未完成。
