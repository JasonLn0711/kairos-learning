# AASE v1｜需求與完成核對

核對日：2026-11-05。本 repo 為課程、教材、網站及工作坊正本。依使用者貼出的完整規劃與「版型、設計及欄位與 CEH 相同」要求核對；原 ZIP 已遺失，未把它列為續編前置條件。此表區分設計、實作、驗證、發布與真人接受，不因 49 篇中文齊備就宣稱整體目標完成。

## 核對表

| 要求 | 正本與實際證據 | 目前範圍與狀態 |
| --- | --- | --- |
| 系列名稱、AASE／v1 與獨立識別碼 | content/aase/course.json、src/lib/aase.ts | 已實作；中文、英文系列名稱與 AASE-Mxx-Cyy 分開管理，不和 CEH 共用 ID。 |
| 九模組、49 概念、600 分鐘含 150 實作 | course.json 與 tests/aase.test.ts | 已驗證；26 深講／20 概覽／3 延伸不變，實作時間不重複加總。 |
| 49 篇獨立中文教材 | content/aase/lessons/、各模組來源及發布回執 | 已實作。逐檔核對 49 個唯一課綱 ID、目標、正文、練習、來源與檢核；139 題四選項解析、50 張原生圖。本文數量不證明真人已理解。 |
| 每篇導讀、類比、機制、案例、誤解、練習、檢核與來源 | 各 JSON 的 summary／objectives／readingGuide／sections／exercise／checks／sourceIds | 編輯結構已核對；正式渲染逐段與正本比對，手機圖解由本次代理視覺檢視，沒有獨立真人審稿證據。 |
| CEH 相同版型、設計及欄位 | TeachingArticle.svelte、CourseRail.svelte、AaseLesson.svelte；AASE browser geometry test | 沿用共用摘要、日期版本、導讀、目錄、正文、Q&A、前後篇及側欄。AASE 保留獨立課程資料與 URL；本批未修改共用元件。 |
| 系列、模組、概念與工作坊路徑 | /courses/aase/v1/、各模組／concepts／workshop；browser tests | 已實作；全數中文發布後以不存在 ID 驗 404。草稿／未來日期仍用獨立 fixture 驗證，不因目前無缺稿放寬閘門。 |
| 搜尋、閱讀及理解檢核 | catalog.ts、TeachingArticle、checks；browser tests | 已整合。檢核為可閱讀題目與原生收合解析，不蒐集作答成績；qa 保留實際問題欄位，目前空陣列，不編造學員問答。 |
| 手機、鍵盤、200% 文字及無 JavaScript | tests/browser/aase.spec.ts、本機／正式站結果與圖解截圖 | 驗證範圍見本批回執；不提升為完整輔助科技驗收、實體手機試用或 WCAG 認證。 |
| 同一案例累積問題、線框、規格、架構、程式與測試 | resources/aase/reference/{problem.md,wireframe.svg,spec.md,architecture.md,app.py,rules.py,tests/} | 參考作品存在且相互對應；沒有真實業務 SOP、模型 API、帳號、多人授權或持久資料庫。 |
| 三次垂直切片與 Agent 任務 | starter/AGENTS.md、slices/01-form/、slices/02-validation/、reference/、M07 | 範例及範圍已實作／驗證。指定品牌 Agent 的授課版本、帳號、權限與完整課程操作尚未驗收，不以教師快照替代。 |
| 規則、AppTest、瀏覽器與負向回歸 | reference/tests/、M08 範例、本機 Streamlit browser tasks | 已驗證所列本機情境；M08 新範例由 JSON 取出，46 項整合通過。真人任務及正式多人安全維持獨立待驗。 |
| Git、README、重現、停止與復原 | M09 與 .local/aase/m09/{git-lab.log,clean-room.log,clean-room-browser.log} | 本次代理在獨立 Git 練習及全新解壓環境驗證；23 項參考測試及下載任務通過，服務已停止。真人接手、Windows／Python 3.11 仍未另驗。 |
| 10 小時教師流程、講義與六題整合評量 | resources/aase/{instructor-guide.md,student-handout.md} | 已編製；600 分鐘包含 150 分鐘實作，已有六題參考方向及 100 分評分規準。未進行真人 10 小時試教，不聲稱學員已通過。 |
| 可下載資源與合成案例 | site/downloads/aase/aase-v1-workshop.zip、SHA256SUMS.txt、package-aase.py | 新編工作坊 30 檔，固定時間戳、逐檔／CRC／SHA256 與正式下載核對。不是原始規劃 ZIP 的復原。 |
| 通用核心與產業案例分離 | generic.json、課程設計與教師指南 | 通用合成案例已提供；刑事局／醫療／企業／研究室只是可替換情境，尚未交付四套獨立案例包或核實內部流程。 |
| 英文全文及雙語出版 | 目前 AaseLesson 與驗證器只接受已確認 zh；/en/courses/aase/v1/ 關閉 | 尚未實作。需先擴充雙語資料／路由／搜尋與缺件閘門，再逐篇翻譯、核對及發布；英文系列名稱不等於全文完成。 |
| 正式網站部署與回讀 | docs/releases/2026-11-05-aase-m01.md 至 m09.md | 各批發布獨立記錄。本批 M09 的完整瀏覽器、提交與 Pages 證據見 [M09 回執](../releases/2026-11-05-aase-m09.md)，完成前不提升發布狀態。 |
| 原對話附件保存與復原 | docs/aase/course-design.md 的來源邊界 | 原 V0.3、原 ZIP、原 M04-05 詳細稿及原九模組 SVG 未取得。依已貼規劃新編，沒有將新作品冒稱原檔；HTML 課程地圖已存在，未宣稱恢復原 SVG。 |

## 下一道閘門

中文教材與本機參考作品齊備後，接續英文資料與網站能力、全文翻譯及逐頁驗證。整合遠端 1d21209 時，上游 C05 回執記載既有 CEH 英文側欄在 320px／200% 文字溢出；本批未將它納入已通過範圍。AASE 英文化前需驗證並修正共用重排，不能只開啟英文路由。

指定品牌 Agent、真人試教與完整工作坊接受需各自留下實際結果；目前沒有這些證據，維持待驗，不將規劃或自測寫成真人接受。

產業案例包及正式多人應用需先確認情境、規則與責任，再分別執行；不因核心課程完成就啟動真實資料、內部 SOP 或正式系統部署。遺失附件日後若找到，另保留來源並核對差異，不覆蓋成同一來源。
