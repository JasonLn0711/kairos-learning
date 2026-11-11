# M06-06｜TLS、秘密與信任邊界完整抽換

原發布 2026-11-05，內容 v1.1.0／revision 4，版本修訂 2026-11-11。

[逐節來源對照](../sources/aase/m06-06/replacement-2026-11-11/source-map.md)保存原稿、三張 PNG、前版與 SHA-256；[技術核對](../sources/aase/m06-06/replacement-2026-11-11/technical-review.md)記錄格式清理與技術界線。完整雙語正文含導言與八節、TLS 三保護與四步建連、憑證／對稱加密／mTLS、代理終結與收發室比喻、秘密辨識與撤銷輪替、機場比喻、醫院／成績／Agent 三案例、六類控制、完整 architecture.md 及供稿三題。四表資料列數為 3／5／7／6；六個舊錨點與原發布日保留。舊題保留於來源快照，新情境題用 Q04–Q06。

三張圖保留參考關係：兩端 TLS 協商、四端點三段傳輸、A／B／C 三個跨界位置。HTML 節點可搜尋與重排；六份 SVG 由同一正式 JSON 匯出，受限元素／屬性白名單且各小於 100000 bytes。圖中箭頭是示例資料流與跨界位置，未驗證實際系統部署。

## 已執行

- WRITE-05、09–11：逐節核對原稿與雙語成稿；保留表格、程式碼、步驟及案例，聊天式來源卡與等待答題文字另外記錄。
- WRITE-06、08：原發布日、版號、修訂日與課次維持既有模型。
- 來源 SHA256SUMS 五項通過。
- 生成器及六份 SVG `--check` 通過。
- 隔離工作樹整合遠端後 `pnpm run validate:content` 通過；`pnpm test` 在推送提交 65b9ada 上 337 通過；型別檢查零錯誤／零警告。
- HTML-01–04、FIG-01–06、A11Y-01–03：兩語全文、四尺寸 320／390／768／1280、200% 文字、無 JavaScript、原生展開、鍵盤與六圖下載位元組一致，最終四項 Playwright 通過；另核對搜尋同源文字、六份 SVG 文字邊界與文字間重疊，並讀圖檢查手機／桌面截圖。

## 發布狀態

內容提交 `3392574`，連線標籤與圖檔修正 `9a486b1`，完整驗收 `3a38d56`／`411dfd7`，保留同期遠端更新後以 `65b9ada5766835479c1f596fab2993f13068704b` 推送 main；推送後 fetch 實測 divergence 為 `0 0`。

[Pages 工作 42991019517](https://github.com/JasonLn0711/kairos-learning/actions/runs/42991019517)以該提交完成全部發布閘門並部署成功。正式站中英文各回讀 HTTP 200，均顯示 v1.1.0／版本修訂 2026-11-11。以 `AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0606.config.ts` 執行正式站四項測試，全數通過，包含全文／表格／程式碼、四尺寸、200% 文字、無 JavaScript、鍵盤、搜尋、六 SVG byte equality 及字框／重疊。實測範圍只涵蓋本篇。

- [繁體中文正式頁](https://learn.cs-kairos.com/courses/aase/v1/m06/concepts/m06-06/)
- [英文正式頁](https://learn.cs-kairos.com/en/courses/aase/v1/m06/concepts/m06-06/)
- [結構化驗收資料](2026-11-11-aase-m06-06-checks.json)保存提交、工作編號、測試範圍及六圖 SHA-256。

本機與正式站瀏覽器證據分別保存於忽略目錄 `.local/aase/m0606/local/` 與 `.local/aase/m0606/production/`，CI 回應及正式頁 HTML 在 `.local/aase/m0606/evidence/`。額外的 Python urllib 直讀回傳 HTTP 403；實際 Chromium 讀頁及正式站 Playwright 檢查通過，不將該輔助 HTTP 檢查列為通過。原工作目錄其他教材修改保持原狀。


## 待驗界線

未執行真人學習成效、真實 TLS 伺服器測試或完整無障礙認證。教材範例屬本機設計分析，不代表正式系統安全控制已實作。
