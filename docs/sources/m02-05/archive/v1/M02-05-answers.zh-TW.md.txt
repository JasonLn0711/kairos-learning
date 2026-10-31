# M02-05 參考解答

## answer-check｜郵件角色與驗證

退信交由 platform.example 處理，畫面作者使用 shop.example。可信收件端顯示 DKIM 驗證通過，而且簽署網域 d=shop.example 與 From 的 shop.example 相同；這條路徑符合 DMARC 的驗證與對齊條件。

SPF pass 描述 platform.example 這個信封網域的寄送來源檢查。各自記下檢查對象，就容易看懂平台代寄的分工。

遇到更改付款帳戶的要求，可透過原先保存的官方電話、已知客服入口或原有負責人聯絡方式確認。以獨立取得的管道核實新收款資訊，完成技術與業務兩層查核。

## answer-choice｜Received 與可信紀錄

選 B：先查看自家可信節點產生的 Received。它記錄該節點接收郵件的連線對象與時間，適合對照自家日誌。接著逐段確認上游紀錄的產生者，再整理時間順序。
