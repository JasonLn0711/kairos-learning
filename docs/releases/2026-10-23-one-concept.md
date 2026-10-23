# 一次學一個概念：發布驗證

## 範圍與來源

網站仍由 kairos-learning main 的 Pages workflow 發布 build/；GitHub Pages API 確認 custom domain 為 learn.cs-kairos.com、build_type 為 workflow。前一成功版本 75e47d39910745dcff83fe95017645dfd21c0a8a，run 39832134230。個人主站 Worker、DNS、權限、Access、Tunnel 均未變更。

M01–M20 保留原有雙語教材，各章標示獨立概念路線整理狀態；M04 列出 12 核心及 7 選讀，新增 `/courses/ceh/v13/m04/concepts/m04-01/` 與英文對應。其他核心只列待整理，尚無教材就不產生概念頁。中文完整正文與 [CEH 教學來源](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/source/2026-10-23-one-concept/M04-01-teaching.md)逐段比對相同。Q&A待補，沒有私人進度、訊息識別或本人回答。

## 已驗證

- 12 項 Node 測試通過；內容驗證通過；Svelte check 零錯誤／零警告。
- 草稿／未來日期實際輸出檢查通過；192 HTML 的本機連結、錨點、語言對應、canonical及CSP通過；55既有靜態資產位元組一致。MATLAB與六份ZIP校驗通過。
- npm audit 高嚴重度門檻通過；維持既有3項low，未升級框架。
- Chromium 320、390、1280px：無水平溢位、無pageerror；M04-01 → 下一個待整理錨點 → M04-01 → English成功。已檢視手機完整頁截圖。
- 完整教學來源檔逐字比對相同，五段中文正文逐段比對相同。

## 發布證據

本文件建立時尚未部署；實際部署版本、run與正式URL讀回結果由私人Planning交付回執及交付訊息保存，只有workflow成功且正式頁核對後才更新已發布狀態。技術驗證不代表本人理解或真人使用驗收。
