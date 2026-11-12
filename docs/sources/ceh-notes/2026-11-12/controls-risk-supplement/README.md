# C17–C29 原稿、圖稿與採納對照

本目錄保存 2026-11-12 供稿的兩份完整文字與 13 張原始 PNG；原始檔保持供稿 bytes。`sha256-manifest.json` 記錄逐檔大小與 SHA-256。C17–C24 採入當日筆記第 2 部分，C25–C29 採入第 3 部分。C01–C16 的既有來源保留在原 11 月 10 日歷史來源目錄，正文移至 11 月 12 日第 1 部分。

## 原始來源

| 檔案 | bytes | SHA-256 |
| --- | ---: | --- |
| `image-1.png` | 53411 | `da6d671a538e2ab1b538076d09da852b3481ed2cfde4eb300cad9f4eb1afaaa8` |
| `image-10.png` | 44423 | `7e8a6566e3bad30a8e7c51404be3ce9091d65334a09eaae4a31fb29e95e09dfd` |
| `image-11.png` | 39563 | `29d1b5bb270cce973911d6dc3fe887478090aa934b3e0212900c93b184f06a66` |
| `image-12.png` | 37692 | `64dd359ab0692cdb50ec7c1c6432fbc4e7989059c5f1299eeea919ec3c455208` |
| `image-13.png` | 77221 | `19274963d2a4848c0b162ca0d22df03c5a8bf1a6e0942c5286de1cbd519307d3` |
| `image-2.png` | 86646 | `1094acd49d7813903099d1263438125a753ec5ec0afdb746d30801b3191024d4` |
| `image-3.png` | 44510 | `c83c46f08b98c8a49e8b3259aa8136a9e73aa4b958a074d427f2823347079972` |
| `image-4.png` | 25442 | `db6c9a304ec9e7e5253e993a74c8858774fed70cc87b2b5d42a99829f1a765d7` |
| `image-5.png` | 99767 | `4525a4a25896eaf13f08d01ab1446aebe5f605ef53547fda29e465d0cd727488` |
| `image-6.png` | 58417 | `ff4111d953b2e3a65aff881fc61975f58fb0ffd845c6f0253fbbd1e176c57a59` |
| `image-7.png` | 127405 | `81023c74668c4e913caadcd9669ad7bb1bfad39e4fe165030779c2c402538df1` |
| `image-8.png` | 50311 | `305f8dfbbdaebd20affe3acfaa8a098ae167ca97b98fc575c7e33d9a35dfbb58` |
| `image-9.png` | 54872 | `d4ba74fcdf10b91b27d17161744a935c42d560ea4ebbfc6179cf80ba08e995cb` |
| `pasted-text-1.txt` | 42238 | `eb0425be7a3a7f95f4bc666708d7a428da5dd82bb3befefb46a95f67ac3b7e65` |
| `pasted-text-2.txt` | 42657 | `6f4dbcfa46d04af94df727a401fa5a7275165d36827f1ef5ec0c37255e034acd` |

## 採納與編輯

- `part-2-source-units.json` 保留 C17–C24 的 439 個來源單位；`part-3-source-units.json` 保留 C25–C29 的 394 個來源單位。
- `part-2-adopted.json` 與 `part-3-adopted.json` 保存完整雙語採納正文，分別有 15 與 12 個章節。`part-*-translations.en.json` 保存逐單位英譯；`part-*-adoption-map.json`、`part-*-line-map.json` 與 `part-*-chapter-map.json` 對照原稿、採納與正文錨點。
- 原稿中的來源卡、favicon 與介面標籤保持於來源層；不把它們當成教學段落。圖中文字依 `diagrams.json` 的 13 個模型重建，原圖保留以供對照；7 張圖屬第 2 部分，6 張圖屬第 3 部分。
- 兩張比較表的原始空白列標頭補為「比較項目」／“Comparison”，保留全部資料格與比較內容，讓表格欄位具有可理解的標籤。
- `editorial-corrections.json` 分開記錄技術、法規時點與原題未附界線的雙語修正；原稿不隨修正改寫。原題引用來自供稿，未提供的原題全文不視為已獨立查核。
- 網頁沿用既有 inline renderer：只將受限的 HTTPS Markdown 連結轉成連結，不渲染任意 HTML，也不以反引號標示當作已支援的 inline code。採納文字已清除供稿格式殘留的反引號。

## 驗證與發布界線

來源雜湊、單位對照與雙語結構檢查建立保全及採納證據；它們各自不代表語意審查、瀏覽器呈現、使用者學習完成或正式站已發布。正式日期頁由 `scripts/reconstruct-ceh-notes.py` 明確呼叫 `ceh_note_regroup.regroup_notes` 與 `ceh_note_controls_risk.adopt_new_material` 重建。

法規與現行標準的 primary-source 查核及存取界線見 [本次來源查核](../../../../releases/2026-11-12-ceh-day01-source-review.md)。實測與發布結果由本次正式發布紀錄另行保存。
