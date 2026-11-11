# M04-05 完整供稿抽換紀錄

## 來源保存

2026-11-11 使用者要求抽換 AI 協作軟體工程相關章節，詳實記錄並參考六張隨文圖。正本由本 repo 承接；本目錄保存 `pasted-text-1.txt`、`image-1.png` 至 `image-6.png` 與 `previous/aase-m04-c05.json`。SHA256SUMS 核對原始位元組。前版為 v1.0.3、revision 4，原發布日 2026-11-05。保存來源不代表正文已抽換或正式站已部署。

## 逐節採用與檢查清單

下列供稿已由 teaching.zh.md／teaching.en.md 採用至正式 JSON；保留舊錨點 start、analogy、states、principles、counterexamples、changes、observe 的相容性。

| 來源 | 成稿位置／採用內容 | 驗證重點 |
| --- | --- | --- |
| 導言 | start；醫院、ATM、購物及四個使用者問題、三核心觀念 | 保留問題及原教材任務定位 |
| 一、漸進揭露 | analogy；列印基本／進階兩層、主要與次要功能可發現性 | Office Printer、1、A4、雙面關閉、100%、反向關閉 |
| 二、極簡設計 | principles；機場延誤反例、四列資訊判斷表、銀行與診斷資訊 | 不能隱藏影響風險／行動的資訊 |
| 三、必要狀態 | states；ATM 5,000 元、四狀態完整欄位與下一步、缺漏／故障、完成邊界 | 四卡並列；檢核不等於正式受理 |
| 四、跨產業 | industries；六產業三欄表、銀行客戶與工程師的角色差異 | 保留角色／當前任務例外 |
| 五、分階段揭露 | disclosure；兩種揭露四維比較表、結帳與特殊配送共存 | 可選展開與必要步驟區別 |
| 六、舊結果失效 | changes；資料 A/B 分支、3/3 與 4/3 版本範例、後端完整性／權限／版本與 spec.md／測試 | UI 隱藏不代表後端安全 |
| 七、可近用性 | counterexamples；紅框反例、持續可見 Label、placeholder、動態狀態 | 顏色之外有文字；輔助科技 |
| 八、驗證 | observe；缺漏文件類型任務、五項驗收矩陣、一次同儕試用界線 | 候選標準與已實測成果分開 |
| 九、交付成果 | deliverables；四畫面 wireframe、三個畫面問題、舊結果失效、匿名紀錄及修正比較 | SVG／Figma／紙本皆可；不要求先完成前後端 |
| 十、理解檢核 | understanding 及 checks；概念辨識、銀行送出與確認、後端舊結果三題 | 使用既有原生參考答案；不新增假提交 |
| 結語 | 理解檢核後；負擔、時機、狀態與下一步的整合 | 保留三概念關係 |

## 六圖設計判讀

1. 列印前後並列：保留基本欄位與進階欄位；同一工作兩種展開狀態，不畫成列印流程。
2. Settings：Security／Password Change、Country Settings 與可辨識 Advanced Settings 入口；以語意 HTML 重排，示意不連接實際帳號設定。
3. Basic Settings／Advanced Configuration 前後：保留 Company Name、Email、API Rate Limit 1000/hour、Webhook URL、Custom Headers 與 Security Options。原圖右側淡化不能作為可近用範本，成稿應改為清楚的進階入口，記錄此編輯差異。
4. Accordion：保留三個標題、第二區展開、其餘收合的關係；本文原理直接顯示，收合示例只解釋元件機制。
5. 四狀態：保留 A001、甲部門、缺文件類型、等待避免重複送出、補填保留欄位、完成不等於正式受理。四卡不加依序箭頭。
6. 資料修改：A 通過後改為 B，分出錯誤沿用與正確失效兩個互斥結果；不把兩個結果串成先後。

## 編輯與發布界線

供稿中的 favicon、搜尋圖連結、孤立「11」、「W3C+2」為貼上介面殘留，原檔完整保留，正文不採用。NN/G 與 W3C 主張須查核原始公開頁面並保留精確來源。中文全文與英文逐小節等深對應後，才進入內容、型別、單元、建置、瀏覽器與 SVG 驗證。

目前狀態：source preserved、implemented。正式正文為導言與十節；雙語六圖已實作，實測及 Git／部署由回執承接。既有其他章節的工作目錄修改不在本次授權範圍。


## 實際採用與編輯差異

- teaching.zh.md 完整採用供稿獨立資訊與推理，將視覺逐行文字改放 figures.json；teaching.en.md 逐小節同深度對應。正式 JSON 由產生器維持兩語同結構，三題移至既有 checks 區的 openChecks，原始 Q01–Q03 退休保存在前版，新題使用 Q04–Q06，避免變更既有題目身分。
- 導言四個問題保留為清單；四張表保留 4／6／4／5 列。兩種揭露表的空白表頭補為「比較面向／Dimension」。NN/G「原始研究」改為可核實的「設計文章」，不將設計原則說成新實驗證據。狀態節開場改為具體教學要求，移除「最容易被低估」的無依據比較；章節七補上動態訊息無須移焦點即可由輔助科技得知的範圍。
- 版本範例保留 currentVersion／validatedVersion 的 3/3、4/3 與匯出判斷，雙語 code 相同，英文段落另解釋中文註解。新增說明指出實際後端需避免驗證與匯出間競態；此為編輯推導，不是已部署的匯出系統。
- 圖 1 保留兩卡與所有列印值；圖 2 保留設定層級與橘框，但採網站低彩度底色，中文補英文原標籤；圖 3 保留基本／進階項目，右卡明列「展開後可用」的功能清單以便教學閱讀，不將其當成已停用控制；圖 4 保留三標題、第二面板展開，補狀態文字而非複製 NN/G 商標；圖 5 四卡保留所有欄位、操作與下一步，不加流程箭頭；圖 6 保留兩前置節點與兩策略，以兩箭頭表達資料改變，不連接互斥策略。
- 六圖均為靜態、可搜尋的語意 HTML 線框示意，沒有可提交資料的假表單。只有既有參考答案可原生展開。SVG 固定桌面幾何，HTML 在窄容器單欄重排；字型、圓角、卡高隨網站規範調整，原始 PNG 保留供比較。

## 公開來源查核｜2026-11-11

| 原始公開頁 | 本課採用界線 |
| --- | --- |
| [NN/G Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | 列印基本／進階、功能可發現性與 staged disclosure 區別；設計文章，非本課新實測。 |
| [NN/G Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/) | 收合增加操作成本，三面板示意不代表所有內容適合收合。 |
| [NN/G Ten Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) | 狀態可見性與極簡設計；本課產業例子屬教學應用。 |
| [W3C Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)、[Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)、[Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) | 資訊不能只靠顏色，狀態可由程式判定，輸入有標籤；不是本頁完整 WCAG 認證。 |
| [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、[Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)、[MDN If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Match) | 後端權限／輸入檢查與版本前置條件。3/4 範例是本課簡化策略，非任一 API 的直接規格。 |
| [GOV.UK Moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing) | 觀察使用者完成具體任務；矩陣為候選條件，不是使用者實測結果。 |

## 所有權與下一關

稀缺資源為完整教學編輯與視覺驗證時間。本 repo 擁有正文、原稿、圖檔與測試證據；Planning 只適合鏡射定位、狀態、容量與下一關。這次不修改 Planning 或其他章節。發布證據留在 docs/releases/2026-11-11-aase-m04-05-replacement.md。實體手機、完整讀屏與獨立讀者理解屬另行驗收，不以自動檢查推定。
