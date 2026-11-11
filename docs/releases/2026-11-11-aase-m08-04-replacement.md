# M08-04｜AppTest 完整供稿抽換與三圖

本次完成供稿導言與九節的完整雙語正文、三個實作步驟、四張表、五個程式／指令區、三道四選題及三張原生重排圖。目前內容為AASE-M08-C04 v1.1.2／revision 6（保留v1.1.0及v1.1.1發布紀錄，補上200%文字的品牌換行與跳至內容連結修正）；原發布2026-11-05保留，修訂2026-11-11。原有URL、六個錨點及三個題目概念ID保留。

[原文與逐節對照](../sources/aase/m08-04/replacement-2026-11-11/source-map.md)記錄三個PNG、前版、原始文字、SHA256SUMS、中英文成稿、技術修正及視覺差異。文章正本、程式與驗證由kairos-learning持有；本次只修訂M08-04及其共用渲染分支、專屬驗證與工作坊包，其他課次的既有工作保留。

## 採用內容與實作

供稿中的銀行四步錯誤、餐廳三規則及五次操作、五層測試比較、三階段資料與過期狀態、六個術語與購物車比喻、完整app及測試、五項語法、回歸測試例子、五產業比較、四誤解及A/B授權案例都進入正文。原稿的黏行／截斷程式保留原件，成稿補齊並實跑；不將來源的「尚未執行」沿用為本輪狀態。favicon、搜尋導航殘留移出正文，來源查核另記錄。

`python3 scripts/aase_m0804_content.py --check`核對完整稿件、共用範例與正式JSON。`resources/aase/examples/m08-04/app.py`和`tests/test_app.py`同時顯示在兩語正文並納入既有工作坊ZIP；以`python3 scripts/package-aase.py --check`驗證bytes與checksum。程式以合成資料示範規則、狀態與下載，沒有引入正式收件或審批服務。

圖1呈現輸入→run()→assert，寬版橫向、窄版向下。圖2保留三階段及所有欄位值，橘／綠／中性色搭配文字標示缺漏、成功及再次清空。圖3為五項語法清單，不加順序箭頭。`AppTestDiagram.svelte`的HTML、搜尋與六份SVG共用受限制的ConceptVisual；`aase.ts`拒絕錯誤位置、關係、項目數與額外標記。`aase_m0804_svg.py`限制匯出元素／屬性、小於100000 bytes，`--check`核對同步。

三題保留供稿全部選項與答案B／C／D，依既有概念對應Q01／Q03／Q02。採原生details參考解析，不新增虛假提交、分數或學習完成紀錄；qa保持空陣列。

## 規則與驗證範圍

WRITE-01–06、08–11：保留原文與舊版、逐節對照、完整雙語教學、版本與日期、主張及能力邊界。WRITE-07沿既有品牌署名。

HTML-01–04、FIG-01–06、A11Y-01–03：語意HTML、可選取文字、容器重排、具名稱的表格／程式局部捲動、固定SVG下載、原生答案與鍵盤。INT-01不新增參數模擬器，本次沒有需要調參的計算問題。

本機驗證（Linux／Chromium，2026-11-11）：

| 層次 | 命令或觀察 | 實測結果 |
| --- | --- | --- |
| 來源保存 | SHA256SUMS及附件cmp | 原文、三圖、前版保持保存時位元組 |
| 同源產生 | content／svg產生器--check | 雙語稿、共享程式、JSON及六SVG一致 |
| 程式 | Streamlit 1.51.0／pytest，三階段 | 1 passed；成功狀態與完整JSON正確，輸入變更清除舊報告 |
| 回歸敏感性 | 只在副本移除on_change回呼 | 第三階段assert not at.success按預期失敗；原程式1 passed |
| 真實app | 127.0.0.1:8584，check-aase-m0804-example.mjs | 三階段、report.json檔名與完整JSON、Enter／Space／Tab／Shift+Tab通過 |
| 單元 | pnpm test | 初輪324／324，保留並行版本合併後339／339通過；新測試含圖解無效資料拒絕及發布閘門 |
| 型別 | pnpm run check | 0 errors／0 warnings |
| 靜態HTML契約 | python3 -m unittest discover -s scripts -p test_validation_html.py | 6／6通過 |
| 依賴 | pnpm audit --audit-level=high | 通過high門檻；4項既有low |
| 發布邊界 | node scripts/check-publication-boundary.mjs | draft／future、英文課程閘門通過；fixture移除並乾淨重建 |
| 靜態發布 | pnpm run validate:release | 通過全站靜態頁、連結、CSP、資產、既有下載及教材檢查 |
| 文章瀏覽器 | playwright.aase-m0804.config.ts | 中英2／2通過；全文及順序、四表、五程式區、三題全部解析、四寬度／200%、無JS、鍵盤、搜尋、六SVG與工作坊下載 |

文章瀏覽器包含320／390／768／1280 CSS px，每一尺寸再以200%根字級檢查無頁面水平溢出、文字至少16px及行高1.7。確認圖1重排後保留相同箭頭端點，圖2一直維持相繼狀態，圖3沒有箭頭。SVG逐份核對文字viewBox邊界、文字互相重疊及下載bytes；目視中文390、英文1280及獨立SVG截圖，沒有裁切或錯誤連線。

細部截圖、原始測試輸出及Python環境在隔離工作樹`.local/aase/m0804/`；[機器可讀摘要](2026-11-11-aase-m08-04-checks.json)保留各層實測及資產雜湊。發布前新增範例使工作坊ZIP增加兩份檔案，包內容與checksum同步，沒有改動原三個切片。

重現程式驗證：使用獨立虛擬環境安裝`streamlit==1.51.0 pytest`，執行`python -m pytest -q resources/aase/examples/m08-04/tests/test_app.py`。真實app以`python -m streamlit run resources/aase/examples/m08-04/app.py --server.headless true --server.address 127.0.0.1 --server.port 8584 --browser.gatherUsageStats false`啟動後，執行`node scripts/check-aase-m0804-example.mjs`；完成後停止自己啟動的服務。

## 發布與待驗

初次本機驗證階段曾將Git與正式站保留待驗；後續各版發布與回讀已記錄於下方。正式回讀使用`AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0804.config.ts`，必須核對同版全文與全部資產後才完成。

實體手機、完整螢幕閱讀器、真人理解與學員實作接受仍是獨立待驗層。本課AppTest、真實瀏覽器及文章驗收各自記錄，不宣稱正式收件系統、安全控制或學員已通過。

## 合併後驗證

來源提交8484645、正文與驗證提交9a2d82b、保留並行M06／M07版本的合併cadbac6。合併時保留各課次渲染、資料驗證、歷史遷移測試及撰稿指南。M08-04原生清單分支在衝突合併時漏接，新增瀏覽器斷言確實偵測到銀行四步及餐廳三規則／五步操作未成為ol／ul；修復本課分支後重建，中英2／2通過（10.1s），339／339單元及型別零錯誤／警告。六份SVG重新核對幾何與bytes，圖2中文圖說的末尾孤立標點也已調整換行。原工作目錄無關修改未攜入隔離工作樹。

最後整合保留M06-01／M06-03／M08-01／M08-06並行修改；課程目錄標題更新使工作坊ZIP需由整合後來源重新產生，仍為32份檔案且包含本課兩個範例。整合後348／348單元、型別零錯誤／警告、正式建置、靜態發布及中英瀏覽器2／2（6.9s）通過。表格與程式碼另套本課16px／行高1.8，擴充檢查涵蓋th／td／code及200%字級；原生清單仍由專屬DOM斷言保護。發布前最近成功Pages為run42991324344（6810cac8），保留為回復定位。

## v1.1.0 正式發布與下載入口核對

[c081a4d](https://github.com/JasonLn0711/kairos-learning/commit/c081a4d621a8b065e77d1577b917438f07468df1)已推送main，當次fetch確認0 0。該排隊run42992805312取消，後續main的11844c3a包含本次提交（merge-base祖先檢查通過），[Pages run42992845088](https://github.com/JasonLn0711/kairos-learning/actions/runs/42992845088)全部品質閘門與部署成功：Node24上375／375測試、型別零錯誤／警告、發布邊界及靜態發布均通過。

正式站初輪中英全文、圖解、四表、五程式區、鍵盤、無JS、搜尋與六SVG都通過；最後的工作坊裸網址bytes檢查發現CDN仍回傳30檔舊包。部署來源與CI證明新包32檔且含本課app/test，回應頭cf-cache-status:HIT、age:585、cache-control:max-age=14400指出舊快取。既有AaseWorkshop本來就使用`?sha256=6808d0ca4f7c6fb97a6fd1ec099203a6b0bba7dd0a511a7a5a4ff90e77673b35`連結；測試改為實際走中英文工作坊入口、核對連結雜湊、請求ZIP／checksum，再用鍵盤Enter下載並逐bytes比較。中英2／2通過（18.1s）；原本下載流程無須修改，未清除或改動Cloudflare設定。裸網址舊快取的觀察保留，不把它寫成新入口的下載失敗。

## v1.1.1 的200%文字修正

進一步將正文固定px字級與根字級一起放大到200%，發現320px時頁面scrollWidth為352px。定位證明唯一頁面外溢來源是品牌連結的`white-space:nowrap`，圖解／正文沒有頁面級外溢；表格寬度留在具名稱的局部捲動容器。只把品牌的white-space改為normal後，頁面寬度回到320px，品牌可自然換行，沒有縮小文字或隱藏內容。已保存實際發布的`published-1.1.0.json`及SHA256，以v1.1.1／revision5記錄這次閱讀修正，原發布日保持2026-11-05。

增強後的本機驗收375／375單元、型別零錯誤／警告、建置及靜態發布通過；中英瀏覽器2／2（8.8s）在四尺寸同時測正文與根字級200%、頁面無水平溢出、三圖／表格／程式碼重排及實際版本化下載。320px／200%的頁首截圖也已保存。本段記錄v1.1.1發布前狀態；後續正式回讀見下一節，v1.1.0的正文及下載入口證據維持歷史觀察。

## v1.1.1 正式回讀與v1.1.2最後修正

[0cc6a84](https://github.com/JasonLn0711/kairos-learning/commit/0cc6a84af2440b0997b1ce9c29a07fae194ebbbc)推送後fetch確認0 0，[Pages run42994431459](https://github.com/JasonLn0711/kairos-learning/actions/runs/42994431459)成功；Node24上375／375與型別零錯誤／警告。2026-11-11 17:24（Asia/Taipei）正式站中英2／2通過（20.7s），包含v1.1.1全文、三圖六SVG、實際正文200%與版本化ZIP鍵盤下載。

目視200%英文頁首截圖時另發現：既有「Skip to content」以固定top:-100px隱藏；文字放大後連結高度超過100px，未取得焦點時露出下半段，覆蓋品牌。v1.1.2把隱藏位置改為top:0加translateY(-100%)，取得焦點時top:1rem及transform:none；依連結自身高度隱藏，保留鍵盤入口。前版v1.1.1由提交c65a95a及部署0cc6a84保留，沒有重寫發布歷史。

新增斷言在四尺寸／兩種字級核對未聚焦跳轉連結完全位於畫面外，並從全新頁面用Tab找到連結、Enter跳到#main且正文取得焦點。兩語本機375／375單元、零型別錯誤／警告、建置、靜態發布及瀏覽器2／2（9.7s）通過；200%英文截圖不再出現浮出的連結文字。本段記錄v1.1.2發布前狀態；正式回讀見下節，不將先前通過的斷言擴大為未涵蓋的目視驗收。

## 最終正式發布與完成核對

[d959621](https://github.com/JasonLn0711/kairos-learning/commit/d959621aebd68968aa2436edffb08a47b4a6eda8)推送main後fetch確認0 0。[Pages run42995356302](https://github.com/JasonLn0711/kairos-learning/actions/runs/42995356302)成功部署該確切來源；CI為375／375測試、型別0 errors／0 warnings，內容、發布邊界、靜態發布、下載校驗及artifact可見性全部通過。

2026-11-11 17:32（Asia/Taipei）觀察正式回讀結果：`AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0804.config.ts`中英2／2通過（18.7s）。[繁體中文M08-04](https://learn.cs-kairos.com/courses/aase/v1/m08/concepts/m08-04/)與[English M08-04](https://learn.cs-kairos.com/en/courses/aase/v1/m08/concepts/m08-04/)均為v1.1.2，原發布與修訂日期正確；逐節全文與順序、原生清單、四表、五程式區、三題全部選項與解析、三圖與六SVG、搜尋、導航、無JS、局部鍵盤捲動及實際雜湊版工作坊鍵盤下載全部核對。

四尺寸320／390／768／1280及200%根字級與正文同時放大均無頁面橫向溢出。未聚焦跳至內容連結在畫面外，Tab可顯示該連結，Enter跳到#main且正文取得焦點；目視正式站兩語200%頁首截圖，沒有浮出的Skip文字或品牌重疊。SVG逐份下載bytes與受限模型匯出一致，文字在viewBox內且沒有互相重疊。工作坊由既有帶SHA-256的連結下載32檔新包，檔案bytes與本次來源包完全相同。

來源保存、完整雙語抽換、三張圖解、可執行範例與回歸敏感性、Git歷史保留、正式部署及正式站回讀均已完成。原稿與三圖仍以SHA256SUMS及附件逐檔回比；前版1.0.2、發布版1.1.0及1.1.1／1.1.2提交歷史分別保存。頁首修正屬共用樣式，本輪逐頁驗收只涵蓋M08-04及兩語工作坊下載入口，不宣稱全站無障礙認證。實體手機、完整螢幕閱讀器與真人理解保持獨立待驗；本次沒有新增學員成績、學習完成或正式收件系統驗收。

機器摘要保留確切部署來源、job／step結果、所有原件與SVG雜湊、版本化下載、三階段與變異測試、兩次目視修正及最終正式站測試資料。細部截圖與原始輸出位於隔離工作樹`.local/aase/m0804/`，原工作目錄的無關修改保留。
