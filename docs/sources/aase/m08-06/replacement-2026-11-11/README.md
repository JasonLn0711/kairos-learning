# M08-06 供稿抽換紀錄（2026-11-11）

本次來源、成稿、實作與驗證由 kairos-learning 保存。稀缺資源為逐小節編輯與瀏覽器驗收時間；範圍限定 AASE-M08-C06，不擴充多人系統。Planning 僅承接既有專案定位與狀態，不存本次全文或測試細節。

- [完整原文](original.txt)、[參考圖](reference.png)：附件逐位元保存，未更動原措辭、錯誤或被截斷的程式。
- [舊版教材](previous/lesson.json)：修改前 v1.0.2、revision 3；原發布日 2026-11-05 與六個既有錨點保留。
- [繁體中文成稿](teaching.zh.md)、[英文成稿](teaching.en.md)：正文的直接來源；`scripts/aase_m0806_content.py --check` 比較正式 JSON。
- [報告函式](report.py)、[三個測試](test_report.py)：補完並可執行的獨立教學示範，與工作坊原型分開。
- [發布回執](../../../../releases/2026-11-11-aase-m08-06-replacement.md)：實測與部署證據。

## 原文 → 正文逐小節對照

| 來源 | 成稿錨點 | 保留的教學內容與編輯處理 |
| --- | --- | --- |
| 標題、導言、四個例子 | intro | 銀行、醫院、AI 與修補退步四例；負向＋回歸＋證據；補充原型邊界。刪去「我已找到」對話及 m04 路徑更正語氣，實際 URL 固定 m08-06。課名沿目錄現有名稱。 |
| 一：正向測試 | negative | ATM 有效卡／密碼／餘額／3,000 元成功；只證明該正常情境。 |
| 一：負向測試 | negative | 錯密碼、1,000 領 5,000、負數、登出、A 存取 B 五列；可控制拒絕及副作用說明。 |
| 二：風險到測試五步 | analogy | 原圖五個節點與四個向下箭頭，最後一格淡綠；需求風險→設計負向→執行證據→定位修正→回歸交接；醫院病歷推導、OWASP 四問。 |
| 三：案例一 | matrix | 保險理賠三必要欄位；完整／空白／錯型別／過長四分支；UI 與直接函式都須守規則及原因。 |
| 三：案例二 | matrix | 物流原三欄 JSON 與多 debug_note JSON；明確 allowlist、精確 key 集合斷言及其他出口尚無證據。 |
| 三：案例三 | matrix | 購物車兩件、2,000 元、檢查成功、刪商品、舊總額五步；報告欄位清空後成功及下載失效；後端重新驗證。 |
| 四：畫面不可見與授權 | future | 小明／小華、GET /api/reports/102、登入與資源授權差別；Authentication／Authorization／Access Control 三列；可信任邊界、預設拒絕、逐請求檢查。 |
| 四：Given／When／Then | future | 原候選場景全文與拒絕／不洩漏／無未授權變更；本機無帳號／多人／資料庫隔離，未實作未驗證；假 A／B 不作通過。英文附完整語意翻譯，code 依雙語契約保持一致。 |
| 五：回歸測試 | regression | 餐廳優惠券重用修補；合法一次、無券結帳、金額、折扣付款四項；原失敗案例與正常功能兩問；不得放寬或刪測試掩蓋問題。 |
| 六：程式與 pytest | testing | report.py／test_report.py／執行命令；非空字串、allowlist、pytest.raises；保留「簡化示範」並明列未測日期、數字、長度、副作用、過期 UI、授權。 |
| 六：測試層次 | testing | Unit、API／整合、UI、E2E 四列；AppTest 為模擬介面，實際瀏覽器另驗。 |
| 七：證據 | evidence | 主管追問版本／案例／原問題／影響；九欄紀錄模板，實際結果待執行；可重現可稽核不等於絕對安全。 |
| 八：產業延伸 | industries | 金融、醫療、電商、物流、教育、AI Agent 六列正負配對；未測漏洞、部署、依賴、環境獨立評估。 |
| 九：整合情境 | close、checks | 30 位老師、改 student_id 越權情境；原三題選項數 4／4／3、答案 B／C／B，新 IDs Q04–Q06 取代不同問題的舊 Q01–Q03，避免混用學習紀錄。採原生參考答案，不建立提交假功能。qa=[]，無捏造實際問答。 |

## 格式正規化與實質修正

1. 原稿 favicon 卡與來源品牌殘片移出正文；正式來源連結透過既有 sourceIds 提供。
2. `1\.` 等貼上逸出還原為五步 HTML 圖解；主要教學文字可搜尋，不以 PNG 代替正文。
3. 原 report.py 與 test_report.py 全部壓為單行，第三個測試在 amount 欄位後截斷。補回正常 Python 縮排、結尾括號及 `assert export_report(data) == data`；完整原件保留。三個測試只證明該簡化函式的案例，不宣稱 UI 過期狀態、真正授權或整體資安已驗證。
4. 增加虛擬環境與 pytest 安裝命令。獨立範例沿原 customer／date／amount 三欄，沒有替換工作坊原型的規格。
5. 原標題「證明自己是安全的」較廣，成稿導言與原課名聚焦負向及回歸證據；保留原稿對特定情境與剩餘風險的界線。
6. 來源「提交答案並取得解析」轉為真實存在的原生答案展開；展開不提交、不記錄完成。三題原選項完整保留在 checks。

## 官方查核（2026-11-11）

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)：預設拒絕、每次請求檢查與可信任執行位置。
- [OWASP Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)：四問連接需求、風險、處理與檢驗。
- [pytest assertions](https://docs.pytest.org/en/stable/how-to/assert.html)：raises 對預期例外的檢查；未拋出預期例外應失敗。
- [Streamlit App testing](https://docs.streamlit.io/develop/api-reference/app-testing)：AppTest headless 模擬與 pytest 整合，不當作實際瀏覽器執行。

## 圖解與界線

`RegressionEvidenceDiagram.svelte` 僅接本課 analogy 的 flow。aase.ts 限制位置、一圖、五節點、kind 與 title/body 欄位；不接受任意 markup。CSS 垂直置中、原生重排，最後一格淡綠；四箭頭只代表工作順序。正文圖、搜尋與兩語 SVG 從同一正式 JSON 產生。SVG 沿用受限 serializer；固定幾何並非自行重排，網頁由 HTML 承接重排。

本次不更改登入、API、資料庫或工作坊原型；多人控制維持未實作、未驗證。實際學習理解與真人／實機接受度另待使用者執行。
