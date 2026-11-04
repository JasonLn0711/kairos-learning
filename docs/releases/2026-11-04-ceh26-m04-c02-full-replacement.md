# CEH M04-02 完整供稿抽換 v1.1.0

依2026-11-04供稿抽換正式雙語DNS教材，保留11章、補充第12部分、FAQ、綜合Ubuntu練習、總結及四題整合理解檢核。原稿與兩張參考PNG完整保存；原正式v1.0.0另行歸檔。[來源與逐小節對照](../sources/ceh26-m04-c02/revision-2026-11-04/README.md)記錄75個中英錨點、每項編輯差異、技術查核與圖解重製方式。

採用內部ID CEH26-M04-C02，原發布日維持2026-11-04，revision 2、contentVersion 1.1.0、修訂日2026-11-04。公開網址沿M03命名：[繁中M04-02](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-02/)、[英文M04-02](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-02/)。ceh26前綴不建立第二份頁面；導覽、搜尋、sitemap、canonical與hreflang均維持m04-02。

## 本次修改

中文以供稿全文加明列格式／編輯修正進入正文，獨立核對1162個有序來源單位，含表格各格及程式碼各行；英文逐小節對應用途、原理、例子、命令、條件與限制，獨立核對574個英文稿來源單位。雙語各12表、2張圖與1個原生收合的四題參考答案。教學FAQ不是學員討論；qa保持空陣列，沒有新增送出／評分或進度宣稱。

兩張參考圖重製為可選取、搜尋的HTML／CSS圖解，採容器重排，並以共同資料產生四份SVG。保留角色、五組紀錄、分層證據、三種安全機制與TSIG邊界。圖中授權條件明確適用各階段，解析器可從快取回答；箭頭不代表必定接觸權威端或取得權限。寬表格與ASCII／code採具名稱、可鍵盤捲動的局部容器；本課表格字級至少16px、行高1.8。

| 公開SVG | bytes |
|---|---:|
| /images/ceh/dns-overview-zh-v1-1-0.svg | 7589 |
| /images/ceh/dns-overview-en-v1-1-0.svg | 9156 |
| /images/ceh/dns-security-zh-v1-1-0.svg | 6273 |
| /images/ceh/dns-security-en-v1-1-0.svg | 7421 |

每檔小於100000 bytes，沿既有sanitizer與viewBox限制，無任意SVG／HTML輸入。頁面圖與下載圖使用相同文字及分組；下載保持桌面幾何，手機以原生HTML重排。字型、圖高及保護範圍卡的位置隨閱讀欄寬調整；不宣稱像素級複製原PNG。

## 本機驗證

以遠端最新6387c1e建立隔離工作區，並再次執行`git pull --ff-only origin main`，回報Already up to date。原工作區無關修改不納入提交。修改前最後成功Pages：41778897173、來源6387c1e0d7891f7a1aa6eecf49e389df7becaa4a。

- `verify-ceh26-m04-c02.py`：原稿加明列差異等於採用中文；雙語來源至教材順序通過，75個章／小節對照。
- 兩支content／diagrams產生器`--check`：正文與下載同步。
- `npm run validate:content`通過；`npm test` 152項通過。
- `npm run check`：0 errors、0 warnings。
- `node scripts/check-publication-boundary.mjs`：draft／future fixture未進512份文字輸出，完成移除fixture後重建。
- `npm run validate:release`通過；`verify-m04-retirement.py`核對103份舊原檔可還原、兩篇公開／八篇待發布、853份輸出排除75個退役標記，其他概念與MATLAB不變。
- `npx playwright test --config playwright.ceh26-m04-c02.config.ts`：22項通過。包含C01保護、C02雙語全文、320／390／768／1280、200%文字、無JS、鍵盤原生收合／局部捲動／下載焦點、搜尋、導覽、版本、公開slug、canonical／hreflang、page JSON、sitemap、待發布及前綴404、SVG逐位元組與文字邊界／重疊檢查。
- 目視桌面／手機圖解及四份SVG：角色順序、平行卡、箭頭、授權條件及傳輸保護範圍清楚；未發現裁切與重疊。
- `git diff --check`通過。`npm audit --audit-level=high`通過，既有5項low依賴問題保留，不在教材修訂中作破壞性框架升級。

適用WRITE-01–10、HTML-01–04、FIG-01–06、A11Y-01–03；INT-01無新增計算互動。證據在`.local/ceh26-m04-c02/local/`，正式站另存live/。瀏覽器模擬不等於實體手機／完整螢幕閱讀器認證；未執行供稿中的DNS查詢、AXFR、port scan或系統設定變更，亦無學員理解或官方考試準備度判定。

## 發布狀態

待本次PR、CI與Pages完成後補上實際提交、部署與正式站同套驗收。不得以本機通過代替正式上線證據。恢復採新revert提交保留歷史，不恢復退役legacy DNS課程或force-push。
