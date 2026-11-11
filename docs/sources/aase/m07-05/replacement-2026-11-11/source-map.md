# M07-05 供稿抽換紀錄

原稿、兩張參考 PNG 與編輯前正式 JSON 逐位元組保存，SHA256SUMS 記錄來源雜湊。狀態：source preserved；雙語正文與兩圖已實作，本機瀏覽器通過；正式發布狀態見[回執](../../../../releases/2026-11-11-aase-m07-05-replacement.md)。正本由 kairos-learning 持有。

| 供稿位置 | 必須採用的教學內容 | 呈現與核對 |
| --- | --- | --- |
| 導言、一 | 前兩切片脈絡；A001／C123／收入證明；檢查後改成戶籍謄本，即使完整也須重檢 | 圖1原生表單示範；標示教學模擬與無持久保存 |
| 二.1 Snapshot | 汽車煞車檢驗比喻；record.copy()；current_record == checked_snapshot；簡單字串欄位與版本號／交易／樂觀鎖界線 | 保留可複製程式碼與完整比喻 |
| 二.2 Invalidation | 購物車2000改3500；影響結果的變更使舊結果失效；Session State與on_change提交時機 | 區分瀏覽器即時輸入與Streamlit提交變更 |
| 二.3 Revalidation | 直接函式／API呼叫；UI與Export兩道責任表；醫院病歷號反例 | 分清合法性與已檢查版本；核對現有reference實作的實際責任 |
| 二.4 Allowlist | 五鍵物件含debug_notes與internal_token；僅三欄輸出；最小權限類比 | 修復原稿黏合程式碼換行；SECRET僅原稿示意字串 |
| 二.5 Scope | complete只表示三欄完整；身分、文件真實與貸款核准均另需證據 | scope明示教學完整性 |
| 三 | 輸入→驗證→快照；修改／未變條件；匯出再驗證與允許清單；JSON與scope | 圖2保留分支；修改分支回到檢查，不合流成可匯出 |
| 四 | 醫療、金融、製造、物流、研究五列輸入／變化／處理 | 語意表格與版本追溯原理 |
| 五 | Given–When–Then清空案例；合法修改、直接缺件呼叫、額外欄位三情境；pytest／AppTest／真瀏覽器分工 | 保留下載JSON／中文／檔名驗收與已下載檔案邊界 |
| 六 | Validity／Consistency／Authorization & Scope三層；本機原型範圍；Agent工具邊界 | 不聲稱已實作登入、多人授權或持久儲存 |
| 七 | BATCH-100→BATCH-101完整情境與四個開放問題 | 使用教材自我檢核語氣，qa=[]；保留原有有效錨點 |

格式修正：正文移除favicon／來源卡片擷取雜訊，原稿保留；原m04網址更正採用既有M07-05正式路由。程式碼恢復換行。原發布日2026-11-05保留；完成正文時更新內容版本與修訂日期。兩語逐小節完整對應。

## 成稿採用位置

兩語正文正本為 teaching.zh.json 與 teaching.en.json，產生器 aase_m0705_content.py 載入後輸出正式教材。導言→introduction；一→risk；二.1→analogy；二.2→state；二.3→export；二.4→allowlist；二.5→scope；三→workflow；四→industries；五→run；六→misread；七→understanding 及 Q04–Q07。原 risk／analogy／state／export／run／misread 六錨點保留。四個新開放問題採新ID，原三個選擇題保存在 previous-lesson.json，沒有轉成學員回答。

## 實質修正與查核

- 原圖2的修改分支以「返回檢查」結束；寬版保留條件並列，手機堆疊但不加分支間箭頭。只有未變且規則通過的路徑可進入匯出。
- 原稿稱匯出應確認受檢版本；現有 reference/rules.py 的 export_report(record) 沒有快照參數，只重新驗證欄位並選取允許鍵。成稿明列 app.py 負責快照比對；本頁示範 checkedPreviewReport 則同時驗證快照與欄位。沒有將函式的有限責任擴張成已完成API授權。
- 補充 record.copy() 為淺層複製，將適用範圍限於本課字串欄位。JSON匯出範例與允許清單恢復原始換行，兩語程式碼逐位元組相同。
- [Streamlit Session State](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state) 查核回呼及工作階段保存；[AppTest](https://docs.streamlit.io/develop/api-reference/app-testing/st.testing.v1.apptest) 查核程式化介面模擬與手動run，查核日期2026-11-11。兩者均不作真實檔案下載證明。
- 原稿對話式「先回答之後分析」改為教材自我檢查，四題原問句與工廠批號情境完整保留，編輯參考解答沿原生收合顯示。

## 圖解對照

圖1承接固定申請編號、申請人代號、可改文件類型、檢查／重設、狀態區；初始A001／C123／收入證明及未檢查狀態相同。增加狀態有效時的JSON預覽及實際本機下載，示範三欄快照與允許清單；下載不代表正式受理。圖1 SVG 明示為初始靜態示意，不假裝具有控制項功能。

圖2保留輸入、驗證、快照、修改／未變兩個平行條件、匯出再驗證／允許清單、JSON／scope。節點文字在HTML可選取、搜尋；下載SVG由同份正式資料生成，僅使用受限元素及屬性，所有文字跳脫，沒有外部圖片或任意標記。

## 驗證層次

來源四檔SHA-256核對通過；兩語十二節、五概念小節、三表與四問題逐節對照原稿。瀏覽器全文與順序比對、兩圖手機／桌面截圖、320／390／768／1280與200%文字、鍵盤、無JS、搜尋、四SVG字框／重疊／位元組、兩版中文JSON與檔名均已在本機實測通過。正式站回讀與Git結果由回執續記。實體手機與完整螢幕閱讀器尚未評估。

