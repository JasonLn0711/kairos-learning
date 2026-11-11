# M07-04｜資料檢核完整供稿與四圖抽換

2026-11-11；執行與詳細證據 owner：kairos-learning。發布狀態：本機驗證完成，正式站驗證待執行。

## 交付與來源

AASE-M07-C04 v1.1.0／revision 4：原發布日 2026-11-05、原課次／網址及六個既有章節錨點保留。依[原稿與逐節採用對照](../sources/aase/m07-04/replacement-2026-11-11/README.md)抽換十節完整雙語，包含第四節函式小節、第五節醫院 API 小節、全部比喻與產業案例、四張表、六份 code、完整 Agent 八步指令與五項驗收、三個原開放問題及參考解析。原三題與正文留於 prior-lesson.json，原稿與四 PNG 保留且 SHA256SUMS 通過。

規則程式從壓平原稿恢復為可執行 Python；細分訊息與非 dict 入口拒絕是供稿示例的契約，工作坊既有合併訊息另明示。本文沒有更改 Streamlit 工作坊或 ZIP，也沒有把網頁互動驗收當作 Streamlit runtime 驗收。程式碼兩語位元相同，英文正文完整解讀中文 Agent 指令。

四組圖解：UI→Validation 與互斥結果、三欄文字規則互動、三種平行程式責任、A→檢核→B→舊結果失效。採同一正式資料生成 HTML／搜尋／八 SVG，手機重排保留分支與平行語義。圖二可檢查、修正、重設；輸入事件清除舊結果，Python 空白與 Unicode code point 長度另有對照測試。無 JS 保留預設值與規則並停用控制。SVG 下載圖二固定為尚未檢查的預設，並非使用者當前輸入。

圖像重製差異：保留原圖白底細框、藍色規則區、失敗／通過標示與失效紅框；第三圖以可搜尋檔名與責任文字承接小圖示。增添圖說與條件標籤，手機將並排結果分組堆疊；不把整張參考 PNG 壓縮成手機正文。

## 實測證據

| 規則／範圍 | 命令或操作 | 結果 |
| --- | --- | --- |
| WRITE-04／10 來源原件 | 來源目錄 sha256sum -c SHA256SUMS | 原稿、四圖、前版六項通過 |
| WRITE-05／06／09–11 完整雙語與來源到正文 | aase_m0704_content.py --check；逐節正文、表格、code 與小節核對 | 十節、四表、六 code、三原題與解析；舊錨點及日期保留 |
| 程式規則與文字示範 | 來源目錄 python3 -m pytest -q | 原示例 9＋補充矩陣 34＝43 通過；逐欄缺鍵／型別／空白／長度、錯誤內容、原值不變及非 dict |
| 模型／安全邊界／Unicode | aase-m0704-replacement.test.ts | 來源／產生器、矩陣、Unicode、額外節點與任意 markup 拒絕通過 |
| 內容／回歸／型別 | pnpm run validate:content；pnpm test；pnpm run check | 通過；型別 0 errors／0 warnings；最新測試總數見 checks.json |
| 發布閘門 | node scripts/check-publication-boundary.mjs | 第二 fixture、草稿／未來日期及英文 course draft/future 閘門通過；最後重建乾淨正式輸出 |
| 靜態發布 | pnpm run validate:release；python3 scripts/validate_release.py | 通過；406 HTML、語言配對、連結／錨點與 811 資產一致性 |
| HTML-01–04、A11Y-01–03、INT-01 | playwright.aase-m0704.config.ts | 兩語全文／表格／code／參考解析、320／390／768／1280、200%、鍵盤／修正／重設、無 JS 與搜尋通過 |
| FIG-01／03–06 | 八 SVG bounds／文字重疊／回讀位元組；390 中文與1280英文四圖逐張視讀 | 通過；圖解分組與方向清楚，每圖小於 100000 bytes |
| 依賴稽核 | pnpm audit --audit-level=high | 4 low，無 high／critical |
| 工作樹範圍 | 以 origin/main 建立隔離工作樹；git diff --check | 保留原工作樹其他章節的未提交修改；本次只提交 M07-04 與直接相依路徑 |

瀏覽器逐頁證據存 `.local/aase/m0704/`，結構化摘要與圖檔 SHA-256 存本回執旁的 checks.json。初次回歸測試遇到歷史版本等值斷言，改為核對已保存的前版，當前正文由本次新測試核對；發布閘門注入 fixture 期間的測試結果不作正式通過證據，最終測試在 fixture 移除後執行。瀏覽器比對曾修復編號正規化與英文共用搜尋索引路徑，沒有放寬正文驗收。

## Git 與正式站

來源提交 `0502b42`；實作提交 `30d312e`。整合遠端 `d7f396b`，保留同期 M06-02／M06-04／M07-02／M07-05 等修改；共用來源、呈現器與歷史測試的六份衝突逐項合併，整合後 335 項單元測試、型別、發布閘門及 release 通過。

遠端 M07-05 source-map.md 既有文末空白在 staged diff 檢查中出現，保留該既有來源；本次相對遠端的變更另以 git diff --check 核對。待填：整合提交、部署 run、正式兩語全文及八 SVG 回讀結果。

## 驗證界線

已驗證的是本課內容、網頁操作、靜態發布及指定瀏覽器尺寸。學習者作答、真實裝置、完整輔助科技認證與 Streamlit 工作坊的當次 runtime 尚未驗收。本次沒有建立批改、學習進度、正式核准或資料保存服務；沒有新增依賴、變更其他課次或啟用其他專案工作。

整合後瀏覽器全文比對另外抓到共用呈現器條件改寫使 M07-04 初始條列未走 AaseProse；已將本課加入遠端新條件，保留其他課程分支，再重新驗證全文與無 JavaScript 條列。
