# M04 公開網址格式修正（2026-11-04）

這份回執記錄發布前實作與本機驗收；PR／Pages 與正式站結果以實際發布回讀為準。

## 新的網址契約

使用者要求 M04 與 M03 的公開格式一致。內部 stable ID 仍是 `CEH26-M04-C01…C10`，共用 `conceptSlug`／`conceptPath` 將其對應為 `m04-01…m04-10`。目前只有 C01 公開：

- 中文：`https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-01/`
- 英文：`https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-01/`

原先已公開的 `/concepts/ceh26-m04-c01/`（兩語）明確回傳 404。GitHub Pages 不需增加轉址基礎設施或 client-only redirect；不產生別名正文，因此沒有兩份不同正文或相互矛盾的 canonical。路由產生／查找、目錄、M03-08 下一步、C01 前後導覽、搜尋、sitemap、canonical／hreflang、page JSON 都來自同一 catalog 路徑。

C02–C10 目前只有 stable-ID 目錄錨點，不建立新 slug 正文。舊 M04-02…M04-12、舊章級教材／quiz／labs、舊 SVG 與 archive 仍不公開。只有經發布閘門公開的新 stable ID，才會取得其對應的 m04-xx 網址。catalog 另檢查公開路徑碰撞，禁止 legacy 與新版 ID 同時佔用同一路徑。

## 版本與保存

依 WRITE-06，C01 從 v1.0.0 更新為 v1.0.1（內部 revision 2），原發布日保留 2026-11-04，版本修訂日為 2026-11-04。僅公開定位改變，教學 JSON 的變更只有版本與 revision；兩語 text、qa 的 JSON SHA-256 仍為 `0b34af70e3490bc8c406a70c8ce380d2920fd57eda756bb0d3e4b0ef5ce2b6e0`。

[完整原稿、英譯與單題參考答案](../sources/ceh26-m04-c01/README.md)的四份檔案與原雜湊不變；保留十節、四段命令／合成輸出、Projects/readme.txt 理解題、預設收合答案與空 qa。舊版 SMB/Kafka 正文沒有恢復。兩份歷史回執保留當時的網址與結果，另附後續遷移註記；不改寫歷史。

本次基準為 `dd1adcad0c734d169bbdf7cf3eb9b36ec9ae7041`，最後成功 [Pages run 41768968841](https://github.com/JasonLn0711/kairos-learning/actions/runs/41768968841)。此基準包含後續 M03-08 圖檔版本化等改動；本次不回退其他章節或 MATLAB。legacy 歸檔的 103 份原檔及舊基準仍保留原 SHA-256 與恢復能力。

## 本機驗證

- `npm run validate:content`：22 篇章級教材、51 題、29 詞彙通過。
- `npm test`：31 test files 通過；新增十個新 ID／public slug 對應、舊新 ID 路徑碰撞、前綴舊網址排除、正文／qa 雜湊及原稿保存。
- `npm run check`：0 errors、0 warnings。
- `node scripts/check-publication-boundary.mjs`：獨立概念、draft/future 排除與乾淨正式重建通過，508 個文字輸出排除 fixture。
- `npm run validate:release`：靜態連結、canonical／雙語配對、CSP、資產與最新 M03 章節驗證通過。
- `python3 scripts/verify-m04-retirement.py`：103 份原檔恢復、845 個輸出排除 76 個 legacy／舊前綴 URL／正文／問題標記；目前為 1 篇公開、9 項待發布。其他概念及 MATLAB 與本次最新基準逐位元組相同。
- `npx playwright test --config playwright.ceh26-m04-c01.config.ts`：12 tests 通過。中英完整正文、四尺寸、200% 文字、鍵盤捲動／焦點、淺色程式碼、無 JS、答案收合、M03-08 導覽、搜尋、新 canonical／hreflang、page JSON、sitemap 與原 ceh26 URL 真實 404。

證據分別放在忽略的 `.local/m04-public-slugs/local/`、`live/`。沒有操作真實服務或個人學習紀錄。適用 WRITE-01–07、HTML-01–04、A11Y-01–03；沒有新增 FIG 或 INT。實體手機與完整螢幕閱讀器認證不包含在本次驗收。

## 發布與恢復

經 PR／CI／正常 merge／Pages 發布，沒有 PR Approve、auto-merge、權限或 branch protection 改動。正式回讀需確認上述新頁為 200、舊前綴為 404，並比對部署 artifact 與公開 client／JSON；不重試先前遭拒的 urllib 補充 HTML 讀取。若撤回這次路徑修正，以新的 revert PR 保留歷史；不恢復 legacy 教材、不 force-push。
