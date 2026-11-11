# M07-01｜環境、專案骨架與工具鏈：白話完整教學

AASE · M07 AI Coding Agent 協作實作｜第一單元

## 一、這一課到底在教什麼？

先記住一句話：

寫程式之前，先確定程式要在哪裡執行、需要哪些工具，以及怎麼證明它真的可以運作。

這就叫做建立「開發環境」（Development Environment）。

假設你告訴 AI：

「請幫我開發一個系統，讓員工上傳 Excel，檢查資料是否完整，最後輸出報告。」

AI 很可能可以快速寫出幾百行程式碼。

但接下來會遇到幾個問題：

- 程式碼放在哪個資料夾？
- 電腦有沒有安裝 Python？
- 需要安裝哪些套件？
- 為什麼 AI 的程式在另一台電腦可以跑，在你的電腦卻不能跑？
- 網頁成功開啟，是否就代表系統已完成？
- AI 說測試成功，你要如何確認它真的執行過測試？

本課就是教你解決這些問題。

最重要的觀念：環境建置成功，不等於功能開發完成；程式能啟動，也不等於系統符合需求。

## 二、用開餐廳理解整個軟體開發環境

假設你想開一家牛肉麵店。

| 餐廳      | 軟體開發                        |
| ------- | --------------------------- |
| 店面位置    | 專案資料夾（Project Directory）    |
| 廚房與爐具   | 執行環境（Runtime Environment）   |
| 食材清單    | 依賴套件（Dependencies）          |
| 獨立料理工作臺 | 虛擬環境（Virtual Environment）   |
| 餐廳基本裝潢  | 專案骨架（Starter Project）       |
| 廚師與料理機具 | 開發工具與 Coding Agent          |
| 實際煮出牛肉麵 | 功能實作（Implementation）        |
| 試吃與衛生檢查 | 測試及驗收（Testing & Acceptance） |

這個比喻要告訴你：

你租好了店面、買好了爐具、準備好了食材，並不代表你已經煮出一碗好吃的牛肉麵。

同樣地，安裝好 Python、開啟網頁、看到程式畫面，都不代表軟體已經完成。

這也是為什麼我們要把「環境準備」、「功能實作」和「功能驗收」分開處理。

## 三、認識五個最重要的技術概念

### 1. 專案目錄（Project Directory）：你現在站在哪裡？

電腦裡可能有這樣的資料夾；`.venv` 在建立環境後才會出現：

```
my-project/
├── README.md
├── requirements.txt
├── starter/
│   └── app.py
├── slices/
├── reference/
└── .venv/                 # 建立環境後才會出現

```

這裡每一項都有用途：

| 名稱                 | 白話說明              |
| ------------------ | ----------------- |
| `README.md`        | 使用說明書，告訴你怎麼安裝、啟動  |
| `requirements.txt` | 需要安裝哪些 Python 套件  |
| `starter/`         | 已準備好的程式起始骨架       |
| `app.py`           | 範例應用程式的入口         |
| `slices/`          | 工作坊分階段實作的材料       |
| `reference/`       | 工作坊參考資料           |
| `.venv/`           | 專案自己的 Python 虛擬環境 |

最容易犯的錯，是以為打開某個檔案，就代表終端機也進入了那個資料夾。

其實完全不是。

你可以在編輯器看到 `app.py`，但是終端機卻在另一個資料夾。

這時執行：

```
python -m pip install -r requirements.txt
```

電腦就可能回報：

`Could not open requirements file`

因為它在錯誤的位置尋找檔案。

所以第一步永遠是確認目前目錄。

```
pwd
ls
```

這是 Linux、macOS 常見的指令。在 Windows PowerShell，可使用 `Get-Location` 和 `Get-ChildItem`。

### 2. Python Interpreter：真正執行程式的是誰？

Python 是一種程式語言，而 Python Interpreter（直譯器）是讀取並執行 Python 程式的軟體。

你的電腦可能同時裝有：

- Python 3.10
- Python 3.11
- Python 3.12

就像一家工廠可能有不同年代的生產機器。

如果程式要求 Python 3.12，卻拿 Python 3.10 執行，就可能因為語法或套件相容性而出問題。

先檢查：

```
python --version
```

再確認實際使用哪一個 Python：

```
python -c "import sys; print(sys.executable)"
```

第二個指令尤其重要。它會顯示 Python 執行檔所在的位置。

版本相同，不代表你正在使用同一個 Python 環境。

### 3. 虛擬環境（Virtual Environment）：讓各專案使用自己的套件

這是本課最核心的技術觀念。

假設你同時開發三個系統：

醫院影像分析系統

Python 3.11 + 一組經過驗證的 AI 套件

餐廳庫存管理系統

Python 3.12 + 另一組資料處理套件

學校作業管理系統

Python 3.12 + Web 與測試套件

各自管理套件，避免互相干擾

同一部電腦，也能有多個相互獨立的專案環境。

如果三個專案共用同一組套件，更新餐廳系統使用的套件時，可能意外讓醫院系統發生相容性問題。

Python 的 `venv` 就是解決這種問題的方法之一。

```
python -m venv .venv
```

這行指令的意思是：

「請使用目前的 Python，在這個資料夾建立一套獨立的 Python 環境，名稱叫 `.venv`。」

它隔離的主要是 Python 套件與其執行環境。

但注意：虛擬環境不是安全沙箱（Security Sandbox）。 它不會自動阻止程式讀取其他檔案、連接網路或操作系統資源。要限制 Coding Agent 的權限，仍需要另外設計隔離和授權機制。

### 4. Dependencies：程式需要借助哪些外部工具？

當你開發一個網站，不一定要親自寫出所有功能。

例如：

- 想做網頁介面，可以使用 Streamlit。
- 想寫自動化測試，可以使用 pytest。
- 想處理資料表，可以使用 pandas。

這些別人已經寫好的工具，在 Python 世界中通常稱為套件（Packages）。

你的程式需要依靠它們才能運作，因此稱為 Dependencies（依賴）。

例如 `requirements.txt` 可以寫：

```
streamlit==1.51.0
pytest==8.4.2
```

這是本課工作坊指定的兩個直接依賴版本。

其中 `==` 表示要求特定版本。

但要注意，即使寫死直接依賴的版本，也不一定鎖住所有間接依賴，更不保證跨作業系統完全一致。

### 5. Toolchain：開發需要哪些工具協同工作？

Toolchain（工具鏈）就是把不同用途的工具串在一起，讓它們共同完成開發工作。

| 工具           | 主要工作               |
| ------------ | ------------------ |
| Python       | 執行應用程式             |
| pip          | 安裝及管理 Python 套件    |
| Streamlit    | 建立互動式網頁介面          |
| pytest       | 執行自動化測試            |
| Git          | 管理程式碼版本與變更         |
| Coding Agent | 協助讀寫程式、修改檔案、呼叫授權工具 |

可以把 Coding Agent 想成一位會使用工具的工程師。

但工程師能操作電鑽，不表示電鑽本身就是工程師；Coding Agent 會執行 Python，也不表示它取代了 Python。

## 四、實際操作：從零啟動一個 Python 專案

這部分直接使用教材中的 Streamlit 工作坊作為範例。教材指定 Python 3.11 或 3.12、Streamlit 1.51.0、pytest 8.4.2。

標準操作流程

1. 找到正確的專案根目錄

   確認 README、requirements.txt、starter 在預期位置。
2. 建立並啟用虛擬環境

   確認使用的是符合要求的 Python。
3. 安裝依賴套件

   確認安裝命令成功結束。
4. 啟動程式

   瀏覽器實際顯示起始骨架。
5. 停止並留下證據

   正確結束服務，記錄成功、失敗與尚未驗證的項目。

### 步驟 1：建立與啟用虛擬環境

### Linux / macOS

```
# 在工作坊根目錄執行
python3 --version

# 確認為 Python 3.11 或 3.12 後建立環境
python3 -m venv .venv

# 啟用虛擬環境
source .venv/bin/activate

# 查看目前 Python
python --version
python -c "import sys; print(sys.executable)"
```

### Windows PowerShell

先確認已安裝的 Python 3.11／3.12；下列以 3.12 為例，若使用 3.11，將 `-3.12` 改為 `-3.11`。`py` 是 Windows Python launcher；若未安裝，先依實際 Python 安裝方式找到直譯器。

```powershell
Get-Location
Get-ChildItem
py -3.12 --version
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python --version
python -c "import sys; print(sys.executable)"
```

若無法啟用，仍可直接操作同一個虛擬環境：

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m streamlit version
.\.venv\Scripts\python.exe -m pytest --version
.\.venv\Scripts\python.exe -m streamlit run starter/app.py --server.address 127.0.0.1
```

如果 Windows PowerShell 因安全政策禁止執行啟用腳本，先查明原因，不需要為了方便就放寬安全政策；也可以直接指定虛擬環境內的 Python 執行檔。

### 步驟 2：安裝需要的套件

```
python -m pip install -r requirements.txt
```

為什麼用 `python -m pip`，而不是只寫 `pip`？

因為前者會使用目前選定的 Python 去執行 pip，比較容易避免把套件安裝到另一個 Python 環境。

### 步驟 3：確認安裝結果

```
python --version
python -m streamlit version
python -m pytest --version
```

這裡有一個非常重要的細節：

查看 pytest 版本，不等於執行過測試。

執行 `python -m pytest --version` 只證明目前 Python 能呼叫 pytest 並顯示版本。

未來若要真正執行測試，通常才會使用：

```
python -m pytest
```

而且還要確認專案裡有適當的測試案例，並檢查實際測試結果。

### 步驟 4：啟動網頁

```
python -m streamlit run starter/app.py --server.address 127.0.0.1
```

這段指令的意思是：

- `python -m streamlit`：用目前的 Python 執行 Streamlit。
- `run starter/app.py`：啟動指定的應用程式。
- `--server.address 127.0.0.1`：讓服務只綁定在本機 loopback 位址。

成功時，終端機通常會顯示可以在瀏覽器開啟的本機網址。

但這個階段只需要確認起始骨架有正常開啟，不應期待已有完整的資料檢核和報表匯出功能。

### 步驟 5：正確停止

在執行服務的終端機按下：

```
Ctrl + C
```

這是停止目前前景服務的常見方法。

如果還要離開虛擬環境，可以再輸入：

```
deactivate
```

停止服務和離開虛擬環境是兩件不同的事。

## 五、遇到問題時，怎麼知道是哪裡出了錯？

下面這張表，是排查問題時非常實用的診斷架構。

| 問題現象                  | 優先檢查             | 不該急著做的事  |
| --------------------- | ---------------- | -------- |
| 找不到 requirements.txt  | 終端機工作目錄          | 亂改程式碼    |
| `python` 找不到          | Python 是否安裝、PATH | 刪除專案     |
| `ModuleNotFoundError` | 是否裝在正確環境         | 重寫整個功能   |
| Streamlit 無法啟動        | 套件、錯誤訊息、連接埠      | 直接宣稱系統完成 |
| 網頁正常，但沒有匯出            | 功能是否實作           | 誤認為環境故障  |
| 測試失敗                  | 測試案例、輸入與實作       | 刪掉失敗的測試  |

例如一個物流公司正在開發出貨管理系統。

AI 完成程式碼後，執行時出現：

```
ModuleNotFoundError: No module named 'streamlit'
```

這通常先表示目前執行程式的 Python 找不到 Streamlit 套件。

合理的排查順序是：檢查正在使用哪個 Python、確認套件是否安裝在該環境、檢視安裝是否失敗。

錯誤發生在哪一層，就優先查哪一層。不要把每個錯誤都當成應用程式邏輯錯誤。

## 六、為什麼 AI Coding Agent 特別需要這套紀律？

因為 AI Agent 可能同時擁有修改程式和執行命令的能力。

假設你要求：

「把這個醫院預約系統做好，順便修復所有錯誤。」

AI 發現測試環境缺少某個套件。

不理想的做法，是直接修改大量程式碼，甚至刪掉測試，然後宣稱問題解決。

比較好的做法，是要求 Agent 先查明環境，再進行最小必要修改。

實務上可把工作分成三道驗收門：

| 驗收門       | 要證明什麼   | 證據         |
| --------- | ------- | ---------- |
| G1 環境成立   | 工具與版本可用 | 安裝結果、版本輸出  |
| G2 程式可執行  | 服務正常啟動  | 啟動畫面、終端機紀錄 |
| G3 功能符合需求 | 實際行為正確  | 測試結果、驗收操作  |

三者不可互相替代。

例如 G1、G2 通過，而 G3 尚未執行，就應如實記錄為「環境與骨架啟動成功，功能尚未驗收」。

這就是 AI 協作工程中非常重要的證據導向開發（Evidence-based Development）。

## 七、最後要留下什麼成果？

教材要求建立 `environment-notes.md`，作為環境與啟動結果的紀錄。

範本分六組記錄：(1) 專案名稱、根目錄與 README；(2) 作業系統、Python 版本與執行檔、Streamlit 與 pytest 版本；(3) 安裝命令、成功／失敗／未執行、退出結果與錯誤；(4) 啟動命令、本機網址、預期與實際畫面、停止狀態；(5) 完成、未實作與未驗證功能；(6) 待處理問題與下一個最小工作。請使用以下完整範本：

```
# Environment Notes

## 1. 專案資訊
- 專案名稱：
- 專案根目錄：
- README 位置：

## 2. 執行環境
- 作業系統：
- Python 版本：
- Python 執行檔位置：
- Streamlit 版本：
- pytest 版本：

## 3. 安裝結果
- 執行命令：
- 成功 / 失敗 / 未執行：
- 結束狀態與錯誤訊息：

## 4. 啟動結果
- 啟動命令：
- 本機網址：
- 預期畫面：
- 實際畫面：
- 是否成功停止服務：

## 5. 功能狀態
- 已完成：
- 尚未實作：
- 尚未驗證：

## 6. 下一步
- 待處理問題：
- 下一個最小工作：

```

不要把 `.venv` 當成備份提交到 Git。應保存程式碼、依賴規格和必要的環境紀錄，讓其他人可以重新建立環境。Python 官方文件也明確將虛擬環境視為可以重建、而非直接搬移的產物。

## 八、今天最需要記住的四件事

1. 找對位置： 確認終端機目前在哪個專案目錄。
2. 用對環境： 確認 Python 版本、虛擬環境及套件。
3. 分開驗證： 套件安裝、程式啟動、功能正確是三件事。
4. 留下證據： AI 說完成不算完成，必須能核對實際執行結果。

這一課的目的不是讓你背熟每一行終端機指令，而是建立一種工程判斷能力：

當 AI 幫你開發軟體時，你能知道它在哪個環境工作、做了什麼、哪些結果已確認，以及哪些事情根本還沒有完成。

## 九、理解檢核

假設你用 AI Agent 開發一個學校成績管理系統。AI 回報：

「Python 套件全部安裝成功，Streamlit 頁面也打開了，但成績統計和 Excel 匯出還沒做。」

問題 1：目前可以宣稱哪個階段完成？

A. 整個系統已完成

B. 環境建置與起始骨架啟動成功

C. 所有功能測試通過

問題 2：如果 Agent 說虛擬環境能阻止程式讀取其他資料夾，這句話正確嗎？

A. 正確，虛擬環境提供完整安全隔離

B. 不正確，它主要隔離 Python 套件環境

問題 3：如果 `pytest --version` 成功顯示版本，可以說自動化測試全部通過嗎？

A. 可以

B. 不可以，還需要真正執行測試並檢查結果

完成判讀後，可在本頁理解檢核區展開三題參考解析；此操作不提交答案或記錄學習進度。

下一個單元 M07-02「用規格約束 Agent 工作」，將進一步處理：環境準備好以後，如何讓 AI 只修改指定檔案、遵守需求規格，並提供可驗證的成果。