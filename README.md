# CS Kairos Learn

研究與技術教育平台的課程入口：<https://learn.cs-kairos.com/>。個人研究、專案與文章由[主站](https://cs-kairos.com/)承接。

新課程採 **Svelte 5＋SvelteKit 2＋TypeScript＋adapter-static**，輸出純靜態 `build/`。既有 MATLAB HTML、程式、圖庫與 ZIP 保留在 `site/`，直接複製到相同公開路徑。

## 課程與閱讀工具

- [CEH v13 核心概念](https://learn.cs-kairos.com/courses/ceh/v13/)：M01 兩篇；M02–M20 各一篇。每篇提供完整繁體中文、英文、來源、例子、安全練習與原創測驗。課程模組與官方考試藍圖分開標示。
- [MATLAB 三案](https://learn.cs-kairos.com/courses/matlab-practice/index.html)：原有繁體中文教材、24 步、43 段逐段教學與 523 個非空程式行解說，下載連結及六份 ZIP 校驗碼保留。
- [AI／ML 基礎](https://learn.cs-kairos.com/courses/ai-ml/)：資料切分、評估與洩漏的雙語入門單元。
- [網路基礎](https://learn.cs-kairos.com/courses/networking/)：DNS、TCP、TLS、HTTP 的雙語入門單元。
- [詞彙表](https://learn.cs-kairos.com/glossary/)、[全文搜尋](https://learn.cs-kairos.com/search/)、[錯題複習](https://learn.cs-kairos.com/review/)共用內容來源。答案與信心值只儲存在本機瀏覽器，沒有帳號或答案上傳。

首版共 23 個雙語主題、54 題與 30 個詞彙。這些教材支持核心概念學習；官方完整考試範圍、個人正式作答與 CEHP 實作驗收各有獨立證據。

## 開發與檢查

使用 Node.js 24；安裝以 lockfile 為準。

```sh
pnpm install --frozen-lockfile
pnpm run dev --host 127.0.0.1
pnpm run validate:content
pnpm test
pnpm run check
node scripts/check-publication-boundary.mjs
python3 scripts/validate_site.py
python3 scripts/validate_release.py
pnpm audit --audit-level=high
```

`check-publication-boundary.mjs` 會建置並檢查草稿／未來日期測試資料沒有進入任何公開文字資產，最後移除測試來源。一般建置使用 `pnpm run build`。檢查完成的靜態頁：

```sh
python3 -m http.server 4179 --bind 127.0.0.1 --directory build
```

公開部署以自訂網域根目錄為基準。舊 `site/index.html` 存於 [歷史首頁](docs/archive/learning-home-2026-10-22.html)，根目錄改由 Svelte 產生；MATLAB 的 `/index.html` 返回連結繼續有效。重新建置後應重新載入預覽，避免舊頁面引用已換版的雜湊資產。

## 編輯與發布

[架構與所有權](docs/platform-architecture.md)說明 FIRST PRINCIPLE 分工；[內容指南](docs/content-authoring.md)定義雙語教材與題庫規範；[發布與回復](docs/publishing-security.md)保存 PR、預覽、部署及 rollback 步驟。[本輪驗證回執](docs/releases/2026-10-23-phase-0-3.md)區分本機驗證、正式發布與真人使用驗收。

GitHub Actions 在 PR 驗證內容、程式、資產與實際靜態產物，提供可下載的預覽 artifact；main 通過相同檢查後把 `build/` 發布到 GitHub Pages。Cloudflare 保留既有 proxied `learn` CNAME；本 repo 不管理 API／console 的存取控制。

MATLAB 下載來源變更時，執行 `python3 scripts/package_release.py` 重建 ZIP 與 SHA-256。PDF 範本由 `python3 scripts/build_report_pdfs.py` 產生（需要 ReportLab），再重建下載包。Python 合成參考圖庫不視為 MATLAB 執行結果。

[CEH 編輯決策沿革](docs/ceh-bilingual-publishing-plan.zh-tw.md) · [11/10 三輪複習紀錄與容量橋接](docs/ceh-bilingual-publishing-plan.zh-tw.md#spiral-review-2026-11-10) · [CEH 學習橋接](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/docs/public-teaching-bridge-2026-10-23.md) · [主站平台規範](https://github.com/JasonLn0711/JasonLn0711.github.io/blob/main/docs/cs-kairos-platform-architecture-v1.zh-tw.md)

2026-10-23 新增[一次學一個概念：M04 目錄](https://learn.cs-kairos.com/courses/ceh/v13/m04/#one-concept)與 [M04-01 列舉原理](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-01/)。12 核心之後接 M05，另外 7 項選讀；各章獨立概念路線逐步整理。原有雙語入門教材持續提供。

## 觀點 Perspectives

Learn 的觀點專欄承接有教學價值的事件解讀與實作反思；個人研究與專案論述仍由主站承接。每篇完整雙語。參見 [編輯指南](docs/perspectives/authoring.md) 、[撰稿模板](docs/perspectives/writing-template.md) 與 [首兩篇企劃](docs/perspectives/editorial-briefs.md)。使用 `pnpm run preview:perspectives` 檢查隔離的合成文章；目前沒有正式發布文章。

## 全站共同規範

所有教學頁面遵循[文章與響應式閱讀規範](docs/article-standards.md)。既有歷史規則有差異時，以共同規範的閱讀品質與收合要求為準；資料契約及原始教材保留要求持續適用。

[本次成果、驗證與跨 repo 關聯](docs/releases/2026-11-01-perspectives-standards.md)記錄實際結果及後續驗收。

M01–M02 的 16 篇教材採用雙語閱讀導引與可換行圖解；[資料契約](docs/content-authoring.md#m01m02-閱讀導引與可換行圖解)及[逐頁驗收紀錄](docs/releases/2026-11-01-m01-m02-readability.md)說明本機成果與發布狀態。

## AI 協作軟體工程（AASE v1）

[編輯入口](docs/aase/README.md)連結九模組／49 概念的完整課程設計、四篇先導教材與 10 小時工作坊。課程目錄使用獨立 ID 與發布閘門；繁體中文先行，未完成全文維持準備中。工作坊本機執行，不由 GitHub Pages 提供 Python 後端。

修改 `resources/aase/` 後執行 `pnpm run package:aase`；依工作坊 README 安裝 `.local/aase-venv`，執行 `pnpm run test:browser:aase`。一般發布仍須完成既有內容、型別、單元、發布邊界及 release 檢查。[內容契約](docs/content-authoring.md)提供維護細節。

## Package manager

Use the version of pnpm pinned in `package.json`. Install with
`pnpm install --frozen-lockfile`; use `pnpm run <script>` for project commands
and `pnpm add` / `pnpm add -D` for dependencies. Commit `pnpm-lock.yaml` with
dependency changes. pnpm shares package content through its local store.

[11/8 M05 發布與 pnpm 整合回執](docs/releases/2026-11-08-first-principle-closeout.md)串接兩篇教材、來源對照、驗證及 Planning 狀態。

AASE 工作站 Python 快取共用與本機鎖檔操作見 [content authoring](docs/content-authoring.md#aase-uv-cache)；此維護保留教材下載包與學員操作契約。

## 共用 Rust 工具

[共用工具、固定版本與驗收分工](docs/shared-rust-tools.md)連接 `kairos-rust-tools`、本庫設定及發布流程；現有正式發布閘門持續保留。

[11/9 工作目錄整合與 Planning 回執](docs/releases/2026-11-09-repository-reconciliation.md)記錄歷史保留、重疊修改處理及本輪驗證。

[M05-05 優先順序完整教材](docs/releases/2026-11-09-m05-05.md)串接九節雙語供稿、四圖／八份SVG、逐段對照及本輪驗證與發布。

[AASE M03-05 完整教材與五圖](docs/releases/2026-11-09-aase-m03-05-replacement.md)串接原稿、逐節對照、雙語正文、十份SVG、互動及正式站驗證；[本機與發布分支對帳](docs/releases/2026-11-09-repository-reconciliation.md#lesson-publication-reconciliation-2026-11-09)說明歷史保留與 Planning 入口。
