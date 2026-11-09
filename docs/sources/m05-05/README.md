# M05-05｜CVSS、KEV、EPSS 完整供稿

2026-11-09 採入 Jason 本輪提供的完整供稿與四張 PNG。原稿 [pasted-text-1.txt](pasted-text-1.txt)、[圖1](image-1.png)、[圖2](image-2.png)、[圖3](image-3.png)、[圖4](image-4.png)逐位元組保存；[source-checksums.json](source-checksums.json)記錄原件 SHA-256。附件識別為 `dfc414f6-2509-4d18-87c8-1083a110bc5c`。Jason 提供正文與參考圖，代理負責編輯、英文、程式化 SVG、工程驗證與發布；公開署名維持 Kairos。

## 前版與採用稿

原有 `CEH26-M05-C05` 已存在於課綱但尚無獨立正文檔案；[registry.before.json](registry.before.json)保存修訂前課綱。首次正文沿既有 ID 與短網址 `m05-05`，版本 v1.0.0、首次發布／修訂日 2026-11-09。原有 M05-01–04、其他課程與發布閘門維持。

[完整中文](teaching.zh-TW.md)與[完整英文](teaching.en.md)各保留九節、五張表、五個小節與原本兩個開放檢核問題。本文直接閱讀；不預填本人答案、不建立測驗分數或批改承諾，qa=[]。

[source-paragraph-map.json](source-paragraph-map.json)逐段列出原稿文字、採用位置及改動理由；除了 favicon／來源卡 UI 雜訊外，每個來源段落均對應全文採用稿。[diagrams.json](diagrams.json)為 HTML、搜尋與八份下載 SVG 的雙語共同正本。正式資料由 `python3 scripts/m05_05_content.py` 產生，`--check`核對九份產物。

## 明列的編輯處理

1. 原稿中的 favicon、`first.org+1`／`GovDelivery` 等來源卡雜訊不放入正文，改在相關段落接上可追溯官方連結；移除 utm tracking query。
2. 錯置的 `# 0.20` 改為一般段落；數值仍為 0.20＝20%，另以固定20%長條重製第三張圖。
3. 最後「我會根據你的答案檢查」改為靜態教材的自我核對說明；兩個問題、情境及判讀目標完整保留。
4. 四關流程的第二關改為「漏洞與外部威脅訊號告訴我什麼？」，並明說 CVSS 是嚴重度背景，本身不證明外部實際利用。圖4同步修訂該標籤，仍保留四關、三支向下箭頭及最後淡藍卡片。
5. 正文保留 CVSS、KEV 與 EPSS 的所有比喻、表格、兩漏洞完整案例、隔離／緩解改變後需重評、修補程序四個問題與實務紀錄欄位。英文逐段完整對應，並非摘要。

## 四張圖的語意與差異

| 原圖 | 正式模型／呈現 | 桌面與手機語意 |
| --- | --- | --- |
| image-1.png | signals，三列平行工具，儀表／盾牌／趨勢圖示 | 每列標題與比喻；不加順序箭頭；窄欄文字換行 |
| image-2.png | groups，四組指標與說明 | Base／Threat／Environmental／Supplemental 為用途分類，不畫成流程；保留 Supplemental 不改分數 |
| image-3.png | probability，一組固定0.20＝20%與兩段界線 | 實際20%長條；完整保留30天、觀測範圍、全球漏洞層級與單一主機機率的區分 |
| image-4.png | workflow，四關、三箭頭、最後藍卡 | 保留判斷順序，第二關文字修正如上；明示非官方計分公式 |

文字使用語意 HTML，SVG 以同模型輸出固定桌面下載版；圖說補上圖號與判讀界線，增加留白、邊框對比與英文換行，未逐像素複製字型。HTML／SVG 圖示均為固定受審核 path，未匯入點陣圖或任意標記。第三張圖為固定教學案例，不是互動風險計算器。

## 官方查核｜2026-11-09

- [FIRST CVSS v4.0 specification](https://www.first.org/cvss/v4.0/specification-document)：五個分數區間、Base／Threat／Environmental／Supplemental、AT及後續系統影響；Supplemental不改分數，CVSS須附版本／向量。9.8／8.1為假設教學數字，並非對某CVE發出的正式評分。
- [FIRST EPSS](https://www.first.org/epss/)、[Probability／Percentile](https://www.first.org/epss/articles/prob_percentile_bins)、[Using EPSS](https://www.first.org/epss/using-epss)：未來30天、每日更新、全球漏洞層級、機率與排名差異，以及Presence／Reachability／Consequence。0.20與0.95明列為分開的假設範例，並非同筆真實資料。
- [CISA官方KEV bulletin](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/42a9f71)：收錄要求CVE、實際利用證據與緩解指引；PoC不能單獨證明真實利用。KEV也不直接證明本機受影響或已遭入侵。
- [CISA官方BOD26-04發布公告](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/41b445a)與[官方FCEB適用範圍說明](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/4309083)：確認2026-06-10公告與聯邦文職行政機關範圍。CISA directives／KEV主站本輪直接讀取403，因此採可讀的CISA官方公告；未猜測條文期限，也未把美國機關規則推廣為臺灣企業法定期限。

## 執行與下一關

[發布／驗收回執](../../releases/2026-11-09-m05-05.md)承接本輪實測、未驗事項、Git及Pages狀態；[維護契約](../../content-authoring.md#m05-05-prioritization)提供產生器與驗證入口。真人作答與獨立學習接受由各自證據確認，網站編輯與發布不代表本人完成學習。
