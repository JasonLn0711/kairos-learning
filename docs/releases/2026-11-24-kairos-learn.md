# Kairos Learn 互動學習工作區正式發布

中英文互動首頁、HTTP 課頁及 AASE M02 六章共用「Kairos Learn」品牌連結。可及名稱引用畫面上的品牌字樣，並依語系補上首頁用途。兩個語系各自連回對應首頁。[中文入口](https://learn.cs-kairos.com/interactive/) · [英文入口](https://learn.cs-kairos.com/en/interactive/)

正式來源為 `58c7d3ef7ab8dfdccfd2e2e329b25eda6576a57a`。GitHub Pages 第一次嘗試通過建置與檢查，上傳後部署步驟未讀到成品。REST API 確認成品存在且未過期；同一來源第二次嘗試以 `github-pages-2` 部署成功。[本次部署](https://github.com/JasonLn0711/kairos-learning/actions/runs/45344826367/attempts/2) · [前一個成功版本 e6495938](https://github.com/JasonLn0711/kairos-learning/actions/runs/45158413361)

- 本機型別檢查零錯誤、零警告；靜態驗證通過 512 個 HTML 頁面及 1,062 個原樣資產。
- 正式 HTTPS 讀回 16 個中英文工作區入口，逐頁確認頂欄名稱、可及名稱、連結目的地及分鏡切換。
- 中文首頁在 320、390、768、1280 CSS px 保持視窗寬高；英文首頁停用 JavaScript 仍呈現品牌。
- 核對公開首頁、AASE 原課頁、MATLAB 入口、遺失頁面 404、下載檔 SHA-256 及互動頁樣式表位元組。
