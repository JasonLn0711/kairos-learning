# 續篇來源到正文的採用對照

這批兩份原稿與 17 張 PNG 屬於 2026-11-10 同一日期頁。`manifest.json` 保留 19 份附件的 SHA-256；`part-2-paragraph-map.json`、`part-3-paragraph-map.json` 分別保存 302／359 個完整中文來源單位及逐段英文。`adoption-ledger.json` 逐一記錄來源單位範圍、正文錨點與處理決策；`reference-diagrams.json` 保存 17 張圖的雙語節點及來源範圍。

## 版本與呈現

既有 [reconstruction 版本](../reconstruction/source-map.md)是另一批較新的三份完整稿與 11 張圖，含更多推導與編輯補充解析。本輪保留其全部正文、日期與錨點，在同日第 2／3 部分續接本批完整供稿版，避免以較新來源的章節盤點代替本批詳實紀錄。讀者可由目錄直達兩批內容；沒有另建日期頁或覆寫較新版本。

續篇正文保留五個治理／密碼學單元與四個密碼學單元的解釋、比喻、案例、表格、推導、條件、選項差異與歧義。包含鎖匠與外包 API、船舶比喻、醫院 VPN 的風險元素、凌晨兩點 SOC 警報、BCP／DRP／IRP、15 分鐘 RPO、FTL 與 CE 前提、SSD 移交、Sweet32、三種雜湊抗性、HMAC 歸屬限制、CA 私鑰界線、Twofish／AES 歧義、Rohos 功能重疊、受入侵已掛載主機、DH／RSA 七個數學式、k 重用、確定性簽章及公鑰目錄遭竄改等內容。

## 17 張圖

| 原圖 | 同源圖名 | 保留的關係與明列調整 |
| --- | --- | --- |
| 1 | authorization | 四步授權、範圍、測試證據與回報 |
| 2 | soc | 是／否分流、可選 Tier 3、Tier 2／3 均可到重大事件指揮 |
| 3 | blocksize | 64／128-bit 比例條、8／16 bytes、32–448-bit 金鑰獨立性 |
| 4 | hybrid | ECDHE／KDF 與憑證驗證平行匯入 AEAD；功能關係非封包時序 |
| 5 | digest | 原始 A／修改 B 的平行摘要比較與可信基準 |
| 6 | certificate | CA／網站／瀏覽器三角色、事先簽發、往返訊息與本機驗證 |
| 7 | tasks | 四種平行密碼學任務與對應機制 |
| 8 | bytes | 上方 16 個資料位元組格、下方 32 個金鑰位元組格；手機重排 |
| 9 | aeshistory | 1998 的 15 候選、五決選及 Rijndael 獲選的分組與標示 |
| 10 | storage | 三個平行保護範圍；依原文移除會暗示部署先後的箭頭 |
| 11 | hidden | 外層包含隱藏磁碟區、不同密碼、可否認性條件 |
| 12 | response | 七步應變思路；明示時序須依揮發證據、外洩與服務需求調整 |
| 13 | keymethods | RSA transport 與 DH agreement 兩欄，各自向下閱讀 |
| 14 | mitm | Alice ↔ Eve 的 K1、Eve ↔ Bob 的 K2；沒有可信直接連線 |
| 15 | tlsroles | 驗證失敗／成功分支，成功後 HKDF 與 AEAD 的功能關係 |
| 16 | signverify | 簽署／驗證兩欄，可信公鑰與方案運算界線 |
| 17 | reasoning | 六步判斷後的唯一答案／考試預期與歧義分支 |

原稿另有風險改善回饋環（沒有獨立 PNG），以七列 HTML 關係表保留末項回到風險評估的回饋，不宣稱為 ISO 強制順序。17 張圖每圖提供中英文 SVG，使用正文同一份受驗證資料；未使用原稿的 Mermaid CSS 或任意標記。

## 來源、校正與練習

- 原文匯出 CSS、favicon、來源卡與不可操作的提交介面逐位元留在原始文字；正文移除介面殘片，不移除其教學內容。
- 題號 10–27 的字母、方案與歧義保留為供稿參考答案。供稿作者「已重新判讀」的聲明改為具名來源歸屬，未冒稱本站核對未提供的完整題庫。
- 兩組各七個回憶問題及題號完整保存；附件未附翻面答案，正文指向原理解說。前面較新版本原有的 17 張回憶卡及編輯補充解析保留其既有版本身分。
- 本批兩組各五題練習保留全部題幹、選項與開放題，不建立答案鍵、評分器、提交服務或虛構作答紀錄。Day 0／1／3／7／14／30 日期及調整規則保留，不冒稱建立行事曆。
- Purge 的 infeasible、TLS 1.3 的驗證與分階段導鍵、DSA 新簽章不再核准、XTS／GCM 等條件沿原稿與明示圖說呈現。2026-11-11 再讀 [NIST SP 800-88r2](https://csrc.nist.gov/pubs/sp/800/88/r2/final)、[SP 800-38Er1 草案](https://csrc.nist.gov/pubs/sp/800/38/e/r1/ipd)、[FIPS 186-5](https://csrc.nist.gov/pubs/fips/186-5/final)、[RFC 9846](https://datatracker.ietf.org/doc/html/rfc9846)、[RFC 6979](https://www.rfc-editor.org/rfc/rfc6979.html)、[ISO 27701](https://www.iso.org/standard/27701)及 [VeraCrypt 安全模型](https://veracrypt.io/en/Security%20Model.html)的相關公開範圍。未宣稱全面審閱付費 ISO 全文或標準所有 errata。

## 可重跑證據

`python3 scripts/check-ceh-continuation-source.py --check` 核對原始 bytes、中文正規化、661 筆雙語對照及真正正文完整相等；已納入 release gate。`check-ceh-continuation-diagrams.mjs` 檢查 17 圖的無 JS、四尺寸、200%、34 SVG 幾何與下載；`check-ceh-continuation-graphs.mjs` 檢查實際頁面量測後的箭頭端點。完整頁面另跑既有 `check-ceh-notes-browser.mjs`。雜湊與測試只證明其範圍；發布及待驗界線見 [本輪回執](../../../../releases/2026-11-11-ceh-continuation-17.md)。
