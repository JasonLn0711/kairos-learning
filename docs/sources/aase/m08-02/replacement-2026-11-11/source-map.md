# M08-02 供稿抽換與來源對照

正本由 kairos-learning 保存。原稿 `pasted-text-1.txt`、三張 PNG、修改前 `previous-lesson.json` 逐位元保留；SHA256SUMS 同時核對原件與雙語採用稿。正文為 `content/aase/lessons/aase-m08-c02.json`，由 `scripts/aase_m0802_content.py` 產生。原發布日 2026-11-05 保留；本版 v1.1.0／revision 4，修訂日 2026-11-11。舊六錨點全部保留。

| 原稿章／小節 | 成稿錨點 | 保留內容與編輯處理 |
| --- | --- | --- |
| 導言與三步定義 | cycle | 先定義正確、Red／Green／Refactor、下一要求、需求與驗證連結；只改寫一句重複對比 |
| 第一節先用圖理解 | analogy | 自動門施工、靠近開啟、感測器／控制器重構、門口不可關閉與停電復原；圖1保留三步與下一輪回返 |
| 第二節為何先失敗 | red-meaning | 初學者疑問、不良品檢驗機、只測良品的證據不足；「不是所有紅燈有意義」小節及完整五列判讀表 |
| 第三節產業 | industries | 銀行、醫療、電商、教育、行政五列；保留醫療「依設定阻擋或警示」，作合成業務規則示例；提款100／150的GWT與拒絕及餘額不變兩條結果 |
| 第四節練習導入／需求 | requirement | 文件類型規則、合成申請表、空字串／空格／None／數字；完整complete契約 |
| 第四節第一階段 | red-stage | 無驗證起點、兩個測試函式、四組參數、pytest／參數化／例外三術語、命令、四失敗一通過的原因 |
| 第四節第二階段 | green-stage | 最小輸入驗證、str／strip／ValueError、回傳、同測試重跑、維持驗收標準 |
| 第四節第三階段 | refactor-stage | 驗證／組合報告兩責任、可重用理由、維持行為、無需強制抽函式與過度拆分界線 |
| 第四節實際結果 | evidence | 圖2保留來源4失敗／1通過、5通過、8通過；加上三項完整可執行回歸測試；明示測試集合不同、來源與本版執行分開 |
| 第五節差異 | comparison | 完整五列比較；保留成效取決於測試品質、能力、系統、成本及Agile Alliance實證界線 |
| 第六節AI協作 | agent-workflow | 模糊報告功能提示及漏驗證、四步協作圖、原完整可複製提示詞、同一Agent同時寫錯需求／測試／程式的風險與獨立確認 |
| 第七節品質 | quality | 單元／整合／端對端／安全／易用性五列問題；保留全系統、所有欄位、資安不可由單例通過推論 |
| 第八節適用時機 | applicability | 金額、權限、驗證、狀態、API、既有Bug；原型／訪談／探索；需求本身正確性及需求工程／GWT／SDD連結 |
| 第九節三題 | checks，Q01–Q03 | 原三題題意及全部三選項保留，答案B／B／C；補參考解析，沿用原生details，沒有送出／評分功能 |
| 文末實作目標 | understanding、practice | 獨立選需求、真正Red、最小修正、重構、三階段證據；保留原型另兩欄／長度／白名單／介面與獨立tdd-lab的原有界線 |

## 格式修復與技術修正

- 原供稿五段Python／shell fence中的Python換行黏合。依現有相同範例修復縮排、分行，保持輸入、輸出與錯誤訊息；正式中英文code字串完全相同。沒有照貼不可執行的黏合版本。
- 刪除搜尋favicon、CS Kairos Learn+1等平台殘片與「提交答案」假按鈕。來源/m04/路徑更正只屬供稿脈絡，正式網址維持/m08/。
- 供稿「我將三階段執行」改成可追溯的來源回報，另寫本版實測。本次以Python 3.11.15、pytest 8.4.2及9.0.2各執行五個組合：Red原五測試4失敗／1通過；Green原五5通過、擴充8通過；Refactor原五5通過、擴充8通過。完整輸出位於本機`.local/aase/m0802/pytest-*-example.json`，公開精簡回執見版本紀錄。
- 三項補測在Green與Refactor都執行，避免把測試數量增長當成重構效果。每階段採新暫存目錄，保留預期Red exit 1，確認四個DID NOT RAISE均為ValueError需求缺失。
- 供稿影片僅有GitHub與1:10，未提供可核實網址。原句保留原稿，正式正文不杜撰影片連結。此項為來源資訊缺漏，不阻擋可獨立閱讀的完整教學。
- 雙語逐小節保留相同案例、條件、表格、步驟、程式與界線，非一語摘要。移除「簡單說」引導句，保留後面的要求實作與需求正確性區分。

## 圖解關係與實作

三圖共用正式JSON資料，受限flow／cards種類與3／3／4節點契約，拒絕額外markup／path欄位。TddDiagram以可選取HTML及CSS容器查詢重排；SVG連線與匯出由固定序列化器產生，僅使用審核過的元素／屬性白名單與跳脫文字，小於100000 bytes。

1. image-1 → analogy：三節點垂直順序、紅綠藍色及右側虛線回到Red；底部下一需求提示。手機保留同一端點關係。
2. image-2 → evidence：桌面三欄平行結果、手機無箭頭直排；保留版本差異與三項新增測試。正文caption先說明集合不同，匯出caption／nodes／description使用同源文字。
3. image-3 → agent-workflow：人定義驗收、Agent測試、Agent修正、確認及重構四步，向下箭頭只表示工作順序；增加每步目的以承接教學。未新增外部AI執行服務。

查核：pytest [assertions／raises](https://docs.pytest.org/en/stable/how-to/assert.html)、[parametrize](https://docs.pytest.org/en/stable/how-to/parametrize.html)、[Agile Alliance TDD](https://agilealliance.org/glossary/tdd/)（2026-11-11）。pytest兩固定版本的實跑也直接核對例外與參數化行為；既有sourceIds保留。

驗收規則、測試指令與正式發布證據見[回執](../../../../releases/2026-11-11-aase-m08-02-replacement.md)。實機及讀者理解另行驗收，未以網站檢查代替。
