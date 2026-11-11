# 技術查核與編輯決策

查核日期：2026-11-10。供稿逐段保存於三個 pasted-text 檔；來源卡圖示與介面文字的處理不等於刪去教學內容。下表記錄本輪一手來源查核與編輯決策；完整標準的所有條款與 errata 不屬於本輪全面審閱。

| 供稿位置 | 查核或編輯決策 | 依據／狀態 |
| --- | --- | --- |
| 第 1 份，第六章 | 宣稱有 10 題新情境，但實際僅有第 1 題。成稿呈現該題完整四選項、保留綜合案例與學習標準，說明其餘九題未隨附件提供；不捏造遺失題文或首次答對數。 | 原稿 809–845 行。原「10 題全對」標準以條件式保留，不能成為本頁現有功能的主張。 |
| 第 2 份，單元五 §10；第 3 份，第四階段 §7 | TLS 1.3 現行規範已是 RFC 9846（2026-07），取代 RFC 8446。第 3 份仍稱正式規範為 RFC 8446，成稿需更新並註明前版。 | [IETF RFC 9846](https://datatracker.ietf.org/doc/html/rfc9846) 文件首頁與摘要本輪回讀；[RFC Editor 前版紀錄](https://www.rfc-editor.org/info/rfc8446/)亦列 Obsoleted by RFC 9846。 |
| 第 2 份，單元三 §3 | SP 800-88 Rev. 2 發布於 2025-09。安全清除為在指定努力程度下使目標資料存取不可行；題文 impossible 不宜升格成無條件絕對不可能。Purge 保留媒體可能重用的狀態；Destroy 另使媒體不能再儲存資料。 | [NIST SP 800-88 Rev. 2](https://csrc.nist.gov/pubs/sp/800/88/r2/final) 及[正式 PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r2.pdf) §3.1.2–3.1.3（文件頁 10–11）本輪回讀。§3.1／3.2 的 Clear 與 CE 亦已回讀：保留 effort level、最後一次適當清除後資料須已加密、無明文殘留、金鑰及副本處理與驗證等前提。 |
| 第 2 份，單元二 §3 | ISO/IEC 27701:2025 為 2025-10 發布第二版，已取代撤回的 2019 版；PIMS 的定位可保留。 | [ISO 官方 27701 頁](https://www.iso.org/standard/27701) 版本、用途與 lifecycle 本輪查核。另已回讀 ISO/IEC 27001:2022、27002:2022、27005:2022 與 ISO 22301:2019 官方用途與版本。 |
| 第 3 份，第五階段 §4／第六階段 §4 | FIPS 186-5 發布於 2023-02-03，官方摘要支持簽章用於完整性、來源認證及不可否認性證據。§4 不再核准 DSA 產生新簽章，保留驗證實施日前產生簽章；§5.1 要求 RSA 簽章金鑰對不能兼作金鑰建立等其他用途。 | [NIST FIPS 186-5](https://csrc.nist.gov/pubs/fips/186-5/final) 及[正式 PDF](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf) 文件頁 16 本輪回讀。網站有 2025-05 潛在修訂提示；本輪直接回讀上述正式條款。潛在更新 XLSX 擷取回傳 403，未宣稱完成全部 errata 審閱。 |
| image-11 | 保留兩端生命線、10 個事件／本機步驟與往返方向。明示虛線代表伺服器回覆，不代表未加密；共同祕密導鍵框只說明交握金鑰，應用流量金鑰依後續金鑰排程導出。瀏覽器驗證框彙整責任，不宣稱是精確封包執行時序。 | 來源圖已目視；已編入雙語圖解資料，已接入完整雙語正文並通過本機驗收；正式站證據另見發布回執。 |
| 全部三份測驗／回憶卡 | 回憶卡參考答案與本機選項解析若依正文補成，須在採用對照標為編輯補充；開放題保留自我作答，不顯示無服務支援的送出／自動批改承諾。 | 已於正文與採用紀錄標示編輯補充。現有本頁檢核僅在瀏覽器處理、不儲存或外送。 |

## 本輪圖解契約

`reference-diagrams.json` 保存雙語圖解資料，已由重建腳本接入完整成稿。十種新增圖解加上既有 CIA 共對應 11 張參考圖。HTML 與 SVG 從同一筆 items／caption／description 取得文字；`src/lib/note-diagram-specs.json` 共用固定圖名、節點數與版型。TLS 方向由固定模板提供，資料不得注入座標、path、CSS 或事件處理器。

獨立預覽入口：`node scripts/check-note-reference-diagrams.mjs`。它透過 Vite SSR 渲染真正的 Svelte 元件，於忽略目錄產生預覽 HTML、22 份 SVG、桌面／手機截圖及結果；不暫改正式 JSON 或將草稿解鎖發布。此檢查的通過範圍只涵蓋圖解 fixture，不能替代三部分全文與正式站驗收。

## 其他已核對主張

正式 JSON 的 sources 保存本輪引用 URL。已回讀 NIST FIPS 199、SP 800-115、AES 決選報告、SP 800-38E、SP 800-56B Rev.2、FIPS 198-1、RFC 5280／8017／6979、Schneier Blowfish／Twofish、Sweet32 原研究、Microsoft Defender XDR 事件應變角色與 VeraCrypt 官方文件。

- Blowfish 為 64-bit 區塊，生日界約 32 GiB 不等於跨所有情境立即洩漏；Twofish 為 AES 決選者而非獲選演算法。
- HMAC 使用祕密金鑰；普通 hash 不自行證明來源。FIPS 198-1 頁面遷移規劃不寫成已撤回。
- XTS 不提供資料驗證；VeraCrypt 隱藏卷可否認性有環境限制，官方不建議用於 SSD 等 wear-leveling 裝置，已在 1 TB SSD 題例旁明示。
- RSA 加解密與簽章分別說明 OAEP／PSS；DH 數學以測試獨立驗算。DSA 與 ECDSA 的 nonce、確定性產生方式及金鑰用途不混寫。
- TLS 1.3 的 ServerHello 後交握加密、兩端 Finished 與應用流量金鑰界線均寫入圖說；十事件圖為簡化教學，明列省略項。

來源／正文重建、逐標題映射與全部原圖雜湊已通過稽核；驗證數字、視覺差異及部署狀態以[發布回執](../../../../releases/2026-11-10-ceh-notes-reconstruction.md)為準。
