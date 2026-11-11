# 快照示例執行結果

2026-11-11，本機 Python 以 compile／exec 執行恢復縮排後的 snapshot_example.py，直接呼叫原 test_changed_input_cannot_export()：通過。另核對完整欄位變更成另一非空文件種類仍不可沿用舊結果、空白名稱不能建立檢查結果、沒有結果不可匯出：三項斷言通過。

此證據只涵蓋三個字串欄位的簡化 Python 邏輯，未驗證 Streamlit 介面或真實銀行業務規則。form.copy() 為淺複製；巢狀資料另需不可變值、深複製或版本識別。
