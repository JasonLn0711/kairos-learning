# Static release, security and recovery

Follow AGENTS.md and the current task for Git and publication authorization. Review, the applicable project checks and a static preview establish what will be published; use the required PR workflow when it applies. This checklist does not add publication authority or a new permission gate. Existing Git and deployment history remains available for recovery.

## Release checks

Use Node.js 24, the pnpm version pinned in `package.json`, and Python 3.12 or newer available as `python3`; verify `python3 --version` before running the Python-backed checks. Install with `pnpm install --frozen-lockfile`. Run the commands in the [README](../README.md). Both PR and production workflows validate content, tests, types, audit at high severity, the actual unpublished-content boundary, legacy MATLAB and the static output. Download checks run against the existing `SHA256SUMS` and cover six ZIP files. The PR workflow uploads the complete `build/` artifact for a local static preview; production uploads it to Pages only after checks pass.

`validate_release.py` checks local destinations and anchors, duplicate IDs, language pairs, canonical, hashed CSP, static-asset byte equality and selected credential patterns. This targeted scan is useful evidence, not a claim of exhaustive secret detection. No `.env`, source map or `.git` files belong in the deployment.

SvelteKit adds a hash-based CSP meta tag to generated pages. GitHub Pages does not honor Cloudflare Workers `_headers`; do not claim response headers from a file it ignores. Legacy MATLAB remains unchanged and does not acquire the new page CSP. Cloudflare's existing TLS/proxy configuration remains in place. There are no API bindings, stored server credentials, account sessions or third-party analytics in the new application. Record dependency audit findings, tool output and severity in each release receipt rather than treating an old count as current. The production workflow enforces the high-severity audit gate; framework upgrades remain separate compatibility changes.

Before merge, record the previous successful Pages run and commit. Check both language versions, navigation, search, wrong-answer → correction → refreshed-empty review, keyboard controls, the smallest supported width, long code blocks, and MATLAB return links. Browser test answers are test evidence only. Lighthouse laboratory scores and scoped accessibility checks do not establish field Core Web Vitals or a complete WCAG certification.

After merge, confirm the Pages workflow succeeds, inspect the public root and deep lessons over HTTPS, verify a missing path returns 404, and compare published ZIP hashes. Record the deployed commit and URL in the [release receipt](releases/2026-10-23-phase-0-3.md).

## Recovery procedure

1. Identify the last successful production workflow and its exact source commit before changing anything.
2. If its artifact remains available, use the existing deployment workflow's rerun operation for that commit. Alternatively prepare a new revert commit or PR restoring the affected source while preserving both histories. Never reset/force-push main.
3. Verify the restored root, a deep lesson, MATLAB, downloads and 404. Then restore the intended known-good release using its workflow or a new forward fix.
4. Record actual rollback and restoration results. A documented command or an unexecuted workflow is not a completed drill.

The pre-migration baseline is `69c24f847425486529424dfa858e0b53dddd1c03`, which deployed the original `site/` tree. It remains in Git history and can reconstruct MATLAB. The current workflow deploys `build/`; restoring a historical source also requires its matching workflow/configuration. Learning DNS remains the existing proxied GitHub Pages CNAME, independent of the main-site Worker. Do not edit API, console or other applications to recover a course release.

An incident correction should state the affected content/version, evidence, correction and next validation. Capacity, learner scores and exam readiness remain in their subject/Planning records. This release adds no recurring daily-publication obligation.

## Perspectives extension

Bilingual educational perspectives use a separate catalog with the shared publication date gate. See [authoring guide](perspectives/authoring.md). Private case material stays in ignored local storage. Synthetic preview builds are isolated and excluded from deployment. Publication evidence is recorded in [the November 1 release record](releases/2026-11-01-perspectives-standards.md).

## Pages artifacts per attempt — 2026-11-05

The Pages artifact name is `github-pages-${{ github.run_attempt }}` in the upload, visibility check and deployment inputs. A failed-job rerun receives a new name, so artifacts from earlier attempts remain available without making the deployment ambiguous. The workflow adds only `actions: read` for metadata inspection; it does not delete artifacts or add repository write access.

After upload, `scripts/pages-artifact.mjs` checks the current workflow run using the Actions API, with at most six metadata checks separated by two seconds. It proceeds only for one matching, non-expired artifact with a valid ID and positive byte count. Duplicates, invalid metadata, API errors and a bounded visibility timeout stop before deployment. Logs show measured match counts and elapsed time, not estimated deployment progress. This waits for metadata visibility; it does not retry a deployment.

The trigger was run 41986934035: attempt 1 finalized artifact 13395939415, then deployment listed zero artifacts; a subsequent API read found it. Attempt 2 retained that artifact and uploaded 13397300134 under the same old name, so deployment rejected two matches. Both failed records remain; no artifacts were manually deleted. [Upload input](https://github.com/actions/upload-pages-artifact#inputs-), [deployment input](https://github.com/actions/deploy-pages#inputs), and [Actions API permissions](https://docs.github.com/en/rest/actions/artifacts#list-workflow-run-artifacts) support the new contract. The readiness helper's controlled tests do not establish a deployed result; actual workflow and page evidence belongs in the [AASE bilingual receipt](releases/2026-11-05-aase-bilingual-foundation.md).

<a id="article-production-verification"></a>
## 文章正式站內容驗收（PUB-01–02；2026-11-14）

依[文章規範](article-standards.md#contextual-supplement)與[工作表](article-writing-template.md#supplement-checklist)，驗收必須涵蓋實際公開內容。成功建置、artifact 已上傳、Pages 成功及使用者理解是不同層次，回執分別記錄；本節不增加使用者已授權範圍以外的發布或確認程序。

### 穩定來源、fixture 與瀏覽器

1. 會改寫來源的 draft／future fixture 在隔離工作樹或獨占寫入階段執行；驗證真實建置的路由、索引、搜尋及 payload 排除。記錄原檔，完成／失敗／取消後確認 fixture 已還原，重新建置正式輸出，再進行該輸出的正式驗收或提交。
2. 不在同一建置目錄改寫期間進行瀏覽器全文／資產比對。預覽與預期模型使用同一版本；重建後若預覽程序仍持有舊的雜湊 manifest，重啟該預覽或使用一致的靜態產物，核對載入錯誤，不能把舊 chunk 的404算成內容通過。
3. 截圖及下載前等待適合該頁的初始化完成；本專案靜態頁可使用 `networkidle` 並核對版號／正文／圖節點。其他持續連線頁改用明確就緒條件；不把任意延遲或無限制重試作為修復。SSR／hydration切換造成節點置換時改善時序，仍保留完整文字與載入錯誤的驗證。

### CDN 改寫與教學範例

- 正式站須在 JS 開／關核對教學信箱、路徑、程式碼與圖中文字；HTTPS200或正確版號不證明每段文字未被 CDN 改寫。
- 本專案已採用固定 `email_off` 註解保留合成教學信箱。需要時依文章身分與範例位置限制範圍，註解內容固定，教材文字持續由既有模型驗證及跳脫；不得由內容欄位拼出任意 HTML，也不為單篇教材停用全站防護。參考[實際元件](../src/lib/components/M20Review.svelte)與[正式站修正回執](releases/2026-11-14-ceh-day02-a.md)。
- 驗證原文字實際保留，且沒有 `__cf_email__`／`email-protection` 替代連結；這項檢查只用在原樣保留的合成教材範例，不要求公開真實私人信箱。修正公開版後依 WRITE-06 升版並重新回讀，保留先前驗收失敗的範圍與最後通過版本。

### 部署結果與重跑

記錄部署 source SHA、run、attempt、公開版號及URL。artifact metadata出現零筆時，依現有[每次嘗試的artifact契約](#pages-artifacts-per-attempt--2026-11-05)讀取實際狀態；一次metadata可見不保證下一個部署請求一定讀到。先確認作業終態、名稱與未過期成品，再按已獲授權範圍處理失敗重跑。每次attempt結果分開記錄，保留既有artifact與歷史，不以觸發重跑或提出取消請求宣稱成功／已取消。

部署成功後，以對應模型核對完整公開正文、表格、程式、選項、圖說及圖中文字；比對每張下載圖的HTTP結果／位元組，核對索引與搜尋、四尺寸、200%、無 JS與鍵盤。依變更影響選擇既有閘門與實測範圍，記錄未驗事項；數量、雜湊及測試名稱不能取代其實際覆蓋範圍。只確認程式範例或單篇文章，不延伸為所有服務／全站／學習完成。

規範、來源紀錄及回執的純文件更新，若未改變頁面、metadata、資產、程式、模型、產生器或發布閘門，可記錄為Git文件發布並按既有方式略過重複網站部署；不改教材版號／日期，不宣稱重新部署或重新驗收教材。公開內容或執行契約有變動時，仍須完成其適用閘門與部署驗收。

完整應用例見[四重點補充回執](releases/2026-11-14-ceh-day02-a-four-topics.md)；未執行的實體裝置、完整無障礙認證與讀者理解保持待驗。本規範更新本身不重做這些驗收。
