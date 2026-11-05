# M06 六篇英譯與來源核對

2026-11-05，新增六篇 text.en 與 18 題 checks[].text.en。六份 before.json 保存修改前正本；中文正文、目標、導讀、練習、來源、qa、原發布日及答案索引保留。六篇由 v1.0.0／revision 1 升為 v1.0.1／revision 2，版本修訂日為 2026-11-05。

## 來源與採用範圍

- [C4 Context](https://c4model.com/diagrams/system-context)、[Container](https://c4model.com/diagrams/container)及[四層導覽](https://c4model.com/diagrams)：分開外部關係、應用與儲存、程序內元件與程式碼；系統範圍不等於信任隔離，Container 不等於 Docker、檔案或部署實例。本課兩張圖為合成案例；六個節點及六條有向關係的識別、種類、內外分組與方向逐項保留。
- [Streamlit 架構](https://docs.streamlit.io/develop/concepts/architecture/architecture)：支持瀏覽器／Python、HTTP／WebSocket 及框架工作階段的區分。官方現行頁面另有伺服器框架資訊，本次不將其套用到固定 1.51.0 參考環境。未擷取封包；沒有自訂 /api/check、模型 API、資料庫或正式帳號。
- [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)：請求／回應結構與無狀態協定，HTTP 成功與業務完整、正式受理及授權各自驗證。API 不限網路或 REST。
- [OWASP 授權](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)與[工作階段](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)：最小權限、預設拒絕、每次請求核對，及匿名狀態、逾時、撤銷／重新驗證責任。十人版與 A／B 負向情境維持候選、未實作／待驗；st.session_state 不當成正式身分或授權證據。
- [OWASP TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)、[秘密管理](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)及[威脅建模](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)：逐段終結、公用憑證與私密金鑰、秘密保管／輪替／撤銷、資料流與信任邊界。HTTPS 不取代授權，.env 不等於完整秘密管理，圖框不建立防火牆。未新增實際憑證、秘密或正式安全評估。

上述公開原始文件於本次英譯核對。正文、數字、條件、結論與答案逐節對照；36 節、七張圖（兩張 C4、四組平行卡片、一張流程）、一張表格及六份範本結構一致。原繁中 code 逐位元保留，英文說明對應各紀錄欄位；不要求讀者自行翻譯才能理解概念。

保留 CEH 共用 TeachingArticle、CourseRail 與欄位；不修改共用樣式、工作坊 ZIP 或 reference/。驗證及出版狀態見[本批回執](../../../releases/2026-11-05-aase-m06-en.md)。獨立真人審稿、指定 Agent、實體工作坊及正式多人安全仍須各自驗收。
