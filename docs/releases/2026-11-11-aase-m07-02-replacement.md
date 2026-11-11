# M07-02 工作契約完整抽換｜2026-11-11

內容正本為 kairos-learning；本次範圍為 AASE-M07-C02 v1.1.0／revision 4。原發布日 2026-11-05 保留。使用者本專案教材修訂授權涵蓋驗證後提交、推送與正式部署；以隔離工作樹保留其他未提交修改。詳細附件、對照與證據留在本 repo，Planning 僅需定位、狀態、驗證及下一關。

[來源索引](../sources/aase/m07-02/replacement-2026-11-11/README.md) · [逐節／分支／圖意對照](../sources/aase/m07-02/replacement-2026-11-11/source-map.md)

完整中英正文承接十節及安全小節、需求歧義／實作錯誤兩分支、七張表與原任務範本，另加導讀，六個原錨點保留。醫院情境與四個原問題直接進入正文／checks；新 Q04–Q07 原生收合參考解析，qa=[]。既有練習保留，沒有建立評改或學習紀錄服務。

兩張參考圖採五步流程與兩種並列情境；四份下載 SVG 復用固定文字序列化器，同源於正式 JSON。無新增依賴。正文、搜尋、SVG 的資料一致性和來源完整性是各別檢查項目。

適用規則：WRITE-01–11、HTML-01–04、FIG-01／03–06、A11Y-01–03。FIG-02 的固定空間圖縮放及 INT-01 參數互動不適用；頁面採原生文字重排，沒有加入模擬控制。依 anti-ai-rhetoric-lint 做保守修訂，原始供稿完整另存。

## 實測

- `sha256sum -c SHA256SUMS`：四件原件及前版通過。
- 兩個產生器 `--check`：正文與四 SVG 可重建一致。
- `pnpm run validate:content`：通過。
- `pnpm test`：320／320 通過（包含本次三個單元檢查）。兩個歷史遷移測試改讀保存前版，新正文另由專屬測試核對。
- `pnpm run check`：0 errors、0 warnings。
- `node scripts/check-publication-boundary.mjs`：通過，含第二概念、draft／future 排除與英文課程閘門，最後重建乾淨 production。
- `pnpm run validate:release`：通過。
- `pnpm exec playwright test --config playwright.aase-m0702.config.ts`：2／2 通過；逐段／表／code／圖／答案全文、兩語四寬度各 100%／200%、無 JS、鍵盤焦點／答案／局部捲動、搜尋同源、四 SVG 字框／重疊／下載位元組。桌面與手機截圖已人工檢視。
- `pnpm audit --audit-level=high`：退出 0，4 low。
- `git diff --check`：通過。部署與正式站回讀接續記錄。

## 整合記錄

隔離分支從原工作樹 HEAD 建立後，遠端已有 149 個同期提交；已快轉至 `60b3488` 並保留遠端全文。第一次發布閘門尚在執行時進行 stash／整合，造成它產生的夾具與 renderer 衝突；該次結果不採為通過。確認程序結束後，將暫時夾具還原為遠端版本，再重套本次 M07-02 差異並完整重跑。原工作樹未受影響。下一關為正式發布與兩語頁面／四圖回讀，未取得的真人學習回饋保留待驗。
