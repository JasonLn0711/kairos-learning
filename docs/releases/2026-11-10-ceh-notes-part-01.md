# 2026-11-10 CEH 同日筆記｜第 1 部分

## 交付範圍與來源

使用者提供「今天的筆記 1 of 3」，要求同一天放在一起，並依三張附圖繪製。[來源對照](../sources/ceh-notes/2026-11-10/part-01/source-map.md)逐節連接原文、三原圖、校對與成稿。原文及原圖SHA-256已逐一核對，來源本體保留於此repo的docs，不打包進公開網站。

[正式JSON](../../content/ceh-notes/2026-11-10.json)以日期識別，`parts`本次只有第1部分，`expectedParts=3`記錄使用者預期。第2、3部分未提供；後續加入同一JSON及同一頁，保留日期網址、原發布日及既有錨點。沒有個人作答、學習完成或正式考試通過的主張。

公開頁：

- [中文日期頁](https://learn.cs-kairos.com/ceh-notes/2026-11-10/)
- [英文日期頁](https://learn.cs-kairos.com/en/ceh-notes/2026-11-10/)
- [筆記目錄](https://learn.cs-kairos.com/ceh-notes/)

本次完整採用導讀、六大節、白／黑／灰帽及Script Kiddie表、九筆答案對照、CIA四小節、安全控制三類表、五層防禦、複習間隔、三回憶卡及三個三選項檢核。銀行、192.0.2.10／.11、10–14時、DoS、跨院病歷、血型A改B、掛號停擺、電子合約及機房裝置遭竊案例逐項保留；兩語小節與深度對應。

原稿「六題圍繞授權」依七筆題號校對為七；未附原題全文，因此保留為供稿參考答案。兩張補成的回憶卡、卡片答案與檢核解析依正文原理加入，與原供稿清楚分開；沒有補出未收到的18題或M20內容。NIST／ESC來源於2026-11-10回查，原題正解仍待題文核對。

## 實作與邊界

沿用Svelte、SourceBody、ArticleMetadata、共用`isPublic`與既有Pages發布流程，未新增依賴。

- 唯一日期catalog連接清單、路由、語言切換、搜尋、sitemap與公開payload；雙語日期內容在同一資料物件維護。
- `ceh-notes.ts`拒絕重複日期、無效日期／部分、額外欄位、任意markup、錯誤圖解節點數、錯誤答案索引及不對應的雙語結構；新部分錨點使用pN前綴。
- 整篇與個別部分都以status／publishedOn過閘，草稿及未來內容不進入公開資料。
- 圖一維持四節點向下順序；圖二維持藍／綠／米白平行CIA與線條圖示，手機上下重排且無箭頭；圖三保留計數、置中問題、對應題號、答案及前後卡操作。字型、留白與按鈕顏色沿用站點；SVG靜態匯出包含三卡與答案，未假裝具有互動按鈕。
- 回憶卡與檢核在本頁處理，無儲存或外送；無JavaScript可閱讀三卡與原生答案，不能使用的表單按鈕停用。每題三選項保持原稿，逐項解析可展開。
- 原工作目錄兩份既有dirty文件保留；編輯、來源、驗證均在`/tmp/kairos-ceh-exam-notes`隔離工作樹完成。kairos-learning是正文、來源與工程證據的owner；沒有修改個人CEH進度或其他repo。

## 驗收與實測

適用WRITE-01–11、HTML-01–04、FIG-01–06、INT-01、A11Y-01–03；WRITE-08以M01辨識同日第1部分的課程主題，日期頁為同日集合。

| 檢查 | 結果與範圍 |
| --- | --- |
| 原稿到正文 | 逐節比對見source-map；表格九列及三完整情境逐項保留。原文與圖三的缺項、補成內容及七題校對明列。 |
| 中英成稿到頁面 | 瀏覽器逐節比對每段文字、每個表格資料格、圖解節點、回憶卡及全部選項／解析，兩語均通過。此證據搭配逐節閱讀，不以標題數替代內容深度。 |
| `pnpm run validate:content` | 通過既有22篇教材、51原創題、29詞彙及新筆記catalog匯入驗證。既有題數不包含本次三個頁內檢核。 |
| `pnpm test` | 286通過、0失敗，涵蓋同日彙整、獨立路由／搜尋、逐層draft／future、非法資料與題目語意。 |
| `pnpm run check` | 0錯誤、0警告。 |
| `node scripts/check-publication-boundary.mjs` | 實際build確認整篇與同日部分draft／future標記不出現在HTML、JSON、JS或XML；保留既有CEH及AASE邊界，結束時移除fixture並重建乾淨正式產物。 |
| `pnpm run validate:release` | 靜態連結、語言對應、資產等既有發布檢查通過，新增同源SVG `--check`納入此命令。 |
| `node scripts/check-ceh-notes-browser.mjs` | 中英320／390／768／1280及各寬度200%文字；無頁面水平溢出；正文至少16px／1.8；無JS全文、原生答案、可聚焦捲動表格；Enter／Space展開及前後卡；B／B／A回饋、錯誤答案回饋與修改後清除回饋通過。 |
| SVG | 六份下載位元組與本機相同，每份小於100000bytes；文字無viewBox越界與互相重疊。初測發現回憶卡長句越界，縮窄換行後重測通過。 |
| 目視 | 對照三原圖、桌面三圖與320px CIA／回憶卡；檢查靜態SVG中英匯出，保留分組、順序與圖意。截圖於忽略目錄`.local/ceh-notes/`。 |
| 對比 | 正文15.26:1、補充文字6.77:1；三圖示／其卡底色分別5.15、5.95、5.73:1。 |
| 其他 | `pnpm audit --audit-level=high`通過門檻（4 low）；HTML validator 6項通過；來源SHA256全部通過；`git diff --check`通過。 |

六份匯出：

| 圖解 | 中文bytes | 英文bytes |
| --- | ---: | ---: |
| `/images/ceh-notes/2026-11-10-part-1-workflow-{zh,en}.svg` | 2005 | 2305 |
| `/images/ceh-notes/2026-11-10-part-1-cia-{zh,en}.svg` | 2763 | 2806 |
| `/images/ceh-notes/2026-11-10-part-1-recall-{zh,en}.svg` | 4196 | 5712 |

## 發布回讀與待驗

前次成功部署為fd256fc，Pages run 42776106302。此次依專案既有文章發布授權，完成驗證後提交、推送main，使用Pages部署；部署commit／run與正式回讀的結果保存在忽略目錄`.local/ceh-notes/part-01-publication.json`並於交付回報。推送後核對`HEAD...origin/main`為`0 0`，部署後同一瀏覽器腳本設定`CEH_NOTES_BASE_URL=https://learn.cs-kairos.com`重跑。

尚未執行實體手機、完整螢幕閱讀器或個人學習理解驗收；未附原題全文，字母答案仍是供稿參考。第2／3部分收到後延續本日頁面，不把未收到內容視為已完成。
