# 11/14 FIRST PRINCIPLE｜教材、規範與Planning連結

<a id="kairos-day02a-2026-11-14"></a>
## 貢獻、owner與證據

稀缺資源是來源忠實度、讀者注意力、證據可信度與維護時間。Jason提供稿件／圖示、指定一般教學用語、CSRF抽換與收合，並要求規範沉澱與repo安全確認；agent執行整理、實作、驗證與發布。受眾為CEH讀者與後續教材維護者。

- [Day02-A初版](2026-11-14-ceh-day02-a.md)與[四重點補充](2026-11-14-ceh-day02-a-four-topics.md)承接今日原始範圍；[SQL參數化補充](2026-11-14-ceh-day02-a-parameterized.md)承接SQL程式與驗證。
- [CSRF最新發布正本](2026-11-14-ceh-day02-a-csrf-part-replacement.md)：v1.4.0、十四節／二十六小節、七圖、原生收合；內容`31bfe594`、回執`b47932c9`，Pages [43600010274](https://github.com/JasonLn0711/kairos-learning/actions/runs/43600010274)success，423項測試與正式站14項檢核。完整來源、前版及映射由該回執連回。
- [規範採納](2026-11-14-article-supplement-standards.md)→[文章規範](../article-standards.md#contextual-supplement)→[內容指南](../content-authoring.md#contextual-supplement-workflow)→[工作表](../article-writing-template.md#supplement-checklist)，圖解與發布規範維持原owner。
- [pnpm文件／repo完整性](2026-11-14-pnpm-documentation-check.md)：指令對齊與Python前置條件，415項及盤點屬該次版本證據；未遷移依賴／CI，不與最新423項混算。

內容與詳細工程證據留kairos-learning；Planning持狀態／定位／容量／下一關，CEH owner持私人學習。本人投入與容量Unknown，不以代理執行時間計入學習分鐘，不代填閱讀、作答或實作完成。下一關由Jason在正常使用時提供具體疑問；新變更按範圍驗收，真機、WCAG及真人理解保持各自證據邊界。本輪只更新紀錄／路由，沒有修改教材或重新部署。

## 雙向路由

[日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/days/2026-11-14.md#kairos-day02a-2026-11-14) ↔ [週容量](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/weekly-plan.md#kairos-day02a-2026-11-14) ↔ [網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-day02a-2026-11-14) ↔ [CEH專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-07-ceh-cehp-certification-training.md#kairos-day02a-2026-11-14) ↔ [整合入口](https://github.com/JasonLn0711/planning-everything-track/blob/main/docs/14-local-integrations.md#kairos-day02a-2026-11-14) ↔ [執行正本](https://github.com/JasonLn0711/kairos-learning/blob/main/docs/releases/2026-11-14-first-principle-closeout.md#kairos-day02a-2026-11-14)

## Git與驗證

Planning開始時落後origin/main五提交，已以fast-forward承接至`62c7a9ac`，既有AURA與其他11/14紀錄完整保留。本輪依交付／容量及規範／整合拆分提交，發布前fetch核對，使用非強制`HEAD:main`；驗證與發布結果依本輪實測補記。

驗證：Planning的`agenda.py day 2026-11-14`與`agenda.py week 2026-W46`均退出0；日誌成果摘要已對齊實際交付，個人must-win仍pending。指標最新2026-08-20、已86天，僅報告stale而不估算新容量。owner四份Markdown檢查0 findings。Planning五份完整檔初篩有314項既有跨根目錄／缺目標警示，本次附加區塊0項；另按實際checkout核對41個GitHub檔案／明示錨點路由全部存在，不宣稱遠端HTTP或全庫舊連結皆通過。兩repo `git diff --check`通過，未改knowledge、模板、程式或教材，故不重跑網站／knowledge驗證。

## 已驗證Git發布

- Kairos `8eafa416`：本輪owner證據、規範／工具鏈回執與Planning雙向連結，已推送main。
- Planning `c5332709`：日誌、週容量及網站／CEH專案的教材交付與學習界線。
- Planning `533fdeee`：文章規範及pnpm完整性證據的owner路由。
- Planning `3edafa0a`：日誌成果摘要連回實際交付owner，保留原課務日曆入口。

Planning目前分支`feat/0903`依使用者要求以`git push origin HEAD:main`發布；`git ls-remote`確認main為`3edafa0a14a9183c1cc9e3a673df8d4fb509f980`，與本機HEAD相同，對origin/main為`0 0`且工作目錄乾淨。沒有強制推送、丟棄或改寫任何既有提交。此文件補記仍以獨立docs提交／`[skip ci]`發布；本輪未變動網站內容或重新部署。
