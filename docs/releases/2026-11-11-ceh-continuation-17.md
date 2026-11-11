# 2026-11-11｜CEH 11/10 兩份續篇與 17 圖

範圍：同日第 2／3 部分，第 10–27 題的兩份供稿與 17 張圖。筆記日期與原發布日保持 2026-11-10；本輪增加教學範圍為 v1.2.0／revision 3；TLS 註記範圍修正後為 v1.2.1／revision 4，版本修訂 2026-11-11。

## 正本、來源與採用

- 原始保存提交 `051c167`：19 份附件逐位元保留，含 2 份文字與 17 張 PNG，SHA-256 見 [manifest](../sources/ceh-notes/2026-11-10/continuation-17-reference/manifest.json)。
- [來源對照](../sources/ceh-notes/2026-11-10/continuation-17-reference/source-map.md)、661 個逐段雙語單位與逐單位採用紀錄在原始來源旁；來源、校正、正文及發布證據分開。
- 同一日期頁保留另一批較新完整稿的全部正文、11 圖、原錨點與練習，續接本批完整供稿版。中文／英文深度逐段對應，五個治理單元、四個密碼學單元的案例、表格、推導、限定與歧義完整進入正文。
- 17 張參考圖對應 34 份新 SVG；原有 30 SVG 保留。固定模型承接分支、平行、巢狀、比例條、16／32 位元組格及三角色憑證交握；節點正文可選取、搜尋與重排，SVG 同源產生且小於 100000 bytes。
- 兩組各七個原始回憶問題完整保存；兩組各五道情境題不提供答案鍵、評分器或提交服務。較新完整稿既有本機檢核仍保留在自己的版本段落。本輪沒有個人作答、理解程度或官方考試準備完成證據。

## 驗證與界線

適用 WRITE-01–06、09–11、HTML-01–04、FIG-01–06、A11Y-01–03；未新增計算互動，INT-01 參數計算不適用。下列實測僅支持本輪範圍，不能由來源雜湊、圖名數或單一綠燈推論全站改善。

- `pnpm run validate:content`、`pnpm test`：最終合併後 298 項測試全部通過。
- `pnpm run check`：0 errors／0 warnings；`python3 -m unittest discover -s scripts -p test_validation_html.py`：6 項通過。
- `node scripts/check-publication-boundary.mjs`：draft／future、英文課程閘門與乾淨正式重建通過；`pnpm run validate:release` 全部通過，包含本批來源逐單位稽核。
- `check-ceh-continuation-diagrams.mjs`：17 圖 SSR／無 JS fixture、雙語四尺寸／200% 共 16 組案例、34 SVG 字框／重疊與下載通過。
- `check-ceh-continuation-graphs.mjs`：實際頁面雙語四尺寸／200% 共 16 組案例通過；17 圖中每條量測連線的起訖對準節點、不穿過其他節點，全部條件／共享祕密標籤可見；16／32 bytes、巢狀卷及原始練習無答案鍵介面另核對。手機分支繞過不相干的中間節點。
- `check-ceh-notes-browser.mjs`：最終合併版本的雙語全部正文與搜尋、四尺寸／200%、無 JS、鍵盤、既有卡片／檢核、64 SVG 幾何及下載 bytes 全部通過。目視來源 17 圖及手機／桌面重點圖解；截圖與結果留於忽略的 `.local/ceh-notes/`。
- 原較新版本全部中英文 sections 與錨點逐物件比較保持相等；沒有覆寫原工作目錄的無關修改。
- `pnpm audit --audit-level=high`：高風險門檻通過；仍列 4 項 low。建置有大於 500 kB 的既有整站 bundle 提示，未擴張為全站拆包工作。
- `git diff --check`：合併整理後通過。來源保存 `051c167`，逐段對照 `452beea`，實作 `d49e912`，保留兩邊歷史的合併 `f0bd5c4`。

首次檢查在發布邊界腳本暫放 fixture 時並行讀取正文，曾出現重建不同步；已結束該 fixture 後順序重跑。另一次在更新 SVG 後沿用舊 build，資產 byte-parity 正確報出兩份憑證 SVG 不同；最終建置後重新驗證。上述失敗不作通過證據。長頁 locator 自動捲動截圖曾逾時；改為明確捲至圖首／圖末再擷取 viewport，保留完整圖的 SSR 截圖與實際箭頭幾何檢查，不把截圖工具逾時冒稱為頁面完成或失敗。

真人學習理解、實機與完整螢幕閱讀器驗收、付費 ISO 全文及所有標準 errata 未作完成宣稱。原 checkout 的 README 與 CEH 發布計畫維持原有修改；工作在持久隔離 worktree 進行。

## 發布閘門

尚未發布此輪續篇修訂。完成必要驗證後提交／推送，等待實際 Pages run，回讀雙語全文與 34 新 SVG，再填入正式發布證據。`kairos-learning` 擁有原稿、教材、實作、圖解及發布證據；Planning 僅持定位、狀態、容量、驗證及下一閘門。

## TLS 註記框修正

最後圖意核對將事先申請框限定 CA／伺服器、本機驗證框限定瀏覽器、應用保護框限定伺服器／瀏覽器；手機依角色文字重排。同源 HTML／SVG 與桌面參與角色範圍測試一併修正，34 SVG fixture、型別及 release gate 重跑通過。
