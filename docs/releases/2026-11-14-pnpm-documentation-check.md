# 三項pnpm文件修正與repo完整性確認

使用者要求確認修改後不會讓repo損壞。本次以`9ed7f6164b53b57079996763d1360fc17d0f3213`為基準，對齊既有工具鏈的文件指令，在獨立工作樹實際執行，保留主工作樹與原Git歷史。

## 修改與一致性

| 位置 | 修正 |
| --- | --- |
| docs/article-audit.md | `npm run audit:articles`→`pnpm run audit:articles` |
| docs/diagram-design-system.md | `npm run generate:perspective-diagrams`→`pnpm run generate:perspective-diagrams` |
| docs/publishing-security.md | `npm ci`→`pnpm install --frozen-lockfile`，補明Node24、manifest指定pnpm與Python3.12以上的前置條件 |
| README.md | 補上Python版本及`python3 --version`檢查方式 |

`package.json`原已固定`pnpm@10.34.9`，根目錄唯一套件lock為pnpm-lock.yaml；兩份CI均已使用相同pnpm版本、pnpm快取與凍結安裝。盤點與圖解生成也都是既有scripts，文件改用pnpm後沿用相同實作。未升級依賴、修改manifest／lockfile、改寫CI或教材程式。

核對package.json、pnpm-lock.yaml、兩份CI、圖解生成與兩個盤點腳本共7個來源檔，與基準位元組／SHA一致。執行前後的Git差異僅為上表四份文件，沒有新增／改寫已追蹤的教材、圖檔或程式。

## 實際環境與檢查

本機隔離工作樹：macOS arm64、Node v26.13.1（符合manifest最低版本）、pnpm10.34.9、Python3.15.2。CI建議Node24的設定保留；這是本機上述版本的實測，不宣稱每一種Node／Python或作業系統組合皆已驗證。

| 檢查 | 實際結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | 主工作樹及乾淨的隔離工作樹均退出0；隔離安裝重用63個套件、下載0，lockfile未變 |
| `pnpm run validate:content` | 通過；22份雙語lesson、52題、29術語 |
| `pnpm test`（正確Python環境） | 415／415通過，0失敗 |
| `pnpm run check` | 0 errors／0 warnings |
| `pnpm run generate:perspective-diagrams` | 退出0，沒有已追蹤或未追蹤的內容變動 |
| `pnpm run audit:articles` | 包含正式建置；410頁／1640次尺寸初篩，溢出、缺alt及h1數量異常均0；410頁無JS／鍵盤互動盤點完成，無正文缺失或首次焦點無外框記錄 |
| `pnpm run validate:release` | 通過；包含靜態連結／語言／CSP／資產位元組、原教材與SVG同步、Day02-A及SQLite片段等現有閘門 |
| 文件連結／錨點及`git diff --check` | 通過；5份文件的本機連結／支援錨點為0 findings |

盤點中189個首次原生收合操作另與建置HTML初始狀態核對，皆正確切換：五個MATLAB頁面預設展開，按Enter後關閉是正常切換，不應把欄位`firstDisclosureOpened=false`直接算成失敗。盤點是自動初篩，完整鍵盤旅程、逐圖目視及WCAG認證各有自己的驗收範圍；本次不重做整站人工認證。

## 發現並補明的Python前置條件

第一次隔離終端選到macOS的Python3.9.6，415項中405通過、10項因既有Python腳本語法／API不相容而失敗，當次流程即停止，沒有把失敗寫成通過。主工作目錄原本使用Python3.15.2；在隔離驗證程序中選用相同的既有Python後，415項全部通過，未修改教材程式來遷就舊直譯器。

既有`scripts/m04_09_content.py`使用重用引號的f-string，需Python3.12起的語法；其他產生器亦使用較新的Python API。依[Python3.12官方語法說明](https://docs.python.org/3.12/whatsnew/3.12.html#pep-701-syntactic-formalization-of-f-strings)，在README與發布文件補明最低前置版本，讓安裝Node套件與選擇Python環境的責任清楚。此次僅對驗證子程序調整PATH，沒有安裝／替換系統Python或改全域shell設定。

## 證據與發布範圍

隔離工作樹、安裝／失敗及成功測試／型別／建置與盤點／release日誌、來源完整性報告與原始盤點結果保存於忽略的`.local/pnpm-doc-check/`；完成後保留報告並清理暫時工作樹。這些命令未執行部署，網站內容與依賴維持原版。

本次結論限定為四份文件修正與既有工具鏈一致，凍結安裝、測試、生成、盤點及建置／release正常，且沒有引入來源或依賴變動。適用環境的版本前置條件已補明；後續變更仍需其相應閘門，不能將本次檢查解讀為repo日後任何修改都不可能出錯。
