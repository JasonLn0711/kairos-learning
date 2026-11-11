# 技術查核與採用界線

查核日期：2026-11-11。來源為供稿、三張 PNG、前版模型與官方文件。

- [Streamlit 1.51.0 st.text_input](https://docs.streamlit.io/1.51.0/develop/api-reference/widgets/st.text_input)：沿本課既有版本，支援 key 與 on_change。本次 Python 依 resources/aase/requirements.txt 安裝 Streamlit 1.51.0，實際 AppTest 驗收另列回執。
- [Session State](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state)：callback 先執行，然後由上到下重跑程式。state 屬使用者 session，不等於資料庫持久保存。本例用 callback 清空 preview；修改提交後先清除結果，再由按鈕重建。
- [Nielsen Norman Group 易用性原則](https://www.nngroup.com/articles/ten-usability-heuristics/)：Visibility of System Status 支持及時明確的回饋；本課以「未檢核」及舊結果失效作為編輯應用，不將此原則視為本作品已通過完整易用性認證。

原稿修正採用：

1. 保留原稿黏在一起的 Python 文字於 original.zh.txt；app.py 補回行距、縮排與註解，加入合成資料／未持久保存的可見說明，維持三欄、允許空白、按鈕產生與 callback 清除預覽的功能。
2. 網頁示範使用瀏覽器 input 事件，每次編輯立即清除；Streamlit 在欄位變更提交時觸發 callback。正文分別交代這兩個驗收時點。
3. 移除正式教材中的 favicon／來源卡片雜訊及對話式網址更正；原件完整保存。正式課次沿原 m07 路由。
4. 原文結尾「我再根據你的答案判斷」轉成可自我核對的三題開放題及原生收合參考解析；不產生學員回答、分數或完成狀態。
5. 原有工作坊 ZIP／教師快照保持其原責任；獨立 app.py 是本課的補充範例，不以本次測試宣稱 Python 可在 GitHub Pages 執行。

圖解差異：圖 1 桌面保留左右比較、三層橫列、三個直向切片與第一切片綠色；手機上下排列比較組，切片各保留自身三層，不建立時間箭頭。圖 2 採原三欄、預設值、單一深色按鈕與初始無結果狀態，增加原生標籤關聯、鍵盤焦點、狀態朗讀及無 JS 靜態例。圖 3 保留四個編號階段及最後一步兩課合併，使用原生有序清單；無新增分支。下載圖為固定幾何 SVG，HTML 可依欄寬換行。圖 2 下載只代表預設狀態，不匯出讀者輸入。
