# 2026-11-20 依賴安全修補與發布驗證

## 修補與版本

- `7cfb698f` 將網站遷移至 SvelteKit 3.4.0、adapter-static 4.0.1 及 TypeScript 6.0.3。Vite 設定保留靜態發布、404 fallback 與雜湊 CSP，remote functions 維持關閉。舊版鎖檔命中的高風險公告曾阻擋 [Pages 44716040511](https://github.com/JasonLn0711/kairos-learning/actions/runs/44716040511)。[SvelteKit DoS 公告](https://github.com/sveltejs/kit/security/advisories/GHSA-3r8g-jcqq-3p5j) · [SvelteKit 3 遷移指南](https://svelte.dev/docs/kit/migrating-to-sveltekit-3)
- `1c2890aa` 更新 AASE 工作坊。直接依賴為 Streamlit 1.67.0、pytest 9.2.0，間接依賴包含 Pillow 13.0.0 和 PyArrow 26.0.1。鎖檔含下載雜湊並隨 33 個檔案打包。ZIP SHA-256 為 `8701aad6613f43e12782725326e68d94f6755d0f2818069ea66a71bdcc427f11`。
- `9d201252` 在 PR 與 Pages 流程保留 JavaScript 高風險閘門，加入工作坊鎖檔稽核，並以完整 commit SHA 固定 Actions。

## 發布前實測

- 凍結安裝及 `pnpm audit` 完成，JavaScript 公告 0 則。型別檢查 0 錯誤、0 警告，428 項單元測試和 6 項共享 HTML 驗證通過。內容、隔離工作樹的草稿及未到期發布閘門和完整 release 驗證通過。
- 比較升級前後的靜態建置，共 414 個 HTML 路徑，搜尋索引、sitemap 和 robots 檔案位元組一致。去除 Svelte 產生的 HTML 註解和雙語工作坊頁的下載雜湊後，所有頁面主體一致。
- Linux ARM64、Python 3.11／3.12 各以雜湊鎖檔安裝，各通過 49 項工作坊測試，已安裝套件和鎖檔掃描均回報 0 則已知漏洞。瀏覽器通過兩次切片、參考解答和從新 ZIP 解壓的 M08-04 範例，讀取實際下載的 JSON，並驗證輸入變更後的下載失效。
- AASE 瀏覽器套件 46／65 通過。19 個失敗逐一在 `d96ac02b` 重現，相同頁面及失敗類型為 6 個 768px 可讀性檢查、13 個教材文字斷言。網站功能另驗證雙語、鍵盤、搜尋、錯題更正與重新整理、無 JavaScript 教材與 MATLAB 返回連結。

## 正式站回讀

- [Pages 44726035081，attempt 1](https://github.com/JasonLn0711/kairos-learning/actions/runs/44726035081) 成功。部署來源為 `9d201252c9bd76c7f996b8f4e896e00d193cdca7`，GitHub deployment ID `7940204713`。上次成功部署為 `08e921c4` 的 [Pages 43693970005](https://github.com/JasonLn0711/kairos-learning/actions/runs/43693970005)。
- [正式站](https://learn.cs-kairos.com/) 首頁與雙語深層教材為 HTTPS 200，測試用缺頁為 404，搜尋索引與本機產物一致。雙語工作坊頁均指向新雜湊，實際下載的 ZIP、雜湊檔與內含的依賴鎖檔一致。六份 MATLAB ZIP 雜湊及抽查的舊案例頁原始位元組也一致。
- 正式站 Chromium 驗證通過雙語、搜尋、鍵盤、錯題更正、MATLAB 返回與無 JavaScript 教材。Cloudflare 插入的 Insights beacon 在 7 次載入中被既有 CSP 阻擋，其餘受測頁面無應用程式主控台錯誤。舊 MATLAB 頁沿用原有防護範圍。
- 工作坊安裝與瀏覽器驗證以 Linux ARM64 執行，Windows、macOS 和實體裝置未驗。疑似憑證的檢查範圍隨發布驗證器，Git 歷史與組織設定未掃描。
