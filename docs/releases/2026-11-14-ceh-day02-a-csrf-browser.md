# Day02-A｜瀏覽器、Session 與 CSRF 完整精讀

## 正文與來源

Day02-A由v1.2.0升為v1.3.0／revision 5，沿原發布日2026-11-14、13章及有效錨點；本次完整插在既有CSRF核心原理之後。使用者詢問為什麼網頁沙盒仍允許CSRF，以及瀏覽器／伺服器怎麼交換Session；正文完整回答發起請求、附帶憑證、讀取回應、Server驗證及實際操作的不同責任。

[來源與逐節採納](../sources/ceh-day02-a/2026-11-14/csrf-browser/README.md)保存原稿、八PNG、前版、680個非空行採用、44標題及六項程式修正。14節、30小節、24程式／HTTP／偽碼、13表、八圖、六項觀察清單與五道整合題完整進正文；24片段中兩段HTTP由圖11承接，13表中兩表由圖14／15承接。保留例子、推導、條件、限制及五題未公布答案，不以數量或附件代替正文。

WRITE-09–13、15：舊正文逐區塊依序保留，公開用一般語氣，原稿另存；概念缺口診斷標示為根據提問的教學判讀，仍需觀察與回答確認。原稿的假進度及提交／批改文字改為靜態清單與未答題。補明登出／逾時、Cookie不以Port隔離、__Host-限制、瀏覽器保留標頭及預檢不附Cookie；四個Set-Cookie標頭、偽碼及表單編碼修正可追溯。

## 八圖關係與來源差異

FIG-03–07：圖9保留兩網頁平行與Browser內含Cookie／Network；圖10為兩端並列分工；圖11保留完整HTTP往返；圖12用具名起訖交代Set-Cookie與Cookie相反方向。圖13有三角色、五步箭頭右／左／右／右／左與虛線生命線，窄欄改具名訊息清單，Cookie不交給惡意網頁。圖14的四URL／兩判斷欄及圖15的四情境／三政策欄保留每格，空白原文格依PNG補回勾叉及文字。圖16保留五步與拒絕條件。八圖同源純文字模型、原生HTML／容器重排及受審核SVG；不加入任意標記、外部圖形服務或假複製按鈕。

## 核心機制實驗

CODE-01：`PLAYWRIGHT_CHANNEL=chrome node scripts/check-day02a-csrf-mechanism.mjs`已以Chrome157.0.8103.79實跑本機HTTPS fixture；只綁127.0.0.1，測試網域bank.example.test／promo.example.test／evil.other.test由該瀏覽器本機解析，沒有對外銀行或真實帳戶。直接取正式表單及include Fetch，只替換目的地及fixture Token。

- 顯式Strict／Lax／None於同Site POST、跨Site頂層GET／POST及圖片GET的12格全部符合圖15前提。
- HttpOnly無法由銀行或同Site其他Origin的document.cookie讀出；後者仍可誘發帶Strict Cookie的請求。缺Token回403且不執行，合法表單帶Token則接受。
- 預設跨來源Fetch不帶Cookie；include簡單請求帶None已到伺服器並觸發合成動作，發起程式卻因CORS無法讀回應。
- 非簡單Fetch只送無Cookie的OPTIONS；伺服器拒絕後，沒有實際POST。

這是特定Chrome、乾淨context及政策下的合成證據，不外推至所有瀏覽器、隱私設定或正式金融系統。私鑰／憑證及隨機Token只在忽略的.local/day02a-csrf，公開結果只記Cookie名稱及狀態，不保存憑證值。靜態教材不會執行示意轉帳。

## 本機及發布驗收

單元420／420通過；新增兩測試檢查逐行完整性、舊正文、圖解非法資料拒絕與八原圖SHA。型別檢查已修復測試的可選id縮窄及鍵盤捲動區域標註，最後0 errors／0 warnings。新增內容及圖檔由原`ceh_day02a.py --check`承接既有release；沒有依賴升級或移除舊閘門。

HTML-01–04、A11Y-01–03：初次整頁瀏覽器13項通過，四尺寸320／390／768／1280、JS開關、320px 200%、鍵盤及16圖下載／文字幾何核對；八新圖桌面及390px截圖已逐張目視。兩段HTTP下載圖另保留標頭與body間的空白行；最終版加入登出／Port等說明及SVG空白行後，再跑13項整頁檢查全部通過；新增圖解的分組、五箭頭、資料格、HTTP與Token步驟數亦由同一檢查核對。發布回讀依下節補記。PNG來源本身不受公開SVG小於100000 bytes限制；所有產生SVG仍受此限制。

PUB-02：真實draft／future隔離通過，包含本頁路由、搜尋、payload與導覽排除；fixture已還原，正式產物重新建置。最終版完整release、內容驗證、六項HTML契約、三份文件連結與八份來源JSON檢查均通過。PUB-01正式站回讀仍待部署。未把頁面檢查當成讀者已學會、真實交易成功或全站完整無障礙認證。
