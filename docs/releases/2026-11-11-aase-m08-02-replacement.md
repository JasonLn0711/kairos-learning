# M08-02｜TDD 完整供稿抽換

本版將既有短篇換成完整供稿教學，保留公開網址、原發布日2026-11-05、六個既有錨點及Git歷史。內容版本v1.0.2 → v1.1.0，revision 3 → 4，修訂日2026-11-11。

[來源與逐小節對照](../sources/aase/m08-02/replacement-2026-11-11/source-map.md)保存原文、三PNG、前版、雙語成稿與SHA256SUMS。兩語各14個section承接導言、九節及第四節分階段內容：自動門、檢驗機、五產業、提款GWT、完整Python、四張五列資料表、AI協作提示與風險、品質界線、適用條件、原三題三選項與新增參考解析均進正文。原本的獨立tdd-lab與單一規則界線保留。

三張參考圖製作為可選取、搜尋、原生重排的HTML，搭配六份同源SVG。循環圖保留Red → Green → Refactor及虛線回返下一需求；結果圖保留三階段結果及測試集合／版本差異；協作圖保留人員與Agent四步順序。正文不以縮小整張SVG承接手機閱讀。SVG固定白名單、跳脫文字、小於100000 bytes；資料不接受任意markup或path。

## 規則與實測

| 規則 | 檢查範圍 | 本機結果 |
| --- | --- | --- |
| WRITE-01–11 | 來源逐節對照、雙語深度、日期、可執行程式、證據界線 | 成稿核對完成，來源／修正／本次執行分開記錄 |
| HTML-01–04 | 全文與順序、320／390／768／1280px、各200%文字、局部捲動 | 兩語通過；無頁面水平溢出 |
| FIG-01／03–06 | 三圖關係、手機重排、六SVG大小／字框／文字重疊／下載bytes | 兩語通過；已檢視桌面及手機三圖截圖 |
| FIG-02 | 以整張空間SVG作正文 | 不適用；正文為HTML節點，SVG供原尺寸下載 |
| A11Y-01–03 | 語意圖說、表頭、程式容器、無JS、Tab／Shift+Tab、Enter／Space答案與下載 | 兩語通過；無假提交／評分功能 |
| INT-01 | 計算或模擬互動 | 不適用；保留原生參考答案收合 |

## Python範例實跑

實際執行程式為正式JSON中的code，不另寫一份近似實作。Python 3.11.15，在隔離pytest 8.4.2及9.0.2環境各執行以下五組；每組使用新的暫存目錄，避免import cache混入不同實作。

| 實作／測試集合 | 8.4.2 | 9.0.2 | 解讀 |
| --- | --- | --- | --- |
| Red／原五項 | 4失敗、1通過，exit 1 | 同左 | 四個DID NOT RAISE均指向預期ValueError需求失敗 |
| Green／原五項 | 5通過，exit 0 | 同左 | 相同驗收標準通過 |
| Green／擴充八項 | 8通過，exit 0 | 同左 | 缺鍵、trim、原輸入不變已受保護 |
| Refactor／原五項 | 5通過，exit 0 | 同左 | 同一測試集合下的回歸 |
| Refactor／擴充八項 | 8通過，exit 0 | 同左 | 擴充集合也維持行為 |

命令：`python3 scripts/check-aase-m0802-example.py .local/aase/m0802/pytest-8.4.2/bin/python`及9.0.2相同命令。[本次完整執行輸出](2026-11-11-aase-m08-02-example-results.json)持久保存兩版本紀錄；原本機輸出保存在`.local/aase/m0802/pytest-8.4.2-example.json`及9.0.2對應檔。公開回執保留結果與環境，未把單規則範例擴大成全系統、資安或讀者完成證據。

## 驗證指令與證據

- `python3 scripts/aase_m0802_content.py --check`、`python3 scripts/aase_m0802_svg.py --check`及來源SHA256：通過。
- `pnpm test`：322／322通過；包含三項新增來源／模型契約檢查。歷史M08雙語與標題遷移測試改讀已保存前版，新版內容另由專屬測試檢查。
- `pnpm run check`：0 errors／0 warnings。
- `pnpm run validate:content`、`pnpm run build`、`pnpm run validate:release`：通過。建置仍有既有大於500kB chunk提示。
- `python3 -m unittest discover -s scripts -p test_validation_html.py`：6／6通過。
- `pnpm audit --audit-level=high`：通過；4 low，沒有高風險告警。
- `pnpm exec playwright test --config playwright.aase-m0802.config.ts`：兩語2／2通過，包含每節每段、表格、程式及圖說節點順序、三題及解析、搜尋、四尺寸／200%、無JS、鍵盤、六SVG邊界與無文字重疊、開圖及下載位元組一致性。
- 本機圖像證據：`.local/aase/m0802/{zh,en}-{1,2,3}-{390,1280}.png`及`*-svg.png`；已檢視兩語桌面／手機及結果SVG，未見裁字或錯誤流程關係。
- `node scripts/check-publication-boundary.mjs`：通過；草稿／未來日期、英文課程draft／future均排除於路由、搜尋與payload，並重建乾淨正式輸出。
- `git diff --check`：觸及檔案通過；提交前再次核對。

## 發布

本次採隔離工作樹`/tmp/kairos-m0802`，保留原工作目錄多篇未提交修改。來源、實作與回執由kairos-learning擁有；沒有提交原工作目錄的無關變更。

正式頁：[/courses/aase/v1/m08/concepts/m08-02/](https://learn.cs-kairos.com/courses/aase/v1/m08/concepts/m08-02/)，[英文頁](https://learn.cs-kairos.com/en/courses/aase/v1/m08/concepts/m08-02/)。Git發布、CI部署與正式站逐段回讀均已完成；下節列出實際提交與證據。

待驗：實體裝置、讀者理解與實作接受。原稿影片未提供可核實網址，原文仍保留，正文沒有杜撰影片連結。

## 整合驗證

本次依保留雙方歷史的流程整合遠端`48498a4`，保留M06-02、M06-04、M07-02、M07-05與其他既有發布。共用元件分派、模型驗證、歷史測試及內容指南的衝突均保留雙方用途。整合時型別檢查抓到TDD分派誤插於段落區而未定義block，已移回blocks迴圈；修正後型別0 errors／0 warnings、單元334／334、發布邊界、validate:release與兩語瀏覽器2／2通過。

最後核對補上本課四表的1rem／1.7行高，沿用現有表格樣式並將td／th字級及行高加入四尺寸／200%瀏覽器檢查；最終型別0 errors／0 warnings、單元334／334、兩語瀏覽器2／2與validate:release均通過。

第二次整合保留遠端`ed3b044`的M06-03、M06-05、M06-06、M07-01與M08-01等發布。修正歷史M08測試同時讀取M08-01與M08-02的前版；最終單元344／344、型別0 errors／0 warnings、建置、validate:release及兩語瀏覽器2／2通過。本次觸及檔案diff-check通過；遠端M07-05來源對照有既存EOF空行，保留原有紀錄。

## 正式發布與完成核對

來源提交`5621ea0`、教材提交`ad16dc7`、驗證紀錄`2ce3552`；英文貨幣單位與建議語氣修正`ce26c97`。多次整合均保留本地與遠端歷史，未強制推送；最終包含本次教材的發布提交為`978db68`，目標`origin/main`。較早的推送曾因並行更新被non-fast-forward拒絕，整合後重試成功。

本機最後對推送內容執行單元373／373、型別0 errors／0 warnings、發布邊界、validate:release及兩語瀏覽器2／2，均通過。推送期間追加的遠端教材與回執保留原作者內容，本次沒有改寫其供稿或提交原工作目錄的髒檔。

原排隊工作`42992328799`被後續提交取代，沒有把取消當成成功。[實際成功部署42992453184](https://github.com/JasonLn0711/kairos-learning/actions/runs/42992453184)的head為`3ed7e2e`，已用Git祖先關係確認包含`978db68`；工作於2026-11-11 17:09:57 +08:00完成。依賴、稽核、內容、單元、靜態HTML、型別、發布邊界、release、下載雜湊、artifact及Pages deploy均通過。

正式站於2026-11-11 17:10 +08:00實際檢查兩語v1.1.0／原發布2026-11-05／修訂2026-11-11，全部14節正文、四表、六段程式、三圖與三題均依成稿順序通過。四尺寸及200%、正文／表格字級與行高、無JS、局部鍵盤捲動、答案展開、開圖、搜尋、六SVG字框／文字重疊／大小／下載bytes全部通過（兩語2／2，無跳過與flaky）。瀏覽器回讀為HTTP 200；獨立urllib探測曾被403拒絕，沒有以該請求推論網站不可讀。

[機器可讀完成證據](2026-11-11-aase-m08-02-checks.json)保留CI head、祖先關係、時間、實測範圍與六SVG SHA-256；[Python完整輸出](2026-11-11-aase-m08-02-example-results.json)保留兩個固定pytest版本的真實結果。正式瀏覽器完整JSON另存`.local/aase/m0802/production-browser-results.json`，桌面、手機及SVG截圖與本機結果同目錄。

適用規則WRITE-01–11、HTML-01–04、FIG-01／03–06、A11Y-01–03均有上述範圍證據。實機、讀者理解與實作接受仍為not_evaluated；影片來源缺漏已記錄，不擴大為讀者完成、全站改善或全系統／資安驗收。
