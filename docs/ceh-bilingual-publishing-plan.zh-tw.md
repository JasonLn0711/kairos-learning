# CEH 完整雙語概念文章與 Q&A 規劃

日期：2026-10-23（Asia/Taipei）。狀態：主站＋learn、每篇完整雙語為 adopted decision；
內容模型、閱讀介面與課程頁面為 implementation pending。現在公開站仍只有既有 MATLAB
課程；本文件不建立可點擊的空 CEH 頁面，也不標記任何個人學習完成。

## FIRST PRINCIPLE

- 稀缺資源：讀者理解、作者審稿時間、雙語一致性與可核對的技術來源。
- Canonical home：本 repo 擁有公開教材、編輯模板、Q&A、資產、網站建置與發布回執。
- 主站責任：[個人網站規劃](https://github.com/JasonLn0711/JasonLn0711.github.io/blob/main/docs/cs-kairos-domain-plan.zh-tw.md)擁有 cs-kairos.com、研究／專案／文章與主站部署。
- 來源與學習責任：[CEH repo 的橋接紀錄](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/docs/public-teaching-bridge-2026-10-23.md)連接個人閱讀、正式練習與來源；它們的完成證據保持各自所有權。
- Planning role：日週容量、專案狀態、證據位置與下一步；不複製教材或個人作答。
- Scope control：先一篇 M01 的完整雙語範例；後續章節依實際來源、審閱與容量擴充。
- Next gate：Jason 確認首篇概念稿與兩種語言，工程端驗證靜態範本及 MATLAB 回歸。

## 已確認需求與方案狀態

[原始需求與逐字選項回答](https://github.com/JasonLn0711/JasonLn0711.github.io/blob/main/docs/sources/2026-10-23-kairos-site-requirements.md)
保存本人要求：主站與 learn 分工、CEH 從 M01 起的重要概念教學與 Q&A、每篇完整中英文。

下列 URL、metadata、M01 首篇與製作順序是具體工作方案。方案文件已記錄，課程實作、
文章審閱、公開網址驗收仍待執行。單純 Git 文件發布不視為 CEH 課程上線。

## 讀者與網站關係

主要讀者是正在建立資安基礎、閱讀英文術語與學習 CEH 概念的人。文章也提供研究者
與工程師可回查的來源、條件與判讀界線。教材以一篇一個完整概念為單位，保留必要
子概念的連貫說明；章節入口提供目標、先備知識、已發布文章與下一步。

主站 `/teaching/` 介紹課程並連到 learn；CEH 全文主要網址在 learn。主站 `/blog/`
可以另寫研究觀點或教學反思，使用具體連結接回課程，不重複維護相同全文。

```text
/courses/ceh/                                      中文課程入口
/courses/ceh/m01/                                  中文章節入口
/courses/ceh/m01/authorization-and-scope/           中文概念文章
/en/courses/ceh/                                   英文課程入口
/en/courses/ceh/m01/                               英文章節入口
/en/courses/ceh/m01/authorization-and-scope/        英文概念文章
```

語言切換直接到同一篇的另一版本；每頁 canonical 指向自身，zh-Hant／en 互設 hreflang。
兩頁可獨立搜尋與分享。這是新增課程路徑，不更動 `/courses/matlab-practice/` 的既有網址。

## M01–M20 編輯地圖

模組順序與[現有 CEH 課程覆蓋](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/assessment-governance/course-coverage-2026-09-18.md)
及[官方二十模組課綱](https://iclass.eccouncil.org/our-courses/certified-ethical-hacker-ceh-zone-0/)對齊。
下面是原創編輯方向，保留為候選地圖；不是已完成教材、官方題庫或固定篇數承諾。

| 模組 | 主題 | 概念與 Q&A 的優先問題 |
| --- | --- | --- |
| M01 | 倫理駭客基礎 | 授權、範圍、安全目標、威脅／弱點／風險如何區分 |
| M02 | 偵察與足跡蒐集 | 主動與被動蒐集、公開資訊可支持哪些推論 |
| M03 | 網路掃描 | 主機、連接埠、服務辨識與掃描狀態的意義 |
| M04 | 列舉 | DNS／SMB／LDAP／SNMP 的用途、資訊、條件與權限 |
| M05 | 弱點分析 | 發現、驗證、誤判、排序與修補確認 |
| M06 | 系統安全與入侵流程 | 認證、取得存取、提權與持久化的差異 |
| M07 | 惡意程式威脅 | 感染、行為、分析方法與偵測證據 |
| M08 | 封包與嗅探 | 可見性、ARP／DNS、封包欄位與加密邊界 |
| M09 | 社交工程 | 信任、身分冒用、查證流程與組織防護 |
| M10 | 阻斷服務 | 資源耗盡、反射／放大、緩解與恢復 |
| M11 | 工作階段安全 | Cookie／Token、生命週期、劫持與相關防護 |
| M12 | 偵測與防火牆 | IDS／IPS／防火牆／誘捕的能力及可見性限制 |
| M13 | 網頁伺服器安全 | HTTP、服務配置、反向代理與日誌 |
| M14 | 網頁應用安全 | 驗證／授權、XSS／SSRF、API 與業務流程 |
| M15 | SQL 注入 | 程式與資料邊界、參數化查詢及修補驗證 |
| M16 | 無線網路安全 | 認證、加密、接入風險與設定判讀 |
| M17 | 行動平台安全 | Android／iOS 權限、隔離、資料與裝置管理 |
| M18 | IoT 與 OT 安全 | 裝置、韌體、通訊與實體程序需求 |
| M19 | 雲端安全 | 共享責任、IAM、儲存、容器與配置風險 |
| M20 | 密碼學 | 雜湊、加密、簽章、憑證、金鑰與誤用 |

AI 延伸依概念需要加入，例如 M09 的合成語音與身分查證、M05 的輔助判讀與
驗證、M19 的模型服務權限。每次延伸須有對應來源，不把 AI 當成每篇固定段落。

## M01 首篇與後續候選

第一篇建議為「授權與測試範圍／Authorization and Scope」，用一篇驗證內容深度、
雙語對應、例子、Q&A 與版型。後續候選：安全三要素；威脅、弱點、風險與利用；
弱點評估／滲透測試／稽核的區分；測試流程、發現事項與證據報告。
只在有完整來源與已審閱文章時才增加章節中的可點擊連結。

## 概念文章模板

1. **本文要回答的問題與先備知識。** 用具體問題說明閱讀用途。
2. **核心概念。** 解釋用途、機制、必要術語、適用條件與常見誤判。
3. **一個完整例子。** 標明真實來源或合成情境，依同一條推理說明觀察與結論。
4. **證據與防護。** 說明可以證明什麼、仍缺什麼、對應防護及確認方式。
5. **一個小檢核。** 讓讀者先自行判斷，之後可展開解析。
6. **延伸 Q&A。** 依內容需要加入定義、比較、情境或輸出判讀，不強制每篇相同題數。
7. **來源、更新與閱讀連接。** 記官方文件、版本、查核日期、前後篇與相關概念。

協定文章將用途、常用連接埠、工具角色、取得資訊的條件與防護連成一篇。
正常服務、資訊揭露、配置弱點、可利用漏洞與已取得存取權分別需要證據。
例子以授權環境或清楚標示的合成資料說明；完整課程來源與私人紀錄留在原所有位置。

## Q&A 與雙語一致性

- 題目保留答案、理由、其他判斷不成立的原因與回讀段落；答案採可展開呈現。
- 公開題使用獨立 ID，例如 `CEH-M01-AUTH-Q01`，不沿用個人正式練習 ID。
- 中英文共用文章 ID、題目 ID、章節順序、技術版本與可核對的例子數字。
- 正文、圖說、替代文字、題目與解析全部提供兩種語言；術語表隨實際文章累積。
- 新篇以兩種語言審閱完成作為發布條件；一個雙語配對只算一個教學主題。
- 技術修訂核對兩版。已公開內容有錯時優先修正，必要時明列翻譯待同步狀態。
- 章節 Q&A 索引由同一題目來源產生，避免重複維護答案。
- 公開自測不自動記成 Jason 的正式首答、複測、閱讀完成或實作通過。

## 建議內容欄位（待實作）

| 欄位 | 責任 |
| --- | --- |
| articleId、slug | 穩定概念 ID 與網址；發布後保留舊網址銜接 |
| course、module、order | 課程、章節與閱讀順序 |
| lang、translationGroup、revision | 語言配對及雙語修訂一致性 |
| title、description | 該語言的標題與摘要 |
| draft、pubDate、updatedDate | 可公開狀態、實際發布日與後續更新日 |
| prerequisites、related | 具體先備／延伸連接與連接理由 |
| sources、checkedAt | 公開來源、版本與最近核對日 |
| questionId、conceptId | 題目與被檢核概念的對應 |

未審閱草稿留在公開 Git 與建置輸出之外；已可公開的未發布材料也必須經
build-time 篩選，確保不進入路由、bundle、搜尋索引、RSS 或 sitemap。
未來發布日期不等於排程；沒有另行授權的自動每日發布。

## SvelteKit 與閱讀介面

新課程規劃採 Svelte 5＋SvelteKit＋adapter-static，在此 repo 建立內容產生流程。
實作時選定與主站相容且驗證過的版本。現在 `site/` 仍為無框架靜態站，文件不
宣稱已遷移。加入新產生器後，MATLAB 可作保留的靜態子樹，維持原檔案網址、
錨點、相對連結與下載校驗碼；部署改用新輸出前先通過既有驗證。

共用主站的暖白底、深色文字、少量強調色與字體方向；初版不新增共用套件或
monorepo 維護負擔。桌面提供章節導覽與本文目錄；手機採可展開導覽，正文單欄。
程式碼與表格在各自容器捲動，圖片附圖說與替代文字，Q&A 使用原生可展開元件。
正文、語言連結、章節／前後篇與答案在無 JavaScript 時仍可用。

搜尋列 deferred activation；先驗證章節索引與概念連結，當文章量與查找需求足以
支持時，再加入中文、英文術語與 Q&A 的靜態搜尋。

## 編輯、驗證與發布

既有筆記／Jason 的說明 → 概念稿 → 來源查核 → 完整雙語與 Q&A → 本機檢查
→ Jason 內容確認 → 依當次授權發布 → 公開網址核對。

| 階段 | 完成證據 | 不等同於 |
| --- | --- | --- |
| 規劃／來源整理 | 有來源、編輯地圖與模板 | 本人已理解或文章已完成 |
| confirmed draft | Jason 確認兩種語言與解析 | 已公開 |
| locally validated | 型別／內容欄位／建置、連結與版面通過 | 真實裝置與公開網站已驗收 |
| published | Git、部署回執與實際公開網址核對 | 正式題庫或 CEHP 實作通過 |

第一篇驗收涵蓋：兩版完整、ID 與數字一致、來源可回查、前後篇及語言切換、
鍵盤與手機閱讀、無 JavaScript 基本功能、草稿排除、正確 404、RSS／sitemap。
MATLAB 原網址、下載與 `python3 scripts/validate_site.py`／SHA-256 檢查繼續通過。

公開影片只在來源授權、人工驗收與公開 URL 已確認後嵌入；本機 CEH 製片成果
不自動上傳或算作課程已上線。會員、成績追蹤、留言、AI 助教與影片儲存另行啟動。

## 容量與接續

閱讀沿用[10/22 一概念規則](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/study-plan/concept-reading-2026-10-22.md)。
M01 的公開系列不重設 M04 閱讀位置；每週 CEH＋CEHP 240 分鐘與課日 25 分鐘
上限維持，實際餘裕待確認。雙語審稿納入現有容量，先完成一篇再評估節奏；
沒有新增日／週篇數、600 題目標或 11/29 完成承諾。

本文件的下一次更新由實際首篇草稿／模板驗證觸發；記錄來源、內容版本與
需要修正的閱讀問題。部署證據留在本 repo；Planning 只同步狀態與下一步。

[README](../README.md) · [主站架構](https://github.com/JasonLn0711/JasonLn0711.github.io/blob/main/docs/cs-kairos-domain-plan.zh-tw.md) · [Google 多語頁面](https://developers.google.com/search/docs/specialty/international/localized-versions)

## Git 文件發布回執 — 2026-10-23

本計畫與 README 由 `0bd05ea` 推送至 `origin/main`；重新 fetch 確認本機與遠端
同為 `0bd05eafefed60b5ecc50049dc913d2def368dec`，divergence `0 0`。沒有衝突或歷史覆寫。
`python3 scripts/validate_site.py` 通過，六份下載的 SHA-256 檢查通過；本次未修改 `site/`。

[Publish learning notes run 39816152276](https://github.com/JasonLn0711/kairos-learning/actions/runs/39816152276)
已觸發，00:44（Asia/Taipei）查核仍 queued；這是既有 MATLAB 站的文件提交所觸發的流程，
不代表新增 CEH 課程已上線。下一步仍是一篇 M01 完整雙語稿與靜態範本。
