# M06-06 技術與編輯核對

2026-11-11。正文使用供稿為主，三圖依原附圖的端點與跨界關係重製。

- TLS：區分機密性、完整性與伺服器身分驗證；一般 HTTPS、mTLS 與業務授權各有責任。四步是教學簡化，不是逐封包握手時序；連線恢復等分支未展開。
- 終結：代理處解密；後端及資料庫是獨立連線，不能由入口 HTTPS 推論保護方式。
- 秘密：公開憑證／公鑰與私鑰分開。API Key 的權限與公開限制依實際服務而定，表格以有服務能力的伺服器端憑證為教學情境。Secrets Manager、Vault、KMS 的功能與保管責任不同，不能假設 KMS 直接取代所有應用秘密的保管服務。
- 外洩處理：撤銷／輪替、影響調查與服務驗證；依外洩範圍選擇切換順序，不把刪除 Git 文字當撤銷。
- 信任邊界：A／B／C 為示例資料路徑的跨界檢查位置，不要求所有查詢都先經資料庫再匯出。實際架構需按自己的資料流重畫。圖線不建立控制。
- 英文頁程式區依現有資料契約與中文保持位元組一致；英文來源稿保留完整翻譯供編輯核對。頁面在程式前後提供英文用途、六項架構責任及驗證界線。
- 原開頭錯誤網址對話與 favicon 來源卡移出正文；原稿完整保留。刪除聊天式結尾與等待作答語氣，三題移入既有理解檢核元件。

查核入口（本輪已回讀）：

- [OWASP TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)

來源保存、成稿、靜態檢查、瀏覽器與正式部署分別記錄，原件雜湊不代表教學內容已上線。
