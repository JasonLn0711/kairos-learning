# NAS 記憶體生命週期教學 v1.1.0

[文章](https://learn.cs-kairos.com/perspectives/nas-cve-patching/#memory-state) · [英文](https://learn.cs-kairos.com/en/perspectives/nas-cve-patching/#memory-state) · [正式資料](../../content/perspectives/nas-cve-patching.json) · [採用設計](../perspectives/nas-cve-content-design.md#v110記憶體生命週期補充) · [初版回執](2026-11-01-nas-cve-patching.md)

## 修改與版本

依使用者補充正文及四張截圖，擴充既有記憶體小節，完整納入旅館比喻、六項術語、正常請求生命週期、OOM、UAF、Worker 與 $GLOBALS 的區分、RCE 利用條件、三種記憶體問題對照及理解題答案。NAS 套件段增加內建 PHP 適用範圍、Worker 重新啟動與執行版本確認；入口段增加五項控制的功能比較。

新增教學範圍依 WRITE-06 採 minor：v1.0.1 → v1.1.0，revision 3，保留原發布日 2026-11-01，版本修訂日同為 2026-11-01。依 WRITE-07 保留簡潔品牌署名。雙語各十六節、十一圖、五表；四張記憶體圖取代原一張概要圖，整篇共有二十二份 SVG。各檔 1766–3838 bytes，低於 100000 bytes。

沿用 HTML／CSS／SVG 及受審核節點模型，沒有新增依賴或任意 HTML。圖解採縱向有向流程、顏色與文字共同區分狀態，手機可換行；UAF 將請求 A、B 分組並明示同一 Worker。截圖概念以可搜尋文字與可下載 SVG 重製，沒有把截圖貼成唯一教材。原 `memory-state` 錨點與圖檔路徑保留，後三圖調整圖號，來源 ID、雙向閱讀連結及版本表位置維持。

## 查核與表述

- [PHP OOM 公告](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)：核對 2026-10-21 公布日、longjmp 提早離開與後續清理的關係，以及修補及 Worker 帳號影響。文章沒有提供漏洞利用步驟。
- [PHP 過期狀態公告](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)：核對同一 Worker、前次請求擁有的記憶體、初始化前使用過期狀態。0x1000 及 A／B／C 資料明示為合成教學例子。
- [Synology SA-26:14](https://www.synology.com/en-global/security/advisory/Synology_SA_26_14)：本輪取得 10/22 初版頁，核對九項套件門檻、PHP 7.3 停止支援及 OS 內建 PHP 的適用說明。與前輪不同的語系修訂日期不再寫成目前確定事實；歷史回執保留當時觀察。
- 「歸還給電腦」具體化為交回記憶體配置器；說明 free 不保證清零或立即歸還實體 RAM。「地址相同」與「參照仍有效」分開；VLAN 搭配路由及存取規則限制可達範圍，程式修補處理內部缺陷。

## 驗收與證據

WRITE-01–07、HTML-01–04、FIG-01–03、A11Y-01–03 為本次驗收範圍。89 項單元測試、Svelte 0 error／0 warning、內容驗證、建置、實際 draft／future 發布邊界及 release 檢查通過。中英節點與段落結構一致；SVG 與產生器逐位元組相符。

瀏覽器證據存 `.local/nas-memory/` 日誌及 `.local/nas-cve/local/` 截圖、結果與 trace。目視中文手機 UAF、中文桌面 OOM、英文手機 RCE，文字與箭頭可讀。原生 Safari、實體手機及完整螢幕閱讀器驗收未納入本輪完成聲明。

完整本機瀏覽器 14 項通過：雙語 320／390／768／1280px、390px 下 200% 文字、無 JavaScript 十一圖與五表、搜尋 longjmp、互連、四圖真實 Tab／Enter 下載及逐位元組核對、八份記憶體 SVG 文字 viewBox 邊界、表格鍵盤水平捲動。圖解為靜態內容，沒有需要 Space 啟用的控制項。

一次中間驗收與發布邊界重建同時讀取 build，產生一項暫時 404（其餘 13 項通過）；完成乾淨建置後依序重跑完整 14 項通過。保留 `browser-final.log` 與 `browser-verified.log`，不把重建期間的失敗歸為產品問題或略過測試。
