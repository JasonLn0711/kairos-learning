# M07-01 供稿抽換對照

狀態：原始材料與前版已保存；雙語九節正文、四圖及正式站回讀均完成，證據見發布回執。

正本為本目錄 `pasted-text-1.txt` 及 `image-1.png`–`image-4.png`；`previous-lesson.json` 保存編輯前 v1.0.2／revision 3，原發布日 2026-11-05。`SHA256SUMS` 僅記原始附件與前版，成稿採用狀態另行驗證。完整教材與驗證證據由 kairos-learning 持有。

| 供稿章／小節 | 正文規劃錨點 | 須完整保留的教學 |
| --- | --- | --- |
| 一、這一課到底在教什麼 | start | Excel 上傳案例、六個環境問題、啟動與功能完成的區別 |
| 二、餐廳比喻 | analogy | 八組對照、店面／爐具／食材到料理與驗收的推論 |
| 三 1、專案目錄 | layers | 完整目錄樹、七項用途表、錯誤路徑例子、POSIX 與 PowerShell 定位命令 |
| 三 2、直譯器 | layers | 3.10／3.11／3.12、多版本、版本與 sys.executable 的不同證據 |
| 三 3、虛擬環境 | layers | 三個平行專案、更新套件干擾、venv 命令、套件隔離與沙箱界線 |
| 三 4、依賴 | layers | Streamlit／pytest／pandas 用途、兩固定版本、間接依賴與跨平台限制 |
| 三 5、工具鏈 | layers | 六項工具分工表、Coding Agent 與 Python 的角色區分 |
| 四、操作總覽 | commands | Python 3.11／3.12、Streamlit 1.51.0、pytest 8.4.2、五步流程 |
| 四 1、建立與啟用 | commands | 原 POSIX 命令、直譯器確認、PowerShell 政策與直接呼叫替代路徑 |
| 四 2、安裝 | commands | python -m pip 及其環境一致性理由 |
| 四 3、安裝結果 | commands | 三版本命令、pytest --version 與執行測試的區別 |
| 四 4、啟動 | commands | 完整命令、三個參數意義、loopback、骨架預期 |
| 四 5、停止 | observe | Ctrl+C、deactivate，服務與 shell 環境分開 |
| 五、診斷 | diagnosis | 六列排查表、物流公司 ModuleNotFoundError 例、依層排查 |
| 六、Agent 紀律 | gates | 醫院預約案例、最小修改、三道 G1/G2/G3 證據表與待驗狀態 |
| 七、成果 | misread | environment-notes.md 六部分完整模板、不提交或搬移 .venv |
| 八、四個重點 | recap | 位置、環境、分開驗證與證據，工程判斷的收穫 |
| 九、理解檢核 | understanding | 學校成績管理案例、三題所有原選項、解析、M07-02 銜接 |

## 編輯處理

- 原稿網址更正前言與搜尋來源卡／favicon／圖片搜尋代理連結保存在原始層；成稿移除網頁擷取雜訊。章節使用原正確 M07 路徑。
- image-1 的兩張情境照片提供比喻方向；重製以可選取的 HTML 對照及圖示表現餐廳與軟體角色，照片不另轉載。
- image-2 的三個環境是平行關係，手機堆疊仍保留各專案名稱與版本，不以箭頭串成步驟。
- image-3 的五項是有順序的操作流程，不能把 G3 功能驗收寫成骨架啟動的結果。
- image-4 是跨平台命令呈現參考。原稿只給 POSIX 區塊；成稿補上 PowerShell 實際命令及不啟用腳本的替代路徑。兩平台直接可讀，避免假頁籤。
- 原稿「提交答案並取得解析」缺少實際互動規格，採既有原生參考答案，不建立假提交或進度。
- 原六個錨點 start／analogy／layers／commands／observe／misread 保留；新增章節另外命名。正文 revision 4／v1.1.0、修訂日 2026-11-11，原發布日 2026-11-05 保留。

## 官方查核（2026-11-11）

[Python 3.12 venv](https://docs.python.org/3.12/library/venv.html) 確認獨立套件、啟用及無須啟用的直譯器路徑，以及不提交／不搬移 venv。

[pytest 執行方式](https://docs.pytest.org/en/stable/how-to/usage.html) 確認版本查詢與測試執行的不同用途。工作坊版本為既定教學組合，沒有宣稱最新版本。

## 維護時的驗證順序

完成兩語逐小節正文及四圖語意對照 → 原生 HTML 與 SVG 同源 → 內容／型別／單元／發布閘門 → 四尺寸、200%、無 JavaScript、鍵盤與下載 → 限定本次變更提交推送部署 → 正式頁及圖檔回讀。現有其他章節 dirty 修改保留。


## 成稿與圖解正本

`teaching.zh.md`／`teaching.en.md` 逐章與逐小節對應；`scripts/aase_m0701_content.py` 保留九節、四張表（另以圖 1 承接原八列對照）、五個概念與五步操作。舊 observe 錨點落在步驟 5；其餘五個舊錨點沿正式 section 保留。原有三題 Q01–Q03 保存在前版；供稿三題使用 Q04–Q06 原生參考解析，原選項完整保留於第九節。

圖 1：8 列餐廳／軟體角色配對，照片改為受審核裝飾 SVG 圖示；圖 2：3 張平行環境卡；圖 3：5 步流程及 4 支順序箭頭；圖 4：2 條替代平台路徑，寬版雙欄、窄版直向，程式碼局部鍵盤捲動。下載圖 4 以直向雙區保留程式碼可讀性，與 HTML 使用同一資料。

原始程式碼與六組 environment-notes 範本保留相同 bytes，英文正文另外逐項解釋全部模板欄位。新增 PowerShell 命令與原碼分開記錄；實測平台與未驗平台見[發布回執](../../../../releases/2026-11-11-aase-m07-01-replacement.md)。

規則依 WRITE-05、09–11 逐節核對；正文與四圖檢查依 HTML-01–04、FIG-01–06、A11Y-01–03。可重建檢查為兩個產生器 `--check`、`tests/aase-m0701-replacement.test.ts` 與 `playwright.aase-m0701.config.ts`。


[正式發布及實測回執](../../../../releases/2026-11-11-aase-m07-01-replacement.md)記錄 PR #109、成功部署、兩語全文／八圖正式回讀、Python 3.11／3.12 執行與待驗範圍。
