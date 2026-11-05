# M09 四篇英文交付教材與來源核對

2026-11-05，新增四篇 text.en 與 12 題 checks[].text.en。四份 before.json 保存修改前正本。中文目標、導讀、正文、練習、來源、qa、原發布日及答案索引保留。各篇由 v1.0.0／revision 1 升為 v1.0.1／revision 2，版本修訂日為 2026-11-05。

## 來源與採用範圍

- [Pro Git recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)、[git diff](https://git-scm.com/docs/git-diff)、[git restore](https://git-scm.com/docs/git-restore)：暫存快照、兩種差異、未追蹤檔案，以及還原來源／目的位置／路徑。保留本機提交、遠端推送、部署及驗收的分工；.gitignore 不會清除歷史秘密。
- [GitHub README](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)、[Python 3.12 venv](https://docs.python.org/3.12/library/venv.html)、[pytest 8.4 usage](https://docs.pytest.org/en/8.4.x/how-to/usage.html)與 [AppTest 1.51.0](https://docs.streamlit.io/1.51.0/develop/api-reference/app-testing/st.testing.v1.apptest)：交接入口、重新建立虛擬環境、測試及工具範圍；指令配合實際交付，不把作者重建當真人接手。
- [Gherkin](https://cucumber.io/docs/gherkin/reference/)支持條件、動作、可觀察結果；六題評量仍使用既有教師指南。題目、參考答案與展示清單存在，不代表學員已作答、理解或完成作品。
- [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)及 [Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)支持自願風險管理與明確責任角色。引用不當認證或正式規則，也不將工具回覆當責任移轉。[OWASP Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)支持工具最小權限及執行授權；工具遷移只作計畫，不宣稱新品牌已執行驗收。

上述公開原始文件已於本批核對。英文 24 節、四張原生圖（三個流程、一組平行卡片）、三張表格、七份 code 範本及 12 題解析，逐節核對數字、條件與結論。七份命令、README 與紀錄範本逐位元保留，英文說明完整對應原中文檔案內容及操作；課綱、時數、共用版型與工作坊 ZIP 不改。

## 實際重現

教材 Git 命令在獨立 git-lab/ 執行：本機合成署名、基準提交、兩份未暫存修改、備份與指定 HEAD／worktree／path 還原。只恢復 slice-notes.md，keep.txt 的另一份修改及備份保留，沒有設定遠端或推送。

由正式工作坊 ZIP 解壓新目錄並建立全新 .venv，沒有複製既有環境。requirements.txt 安裝成功，實際 Python 3.12.3／Streamlit 1.51.0／pytest 8.4.2，reference 23 項通過。真實瀏覽器用鍵盤檢查缺漏、補正、完整後清空，再補正重查；下載檔名 synthetic-report.json、status、scope、三欄與中文內容核對通過。本次額外服務已停止。這是代理／作者重建，不是獨立真人交接或所有平台支援。

原工作區有另一批 CEH 修改；本批使用從 b73cdec 建立的隔離工作樹，只套入 AASE M09 與對應測試進行建置及本機頁面驗證。沒有改動、提交或聲稱驗證另一批未提交的 CEH 改寫。正式站及待驗事項見[本批回執](../../../releases/2026-11-05-aase-m09-en.md)。
