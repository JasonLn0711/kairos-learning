# 共用 Rust 工具連動

共用實作由私人 [kairos-rust-tools](https://github.com/JasonLn0711/kairos-rust-tools) 維護；[使用端總表](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/integrations.md)回連本庫。工具來源與完整 commit 記於 [kairos-tools-source.json](../kairos-tools-source.json)，本庫選用的規則記於 [workspace-verify.json](../workspace-verify.json)。

依共用庫的[跨電腦安裝文件](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/installation.md)取得固定版本後，在已有 `build/` 的本庫執行 `workspace-verify run workspace-verify.json`。不要求共用庫放在 sibling 位置；安裝後從 PATH 呼叫。只 pull 本庫不會自動安裝該工具。

本設定包含 package JSON 語法、site 到 build 的位元組保存（排除根 index.html）、公開產物衛生及 HTML 本機連結/錨點。它是完整發布檢查的共用子集；原有 `validate:content`、`validate:release`、TypeScript／單元測試、發布邊界、語言/CSP 及瀏覽器檢查持續由本庫負責，參見[發布與回復](publishing-security.md)。目前未修改正式站部署流程。

效能判斷依共用庫的[量測方法與結果](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/performance.md)，不能把 JSON 單項加速外推成完整網站發布加速。升級時同時審閱來源 SHA、設定範圍、正反例與本庫發布閘門，再回寫使用端總表。新增本機設定不代表該次變更已正式部署。

## 維護與回復連動

[README](../README.md) → 本文件 → [固定來源](../kairos-tools-source.json)＋[檢查設定](../workspace-verify.json) → [共用使用端契約](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/consumer-contract.md)。本機來源 checkout 可放任意位置，私人來源需要讀取權限。

要重現固定版本，將指定 SHA 安裝到獨立 prefix，直接呼叫其 bin/workspace-verify；全域命令可能來自另一個 revision，--version 也不能證明 commit 相同。保留工具 checkout 的 git rev-parse HEAD 與安裝紀錄。回復時一起選回相容的來源 SHA 與 profile，重新安裝並執行上述原有專案閘門；升級後同步更新本文件與共用庫總表。
