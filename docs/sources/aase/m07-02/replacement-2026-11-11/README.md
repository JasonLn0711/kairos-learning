# M07-02 完整供稿抽換

本目錄是本次素材與成稿正本。資源為 M07-02 編輯、圖解與驗收時間；詳細資料由 kairos-learning 保管。Planning 若需承接，僅保留定位、狀態與下一關，不複製附件。

- `pasted-text-1.txt`、`image-1.png`、`image-2.png`：逐位元保存使用者提供素材。
- `prior-lesson.json`：抽換前 v1.0.2，包含原問答與既有錨點。
- `SHA256SUMS`：以上四件原件的 SHA-256。
- `teaching.zh.md`、`teaching.en.md`：完整十節成稿。英文 `TASK_TEMPLATE` 由產生器展開為原始中文任務範本，英文頁逐條解讀其完整指令。
- [逐節對照與修正](source-map.md)、[發布與實測回執](../../../../releases/2026-11-11-aase-m07-02-replacement.md)。

`python3 scripts/aase_m0702_content.py` 產生正式 JSON；`python3 scripts/aase_m0702_svg.py` 從正式圖解資料產生雙語 SVG。兩者 `--check` 核對重建一致。原始 PNG 留在來源層，公開頁使用可選取的 HTML 及受審核匯出。
