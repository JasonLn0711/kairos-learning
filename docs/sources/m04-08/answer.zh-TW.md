Q1：one-level 只涵蓋 People 的直接下一層，不包含 People 本身與更深子部門。cn 是唯一要求回傳的欄位，沒有 mail 不能證明員工沒有電子郵件。20 筆是目前身分與查詢條件下的結果，不能當成整個單位所有人的總數。

Q2：優先把 Scope 改為 subtree，保留正確的 Base，並核對 Filter、所需 Attributes、身分可見性與所有必要目錄。subtree 包含起點及所有後代，但不自動涵蓋其他網域。

Q3：success (0) 只證明本次操作在指定條件下成功完成。盤點完整性還要核對身分、Base、Scope、Filter、Attributes、筆數／時間限制、分頁最後的空 cookie，以及是否涵蓋所有必要目錄與網域。有效 TLS 保護傳輸，不會提升讀取權限。
