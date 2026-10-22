# Kairos 學習筆記

可擴充的繁體中文教學網站。第一套課程：MATLAB 三個合成實作案例。

## 預覽與編輯

`site/` 是完整靜態網站，無前端框架或 CDN 依賴。

```sh
python3 -m http.server 8765 --directory site
```

開啟 http://localhost:8765 。修改 `site/index.html` 課程入口、`site/style.css` 共用樣式與 `site/courses/<course-slug>/` 課程頁面。僅將已完成且可公開的課程加入首頁；CEH、資安與其他主題目前沒有上線課程。

## 第一套課程

`/courses/matlab-practice/` 包含三案各 8 步全程教學、三案小任務、43 段逐段教學、523 個非空程式行的解說、提示詞、起始骨架及報告範本。

下載分為清理後的 MATLAB 教材包與獨立的 153 張 Python 合成參考圖庫。感測 CSV 由 MATLAB 案例一執行後產生；參考圖庫不是本次 MATLAB 的執行結果。

## 發布

main 更新後由 GitHub Actions 檢查教材 ZIP 校驗碼並發布 `site/` 至 GitHub Pages。此 repo 與個人網站獨立。

正式網域設定為 https://learn.cs-kairos.com/ ，以 Cloudflare DNS only CNAME 連到 GitHub Pages；HTTPS 由 GitHub 自動管理。不要修改既有個人站、console 或 api 的設定。

頁面使用相對連結，可同時支援 project path 與自訂網域根目錄，不需改寫 base path。GitHub Actions 發布使用 repo 的 Pages custom domain 設定，不需要 CNAME 檔。

公開內容禁止包含私人對話、學生回饋、電子郵件、帳密、內部檔案路徑與原始驗證紀錄。

## 教材 1.8（2026-10-22）

三案先做小量資料範例，再進入八步流程與逐段解說（段內逐行）。網站提供各案獨立下載及完整包；舊 1.7 ZIP 保留既有連結。發布前執行 `python3 scripts/validate_site.py` 與下載校驗碼檢查，並檢查手機、桌面排版及互動。

修改下載來源後，執行 `python3 scripts/package_release.py` 重建 ZIP 與 SHA-256。PDF 範本由 `python3 scripts/build_report_pdfs.py` 產生（需要 ReportLab），再重建下載包。
