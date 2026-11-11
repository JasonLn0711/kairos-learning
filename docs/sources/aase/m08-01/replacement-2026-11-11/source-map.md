# M08-01｜完整供稿、三圖與雙語抽換

本次由使用者要求抽換 AI 協作軟體工程相關章節並詳實記錄。正本由 kairos-learning 持有；執行位置為隔離工作樹 `/tmp/kairos-aase-m0801`，避免合入原工作目錄其他教材的未提交修改。稀缺資源為逐小節編輯、雙語核對與瀏覽器驗收時間。Planning 如需追蹤，只持有本紀錄、狀態與發布回執連結；本次未另改 Planning。

## 來源保存

- `source.txt`：附件 pasted-text-1.txt 原始位元組，保留原有連結、來源卡雜訊、問答語氣及未正規化格式。
- `image-1.png`–`image-3.png`：三張原始參考圖，沒有裁切或覆寫。
- `prior-lesson.json`：自 origin/main `3c1f378` 保存的前版 v1.0.2／revision 3。原發布日 2026-11-05 保留。
- `teaching.zh.md`、`teaching.en.md`：本次完整中英文編輯稿；`figures.json` 保存雙語圖解內容。
- `SHA256SUMS`：原稿、三 PNG、前版與雙語稿／圖解資料的雜湊。

## 逐節逐小節對照

兩語採相同錨點、教學內容、案例條件與判斷界線。完整正文由 `scripts/aase_m0801_content.py` 產生，不以來源附檔代替教學。

| 供稿位置 | 正文錨點／小節 | 採用內容與核對重點 |
| --- | --- | --- |
| 導言 | claim | 能跑與完成的差別；醫院掛號、重複預約與病歷隔離三個待證主張 |
| 一、汽車比喻 | analogy | 發動、煞車、下雨打滑、撞擊保護、儀表理解；各品質主張各需證據 |
| 二、五面向總覽 | layers／圖1 | 需求規格在上；五面向互補，沒有彼此串接箭頭 |
| 二、第一層 | layers／啟動驗證 | 餐廳網站顯示、服務、日期按鈕；最後位置同時預訂仍待驗 |
| 二、第二層 | layers／規則驗證 | 999／1,000／1,001 邊界表；>= 與 > 條件錯誤原因；pytest 的涵蓋界線 |
| 二、第三層 | layers／介面驗證 | 銀行後端拒絕而前端顯示成功；訊息、按鈕、同步更新及下載內容；AppTest 與瀏覽器邊界 |
| 二、第四層 | layers／使用者任務驗證 | 首次掛號不知道先選誰、按鈕為何停用、如何查結果；觀察完成、卡點與協助需求 |
| 二、第五層 | layers／安全驗證 | 學生成績跨帳號案例；Authentication／Authorization；最小權限、預設拒絕與每次請求檢查 |
| 三、主張證據限制 | matrix | 發票案例五列證據矩陣，完整保留不能據此證明欄；主張→規格→方法→結果→未涵蓋範圍 |
| 四、步驟一 | record／明確規格 | 上傳文件的模糊需求與必要欄位缺漏時拒絕報告的可驗收規格 |
| 四、步驟二 | record／正常異常情境 | Given–When–Then 三項及完整、空白、格式錯誤、過期資料 |
| 四、步驟三 | record／實際結果 | commit、環境、輸入與預期、實際輸出、狀態五項記錄 |
| 四、步驟四 | record／圖2 | Pass／Fail／Not Tested 定義，保留失敗證據與已測版本條件限制 |
| 四、步驟五 | record／verification-notes.md | 完整紀錄模板含驗收、環境、合成輸入、預期、實際結果、待驗及下一步 |
| 五、AI Coding | collaboration／圖3 | Agent 完成宣告、四種漏驗可能、四角色步驟及 M05／M07／M08 關係 |
| 六、Verification／Validation | misread | 兩個定義、最短路線與大貨車巷道案例、規格可能漏掉使用條件的原因 |
| 七、理解檢核 | understanding 與 checks | 三道原題、每題三選項；答案 B／C／B，原生可展開解析；保留要求 Agent 指出需求、方法、證據與待驗的收束 |

## 編輯處理與界線

1. 去除搜尋來源卡、favicon、數字「8」、外部汽車照片推薦，以及「你提供的網址……」的對話敘述。原件仍在 source.txt；三張使用者附圖完整保存並據其語意重製。
2. 修復 `\*\*易用性\*\*` 的轉義格式。五面向總覽、三狀態與協作流程的散落文字移入圖解資料，不在正文重複排列。
3. 原「提交答案並請你評分」改用現有靜態理解檢核及參考解析；沒有建立送出、計分或學習完成狀態。題目改用新 Q04–Q06，舊題保留於 prior-lesson.json。
4. 引用區塊保留 Agent 的原文 `Implementation completed. All tests passed.`。驗證筆記兩語共用原中文範例，維持 repository 的 code byte-identical 契約；英文前後文完整解釋其條件及狀態。
5. 新版增加 Verification／Validation 的完整解釋與供稿全部案例，版本為 v1.1.0／revision 4。保留六個既有錨點 claim、analogy、layers、matrix、record、misread，新增 collaboration 與 understanding。
6. 本文情境均為教學例子；沒有執行醫院、銀行、學生平台或物流系統的實際測試。正文 Pass／Fail／Not Tested 是教學分類，與本次網站編輯驗收分開。

## 三圖設計與實作

| 參考 | 結構 | 桌面與手機語意 | 差異 |
| --- | --- | --- | --- |
| image-1 | 需求規格＋五平行面向（cards，6節點） | 上方規格，往下選擇問題；桌面2＋2＋全寬，手機單欄但不增加面向間箭頭 | 使用相同資訊，增加圖說及SVG連結 |
| image-2 | 三種證據狀態（cards，3節點） | 三列與符號／文字共同區分，沒有流程箭頭 | HTML 狀態符號為裝飾，完整狀態名稱可讀；SVG保留符號 |
| image-3 | 人類→Agent→工具與真人→證據決策（flow，4節點） | 縱向三箭頭，最後決策有邊框 | 每步增加可核對的一句責任說明，不宣稱實際驗收結果 |

`VerificationEvidenceDiagram.svelte` 只接固定本課資料，HTML 承接可搜尋文字與重排；SVG 自相同正式 JSON 產生。圖名、節點數、cards／flow、項目欄位及輸出路徑受限；拒絕任意資產路徑及 markup 欄位。獨立 SVG 使用固定元素／屬性白名單、XML 解析及每檔小於100000 bytes 檢查。

## 技術來源查核（2026-11-11）

- [pytest 8.4 使用方式](https://docs.pytest.org/en/8.4.x/how-to/usage.html)：確認測試執行與選取機制；測試數不等於需求涵蓋是本文的證據判讀原則。
- [Streamlit AppTest](https://docs.streamlit.io/develop/api-reference/app-testing)：官方描述透過API模擬應用而非瀏覽器UI；因此不把按鈕存在推為瀏覽器下載成功。1.51.0 固定頁本次瀏覽工具無法讀取，保留既有固定來源紀錄，另用現行官方文件核對概念，未宣稱固定版本所有API已測試。
- [GOV.UK 任務易用性研究](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing)：觀察參與者完成指定任務，辨認理解與操作障礙。
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)：最小權限、預設拒絕、每次請求檢查權限。
- [NASA Systems Engineering Handbook 4.4.1.2.7–8](https://www.nasa.gov/reference/4-0-system-design-processes/)：對照規格要求與利害關係人期待，支持 Verification／Validation 的區分；貨車案例為供稿的教學比喻。

## 驗證與發布

[本次回執](../../../../releases/2026-11-11-aase-m08-01-replacement.md)分別記錄內容、型別／單元、發布邊界、完整雙語瀏覽器、圖檔與正式站狀態。尚未觀察的項目保留待驗。來源保存與編輯不構成真人理解、實際系統品質或全站改善證據。
