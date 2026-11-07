# M04-08 來源與編輯審查

編輯日期：2026-11-06（Asia/Taipei）。stable ID：CEH26-M04-C08。公開顯示 M04-08；沿用 m04-08 短網址。版本候選 v1.0.0、revision 1；首次正式發布日期待實際發布，尚未宣稱上線。

## 公開採用界線

本目錄保存完整經審查的繁中公開稿、全文英譯與分開的單題編輯參考答案。原始私人供稿保存在已核實的私人既有位置，公開 Git 不包含私人訊息識別、個人學習狀態或原始聊天紀錄。

繁中採用僅有兩處語意調整：第二段改為中性課程引言；題目後聊天交付／個人狀態句改成原生參考答案收合。粗體標記由 sourceBody 轉成純文字，標題仍用語意 heading。六節正文、合成例子、數字、條件、結論、單題問題與七筆來源保留。答案屬編輯參考，qa=[]。

舊 M04-10 LDAP 原稿已讀，歷史來源／版本／日期維持原狀；本篇採必要回顧及新完整性案例。前後課為 M04-07／M04-09；未把相鄰單元加入本分支。

## 來源查核與適用範圍

2026-11-06 已透過網頁工具讀取七筆一手來源。Microsoft 回應同時含一般授權提示及可讀正文；只採用實際可讀部分，沒有登入或改動權限。公開稿保留供稿標示的來源日期，這些日期不是本次部署日期。

- RFC 4511 §4.5、§4.1.9：base/scope/filter/attributes、SearchResultDone、sizeLimitExceeded(4)。[規範](https://www.rfc-editor.org/rfc/rfc4511.html)
- RFC 4513：Bind 的驗證狀態及 StartTLS／保護邊界。[規範](https://www.rfc-editor.org/rfc/rfc4513.html)
- Microsoft：三種 scope 的範圍。[搜尋範圍](https://learn.microsoft.com/en-us/windows/win32/ad/search-scope)
- Microsoft：RootDSE 能力、naming contexts 與 defaultNamingContext。[RootDSE](https://learn.microsoft.com/en-us/windows/win32/adsi/rootdse)
- Microsoft：GC 的部分屬性副本；缺欄位仍須核對資料位置與權限。[GC](https://learn.microsoft.com/en-us/windows/win32/ad/global-catalog)
- Microsoft：分頁與每批上限的區別。[Paging](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ldap/paging-search-results)
- Microsoft：SASL 訊息 signing 的完整性／來源保證及版本差異；不概括所有 AD 預設。[LDAP signing](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/ldap-signing)

案例為離線合成紀錄，沒有網路列舉、帳號登入或環境設定實測。英文逐段對應六節及問題／答案；44 個 sourceBody 區塊的種類、標題 ID、清單項數與答案段數相同。

## 維護

網站以 `python3 scripts/m04_08_content.py --check` 檢查完整主稿到 sourceBody 的一致性。出版前先完成 PR review、瀏覽器驗證，再按既有發布閘門設定實際發布日。9999-12-31 是 draft 模型的關閉日期占位，不能作為首次發布紀錄。隔離預覽使用 2026-11-06 合成日期，產物留在忽略的 .local 目錄，正式來源由 finally 還原為 draft。

## 2026-11-07 完整抽換與入門補充

以本次三份供稿與十張圖為主，逐章逐小節保留原理、案例、表格、DN／Filter／klist 範例、分支與測驗選項；完整英譯同深度呈現。新增範圍升為 v1.1.0／revision 3，保留原發布日。詳細修正、圖形對照與逐段證據在 [本次來源紀錄](replacement-2026-11-07/README.md)。

本次重新回讀 RFC 4511、4513、2696、4120，以及 Microsoft RootDSE、Global Catalog、LDAP signing、Kerberos authentication overview、Maximum tolerance for computer clock synchronization、klist、4768、4769 一手文件。公開正文末列出各文件正式 URL；查核日期 2026-11-07。Microsoft 文件雖顯示登入提示，工具仍實際取得對應技術正文；未把提示視為已讀證據。

查詢的六個維度、三種 scope、結果代碼 0／3／4、389／636、非 TLS SASL signing、分頁最後空 cookie、TGT／Service Ticket／Authenticator、AS／TGS 邏輯角色、授權分離與應用資料加密邊界均有相應段落。Windows 預設 5 分鐘與可調政策保留版本／政策條件；9:00／9:20 與 20 分鐘為合成情境。

安全風險表為高層防禦解釋，未增加取得票證、離線猜測或偽造票證的操作方法。`klist` 僅說明無參數讀取目前工作階段快取；未執行 Windows 命令，未做 LDAP 目標查詢。正文參考答案是編輯解說，不是使用者作答紀錄。
