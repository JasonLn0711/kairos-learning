# M06-04 完整供稿與四圖抽換

AASE-M06-C04 升為 v1.1.0／revision 4，原發布日 2026-11-05 與六個舊錨點保留。正本為 kairos-learning；[原稿、四圖、前版、逐節採用與修正](../sources/aase/m06-04/replacement-2026-11-11/README.md)完整保存。供稿十節與導言進入兩語正式正文，包含兩個 HTTP 訊息、200/false 範例、Streamlit 程式、五教學表、四圖與三題全部選項，qa=[]。

WebDataFlowDiagram 只接本課固定 flow 六節點、cards 三平行層次、cards 兩條四節點鏈，以及固定 Network 模擬表。文字以 Svelte 跳脫，模型拒絕錯誤關係／數量／markup；SVG 由同一正式 JSON 產生，維持固定白名單與小於 100000 bytes。沒有新增依賴或全站版型改寫。原工作目錄的無關修改保留；本次在 /tmp/kairos-m0604 隔離工作樹編輯與驗證。

## 本機驗收

| 規則 | 實測與結果 |
| --- | --- |
| WRITE-02、04、05、09–11 | 原稿與兩語成稿逐節核對；來源對照列明十節、三個 HTTP 小節與移動後的完整題目。兩語全文、表格、程式與圖解順序進入實際 HTML。 |
| WRITE-06、08 | v1.1.0、原發布 2026-11-05、版本修訂 2026-11-11，中英同值；課次 M06-04 與原網址保留。 |
| HTML-01–04、FIG-01–06 | 兩語在 320／390／768／1280 CSS px、100%／200% 文字無頁面水平溢出，圖解文字至少16px、行高1.8；程式與寬表格局部鍵盤捲動。手機架構鏈保持兩組獨立關係。 |
| A11Y-01–03 | 圖說、表頭、語意列表與裝飾SVG，Tab/Shift+Tab、Enter、Space、可見焦點；無JS全文與原生答案可讀可開。核心正文與圖解直接可見。 |
| FIG-03、05 | 八圖下載位元組與檔案一致；字框不越界且文字不重疊；尺寸1595–3037 bytes。桌面／手機截圖與 SVG 已人工閱讀，圖二無順序箭頭。 |
| INT-01 | 不適用；Network頁籤為靜態示意，未新增計算或送出互動。 |

內容、型別、單元測試、publication-boundary、release 靜態檢查與本課雙語瀏覽器驗證已通過。瀏覽器本機證據 `.local/aase/m0604/`；共享舊版快照測試改核對已保存前版，本次正文由新回歸測試覆蓋。Python 範例經語法解析及四組輸入 UI stub 分支測試，未以此聲稱實際框架網路觀察。

## 可重跑的驗證入口與 Git 證據

本課內容／SVG 產生器的 `--check`、`pnpm run validate:content`、`pnpm run check`、`pnpm test`、`node scripts/check-publication-boundary.mjs`、`pnpm run validate:release` 及 `pnpm exec playwright test --config playwright.aase-m0604.config.ts` 均已實際執行。發布前整合版單元測試為 328／328；本課瀏覽器為中英各一條完整驗收，涵蓋每語 4 尺寸 × 2 文字倍率、無 JS、鍵盤、全文順序、原題、搜尋及 4 份圖檔。這兩條驗收包含多個檢查，並非兩次畫面抽查。後續並行章節新增的全站測試數，以實際 CI run 為準。

來源保存提交 `f011f62`，完整教材提交 `f94558a`，圖示／SVG 留白修正 `e6577ce`，表格字級修正 `1c2edb0`。合併保留 M05、M06-02 與 M07 的同期歷史；`d7f396b508b34825e6986a4493f2b95fe7697175` 成功推送 main，當次 fetch 後差異為 `0 0`。原工作目錄的無關未提交修改未納入本次提交。

## 發布

正式部署已完成：[Pages run 42990651032](https://github.com/JasonLn0711/kairos-learning/actions/runs/42990651032) 為 success，部署提交 `48498a49519c362b4a17674cab079b03afa2b484`，保留本課推送提交 d7f396b 的完整歷史。原排隊 run 42990562837 因較新並行提交取代而 cancelled；實際成功部署使用上述後續 run，沒有將取消狀態當成部署成功。

CI 實測：331／331 單元測試、6 項 shared static HTML 測試、內容與型別、依賴高風險稽核、實際 publication-boundary、release 靜態驗證、MATLAB ZIP hashes、artifact 可見性及 deploy 全部成功。331 為含同期 M07-05 的全站測試數；本課發布前本機為 328，兩者不混用。

正式站回讀於 Playwright `2026-11-11T08:56:17.749Z` 開始，23.0 秒，**中英兩條完整驗收全部通過**（expected 2、unexpected 0、skipped 0、flaky 0）：

- [中文 M06-04](https://learn.cs-kairos.com/courses/aase/v1/m06/concepts/m06-04/) 與[英文 M06-04](https://learn.cs-kairos.com/en/courses/aase/v1/m06/concepts/m06-04/) 皆為 v1.1.0。逐節核對完整正文、表格資料格、程式、圖解節點、三題十二選項與解析順序，並與同源搜尋逐段核對。
- 四圖每語各一份，八個正式 SVG 經鍵盤開啟，HTTP 200、位元組與 site 檔案完全一致；文字字框不越界、不重疊，小於 100000 bytes。
- 每語 320／390／768／1280 CSS px、100%／200% 字級無頁面溢出；正文、列表、表格儲存格及圖說至少16px／1.7。Supplementary filters 為14px。局部表格／程式捲動、Tab/Shift+Tab、焦點、Enter/Space、無JS閱讀與答案展開全部通過。
- 正式站截圖已人工閱讀六步與綠底結果、三個獨立層次、兩條架構及手機重排、Network 合成表；圖四仍清楚標示模擬來源，沒有送出或抓包介面。

正式站結果與截圖在隔離工作樹 `.local/aase/m0604/`；原始供稿及可重現成稿／SVG 檢查留在公開來源紀錄。只提交本次來源、教材、測試與回執；原工作目錄的無關未完成修改保持原狀。

未執行真人理解檢核、實體手機及本機 Streamlit 封包觀察；本次瀏覽器尺寸測試與教材合成紀錄各有自己的證據範圍。
