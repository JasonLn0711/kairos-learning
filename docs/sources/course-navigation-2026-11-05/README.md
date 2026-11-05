# 英文課程導覽重排｜來源與變更邊界

2026-11-05，AASE 英文化前沿 CEH 共用版型檢查英文導覽。未修改正式站的 CEH M04-05 在 320 CSS px／200% 根字級時，document.scrollWidth 為 359px。側欄長標題及前後篇標題都有文字超出視窗；單獨改 grid 或只修側欄不足以解決。

本次僅在 html[lang="en"] 的 .with-rail 導覽加入 overflow-wrap:anywhere；900px 以下側欄高度上限改為 10rem，540px 以下前後篇改為直向排列。標題、連結、正文、共用元件 DOM 及中文字體未改。規則依據為 [CSS Text Level 3 §5.4](https://www.w3.org/TR/css-text-3/#overflow-wrap-property)：anywhere 的換行機會會參與 min-content 計算；此來源不是本次瀏覽器實測的替代證據。

app.before.css 保存修訂前完整 CSS，SHA256 為 287105770ebeb6a1019230dd42b803cfa29019c9001c6ea9093b75f6ace3eea0。M03-02 歷史測試改從此保存檔核對原 CSS，原有來源雜湊清單不改。

依 WRITE-06，53 筆已公開且沿用英文側欄的教材資料提升 patch、revision 加一、版本修訂日更新為 2026-11-05；中英共用日期與版號，原發布日保留。33 筆概念及 20 筆舊式 lesson 的逐筆清單、前後版號及排除版本欄位後的原內容 SHA256 見 [版本清單](../../releases/2026-11-05-course-navigation-versions.json)。其中 17 筆舊式 lesson 原無語意版號，以 1.0.0 作本次遷移基準後顯示 1.0.1，不宣稱歷史頁曾顯示 1.0.0。維護中的 *_content.py 同步中繼資料；歷史一次性 build 腳本及原稿不改。

測試先在正式站以新斷言重現失敗，再驗本機修正；量測與截圖留在忽略目錄 .local/aase/rail-fix/。原始全套閱讀檢查有 8 個中文正文案例失敗，逐一在修訂前正式站重現：M01-01、03、04、05、06、07、M03-04、05，均為窄版正文 p 的 scrollWidth 超出其 clientWidth；本次英文導覽規則不作用於它們。保留差距，未把整套檢查寫為通過。完整範圍及發布結果見 [回執](../../releases/2026-11-05-english-course-navigation.md)。
