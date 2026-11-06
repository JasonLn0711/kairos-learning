# M01-02｜AI 可以幫你做事，但誰來負責？v1.1.0

[完整來源與設計](../sources/aase/m01-02/replacement-2026-11-06/README.md) · [正式雙語資料](../../content/aase/lessons/aase-m01-c02.json) · [維護契約](../content-authoring.md#aase-m0102-replacement-2026-11-06)

## 供稿與採用

完整抽換導言、七節及課後三題／結語，兩語九個主 section、四張語意圖、四表、六項任務契約及三個 A–C 檢核。保留新同事、修車、萬用鑰匙與過期入場券類比；Suggestion／Execution／Verification、Prompt／Permission、Capability／Authorization／Verification 及規則正確性的界線完整對應。142 個來源段落逐項記錄採用方式，九個原始選項逐字保留，答案 B／C／A；參考解析為編輯內容，不是學員作答。

本次只有文字附件，兩個外部圖源無可用影像。使用者確認「依原文設計即可」，因此用既有 HTML cards／flow 設計平行角色、四種責任、三層證據與五步交付流程；沒有聲稱仿製未見的照片。原文、前版及雜湊完整保存；圖解文字與搜尋共用教材資料，沒有新 SVG 格式或外部圖片熱連結。

四情境互動用固定合成資料展示規格預期：完整、缺漏、空白及先完整再清空。結果由目前資料重新判斷，不沿用舊旗標；明示不是實際 app.py／pytest 紀錄，不傳送、儲存或評分。三選項所需的驗證器改動限於 AASE，保留三／四選項邊界、解析數與兩語一致；其他 48 篇及 CEH 原契約保持。

原發布日 2026-11-05、stable ID、slug、readingId 與翻譯開放日期保留；v1.1.0、revision 4、修訂日 2026-11-06。summary、目標與原練習保留，僅將練習的「表 2」改為「任務契約表」。spec.md 定義與刪除權限／隔離目錄的補充明列於來源紀錄，原文未被覆寫。

## 規則與驗證

WRITE-01–08：逐段來源與九個選項核對、完整英譯、技術來源與版本／日期／公開標題一致。HTML-01–04、FIG-01／03–06：語意文字、平行／編號關係、四尺寸、200% 文字、搜尋與無 JavaScript；沒有獨立圖檔，本次 SVG 下載與 FIG-02 不適用。INT-01、A11Y-01–03：四個固定情境、空白與過期狀態、鍵盤、焦點、原生答案及局部表格捲動。

本機 214 項單元全通過；Svelte／TypeScript 0 errors、0 warnings；內容與 release 通過。發布邊界在 764 份部署文字產物中未見 draft／future 標記，英文課程 draft／future 閘門通過並還原後重建。專用雙語瀏覽器 2 項、既有 M01 四篇英文 4 項及 M01-01 雙語互動 2 項回歸全通過；原始 SHA-256、來源／回執連結與 git diff --check 通過。

因目錄標題改變，重新封裝工作坊 ZIP 及 SHA256SUMS；獨立比較確認只有 curriculum.json 改變，其餘 29 個檔案逐位元組相同。檢查與重建後 release 的 30 檔封裝校驗通過，未改工作坊程式或宣稱重新驗證其執行環境。本輪檢查驗證教材及示範模型，不代替真正受測 app.py、環境權限、治理認證或本人理解。AI 協助編輯、翻譯、圖解與工具驗證；實體手機、完整螢幕閱讀器與獨立讀者理解仍待各自證據。

## 發布與正式站

來源 `287be2d`、教材／互動 `6956025`、工作坊封裝 `a46fadf`、維護／驗證 `4176f34` 分開提交並非強制推送 main，fetch 後 divergence `0 0`。先 fast-forward 保留遠端 SNMP 發布回執與測試，原 checkout 及無關 dirty work 保持。

[Pages 42209603522](https://github.com/JasonLn0711/kairos-learning/actions/runs/42209603522) 成功部署 `4176f34`。部署後以 `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0102.config.ts` 實測兩語 2 項通過：新標題、v1.1.0、完整段落、四圖、四種規格情境、九個 A–C 選項與 B／C／A 解析、四尺寸／200% 文字、鍵盤、局部表格、搜尋及無 JavaScript。

工作坊實際瀏覽器下載的 ZIP 與校驗碼逐位元組符合本機；校驗碼連結實際操作也能顯示正確內容。ZIP SHA-256 為 `3d0c1af8ca64c4e4483ce9981c12a7fdd03a8be4105871106cc53934e5232840`，內含課綱與新標題一致。初次 Python urllib 直接請求得到 HTTP 403，保留該觀察，不將其改寫成一般 HTTP 客戶端可用；瀏覽器使用者路徑通過。初版下載驗證器誤等一般 response／navigation 事件，改以原生 download 與可見校驗文字核對，沒有修改正式存取設定。

最終提交補明標題驗收與本回執，不變更已部署正文／程式；live.log、live-download.json 與截圖保存於本輪原 checkout 忽略目錄。網站驗證與真實受測應用、權限隔離及本人理解仍分開。

本機證據保存於原 checkout 的忽略目錄 `.local/aase/m0102-replacement-2026-11-06/`；發布 worktree 的 `.local/aase/m0102/` 留瀏覽器與圖解截圖。

## 相鄰教學與 Planning

承接 [M01-01 成品與問題判斷](2026-11-06-aase-m01-01-replacement.md)，本課聚焦責任、授權與驗證證據；同系列前後篇導覽依原 stable ID 及 slug 自動維持。

[今日日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/days/2026-11-06.md#aase-m0102-replacement-2026-11-06)、[網站定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#aase-m0102-replacement-2026-11-06)及 [W45](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/weekly-plan.md#aase-m0102-replacement-2026-11-06)保存狀態、容量與下一關；來源與執行細節留 Kairos。Planning `d8d14d61`／`f61994ca` 分別保存專案及日／週紀錄，推送 main 後 divergence `0 0`；repository validator 保留 44 個既有警告、0 新增，knowledge 186／186 與日／週 agenda 通過。
