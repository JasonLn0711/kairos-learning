# M07 七篇英文實作教材與來源核對

2026-11-05，新增七篇 text.en 與 21 題 checks[].text.en。七份 before.json 保存修改前正本。中文目標、導讀、正文、練習、來源、qa、原發布日及答案索引保留。各篇由 v1.0.0／revision 1 升為 v1.0.1／revision 2，版本修訂日為 2026-11-05。

## 來源與採用界線

- [Python 3.12 venv](https://docs.python.org/3.12/library/venv.html)及 [pytest 8.4 呼叫方式](https://docs.pytest.org/en/8.4.x/how-to/usage.html)：獨立套件環境、重建而非搬移 .venv，及用選定直譯器執行套件。套件隔離不當作檔案／網路沙箱，直接依賴固定不當作完整跨平台鎖檔。
- [Streamlit 1.51.0 text_input](https://docs.streamlit.io/1.51.0/develop/api-reference/widgets/st.text_input)、[Session State](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state)及 [AppTest](https://docs.streamlit.io/develop/api-reference/app-testing/st.testing.v1.apptest)：標籤、穩定 key、max_chars、on_change、回呼及重跑狀態。現行 AppTest 文件顯示 1.66.0；本課只使用固定 1.51.0 環境已執行的共同 API，不宣稱新版本驗收。
- [Anthropic effective agents](https://www.anthropic.com/research/building-effective-agents)及 [OWASP Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)：任務範圍、工具回饋、停止條件、最小權限與可觀測紀錄。AGENTS.md 是協作指令，不能自動改作業系統權限，也不保證所有產品自動讀取；教師仍需確認選定工具入口。沒有宣稱任何指定產品已完成全程授課驗收。
- [Gherkin](https://cucumber.io/docs/gherkin/reference/)及 [NN/G heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)：可觀察驗收、狀態可見、錯誤預防及復原。三次切片各自提供未檢核預覽、三欄規則、受快照約束匯出，不把其中一階段通過當全部完成。
- [Git diff](https://git-scm.com/docs/git-diff)與 [Git restore](https://git-scm.com/docs/git-restore)：預設工作區／暫存區比較、--cached、未追蹤檔另查，以及 restore 的來源與目的位置。沒有執行整個正式專案強制還原；練習副本保留無關合成檔案。

上述公開原始文件已在本次核對。英文 42 節、七張圖（六個流程與一組平行卡片）、兩張表格、十份程式／命令／紀錄範本與 21 題答案，逐節對照中文的數字、條件及結論。十份 code 逐位元保留；英文完整解釋原繁中任務、紀錄欄位與 JSON，必要操作保留介面實際中文標籤。

## 參考作品與實際證據

原 starter、slices/01-form、slices/02-validation 及 reference 程式、測試與工作坊 ZIP 不改。Python 3.12／Streamlit 1.51.0／pytest 8.4.2 環境分程序執行三個階段：1、24、23 項通過。骨架由真實瀏覽器核對起始說明與沒有表單／匯出。

受控舊報告故障只在忽略的練習副本注入：移除 on_change 失效、顯示只看 checked 存在、預覽／匯出使用舊 checked。原套件 22 通過、1 在成功訊息應消失處失敗；瀏覽器清空文件類型後仍下載到舊值。修回同一副本後 23 通過；瀏覽器核對清空後成功／下載消失，補正並重查才恢復正確匯出；無關合成註記保留，兩個額外本機服務已停止。

初次本機 harness 將虛擬環境直譯器 symlink resolve 成系統 Python，回報 No module named pytest。先改為虛擬環境的絕對路徑並跑基線，再注入故障。環境前置錯誤與需求失敗分開記錄，沒有以 import 錯誤冒充 Red 證據。

頁面、發布與待驗事項見[本批回執](../../../releases/2026-11-05-aase-m07-en.md)。本機合成任務不代表學員理解、獨立真人審稿、指定 Agent 驗收或正式多人安全。
