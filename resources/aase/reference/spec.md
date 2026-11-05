# 參考規格 v1.0.0

三個必要欄位須為字串，去除首尾空白後長度為 1–80 字元；80 字元是教學設計取捨。只匯出這三個欄位及完整性狀態與範圍說明，格式為 UTF-8 JSON。完整不表示內容真實或正式受理。無持久儲存、登入、外部 API 或正式授權。

| ID | Given | When | Then | 對應證據 |
| --- | --- | --- | --- | --- |
| A | 三欄皆為有效字串 | 檢查並匯出 | 顯示完整、提供同一筆資料的 JSON | test_complete_export_only_contains_contract_fields；test_missing_then_complete_then_changed_input；瀏覽器下載 |
| B | 任一必要欄位空白或不存在 | 檢查或直接呼叫匯出函式 | 指出缺漏、保留其他輸入、拒絕完整匯出 | test_bad_input_cannot_be_exported；test_missing_key_rejected；AppTest |
| C | 任一欄位只有空白或非字串 | 檢查或匯出 | 視為無效並拒絕匯出 | test_bad_input_cannot_be_exported |
| D | 完整資料已通過，接著清空文件類型 | 輸入變更後嘗試匯出 | 舊結果失效，完整下載消失；匯出函式重驗證並拒絕 | test_stale_success_does_not_authorize_new_export；AppTest；瀏覽器 |
| E | 任一欄位超過 80 字元 | 直接呼叫匯出函式 | 拒絕匯出 | test_bad_input_cannot_be_exported |

必要狀態包含待輸入、檢查結果及缺漏修正。本機檢核同步且短暫，沒有刻意延遲或假的處理進度；未來若加入遠端耗時操作，需補上真實處理中、失敗與逾時狀態。

UI 以欄位名稱及文字提供狀態，不只依賴顏色。修改輸入會清除檢查快照，完成預覽只屬於同一份輸入。最新執行結果由授課者寫入 evidence.md，規格本身不宣稱測試已通過。

多人讀取他人資料應被拒絕是下一階段需求，尚未實作，故不列為本原型已通過情境。
