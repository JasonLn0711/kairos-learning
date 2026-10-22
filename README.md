# CS Kairos Learn

研究與技術教育平台的課程入口：<https://learn.cs-kairos.com/>。個人研究、專案與文章由[主站](https://cs-kairos.com/)承接。

新課程採 **Svelte 5＋SvelteKit 2＋TypeScript＋adapter-static**，輸出純靜態 `build/`。既有 MATLAB HTML、程式、圖庫與 ZIP 保留在 `site/`，直接複製到相同公開路徑。

## 課程與閱讀工具

- [CEH v13 核心概念](https://learn.cs-kairos.com/courses/ceh/v13/)：M01 兩篇；M02–M20 各一篇。每篇提供完整繁體中文、英文、來源、例子、安全練習與原創問答。課程模組與官方考試藍圖分開標示。
- [MATLAB 三案](https://learn.cs-kairos.com/courses/matlab-practice/index.html)：原有繁體中文教材、24 步、43 段逐段教學與 523 個非空程式行解說，下載連結及六份 ZIP 校驗碼保留。
- [AI／ML 基礎](https://learn.cs-kairos.com/courses/ai-ml/)：資料切分、評估與洩漏的雙語入門單元。
- [網路基礎](https://learn.cs-kairos.com/courses/networking/)：DNS、TCP、TLS、HTTP 的雙語入門單元。
- [詞彙表](https://learn.cs-kairos.com/glossary/)、[全文搜尋](https://learn.cs-kairos.com/search/)、[錯題複習](https://learn.cs-kairos.com/review/)共用內容來源。答案與信心值只儲存在本機瀏覽器，沒有帳號或答案上傳。

首版共 23 個雙語主題、54 題與 30 個詞彙。這些教材支持核心概念學習；官方完整考試範圍、個人正式作答與 CEHP 實作驗收各有獨立證據。

## 開發與檢查

使用 Node.js 24；安裝以 lockfile 為準。

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run validate:content
npm test
npm run check
node scripts/check-publication-boundary.mjs
python3 scripts/validate_site.py
python3 scripts/validate_release.py
npm audit --audit-level=high
```

`check-publication-boundary.mjs` 會建置並檢查草稿／未來日期測試資料沒有進入任何公開文字資產，最後移除測試來源。一般建置使用 `npm run build`。檢查完成的靜態頁：

```sh
python3 -m http.server 4179 --bind 127.0.0.1 --directory build
```

公開部署以自訂網域根目錄為基準。舊 `site/index.html` 存於 [歷史首頁](docs/archive/learning-home-2026-10-22.html)，根目錄改由 Svelte 產生；MATLAB 的 `/index.html` 返回連結繼續有效。重新建置後應重新載入預覽，避免舊頁面引用已換版的雜湊資產。

## 編輯與發布

[架構與所有權](docs/platform-architecture.md)說明 FIRST PRINCIPLE 分工；[內容指南](docs/content-authoring.md)定義雙語教材與題庫規範；[發布與回復](docs/publishing-security.md)保存 PR、預覽、部署及 rollback 步驟。[本輪驗證回執](docs/releases/2026-10-23-phase-0-3.md)區分本機驗證、正式發布與真人使用驗收。

GitHub Actions 在 PR 驗證內容、程式、資產與實際靜態產物，提供可下載的預覽 artifact；main 通過相同檢查後把 `build/` 發布到 GitHub Pages。Cloudflare 保留既有 proxied `learn` CNAME；本 repo 不管理 API／console 的存取控制。

MATLAB 下載來源變更時，執行 `python3 scripts/package_release.py` 重建 ZIP 與 SHA-256。PDF 範本由 `python3 scripts/build_report_pdfs.py` 產生（需要 ReportLab），再重建下載包。Python 合成參考圖庫不視為 MATLAB 執行結果。

[CEH 編輯決策沿革](docs/ceh-bilingual-publishing-plan.zh-tw.md) · [CEH 學習橋接](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/docs/public-teaching-bridge-2026-10-23.md) · [主站平台規範](https://github.com/JasonLn0711/JasonLn0711.github.io/blob/main/docs/cs-kairos-platform-architecture-v1.zh-tw.md)
