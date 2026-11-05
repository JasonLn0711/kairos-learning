# M04-05 完整 NetBIOS／RPC 教學替換 v1.1.0

本次依供稿替換完整七部分與三題理解測驗，兩語各 38 個章／小節、9 表、37 個程式／文字區塊，新增三組共六份 SVG。公開課次為 M04-05，網址與 stable ID 保留；版本 1.1.0、revision 3，原發布與版本修訂日均 2026-11-05。

[來源及採納界線](../sources/ceh26-m04-c05/replacement-2026-11-05/README.md)保留全文、三張 PNG 與前版。三圖分別在第 1、4、5 章；圖解以 HTML 換行、窄欄直排，SVG 為可下載橫排。沒有對實際主機執行列舉或 RPC 呼叫；合成資料、編輯答案與學員紀錄分開，qa=[]。M04-04 的同步工作屬另一項修訂。

規則：WRITE-01–06、WRITE-08；HTML-01–04；FIG-01–06；A11Y-01–03。INT-01 不適用，本次無模擬器或遠端操作互動。

## 驗證

- `python3 scripts/verify-ceh26-m04-c05.py`：完整中文對照明列調整、來源雜湊、38 個雙語錨點、9 表、37 區塊及圖檔產物通過。
- `npm run validate:content`、`npm test`：通過，189 項測試；`npm run check`：0 errors／0 warnings。
- `node scripts/check-publication-boundary.mjs`：第二概念、draft／future、英文課程及翻譯閘門通過，最後清理 fixture 並重建正式輸出。
- `npm run validate:release`、`git diff --check`：通過。`npm audit --audit-level=high`：無 high／critical，保留既有 5 low，不進行本次範圍外的破壞性依賴升級。
- `npx playwright test --config playwright.ceh26-m04-c05.config.ts`：5 項通過；中英各 320／390／768／1280、200% 根字級、無 JavaScript、正文全文順序、canonical、資訊列、搜尋、前後篇及 pending／舊網址 404。正文／圖解直接可見，唯一參考答案預設收合；Enter／Space 開合與焦點、Tab／Shift+Tab、Enter 下載、寬表格 ArrowRight 局部捲動通過。
- 三角色／兩體系桌面並排、五階段箭頭向右，手機全部直排且箭頭向下；逐圖截圖目視確認分組、例外與第 2 關停止資訊。六份 SVG 文字均在圖檔邊界內，HTTP 內容及鍵盤下載與本機檔案逐位元組一致。

| SVG | bytes |
| --- | ---: |
| roles zh / en | 3760 / 4460 |
| families zh / en | 3372 / 3703 |
| evidence zh / en | 5862 / 7604 |

全部小於 100000 bytes。證據在獨立工作目錄 `.local/c05/`（content／unit／check／boundary／release／browser／audit logs、results.json、雙語逐圖與全頁截圖），避免與同步 M04-04 建置共用產物。瀏覽器為 Linux ARM64 Playwright Chromium 模擬；實體手機、完整螢幕閱讀器及獨立學員理解尚待人工檢查，未宣稱完成。

## 發布

發布基線：Pages run [42004054843](https://github.com/JasonLn0711/kairos-learning/actions/runs/42004054843)，commit b73cdec，success。

來源保存提交 bd03f73；教材提交 [3c88d24](https://github.com/JasonLn0711/kairos-learning/commit/3c88d24724772406224725bd31c5747c1a7efceb)。推送 `origin HEAD:main` 後 fetch，分歧 0／0；[Pages run 42005010527](https://github.com/JasonLn0711/kairos-learning/actions/runs/42005010527) 為 success，部署 headSha 與教材提交完全一致。

正式頁面：[中文](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-05/)／[English](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-05/)。`CEH_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.ceh26-m04-c05.config.ts`：5 項全部通過，23.9 秒。兩語 h1 均以 M04-05 開頭；主文全文、四尺寸、200% 文字、無 JavaScript、鍵盤、搜尋、導覽、404 與六份 SVG 逐位元組／文字邊界再次驗證通過。200%／320px 的 document.scrollWidth=320，沒有水平頁面溢出。

正式回讀輸出為 `.local/c05/production-browser.log` 與 results.json；截圖已更新為正式站結果。來源／圖檔原始位元組另與本次四個附件核對一致。最後整理僅移除元件空白行尾空格，不改本文、圖解資料或執行行為；整個變更範圍 `git diff b73cdec --check` 通過。

主工作目錄另有 M04-04、article-standards 與 Python 快取等同步／既有修改，未納入本次提交；本次以獨立 worktree 發布，保留兩邊 Git 歷史。

<a id="planning-closeout-2026-11-05"></a>
## FIRST PRINCIPLE 與 Planning 收束

**confirmed／published：** 2026-11-05 以最新遠端 main `7f4293e` 為基線核對，原來源 bd03f73、教材 3c88d24、回執 7e4c913 均為其祖先；[基線 Pages 42013095782](https://github.com/JasonLn0711/kairos-learning/actions/runs/42013095782) success。本輪重新執行 `python3 scripts/verify-ceh26-m04-c05.py` 通過，並從 HTTPS 正式站重跑本課瀏覽器套件，五項全數通過，24.0 秒。完整來源、主標題、四尺寸、200% 文字、無 JavaScript、鍵盤、搜尋、導覽及六份 SVG 位元組／文字邊界均再次核對。原 189 項單元與初次部署為前文歷史證據，本輪連接文件未重跑整站建置或宣稱新的整站驗收。

稀缺資源是閱讀注意力、審稿時間及可信證據。Jason 提供完整供稿、三張參考圖及 M04-05 標題要求；Codex 保存來源、完成雙語／圖解與發布驗證。Kairos Learning 保管[來源與採納界線](../sources/ceh26-m04-c05/replacement-2026-11-05/README.md)、教材、圖解模型及工程證據；Planning 保管定位、狀態、容量與下一關。本輪文件適用維護接手與週回顧，不新增學習交付事件、作答或個人工作時數。

- [11/5 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/days/2026-11-05.md#kairos-m0405-closeout-2026-11-05)：本人貢獻、已發布結果、證據與下一關；接續 13:00 原交付紀錄。
- [網站專案定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-m0405-closeout-2026-11-05)：維護 owner、版本、來源與發布狀態。
- [CEH 學習界線](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-07-ceh-cehp-certification-training.md#kairos-m0405-closeout-2026-11-05)：網站修訂與私人作答／理解分開，原 C06 續讀路線保持。
- [W45 回顧入口](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/weekly-plan.md#kairos-m0405-closeout-2026-11-05)：已完成維護成果，不新增週輸出、固定時段或容量承諾。

維護契約連到 [WRITE-08](../article-standards.md#課程文章標題write-08)、[內容契約](../content-authoring.md#m04-05-完整-netbiosrpc-教學-v110)及 [M04-04 整合回執](2026-11-05-ceh26-m04-c04-replacement.md#遠端整合後複驗)：兩課共用 SourceBody、鍵盤區與 SVG 審核邊界；正文、來源及驗證回執各有正本，後續共同元件修訂須核對兩篇。

**pending confirmation／下一關：** Jason 於下次正常閱讀回報三題答案或閱讀卡點，依既有私人 CEH 紀錄保存。實體手機、完整螢幕閱讀器與獨立理解保留各自關卡；共享每週 240 分鐘／課日 25 分鐘與 W45 Unknown 維持。本輪不啟動新測驗、實驗或排程。新測試輸出保存在 `.local/closeout/production-browser.log` 與 `.local/c05/`；Planning 不複製全文或工程 logs。
