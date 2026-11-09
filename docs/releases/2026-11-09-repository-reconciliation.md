# 2026-11-09｜工作目錄整合與 Planning 關聯

## 需求來源與 FIRST PRINCIPLE

Jason 本輪要求如下，原文保留：

> Using FIRST PRINCIPLE, and please take notes on my day note in the `planning-everything-track` repo, and update the relevant docs, files, and contents for it.
> Please update all the commits separately on git, and push this branch to the remote main branch of the github repo. (If there were conflict among commits, i would like to keep both local commits and remote commits.)
> And build strong connection with all other relevant files, docs, and contents.

稀缺資源是版本判讀注意力、維護時間與可信證據。Kairos Learning 擁有教材、來源、實作及驗證；Planning 擁有定位、狀態、容量與下一關。這次對象是落後工作目錄的整合與發布紀錄，延續 [11/8 同步](2026-11-08-planning-sync.md)，原有各篇教學來源及發布證據保持各自正本。

## confirmed｜版本與衝突處理

- 起始本機 `main` 為 `5ade081`，fetch 後遠端為 `db49bae`；分歧為本地 0／遠端 204。原本本地提交已在遠端歷史內。
- 先用具名 stash `recovery: pre-2026-11-09-publication-reconciliation` 保存 tracked／untracked 工作，再 fast-forward 承接全部遠端歷史。stash 保留作為恢復點；Python 快取只留本機。
- 逐檔位元組核對發現 M04-03／04／05 教材、來源、圖檔及三份回執已在遠端；不建立重複內容提交。[C03](2026-11-05-ceh26-m04-c03-replacement.md)、[C04](2026-11-05-ceh26-m04-c04-replacement.md)、[C05](2026-11-05-ceh26-m04-c05-full-replacement.md)保留歷史發布證據。
- 回套 stash 時有 13 個 tracked 檔案衝突；原 untracked 同名檔因遠端已追蹤而未覆蓋。逐項核對後，保留遠端已擴充的教材元件、M05 驗證、瀏覽器斷言、WRITE-09–11、AASE 整合狀態與 CI 共用 HTML 測試。兩端的來源與提交歷史均保留。
- pnpm 遷移已在遠端採納；沿用 `package.json` 與 CI 的 `10.34.9`，以及遠端 lockfile。本機舊 `12.15.0` pin 留在恢復 snapshot，不覆寫已測版本；本輪沒有升級依賴。
- 本機 preview fixture 的 `related=[]` 原為退休 ID 的 workaround；遠端 `344f98a` 已改為有效 `ceh-m01-cia`。回套 workaround 會移除既有課程往返連結，瀏覽器測試揭露後採遠端修正，完整保留連結與測試。本輪最終只調整維護命令與紀錄；歷史驗收的實際 `npm audit` 記錄維持原文。

## 驗證與範圍

本輪 logs 位於忽略的 `.local/reconciliation-2026-11-09/`。WRITE-01／03／04／11 核對來源、日期、主張及證據界線。教材正文、SVG 與其公開版本維持遠端內容；既有 HTML／FIG 與真人驗收狀態依各篇回執承接。

## 關聯與下一關

- [README](../../README.md) → 本回執 → [內容維護](../content-authoring.md)／[觀點維護](../perspectives/authoring.md)：從維護入口找到本輪整合與重跑方法。
- [11/9 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/days/2026-11-09.md#kairos-reconciliation-2026-11-09) ↔ [網站定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-reconciliation-2026-11-09)：Planning 只承接成果、證據、容量及下一關。

容量維持 Unknown，個人工時未量測。本次整合不新增學習配額、排程或本人學習完成；私人作答與理解由學習 owner 保存。下一關是維護者依本回執接手後續修訂；實體手機、完整輔助科技與獨立學習者接受依原關卡待驗。

## validated｜本輪實測

- `pnpm run validate:content` 通過；`pnpm test` 271／271；`pnpm run check` 0 errors／0 warnings；共用 static HTML unittest 6／6。
- `node scripts/check-publication-boundary.mjs` 與 `pnpm run validate:release` 通過；draft／future 及英文課程閘門依實際建置核對，最後還原乾淨正式產物。`pnpm audit --audit-level=high` 通過，4 low。
- 初次帶入舊 preview workaround 的瀏覽器結果為 14 通過／2 失敗，失敗位於中英課程往返連結；改回遠端已修正 fixture，重新建立隔離預覽後 16／16 通過。失敗與恢復 logs 分開保留，未降低斷言。
- 文件連結核對時找到兩筆已搬移的 Q&A 圖解路徑，改指向既有 `archive/ceh/m04-legacy-2026-11-04/`；歷史教材與元件保留原件。
- Planning policy validator 通過（44 existing warnings／0 new），knowledge 186／186 通過，11/9 agenda 正常顯示 Unknown 及舊 metrics。新日誌與專案明確錨點核對通過。

Git publication 與文件範圍的 Pages 狀態於推送後接續記錄。這些結果證明整合、維護命令與既有測試；既有正式站與真人接受仍依各篇原證據界線。

## published｜Git 回執

- Kairos `c3c06b3`（維護命令及封存連結）、`1f6bca7`（本回執及入口）已分別提交並推送 `origin HEAD:main`；fetch 後 divergence `0 0`。
- Planning `8f4f7db7`（11/9 日誌及網站定位）已分開推送其 `origin HEAD:main`；fetch 後 divergence `0 0`。兩庫均無待提交修改；具名 Kairos recovery stash 保留。
- [Pages run 42564114404](https://github.com/JasonLn0711/kairos-learning/actions/runs/42564114404)對應 `1f6bca7c6c49cd2c9264222cbeb5a0345de0f018`，本回執補件時流程仍在執行，未標記網站部署完成。
- 額外以 Python urllib 嘗試讀回正式 M04-03 中文頁，請求收到 `HTTP Error 403: Forbidden`，停止該次回讀；未取得本輪正式頁／圖檔接受證據。此限制與本機16項瀏覽器通過分開記錄，既有各篇歷史回執保持原範圍。


<a id="lesson-publication-reconciliation-2026-11-09"></a>
## 11/9 教材發布後的主工作目錄對帳

Jason 本輪要求依 FIRST PRINCIPLE 記入日誌、更新相關文件及強連結，分項提交並推送遠端 main，保留兩端歷史；接續明確要求：「Please push all the changes to the remote github repo.」稀缺資源是版本判讀注意力與可信發布證據。Kairos 持來源、正文、程式及驗證；Planning 持定位、狀態、容量與下一關。

confirmed：主工作目錄起始為 `d95a770`，fetch 後遠端 `124049a`，分歧 `0 9`。具名 stash `2026-11-09 requested full publication reconciliation` 保存所有已追蹤與未追蹤修改，再 fast-forward 接上九筆遠端提交。回套時唯一已追蹤衝突位於內容指南：保留 M05-05 與 AASE M03-05 兩節。原未追蹤檔案已由遠端發布；逐位元組比較找到五份差異，均為遠端後續修正：M05-05 來源索引補全對照、鍵盤檢查縮至320px、產生器與兩語機率SVG文字寬度修正。採用已發布修正，原本機版本仍保存在 stash，沒有覆寫歷史或重複提交教材。

- [M05-05 回執](2026-11-09-m05-05.md)承接完整雙語正文、四圖／八SVG、Git、Pages與正式站證據；[來源與逐段對照](../sources/m05-05/README.md)保留原件。
- [AASE M03-05 回執](2026-11-09-aase-m03-05-replacement.md)承接完整雙語正文、五圖／十SVG、互動及下載；[來源索引](../sources/aase/m03-05/README.md)連回原稿與前版。
- [11/9 AASE 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/days/2026-11-09.md#kairos-aase-m03-05-2026-11-09) ↔ [網站定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-aase-m03-05-2026-11-09)：補齊既有發布的控制面入口，容量維持 Unknown，沒有新增本人學習完成或固定時段。

本輪沒有修改教材或圖檔；既有正式站證據沿兩篇回執的部署 SHA 與實測範圍。下一關是 Jason 正常閱讀時回報卡點；實體手機、完整螢幕閱讀器及獨立讀者接受度仍待驗，由原 owner 接續。


validated（本輪）：三項產生器 `--check`、`pnpm run validate:content`、276項單元與`pnpm run check`（0 errors／0 warnings）通過。只補文件連結，未重跑真人或全站閱讀驗收；正式站全文與資產實測沿上列兩篇原回執。Planning policy通過（44既有警告／0新）、knowledge 186／186通過。
