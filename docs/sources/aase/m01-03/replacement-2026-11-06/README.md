# M01-03｜完整來源、五面向圖與文件授權模擬

## 原始來源

- `pasted-text-1.txt`：本次完整供稿，逐位元組保存。
- `image-1.png`：使用者提供的五面向共同支撐圖原件。
- `previous-v1.0.2.json`：修改前完整中英正文、練習、檢核與版本。
- `SHA256SUMS.txt`：以上三份原件的 SHA-256；在此目錄執行 `sha256sum -c SHA256SUMS.txt`。
- `source-paragraph-map.json`：原順序對照 139 個非空白段落，明列保留、表格／清單／問題／選項保留及介面／ metadata 轉換。11 個原始選項完整保留。

正式正本仍為 `content/aase/lessons/aase-m01-c03.json`，不另建可獨立編輯的重複正文。原文兩個外部圖片連結保留於供稿；頁面採同情境文字卡，未聲稱重製那些外部照片。隨附的五面向 PNG 是本輪主要圖解參考。

## 完整章節對照

| 原稿 | 正式 section ID | 採用內容 |
| --- | --- | --- |
| 導言 | start | 個人可用不等於十人共用的核心 |
| 一、辦公室故事 | analogy | 同情境兩卡、部署網址、五種失敗與完整推理 |
| 二、五個面向 | differences | 五卡共同連接成果、五列面向表；圖本身的額外 h2 轉為圖說 |
| 三、驗證與授權 | identity | Authentication／Authorization h3、18 組模擬、RBAC／資源授權及伺服器檢查 |
| 四、並行操作 | concurrency | 09:00–09:03 時間線、Lost Update、版本 1→2 與衝突處理 |
| 五、資料保存 | storage | 白板／存檔類比、記憶體、持久化、備份、還原及 100 份文件 |
| 六、HTTPS | https | 憑證條件、傳輸機密性／完整性、五種保護機制表 |
| 七、驗證共用 | case | Given–When–Then、五種驗收情境、負向測試及執行證據 |
| 八、三階段 | gate | 個人原型、受控多人測試、組織正式使用與相稱設計 |
| 九、前三課 | connections | 三課對照及成果→責任→規則→測試→證據 |
| 十、理解檢核 | review、checks | 三題 4／4／3 選項，編輯參考答案 C／A／C、原生收合 |

兩語均為 11 個主 section、四個語意圖及四表；身份章四個原生 step 保持 h3 與本文順序。三題保留原始選項數，不補造第四個答案；QA 仍為 []，沒有提交、批改、分數或學員進度寫入。原發布日與翻譯開放日期 2026-11-05 保留，v1.1.0、revision 4、修訂日 2026-11-06；stable ID、slug、readingId、summary、目標與原練習保留。課綱／搜尋／導覽標題同步為供稿主題。

## 附圖的節點與線型

原圖五張上排卡按「身分、權限、資料、協作、維護」固定順序，提問分別是「誰在使用？能做什麼？存在哪裡？同時操作？誰負責？」；權限是橘底白字，其他為淺灰。五個節點接到共同橫線，再以中間支線接下方「安全、可靠、可交接」。這是共同支撐關係，沒有方向箭頭，不能畫成五個先後步驟。

OrganizationDimensions 沿既有 cards 模型使用六個 item：前五個節點與最後一個共同成果。桌面保留五卡、橫向共同線與中央成果；窄容器／200% 文字改成左側共同母線，各卡與成果各自接回同一條線，維持平行語意。HTML 文字直接可選取、搜尋，CSS 連線為裝飾；沒有使用原圖整張縮小、任意 SVG、座標或外部資源。

本站字型與補充圖說取代原圖固定字型；英文長標籤採 1rem，完整顯示不省略，其他節點保留內容驅動高度。橘色微調為 #b15840，白字對比約 4.84:1；保留同一色彩角色。詳細結構與驗證見[圖解契約](../../../../diagram-design-system.md#aase-organization-dimensions)。沒有新增 AASE SVG 匯出格式。

其餘圖解為原文導出的個人／十人情境比較、文件授權模擬及更新遺失時間線，不加入原文之外的真實服務或治理能力。

## 授權模擬的明列假設

第三節原文沒有給完整權限矩陣，本輪採以下固定教學政策，直接寫在公開圖說與規則列表中：

| 身分 | 文件 A | 文件 B |
| --- | --- | --- |
| 小明（承辦 A） | 讀、改、刪 | 全部拒絕 |
| 小美（承辦 B） | 全部拒絕 | 讀、改、刪 |
| 主管（唯讀複核者） | 只可讀 | 只可讀 |

`simulatedDocumentAccess` 先限制三身分／兩文件／三操作；未知識別字預設拒絕。已獨立指定 18 組預期並測試，不用函式本身產生期望。原生選單預設小明／文件 A／讀取；無 JavaScript 停用選擇並保留預設與全部規則。沒有真實登入、後端、文件讀寫、刪除、儲存或網路請求，也不是任何組織的實際政策。

第四節是另一個合成案例，另外授權兩位承辦人修改同一份文件；公開正文已標明與前一節固定模擬不同。原文版本號解法補明比較與更新要由伺服器／資料層以原子操作或交易一起保證，不只在前端比較再分開寫入。沒有把圖說或模擬當作真正的並行／授權／備份驗證。

## 查核與維護

2026-11-06 核對 [OWASP 授權指南](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、[Cucumber Given–When–Then](https://cucumber.io/docs/gherkin/reference/)、[MDN If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Match)與 [TLS](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security)。課程保留既有 OWASP TLS 來源。來源支持條件與機制解說，不表示本輪完成正式帳號、共用後端或備份還原。

維護同一雙語 JSON；AASE 驗證器固定本課 differences 六卡、identity 三角色卡，兩語沿既有 shape 核對，未放寬 CEH 或任意標記邊界。舊英文／短標題遷移測試核對前版保存檔，新內容另驗來源對照、固定節點、18 組授權與非法輸入；保留其餘 48 篇正文及歷史題目。

目錄標題變更同步工作坊 ZIP 的 curriculum.json 與校驗碼；其餘 29 個檔案逐位元組不變。內容、單元、型別、publication-boundary、release 後，執行 `npx playwright test --config playwright.aase-m0103.config.ts`，正式站設 AASE_BASE_URL；另核對 M01 英文與 M01-02 互動回歸。[修訂回執](../../../../releases/2026-11-06-aase-m01-03-replacement.md)保存實測與發布。

AI 協助編輯、英譯、圖解與工具驗證。實體手機、完整螢幕閱讀器、本人理解與真正多人後端／還原演練仍各自待證據。
