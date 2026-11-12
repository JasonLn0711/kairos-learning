# M20 技術查核與編輯決策｜2026-11-12

## 已回讀的一手來源

- [FIPS 197](https://csrc.nist.gov/pubs/fips/197/final)：2001發布、2023編輯更新；AES的區塊128 bits，金鑰128／192／256 bits。原稿數值保留。
- [SP 800-38D](https://csrc.nist.gov/pubs/sp/800/38/d/final)：GCM認證加密；頁面註明規劃修訂，不能將修訂計畫當作已生效新版。
- [Blowfish設計者](https://www.schneier.com/academic/blowfish/)：64-bit區塊、32–448-bit金鑰、1993設計；保留短區塊限制與新系統選型界線。
- [Twofish設計者](https://www.schneier.com/academic/twofish/)：1998、128-bit區塊、128–256-bit金鑰、五個AES決選者之一且未獲選。
- [RFC 7465](https://www.rfc-editor.org/info/rfc7465/)：禁止TLS使用RC4套件。正式稿應限定TLS範圍，避免宣稱所有用途均受此RFC禁止。
- [SP 800-38E](https://csrc.nist.gov/pubs/sp/800/38/e/final)：XTS-AES提供儲存機密性，不提供資料或來源認證。頁面另列2026修訂初稿，正式稿須清楚區分2010 final與初稿。
- [SP 800-56B Rev.2](https://csrc.nist.gov/pubs/sp/800/56/b/r2/final)：原稿所述2026-01-06 reaffirmation已確認；包含RSA基礎的key agreement、key transport與key confirmation。
- [VeraCrypt Malware](https://veracrypt.io/en/Malware.html)：遭惡意程式控制的主機可能使資料保護失效；EC-Q024不能推導加裝加密工具足以停止即時外洩。
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)：頁面已成功讀取；密碼儲存專節與Argon2id具體建議仍需逐段核對，尚不列為完整查核。

## 正式稿採用決策

1. 使用獨立M20網址，保留既有2026-11-12 Day 01頁與錨點。現行日期筆記模型只以date辨識；實作前需加入受限識別方式並測試同日不同頁、重複網址與草稿閘門。
2. `adopted.zh.draft.json`完整承接導言與十二節、27小節、八題與32選項。原稿完整保留；本草稿移除來源卡favicon及重複附件檔名。尚未以編輯解說替換模擬送出／批改文字，禁止直接發布。
3. 十張參考圖均已逐張目視檢查，關係見adoption-map.json。AEAD的密文與Tag為兩個並列輸出；公私鑰角色與操作流程分開；五個候選者與CIA不是時序流程。
4. 八題英文題幹與選項保留原順序；不得為符合唯一答案而改寫原題。EC-Q493與P1-Q114保留AES／Twofish辨識歧義，另附編輯解析。沒有提供原題庫答案檔，不宣稱已核對官方答案。

## 待驗

FIPS 180-4／186-5、AES遴選原報告、OWASP儲存細節、VeraCrypt hidden volume及Rohos差異仍需查核。完整英文稿、圖解模型與匯出、網站接線、測試及正式部署尚待完成。

WRITE-09／10：本紀錄與原稿／採用草稿分層。WRITE-11／FIG-04：目視參考圖與來源草稿僅證明設計輸入，不能代替完成頁面驗收。


## 後續查核與採用更新

FIPS 180-4、FIPS 186-5、VeraCrypt Hidden Volume、Rohos產品頁已回讀；OWASP Password Storage的Argon2id段落確認，Cryptographic Storage頁已回讀。原AES報告的推測URL不可讀，已找到正確2001/06報告頁與NIST原PDF，五個候選者及Rijndael獲選敘述均有支持。正式JSON列出15份就近引用及參考來源。

本次頁面採原供稿語言，使用獨立單語正文模型；不修改日期筆記辨識方式，也不製作虛假的英文對應。上文「需加入識別方式」及「英文稿待驗」是早期方案，已由此實作決策取代。原始記錄保留。
