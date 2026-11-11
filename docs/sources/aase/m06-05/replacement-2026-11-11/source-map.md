# M06-05 供稿抽換與逐節採用

正本：kairos-learning；原始附件逐位元組保存於 supplied.zh.md、image-1.png 至 image-3.png。SHA256SUMS 同時涵蓋待替換的 prior-lesson.json。teaching.zh.md 為採用稿，teaching.en.md 為完整對譯；figures.json 與正式 JSON、HTML、搜尋及六份 SVG 共用文字。

| 供稿位置 | 正文錨點 | 保留內容與處理 |
| --- | --- | --- |
| 導言 | three | 登入與權限、三個問題、個人原型轉多人系統的資料邊界 |
| 一、生活例子；1–3 | analogy | 醫院刷證／密碼、醫師與病人關係、持續操作與失效；三列概念表與醫師權限限制 |
| 二、Authentication | authentication | 銀行櫃檯比喻；密碼、OTP、Passkey、MFA；A 的身分及三項不能推定的權限 |
| 三、Authorization 導言 | controls | 十名理賠員、CASE-101／202、同職稱限制、五列許可表及主管／交接例外 |
| 三、1 | controls-1 | Subject、Resource、Action、Context 四因素（圖1）；B 現在匯出 CASE-101 的具體問題 |
| 三、2 | controls-2 | RBAC／ABAC／ReBAC 三列比較、模型組合、最小權限／預設拒絕／逐請求檢查 |
| 三、3 | controls-3 | 兩個 GET API；隱藏按鈕仍可直接請求、資料處檢查（圖2）、水平與垂直越權 |
| 四、Session 導言 | session | HTTP 無狀態、多次購物操作與應用程式維持狀態 |
| 四、1 | session-1 | 瀏覽器 Cookie／伺服器紀錄及五欄示意（圖3）、建立到後續請求流程、Cookie／Session／Token 的區別 |
| 四、2 | session-2 | 網銀離席風險、五項生命週期控制表、依情境設效期、Session Hijacking、三項 Cookie 屬性與匿名 Session |
| 五、跨產業比較 | industries | 銀行／大學／電商／工廠／AI Agent 五列；B 搜尋 A 合約的情境與檢索／資料庫／工具／匯出授權，system prompt 的限制 |
| 六、Streamlit | streamlit | session_state、OIDC 三個 API、四列能力表及十人安全共用的證據邊界 |
| 七、軟體規格 | record | architecture.md 候選模板，四組規格、五負向測試、全部待實作／待驗證；中英模板共同保留，避免修改程式區塊的雙語契約 |
| 八、理解檢核 | negative、AASE-M06-C05-Q04–Q06 | A／B 律師與 C 行政情境；三題完整四選項，答案 B／B／C 及每選項解析；原題 Q01–Q03 保存在前版，不重新賦義 |
| 結尾原則 | negative | 實際資源處判斷此人現在可否執行該動作、多人系統門檻 |

## 編輯處理與官方查核

- 原稿的錯置網址說明屬對話定位資訊，正式頁沿既有正確 m06/concepts/m06-05/ 路徑，移除 utm_source 與聊天來源卡、favicon、三張外部醫院情境圖片連結。原文保存在 supplied.zh.md。
- HTML entity、反斜線句點與行末跳脫正規化；沒有刪除技術推論、例子或表格。供稿的「提交答案」改用既有原生參考答案，不新增無效送出或進度紀錄。
- 2026-11-11 查閱 [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、[OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)、[Streamlit authentication](https://docs.streamlit.io/develop/concepts/connections/authentication)。Streamlit 的 OIDC 身分確認與業務資料授權分開，保留此邊界。本文不宣稱原型已具備登入或安全多人隔離。
- 圖1保留四列平行因素；圖2保留失效／有效、拒絕／許可條件，不將拒絕排成成功前置步驟；圖3保留兩角色與單向 Cookie 請求，伺服器端五欄紀錄。手機重排以明文條件維持路徑，SVG 為固定座標下載版。

## 維護與驗收

執行 `python3 scripts/aase_m0605_content.py --check`、`python3 scripts/aase_m0605_svg.py --check`；原件用 `sha256sum -c SHA256SUMS`。實際發布與規則驗收由 [回執](../../../../releases/2026-11-11-aase-m06-05-replacement.md) 承接。來源保存、正文採用、瀏覽器驗收、正式部署與學員理解分別記錄。
