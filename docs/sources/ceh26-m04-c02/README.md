# 新版 CEH M04-02｜DNS 列舉來源

內部 stable ID：CEH26-M04-C02；顯示名稱：CEH M04-02。正式路徑為 `/courses/ceh/v13/m04/concepts/m04-02/`，英文加 `/en`；ceh26 前綴不是公開 slug。初版 v1.0.0，原發布與版本修訂日為 2026-11-04。

## 完整來源保存

- teaching.zh-TW.md：完整繁中供稿，8170 字元、265 行；SHA-256 `744c93e7d07c7a82131aaae007957decd1dccf4a6339c2322feda45d67c9471d`，與指定原稿一致。
- teaching.en.md：完整逐節英譯，同為265行，保留十一節、數字、命令、合成輸出、條件、來源與最後一題。觀察紀錄的八個中文欄位在英文中完整對譯；前四段命令／輸出完全一致。
- answer.zh-TW.md、answer.en.md：唯一理解題的參考答案；公開頁預設收合，並非學員實際回答。
- sha256.json：上述四個檔案的雜湊。

兩語正文各111個sourceBody區塊、11個章節、5段程式碼／觀察模板與25個主要來源連結。qa為空，沒有新增測驗或私人作答狀態；原稿之外的交付時間、訊息識別與私人收據不進網站。

執行 `python3 scripts/ceh26_m04_c02_content.py --check` 核對確定性。轉換只把標題、清單與程式碼轉成既有 sourceBody，移除 Markdown 粗體格式；不改字句、命令、來源連結或段落順序。正文直接顯示，只有參考答案收合。沒有對真實DNS目標執行查詢或AXFR。

## 來源核對（2026-11-04）

原稿中的RFC、BIND與systemd連結均完整保留於兩語正文。另核對以下主要規範的易錯重點，沒有替原稿增加教學範圍：

- [RFC9824 §1／§3.1](https://www.rfc-editor.org/rfc/rfc9824.html#section-3.1)：精簡不存在證明可為不存在名稱產生NOERROR、空ANSWER與對應否定證明，因此不可單靠回應碼斷言名稱存在。
- [RFC2308 §2.2](https://www.rfc-editor.org/rfc/rfc2308.html#section-2.2)：NODATA不是獨立RCODE，須從回覆內容辨認並與轉介區分。
- [RFC7766 §5](https://www.rfc-editor.org/rfc/rfc7766.html#section-5)：一般DNS實作支援UDP與TCP；TCP不只用於區域傳送。
- [RFC8482 §4.1](https://www.rfc-editor.org/rfc/rfc8482.html#section-4.1)：ANY可以只回傳部分RRsets，不保證完整區域或名稱紀錄清單。

舊DNS供稿／Q&A／圖解留在非輸出歸檔；這份新版供稿按指定雜湊獨立發布，沒有重新啟用legacy教學。發布與驗收見[本課回執](../../releases/2026-11-04-ceh26-m04-c02.md)。
