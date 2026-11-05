# AASE M06｜來源與新編範圍

日期：2026-11-05。六篇繁中初版均v1.0.0、revision 1，依已貼完整課綱續編；不宣稱恢復遺失附件。

| 概念 | 原始來源 | 新編與限制 |
| --- | --- | --- |
| M06-01 流程與架構 | C4 Context／Container、Streamlit架構 | 操作與結構並列，rules.py仍為程序內責任。 |
| M06-02 Context | C4官方Context | 原創本機收件角色、系統與雙向資料關係，沒有虛構外部業務或模型依賴。 |
| M06-03 Container與四層 | C4官方Container／Diagrams、Streamlit | 原創前端、Python程序、下載位置圖；四層不是四台機器，Container不等同Docker。 |
| M06-04 Web資料流 | MDN HTTP概覽、Streamlit架構 | 概念流程不冒稱封包擷取或自訂REST API；HTTP200與業務結果分開。 |
| M06-05 身分／授權／Session | OWASP Authorization／Session Management | A／B紙上候選、每次資料存取處檢查、生命週期；單人原型未實作正式多人安全。 |
| M06-06 TLS／秘密／信任 | OWASP TLS／Secrets／Threat Modeling | 逐段通道、公開憑證與私密金鑰、秘密生命週期；本機沒有因文章新增TLS或控制。 |

來源網址及查核日期集中於content/aase/sources.json。C4來源採概念與層級，不重製官方示例圖；兩張節點／關係圖為本課原創HTML資料。Streamlit文件描述框架機制，不將其自動提升為特定本機封包結果、正式身分或資料隔離證據。OWASP引用限特定原則，不聲稱完成威脅模型、正式部署或安全認證。

每篇六節、至少一個具教學用途的圖、例子、類比、誤解、最小實作及三題四選項解析，共十八題；qa保持空陣列。共同作品為architecture.md及草圖，接回problem.md、wireframe與spec。所有情境只用合成資料，不需真實帳號、憑證或API key。

新增的受限architecture圖採系統範圍分組與有方向的關係列，不把結構圖畫成流程步驟；圖例明示範圍不等於信任邊界。資料、HTML及搜尋共用正本，沒有新增SVG或放寬CEH的資料與媒體邊界。
