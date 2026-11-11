# M07-05 預覽與匯出完整供稿替換

本次將 AASE-M07-C05 正式雙語正文更新為 v1.1.0／revision 4，版本修訂日2026-11-11，原發布日2026-11-05保持。兩語各十二節，完整承接導言、七章及五個概念小節；三表、兩組隨文圖、四個原開放問題與編輯參考解答進入正式內容。qa=[]，不記錄學員作答或宣稱學習完成。

- 中文頁：[M07-05](https://learn.cs-kairos.com/courses/aase/v1/m07/concepts/m07-05/)
- 英文頁：[M07-05](https://learn.cs-kairos.com/en/courses/aase/v1/m07/concepts/m07-05/)
- [原稿、兩PNG、前版與逐節採用](../sources/aase/m07-05/replacement-2026-11-11/source-map.md)

## 來源與採用

原件四檔由SHA256SUMS核對，供稿文字與兩PNG保留原始位元組。teaching.zh.json／teaching.en.json持有完整雙語成稿，產生器輸出正式lesson。六個原section錨點保留；原三個選擇題保存在前版，新四個問題使用Q04–Q07。來源到成稿逐節檢查比喻、2000→3500、五產業、BATCH-100→BATCH-101、Given–When–Then與三個負向情境；沒有用摘要取代小節。

實質澄清包括：copy為淺層複製；Streamlit提交變更與本頁input事件時機分開；reference/export_report只驗欄位，快照由app.py呼叫端比對；工具/API版本對應與授權需要可信任端檢查。兩個官方Streamlit頁面已查核，詳見來源對照。

## 圖解與互動

PreviewExportDiagram只接本課固定四項表單與七節點流程，資料模型拒絕額外節點、任意欄位及錯誤關係。表單保留A001／C123／收入證明與檢查／重設；修改即清除快照、預覽與下載，補正後須重檢。下載邊界再次檢查目前資料、快照、非空字串及80字元限制，只輸出三個允許鍵、status與scope。瀏覽器每個分頁暫存，沒有伺服器送件或持久保存。

流程圖保留修改／未變平行分支；修改分支明示返回驗證，只有未變且通過規則才進到匯出。窄版改上下排列，沒有分支間箭頭。SVG是同資料的靜態輸出；表單SVG明示靜態，不模擬可用按鈕。

| SVG | bytes |
| --- | ---: |
| m07-05-1-zh.svg | 1729 |
| m07-05-1-en.svg | 1840 |
| m07-05-2-zh.svg | 3078 |
| m07-05-2-en.svg | 3353 |

文字#18252c對背景#fbfcfd／#f7f2eb／#eef6f3對比為15.26／14.07／14.26；控制邊框#64748b對白4.76，焦點#245fb0對白6.29。

四檔都有viewBox／title／desc，文字經跳脫，固定元素與屬性白名單，不接受外部圖片或任意SVG。每檔小於100000 bytes。

## 實測證據與規則

實測平台：Ubuntu、Node.js 22.23.4、pnpm 10.34.9、Playwright Chromium。隔離工作樹為`/tmp/kairos-m0705`，原工作目錄其他修改保持。證據位於忽略目錄`.local/aase/m0705/`；瀏覽器報告results.json包含每個測試的狀態，截圖以語言／圖號／寬度命名。

| 規則 | 檢查 | 結果 |
| --- | --- | --- |
| WRITE-01–11 | 原稿逐小節與雙語語意審閱、原件SHA、產生器同步、原發布日與版號 | 本機通過 |
| HTML-01、A11Y-01、03 | 中英全文與順序、三表、程式碼、四題、無JS與原生答案收合 | 本機兩語通過 |
| HTML-02–04、FIG-01–06 | 320／390／768／1280及200%文字、無頁面水平溢出；圖文字可換行；桌面及手機截圖目視分組 | 本機兩語通過 |
| INT-01、A11Y-02 | 檢查→合法修改失效→重檢；清空／空白拒絕；重設；Tab／Shift+Tab／Enter；可見焦點 | 本機兩語通過 |
| FIG-03、05 | 搜尋文字、四SVG文字邊界／互相重疊／大小／下載位元組；鍵盤開圖 | 本機兩語通過 |
| INT-01、WRITE-11 | 真瀏覽器下載原版與修改版JSON，檔名synthetic-report.json、中文、三鍵、status／scope | 本機兩語通過 |

本機命令：

```sh
python3 scripts/aase_m0705_content.py --check
python3 scripts/aase_m0705_svg.py --check
pnpm run validate:content
pnpm test
pnpm run check
python3 -m unittest discover -s scripts -p test_validation_html.py
pnpm audit --audit-level=high
node scripts/check-publication-boundary.mjs
pnpm run validate:release
pnpm exec playwright test --config playwright.aase-m0705.config.ts
```

初輪單元319／319通過；新增模型拒絕案例並合併遠端後325／325通過；續合併M07-02後328／328通過；最終保留M06-04等遠端歷史後331／331通過。型別0錯誤0警告，內容與產生器同步通過。共享HTML驗證6／6通過；audit為四個low，沒有high／critical。瀏覽器本機2／2通過。合併後發布邊界、release與瀏覽器2／2均通過。期間另一次validate:content碰到boundary暫時fixture，待fixture清除後重跑已通過。

## Git、部署與回讀

本次來源提交87152a1、實作提交e14c565；同步時保留遠端M05-02、M06-02等同期提交。共用AaseLesson維持遠端SpecificationDiagram／SystemContextLessonDiagram／M07-02渲染及本次PreviewExportDiagram；歷史快照測試同時保留各章原版。來源與實作分開，無force-push。

部署前最近查得成功Pages執行：[42989406500](https://github.com/JasonLn0711/kairos-learning/actions/runs/42989406500)，來源3c1f378573016a166d6ae420ffcce8482e7180cd。後續616a293部署執行42989840968也已確認成功，作為本次發布前的較新恢復定位。

正式部署來源為 **48498a49519c362b4a17674cab079b03afa2b484**；[Pages執行42990651032](https://github.com/JasonLn0711/kairos-learning/actions/runs/42990651032)狀態completed／success。CI的安裝、audit、內容、331項測試、共享HTML、型別、發布邊界、release、MATLAB下載checksum、artifact與deploy全部成功。推送後fetch取得與origin/main差異`0 0`。

首次push因同期遠端前進而被拒絕；保留雙方歷史合併後，正常push成功，沒有force-push。內容提交由來源87152a1及實作e14c565承接；整合提交6dd5de8／02aded2／48498a4保留所有同期章節。最後一輪整合後重新建置並跑本機瀏覽器2／2通過；精確部署commit的全部發布閘門由上述CI證明。

部署後執行：

```sh
AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0705.config.ts
```

**正式站2／2通過**，兩語v1.1.0全文／順序、三表、程式碼、原四題、四尺寸與200%、鍵盤焦點／操作、無JS、搜尋文字均重新檢查。實際下載原版及戶籍謄本新版JSON，核對中文、三允許鍵、scope、status與synthetic-report.json檔名；四SVG在正式站HTTP 200、bytes與已驗證本機檔相同、每檔<100000，字框與互相重疊檢查通過。圖1／圖2的手機與桌面截圖及四份SVG已目視，條件分支與標籤可讀。

忽略證據：`.local/aase/m0705/production-workflow.json`保存該run所有步驟；`production-results.json`與`production-browser.log`保存正式回讀；同目錄中語言／圖號／寬度截圖為最後一次正式站回讀產物。上述檢查限本次教材與必要共用路由，不代表全站完整無障礙認證。


## 範圍與待驗

教學、來源與發布正本由kairos-learning持有；稀缺資源是教材編輯與正式站驗收時間。本次處理M07-05及必要共用路由／測試，不更改其他章節教學或工作坊Python程式。Planning保留原有控制平面角色，本次沒有新增跨repo學習進度或容量主張。

實體手機、完整螢幕閱讀器與多人授權尚未評估。本頁示範與瀏覽器測試不代表Streamlit原型新增功能、不代表企業授權機制，也不代表正式業務受理。沒有重跑未修改的Streamlit程式；其現有函式與呼叫端的責任已直接核對原始碼。
