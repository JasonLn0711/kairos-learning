# M03-08 v1.1.0 供稿抽換對照

本次供稿與兩張參考圖逐位元組保存在 [supplied-2026-11-04](supplied-2026-11-04/manifest.json)，已發布 v1.0.0 的正文模型、雙語稿與來源圖保存在 [archive-v1.0.0](archive-v1.0.0/)。正式正文由雙語教學稿生成，不以本文件或附件代替。

## 逐小節採用

[detailed-section-map.json](detailed-section-map.json) 逐項對應供稿全部十一主節及內層小節至穩定 section-* 錨點。第一至九節維持原主節錨點；十、十一節新增。中文稿沿用供稿完整推導、比喻、表格、命令輸出、ASCII 流程、五筆人工紀錄與模板；英文逐小節對應相同問題、條件、案例、步驟與限制。四道小檢核的既有參考答案維持獨立原生收合；四道新增教學 Q&A 保留在第十節，不冒充實際學習者提問，qa 仍為空。

## 編輯修正

- 移除「我已核對」與「我根據本章補充」等對話流程敘述，以及原始 sandbox 下載佔位與 content-reference 記號；原稿原樣保存。圖解在第四、六節的對應解釋後直接呈現。
- 移除引用網址的 utm_source 追蹤參數，保留原始技術來源。
- 「我先保留答案」改為提示先作答再展開既有參考解答；最後一句改為可核對的下一步，避免閱讀等同理解的宣稱。
- 將「你之前研究」「我們之前學過」改為一般讀者可用的概念連結，不推定讀者個人經歷。
- Suricata reject 表格補上模式條件：發送 RST／ICMP 拒絕訊息，IPS 模式同時啟用 drop。其餘部署與規則交互作用解釋保留。
- 規則依據核對於 2026-11-04：[Suricata Rules Format](https://docs.suricata.io/en/latest/rules/intro.html) 為 9.0.0-dev；[Thresholding Keywords](https://docs.suricata.io/en/latest/rules/thresholding.html) 明列不同門檻對 action 的差異。成稿保留開發版及現場安裝版本界線。
- [Nmap 狀態定義](https://nmap.org/book/man-port-scanning-basics.html) 支持六種狀態與觀測位置差異。[NIST SP 800-94](https://csrc.nist.gov/pubs/sp/800/94/final) 是 2007 年正式文件，2012 修訂草案已撤回；成稿保留早期概念指南的定位。

## 圖解採用

圖一保留掃描端 → Firewall → IPS → Server 四節點主路徑，以及從 Firewall 前分出的 IDS 鏡像。圖二保留觀察層兩張卡、共同查核層兩張卡與有限度結論；兩張觀察卡共同進入交叉核對，不讓對齊位置暗示單一觀察能證明單一設備結果。手機改上下重排，鏡像來源與共同查核文字持續可見；獨立 SVG 保留桌面空間關係。藍色實線是封包路徑或明列的查核步驟，綠色虛線只代表圖一的副本。

圖中文字與 HTML、搜尋使用同一個 sourceBody visual model；四個已知資產路徑才啟用 ProtectionDiagram。沿用嚴格 SVG serializer，不擴張可接受標記與座標上限。原始 PNG 作為來源保存，不當作主要教學文字。

版本：1.0.0 → 1.1.0，新增細分教學範圍；原發布 2026-11-04，版本修訂 2026-11-04。驗收及正式站結果另見本次 release receipt。
