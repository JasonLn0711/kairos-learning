# AASE M02　四十個概念的 2.5D SVG 教學分鏡

每個概念沿用三幕雙語教材與原有來源錨點。下表由實作分鏡、場景資料與教學觀察點整理；實線表示傳遞、處理或條件分支，虛線表示平行支援。並列物件各自保有身分。選單切換時，原教材決定數值、狀態或證據。

Raschka 第二章以同一段文字展示切分、ID 與嵌入查表，並以錯開一格的序列說明訓練目標。本設計沿用「保留物件身分、看清楚變換前後」的教學方式。本站圖形依 AASE 合成案例重新繪製。[Raschka 第二章](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch02/01_main-chapter-code/ch02.ipynb)

## 設計與檢查順序

1. 從六份章節資料逐幕確認物件、輸入、輸出、參與者及證據範圍。
2. 依關係安排流程、合流、條件分支、比較、回饋或平行支援。將查表、切分、正規化運算獨立成可驗算的元件。
3. 將情境、滑桿、核取方塊及原有計算器連接至圖。保留文字資料、完整閱讀與鍵盤操作。
4. 以桌面與窄版逐幕核對雙語 SVG、所有情境輸出、頁面邊界，另驗證數學、政策、重設及無 JS 閱讀。

## 逐幕設計

### M02-01

[本章第二幕圖集](../../../.local/aase-concept-flows/m02-01-overview.jpg)

| 概念與場景 | SVG 物件及關係 | 此幕要讓讀者看見什麼 |
|---|---|---|
| [文字切成 token · 01 從文字到 ID](../../../.local/aase-concept-flows/verified/zh-1280/tokenization-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/tokenization-01.png) | 原始文字一塊 | 原文已知，切法與片段數要等分詞器確定後才能判斷。 |
| [文字切成 token · 02 比較兩套切法](../../../.local/aase-concept-flows/verified/zh-1280/tokenization-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/tokenization-02.png) | 同一份文字 → 切分成詞元 → 點算 | 比較兩種方案的片段數與邊界。請找出哪個方案把一個英文單字拆成多個 token，或把多個中文字合為一個 token。 |
| [文字切成 token · 03 從片段查出 ID](../../../.local/aase-concept-flows/verified/zh-1280/tokenization-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/tokenization-03.png) | 每個詞元 → 同一欄的詞彙 ID | 畫面中的 42、64 是玩具索引，只代表查表位置。 |
| [詞元嵌入 · 01 用 ID 查向量](../../../.local/aase-concept-flows/verified/zh-1280/embeddings-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/embeddings-01.png) | ID → 詞彙表對應列 → 四維向量 | 這個玩具例子先把「文件」定位為第 21 列，下一步才查看裡面的數字。 |
| [詞元嵌入 · 02 交換詞元 ID](../../../.local/aase-concept-flows/verified/zh-1280/embeddings-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/embeddings-02.png) | 選 ID → 高亮同一列 → 逐格取出四個座標 | 查看第 21 列與第 42 列的第三個座標。兩列都包含第三個分量，但值分別是 0.9 與 0.2。 |
| [詞元嵌入 · 03 分清索引與坐標](../../../.local/aase-concept-flows/verified/zh-1280/embeddings-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/embeddings-03.png) | 對照第 21、42 列 → 比較 x₃ | 同樣都是四維向量，第 21 列與第 42 列的第三分量不同。 |
| [位置資訊 · 01 同樣的詞集合](../../../.local/aase-concept-flows/verified/zh-1280/position-information-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/position-information-01.png) | 位置 1 → 位置 2、位置 2 → 位置 3 | 原句裡小安先出現，位於「幫助」前面。 |
| [位置資訊 · 02 對調姓名](../../../.local/aase-concept-flows/verified/zh-1280/position-information-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/position-information-02.png) | 原始排列 ∥ 交換位置 | 切換兩種順序，核對行動者和接受者是否互換。 |
| [位置資訊 · 03 保留位置關係](../../../.local/aase-concept-flows/verified/zh-1280/position-information-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/position-information-03.png) | 詞元序列 → 含位置表示、位置資訊 → 含位置表示 | 兩句的詞頻相同，但第一位置與第三位置的姓名互換了。 |
| [注意力的 Q、K、V · 01 查詢如何比對鍵](../../../.local/aase-concept-flows/verified/zh-1280/attention-qkv-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/attention-qkv-01.png) | 查詢 → 匹配分數、鍵 A → 匹配分數、鍵 B → 匹配分數 | Q 與 A 的鍵內積為 1，與 B 的鍵內積為 0。這一步還沒讀取或加權值向量。 |
| [注意力的 Q、K、V · 02 切換可見位置](../../../.local/aase-concept-flows/verified/zh-1280/attention-qkv-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/attention-qkv-02.png) | 查詢 → 因果遮罩、因果遮罩 → 值 A、因果遮罩 → 值 B、值 A → 混合向量、值 B → 混合向量 | 切換 B 是否可見，核對分母與兩個分量的加權結果。 |
| [注意力的 Q、K、V · 03 核對因果遮罩的可見範圍](../../../.local/aase-concept-flows/verified/zh-1280/attention-qkv-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/attention-qkv-03.png) | 查詢 → 因果遮罩、因果遮罩 → 可見的鍵 | 位置 1 只可見鍵 1；位置 2 可見鍵 1、2；位置 3 可見全部三個鍵。 |
| [Softmax 與加權總和 · 01 辨認分數和值](../../../.local/aase-concept-flows/verified/zh-1280/softmax-weighted-sum-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/softmax-weighted-sum-01.png) | 分數 A 與值 2 ∥ 分數 B 與值 6 | 預設 A 的匹配分數較大，但 B 的值較大。 |
| [Softmax 與加權總和 · 02 計算正規化權重](../../../.local/aase-concept-flows/verified/zh-1280/softmax-weighted-sum-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/softmax-weighted-sum-02.png) | 兩路取指數 → 共同分母 → 各自正規化 | 把分數由 [1, 0] 調成 [0, 0]。權重會由約 [0.731, 0.269] 變成 [0.5, 0.5]。畫面到小數第三位，計算保留完整精度。 |
| [Softmax 與加權總和 · 03 用權重合成值](../../../.local/aase-concept-flows/verified/zh-1280/softmax-weighted-sum-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/softmax-weighted-sum-03.png) | 追蹤兩路分數 → 權重 → 各項貢獻 → 加總 | 以預設分數計算約為 3.076。相等分數的結果為 4。 |
| [Transformer 區塊 · 01 區塊的四個角色](../../../.local/aase-concept-flows/verified/zh-1280/transformer-block-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/transformer-block-01.png) | 注意力 ∥ 前饋運算 ∥ 殘差路徑 ∥ 正規化 | 注意力與前饋網路都處理表示。找出哪項跨位置收集資訊、哪項在每個位置各自做轉換。 |
| [Transformer 區塊 · 02 比較兩個注意力頭](../../../.local/aase-concept-flows/verified/zh-1280/transformer-block-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/transformer-block-02.png) | 輸入 → 注意力頭 A、輸入 → 注意力頭 B | 頭 A 把較多權重給位置 1，頭 B 把較多權重給位置 2。 |
| [Transformer 區塊 · 03 合併各頭的輸出](../../../.local/aase-concept-flows/verified/zh-1280/transformer-block-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/transformer-block-03.png) | 注意力頭 A → 串接、注意力頭 B → 串接、串接 → 投影 | 注意力頭的權重用來彙整各頭的值。「合併」階段收到的是各頭的彙整表示。 |
| [自迴歸生成 · 01 建立可見前綴](../../../.local/aase-concept-flows/verified/zh-1280/autoregressive-generation-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/autoregressive-generation-01.png) | 位置 1 → 位置 2、位置 2 → 位置 3 | 第一位置只能使用自己，第二位置可用一、二；尚未選出的第三個 token 不在輸入。 |
| [自迴歸生成 · 02 比較兩種解碼策略](../../../.local/aase-concept-flows/verified/zh-1280/autoregressive-generation-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/autoregressive-generation-02.png) | 已知前綴 → 候選分布、候選分布 → 下一詞元 | 切換解碼方式，對照哪個 token 被附加到序列。 |
| [自迴歸生成 · 03 把新 token 加到前綴](../../../.local/aase-concept-flows/verified/zh-1280/autoregressive-generation-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/autoregressive-generation-03.png) | 已知前綴 → 下一詞元、下一詞元 → 新前綴。下一輪以前綴繼續 | 圖中沿用固定抽樣結果「放晴」；這是新的已知 token，下一個位置仍待預測。 |
| [生成與驗證的界線 · 01 分清三種訊號](../../../.local/aase-concept-flows/verified/zh-1280/verification-boundary-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/verification-boundary-01.png) | 注意力 ∥ 生成機率 ∥ 驗收 | 模型可為文字分配高機率，必填資料仍要查實際欄位。 |
| [生成與驗證的界線 · 02 清空必要欄位](../../../.local/aase-concept-flows/verified/zh-1280/verification-boundary-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/verification-boundary-02.png) | 申請表 → 格式檢查、格式檢查 → 缺漏項目 | 填入文件類型並切換聲明，比較哪項改變會影響查驗結果。 |
| [生成與驗證的界線 · 03 用驗證指出下一步](../../../.local/aase-concept-flows/verified/zh-1280/verification-boundary-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/verification-boundary-03.png) | 缺漏項目 → 補正、補正 → 驗收 | 此案例須補文件類型。存在性驗證通過後，其他條件仍可另外核對。 |

### M02-02

[本章第二幕圖集](../../../.local/aase-concept-flows/m02-02-overview.jpg)

| 概念與場景 | SVG 物件及關係 | 此幕要讓讀者看見什麼 |
|---|---|---|
| [儲存與可見的內容 · 01 分清庫存與送達](../../../.local/aase-concept-flows/verified/zh-1280/stored-vs-visible-context-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/stored-vs-visible-context-01.png) | 封存區 ∥ 本次輸入 | 存量沒告訴你實際送入哪份。下一步先檢查同樣十份資料的一個選取位置。 |
| [儲存與可見的內容 · 02 替十份文件選一份規格](../../../.local/aase-concept-flows/verified/zh-1280/stored-vs-visible-context-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/stored-vs-visible-context-02.png) | 封存區 → 選取、選取 → 本次輸入 | 把新版規格與測試摘要分別送入，比較本次是否看得到 v2。 |
| [儲存與可見的內容 · 03 核對實際送達](../../../.local/aase-concept-flows/verified/zh-1280/stored-vs-visible-context-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/stored-vs-visible-context-03.png) | 本次輸入 → 交付紀錄、交付紀錄 → 核對 | 這次的送達紀錄含規格 v2，因此這一版可進入本次上下文。 |
| [組合本次上下文 · 01 拆解一次呼叫](../../../.local/aase-concept-flows/verified/zh-1280/context-composition-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-composition-01.png) | 指令 → 本次輸入、當前任務 → 本次輸入、歷史對話 → 本次輸入、來源文件 → 本次輸入 | 畫面中四種內容送入模型；預留輸出是容量，沒有新增一份輸入文件。 |
| [組合本次上下文 · 02 載入外部記憶](../../../.local/aase-concept-flows/verified/zh-1280/context-composition-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-composition-02.png) | 外部記憶 → 選取、選取 → 本次輸入 | 「已儲存」或「已載入」對應兩種封包。比較模型可見的證據。 |
| [組合本次上下文 · 03 核對這次能見度](../../../.local/aase-concept-flows/verified/zh-1280/context-composition-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-composition-03.png) | 歷史對話 ∥ 外部記憶 ∥ 語言模型 | 檢查這次呼叫的輸入，確認哪一版規格或哪段歷史實際出現。 |
| [上下文容量預算 · 01 盤點固定預算](../../../.local/aase-concept-flows/verified/zh-1280/context-budget-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-budget-01.png) | 固定 9,000 加上 500 日誌，依比例與上限比較 | 合計 9,500，尚餘 500。 |
| [上下文容量預算 · 02 調整日誌量](../../../.local/aase-concept-flows/verified/zh-1280/context-budget-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-budget-02.png) | 滑桿調整日誌 → 改變第五段長度 → 比對容量上限 | 把日誌由 500 調到 1,800 token。剩餘值會由 500 變成 −800，負值代表超出的 token 數。 |
| [上下文容量預算 · 03 核對超額後的取捨](../../../.local/aase-concept-flows/verified/zh-1280/context-budget-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-budget-03.png) | 上下兩條對照移出 800 token 前後 | 只保留 1,000 token 的日誌會剛好用滿。保留 900 則還剩 100。 |
| [診斷上下文失效 · 01 先看線索](../../../.local/aase-concept-flows/verified/zh-1280/context-failure-diagnosis-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-failure-diagnosis-01.png) | 症狀 ∥ 需求規格 | 容量超額與選錯檔案都可能令規格未到達，但修法不同。 |
| [診斷上下文失效 · 02 比較四種診斷](../../../.local/aase-concept-flows/verified/zh-1280/context-failure-diagnosis-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-failure-diagnosis-02.png) | 症狀 → 容量上限、症狀 → 擷取、症狀 → 規格衝突、症狀 → 未依規格產出 | 切換案例以核對證據和下一步。 |
| [診斷上下文失效 · 03 依新證據驗證](../../../.local/aase-concept-flows/verified/zh-1280/context-failure-diagnosis-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-failure-diagnosis-03.png) | 補正 → 本次輸入、本次輸入 → 核對 | 送達驗證和顏色檢查分別驗證輸入與輸出。 |
| [上下文中的位置效應 · 01 固定資料內容](../../../.local/aase-concept-flows/verified/zh-1280/position-effects-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/position-effects-01.png) | 驗證證據 ∥ 干擾文本 | 規格位於第 1 段。 |
| [上下文中的位置效應 · 02 移動同一份規格](../../../.local/aase-concept-flows/verified/zh-1280/position-effects-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/position-effects-02.png) | 開頭 ∥ 中間 ∥ 結尾 | 規格仍送達，改為第 2 段。 |
| [上下文中的位置效應 · 03 設計可比較的檢查](../../../.local/aase-concept-flows/verified/zh-1280/position-effects-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/position-effects-03.png) | 固定配置 → 觀察結果、證據位置 → 觀察結果 | 示意包的規格仍完整，畫面只標記位置；實際正確率要等測試才有資料。 |
| [任務交接包 · 01 準備交接包](../../../.local/aase-concept-flows/verified/zh-1280/task-package-handoff-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/task-package-handoff-01.png) | 需求規格 → 交接紀錄、測試 → 交接紀錄、核准範圍 → 交接紀錄、未完事項 → 交接紀錄、停止 → 交接紀錄 | 檢查待辦與限制能否從封包重建。下一步確認兩個版本中哪一版有權威。 |
| [任務交接包 · 02 判斷規格權威](../../../.local/aase-concept-flows/verified/zh-1280/task-package-handoff-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/task-package-handoff-02.png) | 來源文件 → 有效規格、文件版本 → 有效規格 | 有核准依據時才以該版重現測試。若衝突未決，保留原始內容並暫停寫入。 |
| [任務交接包 · 03 驗證再恢復工作](../../../.local/aase-concept-flows/verified/zh-1280/task-package-handoff-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/task-package-handoff-03.png) | 來源文件 → 重現測試、重現測試 → 留下紀錄 | 接手證據要同時說明看了哪份需求、改了哪裡、哪項測試通過與哪些工作仍待確認。 |

### M02-03

[本章第二幕圖集](../../../.local/aase-concept-flows/m02-03-overview.jpg)

| 概念與場景 | SVG 物件及關係 | 此幕要讓讀者看見什麼 |
|---|---|---|
| [KV Cache｜重用注意力中間結果 · 01 前綴已處理](../../../.local/aase-concept-flows/verified/zh-1280/kv-cache-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/kv-cache-01.png) | 已知前綴 → 鍵快取、已知前綴 → 值快取 | 畫面分開顯示 A 與 B 的 K/V，下個位置才會決定這批狀態能否重用。 |
| [KV Cache｜重用注意力中間結果 · 02 加入下一個 token](../../../.local/aase-concept-flows/verified/zh-1280/kv-cache-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/kv-cache-02.png) | 鍵快取 → 注意力、值快取 → 注意力、下一詞元 → 注意力 | 比較兩條路徑的 K/V 計算位置數。這裡每個位置算作一次概念計數。 |
| [KV Cache｜重用注意力中間結果 · 03 確認效益的證據](../../../.local/aase-concept-flows/verified/zh-1280/kv-cache-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/kv-cache-03.png) | 快取命中 ∥ 交接紀錄 ∥ 耗時量測 | 若要評估快取效果，固定引擎和負載再量延遲、吞吐量與記憶體。這裡只有可比對的運算路徑。 |
| [Compaction｜濃縮對話 · 01 整理工作桌](../../../.local/aase-concept-flows/verified/zh-1280/compaction-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/compaction-01.png) | 歷史對話 → 摘要、來源文件 → 摘要 | 原規格要求平日二科、週末三科，並允許考前一週調整；假日規則仍待確認。 |
| [Compaction｜濃縮對話 · 02 檢查摘要差異](../../../.local/aase-concept-flows/verified/zh-1280/compaction-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/compaction-02.png) | 原始排列 ∥ 摘要 | 摘要寫每天二科時，找出週末分支、考前一週例外與未決問題是否都還在。 |
| [Compaction｜濃縮對話 · 03 讓測試驗證摘要](../../../.local/aase-concept-flows/verified/zh-1280/compaction-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/compaction-03.png) | 判斷規則 → 平日、判斷規則 → 週末 | 週六選三科能揭露每天只准二科的錯誤。 |
| [RAG｜先找來源再回答 · 01 限定來源範圍](../../../.local/aase-concept-flows/verified/zh-1280/rag-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/rag-01.png) | 查詢 → 擷取、核准範圍 → 擷取、擷取 → 本次輸入 | 從「週末科目上限」追到有權讀取的候選規格，再檢查哪份是生效版本。 |
| [RAG｜先找來源再回答 · 02 版本改變答案](../../../.local/aase-concept-flows/verified/zh-1280/rag-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/rag-02.png) | 查詢 → 來源文件、文件版本 → 來源文件 | 切換版本，讀同一問題得到的答案。 |
| [RAG｜先找來源再回答 · 03 把來源當證據](../../../.local/aase-concept-flows/verified/zh-1280/rag-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/rag-03.png) | 來源核對 ∥ 測試 | 有版本與節次可回查，比只有自信回答更容易找出錯配。 |
| [Memory｜跨階段延續工作 · 01 建立交接紀錄](../../../.local/aase-concept-flows/verified/zh-1280/memory-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/memory-01.png) | 修訂版本 → 交接紀錄、驗證證據 → 交接紀錄、未完事項 → 交接紀錄 | 新增科目已完成；週末排程待修。 |
| [Memory｜跨階段延續工作 · 02 確認確實讀回](../../../.local/aase-concept-flows/verified/zh-1280/memory-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/memory-02.png) | 外部記憶 → 載入、載入 → 本次輸入 | 選擇情境，看模型實際收到的內容。 |
| [Memory｜跨階段延續工作 · 03 用目前證據更新紀錄](../../../.local/aase-concept-flows/verified/zh-1280/memory-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/memory-03.png) | 外部記憶 → 修訂版本、驗證證據 → 修訂版本 | 維護紀錄包括更新、存取限制、到期及刪除。 |
| [跨日工作協調 · 01 第一天｜做工與整理](../../../.local/aase-concept-flows/verified/zh-1280/cross-session-orchestration-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/cross-session-orchestration-01.png) | 已知前綴 → 計算快取、歷史對話 → 摘要 | 快取的產出是可重用的狀態；壓縮的產出是更短的文字工作包。 |
| [跨日工作協調 · 02 暫停與次日開工](../../../.local/aase-concept-flows/verified/zh-1280/cross-session-orchestration-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/cross-session-orchestration-02.png) | 外部記憶 → 載入、載入 → 本次輸入 | 比較有無讀回及查證的效果。 |
| [跨日工作協調 · 03 用新證據結案](../../../.local/aase-concept-flows/verified/zh-1280/cross-session-orchestration-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/cross-session-orchestration-03.png) | 重現測試 → 驗證證據、驗證證據 → 留下紀錄 | 週六三科通過，平日三科拒絕，是具體可核對的案例。 |
| [依故障選擇方法 · 01 拆成四個責任](../../../.local/aase-concept-flows/verified/zh-1280/method-selection-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/method-selection-01.png) | 計算快取 ∥ 摘要 ∥ 擷取 ∥ 外部記憶 | 這些故障會表現相似，改善效果要用各自的證據驗證。 |
| [依故障選擇方法 · 02 選一張故障卡](../../../.local/aase-concept-flows/verified/zh-1280/method-selection-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/method-selection-02.png) | 症狀 → 計算快取、症狀 → 摘要、症狀 → 擷取、症狀 → 外部記憶 | 逐個選擇故障，檢查使用的方法與哪一項獨立證據可以驗收。 |
| [依故障選擇方法 · 03 替故障配對方法](../../../.local/aase-concept-flows/verified/zh-1280/method-selection-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/method-selection-03.png) | 診斷 → 計算快取、診斷 → 摘要、診斷 → 擷取、診斷 → 外部記憶 | 只有檢索適用且允許讀取的檔案，才會針對這個來源缺口。另要核對版號、條文及輸出。 |

### M02-04

[本章第二幕圖集](../../../.local/aase-concept-flows/m02-04-overview.jpg)

| 概念與場景 | SVG 物件及關係 | 此幕要讓讀者看見什麼 |
|---|---|---|
| [聊天、工作流程與 Agent · 01 誰與使用者對話？](../../../.local/aase-concept-flows/verified/zh-1280/chatbot-workflow-agent-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/chatbot-workflow-agent-01.png) | 使用者 → 對話介面、對話介面 → 答覆 | 回答和實際執行是兩件事。 |
| [聊天、工作流程與 Agent · 02 比較下一步的決定方式](../../../.local/aase-concept-flows/verified/zh-1280/chatbot-workflow-agent-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/chatbot-workflow-agent-02.png) | 對話介面 ∥ 固定流程 ∥ 代理決策 | 切換設計，辨認決策者與可見的結果。 |
| [聊天、工作流程與 Agent · 03 同一產品可組合](../../../.local/aase-concept-flows/verified/zh-1280/chatbot-workflow-agent-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/chatbot-workflow-agent-03.png) | 使用者 → 對話介面、對話介面 → 固定流程、對話介面 → 代理決策 | 看清楚交接點：介面、授權、選擇與驗收。 |
| [固定規則的工作流程 · 01 閱讀固定規格](../../../.local/aase-concept-flows/verified/zh-1280/deterministic-workflow-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/deterministic-workflow-01.png) | 判斷規則 → 平日、判斷規則 → 週末 | 日期先決定上限，科目數再決定通過或拒絕。 |
| [固定規則的工作流程 · 02 試跑相同科目數](../../../.local/aase-concept-flows/verified/zh-1280/deterministic-workflow-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/deterministic-workflow-02.png) | 日期類型 → 分支判斷、科目數 → 分支判斷 | 用平日和週末分別試跑三科。 |
| [固定規則的工作流程 · 03 寫下會抓錯的測試](../../../.local/aase-concept-flows/verified/zh-1280/deterministic-workflow-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/deterministic-workflow-03.png) | 平日 ∥ 週末 | 工作流程可請 AI 潤飾錯誤文字，仍由固定規則決定結果。 |
| [Agent｜依觀察選擇下一步 · 01 先觀察錯誤與範圍](../../../.local/aase-concept-flows/verified/zh-1280/agent-decision-loop-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/agent-decision-loop-01.png) | 預期結果 ∥ 觀測紀錄 | 先記錄預期通過、實際拒絕。 |
| [Agent｜依觀察選擇下一步 · 02 根據新證據改選](../../../.local/aase-concept-flows/verified/zh-1280/agent-decision-loop-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/agent-decision-loop-02.png) | 驗證證據 → 代理決策、代理決策 → 提議動作、提議動作 → 觀察結果。下一輪依觀測決策 | 比較直接宣布修好與重現日期規則差異。 |
| [Agent｜依觀察選擇下一步 · 03 用條件決定退出](../../../.local/aase-concept-flows/verified/zh-1280/agent-decision-loop-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/agent-decision-loop-03.png) | 分支判斷 → 停止、分支判斷 → 調整行動 | 週末通過、平日拒絕都出現，才送指定驗收者。 |
| [開發 Agent 與產品執行期 · 01 開發期需要探索](../../../.local/aase-concept-flows/verified/zh-1280/build-agent-vs-runtime-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/build-agent-vs-runtime-01.png) | 代理決策 → 程式變更、程式變更 → 交付物 | 交付的是經審核的程式，而執行期依賴要另行畫出。 |
| [開發 Agent 與產品執行期 · 02 選擇執行期控制](../../../.local/aase-concept-flows/verified/zh-1280/build-agent-vs-runtime-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/build-agent-vs-runtime-02.png) | 代理決策 ∥ 固定流程 | 比較固定條件和需探索的任務。 |
| [開發 Agent 與產品執行期 · 03 在沒有模型時驗收](../../../.local/aase-concept-flows/verified/zh-1280/build-agent-vs-runtime-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/build-agent-vs-runtime-03.png) | 測試資料 → 執行環境、執行環境 → 測試 | 預期兩個固定分支都能重現。 |
| [受治理的自主性 · 01 先訂任務合約](../../../.local/aase-concept-flows/verified/zh-1280/governed-autonomy-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/governed-autonomy-01.png) | 核准範圍 ∥ 審查 | 只允許驗證模組的變更與本機測試。發布與資料庫管理需要另外的權限。 |
| [受治理的自主性 · 02 逐次評估請求](../../../.local/aase-concept-flows/verified/zh-1280/governed-autonomy-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/governed-autonomy-02.png) | 提議動作 → 政策判斷、政策判斷 → 允許、政策判斷 → 拒絕 | 先核准發布，觀察結果。再將剩餘次數設為 0，確認已審查的動作也會停止。 |
| [受治理的自主性 · 03 交接給誰、附上什麼](../../../.local/aase-concept-flows/verified/zh-1280/governed-autonomy-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/governed-autonomy-03.png) | 審查者 → 交接紀錄、驗證證據 → 交接紀錄 | 沒有審核收據時，狀態是等待審核。 |
| [固定驗證與受限探索 · 01 固定入口](../../../.local/aase-concept-flows/verified/zh-1280/hybrid-design-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/hybrid-design-01.png) | 輸入 → 格式檢查、格式檢查 → 政策判斷 | 入口未通過會停止，將缺件交還負責人。 |
| [固定驗證與受限探索 · 02 探索後回到固定關卡](../../../.local/aase-concept-flows/verified/zh-1280/hybrid-design-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/hybrid-design-02.png) | 代理決策 → 驗證證據、驗證證據 → 政策判斷 | 切換測試與審核的組合，核對應停在哪道關。 |
| [固定驗證與受限探索 · 03 分清控制與驗收](../../../.local/aase-concept-flows/verified/zh-1280/hybrid-design-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/hybrid-design-03.png) | 控制邏輯 ∥ 驗收 | 決策紀錄會說明怎麼選下一步，驗收紀錄會說明結果是否符合規格。 |

### M02-05

[本章第二幕圖集](../../../.local/aase-concept-flows/m02-05-overview.jpg)

| 概念與場景 | SVG 物件及關係 | 此幕要讓讀者看見什麼 |
|---|---|---|
| [模型與 Agent Harness · 01 認識六個支援面向](../../../.local/aase-concept-flows/verified/zh-1280/llm-vs-harness-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/llm-vs-harness-01.png) | 脈絡 ⋯ 語言模型、工具集合 ⋯ 語言模型、編排 ⋯ 語言模型、執行環境 ⋯ 語言模型、安全控制 ⋯ 語言模型、可觀測性 ⋯ 語言模型 | 從中央的模型往外看，六個面向並行支援同一任務。這張圖不表示任何固定的執行順序。 |
| [模型與 Agent Harness · 02 比較支援條件](../../../.local/aase-concept-flows/verified/zh-1280/llm-vs-harness-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/llm-vs-harness-02.png) | 語言模型 ∥ 外部支援 | 在模擬工作區形成可核對的操作與測試紀錄。 |
| [模型與 Agent Harness · 03 區分建議與執行](../../../.local/aase-concept-flows/verified/zh-1280/llm-vs-harness-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/llm-vs-harness-03.png) | 動作提議 → 政策判斷、政策判斷 → 執行環境 | 在模擬工作區形成可核對的操作與測試紀錄。 |
| [上下文和工具 · 01 分清規格與能力](../../../.local/aase-concept-flows/verified/zh-1280/context-and-tools-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-and-tools-01.png) | 需求規格 ∥ 工具集合 | 能提出寫入，但仍可能採用舊規則。 |
| [上下文和工具 · 02 交叉比較兩個條件](../../../.local/aase-concept-flows/verified/zh-1280/context-and-tools-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-and-tools-02.png) | 脈絡 ∥ 工具集合 | 能辨認應更新為 3 科，實際仍只有讀取。 |
| [上下文和工具 · 03 檢查寫入權限](../../../.local/aase-concept-flows/verified/zh-1280/context-and-tools-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/context-and-tools-03.png) | 核准範圍 → 寫入動作、工具集合 → 寫入動作 | 能辨認應更新為 3 科，實際仍只有讀取。 |
| [編排和執行環境 · 01 核對操作順序](../../../.local/aase-concept-flows/verified/zh-1280/orchestration-and-execution-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/orchestration-and-execution-01.png) | 行動順序 → 提議動作、提議動作 → 測試 | 樣本通過，目標仍待核對。 |
| [編排和執行環境 · 02 切換執行工作區](../../../.local/aase-concept-flows/verified/zh-1280/orchestration-and-execution-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/orchestration-and-execution-02.png) | 工作區 → 執行環境、執行環境 → 測試 | 測試附上目標識別與版本。 |
| [編排和執行環境 · 03 辨別測試版本](../../../.local/aase-concept-flows/verified/zh-1280/orchestration-and-execution-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/orchestration-and-execution-03.png) | 修訂版本 → 交付紀錄、測試 → 交付紀錄 | 測試附上目標識別與版本。 |
| [安全與可觀測性 · 01 先辨認權限邊界](../../../.local/aase-concept-flows/verified/zh-1280/security-and-observability-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/security-and-observability-01.png) | 提議動作 → 政策判斷、政策判斷 → 執行環境 | 符合條件，產生讀取結果。 |
| [安全與可觀測性 · 02 查看允許與拒絕](../../../.local/aase-concept-flows/verified/zh-1280/security-and-observability-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/security-and-observability-02.png) | 政策判斷 → 允許、政策判斷 → 拒絕 | 宿主拒絕，沒有修改發生。 |
| [安全與可觀測性 · 03 用事件還原結果](../../../.local/aase-concept-flows/verified/zh-1280/security-and-observability-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/security-and-observability-03.png) | 事件 → 驗證證據、追蹤 → 驗證證據 | 宿主拒絕，沒有修改發生。 |
| [Harness 故障診斷 · 01 讀取現象](../../../.local/aase-concept-flows/verified/zh-1280/harness-diagnostics-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/harness-diagnostics-01.png) | 宣稱 ∥ 觀測紀錄 | 說已完成不是可重現的事件。 |
| [Harness 故障診斷 · 02 比較六個故障](../../../.local/aase-concept-flows/verified/zh-1280/harness-diagnostics-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/harness-diagnostics-02.png) | 脈絡 ⋯ 症狀、工具集合 ⋯ 症狀、編排 ⋯ 症狀、執行環境 ⋯ 症狀、安全控制 ⋯ 症狀、可觀測性 ⋯ 症狀 | 每張故障卡會列出假設與下一個檢查。 |
| [Harness 故障診斷 · 03 留下可重跑的交接](../../../.local/aase-concept-flows/verified/zh-1280/harness-diagnostics-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/harness-diagnostics-03.png) | 修訂版本 → 交接紀錄、測試 → 交接紀錄、驗證證據 → 交接紀錄 | 下一位維護者可以在指定範圍重跑同一條檢查。 |
| [MCP 與 Harness 的分工 · 01 辨認共同介面](../../../.local/aase-concept-flows/verified/zh-1280/mcp-harness-boundary-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/mcp-harness-boundary-01.png) | 主機 → 共用介面、共用介面 → 工具 | 宿主允許查閱合成教材，留下驗證事件。 |
| [MCP 與 Harness 的分工 · 02 切換宿主授權](../../../.local/aase-concept-flows/verified/zh-1280/mcp-harness-boundary-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/mcp-harness-boundary-02.png) | 主機 → 政策判斷、政策判斷 → 工具 | 工具仍可列出，這次使用被拒絕。 |
| [MCP 與 Harness 的分工 · 03 追查授權責任](../../../.local/aase-concept-flows/verified/zh-1280/mcp-harness-boundary-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/mcp-harness-boundary-03.png) | 共用介面 ∥ 政策判斷 | 工具仍可列出，這次使用被拒絕。 |

### M02-06

[本章第二幕圖集](../../../.local/aase-concept-flows/m02-06-overview.jpg)

| 概念與場景 | SVG 物件及關係 | 此幕要讓讀者看見什麼 |
|---|---|---|
| [工具意圖與結果 · 01 先看到提案](../../../.local/aase-concept-flows/verified/zh-1280/tool-intent-and-result-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/tool-intent-and-result-01.png) | 動作提議 ∥ 執行環境 | 此時只有 intent 記錄，沒有結果或執行時間。 |
| [工具意圖與結果 · 02 比較攔截與執行](../../../.local/aase-concept-flows/verified/zh-1280/tool-intent-and-result-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/tool-intent-and-result-02.png) | 分支判斷 → 停止、分支判斷 → 執行環境 | 切換情境，比對請求與結果紀錄是否同時存在。 |
| [工具意圖與結果 · 03 檢查結果證明了什麼](../../../.local/aase-concept-flows/verified/zh-1280/tool-intent-and-result-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/tool-intent-and-result-03.png) | 工具結果 → 驗證證據、驗證證據 → 驗收 | 版本 v3 支持「讀到 v3」。是否依 v3 實作，還需要後續證據。 |
| [MCP 工具呼叫 · 01 辨認訊息欄位](../../../.local/aase-concept-flows/verified/zh-1280/mcp-tool-calling-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/mcp-tool-calling-01.png) | 呼叫識別碼 → 請求訊息、工具 → 請求訊息、參數 → 請求訊息 | 圖中 read_project_file 是這個合成伺服器的自訂工具。 |
| [MCP 工具呼叫 · 02 判斷在哪一層出錯](../../../.local/aase-concept-flows/verified/zh-1280/mcp-tool-calling-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/mcp-tool-calling-02.png) | 請求訊息 → 訊息傳遞、訊息傳遞 → 回應 | 切換三種回應，找出 error 和 result 的位置。 |
| [MCP 工具呼叫 · 03 把工具回應當成證據](../../../.local/aase-concept-flows/verified/zh-1280/mcp-tool-calling-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/mcp-tool-calling-03.png) | 回應 ∥ 驗收 | 讀到 v3 可用於需求比對，尚未驗收應用程式。 |
| [工具操作的四道關卡 · 01 先檢查格式，再查權限](../../../.local/aase-concept-flows/verified/zh-1280/four-gates-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/four-gates-01.png) | 格式檢查 → 授權 | 格式錯誤時連授權都不進行。格式正確但缺少權限時，仍然沒有工具執行。 |
| [工具操作的四道關卡 · 02 改變條件，觀察停在哪關](../../../.local/aase-concept-flows/verified/zh-1280/four-gates-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/four-gates-02.png) | 格式檢查 → 授權、授權 → 執行、執行 → 驗收 | 取消授權後，執行與驗收都顯示略過。重新授權後，可以分開模擬工具失敗或證據不足。 |
| [工具操作的四道關卡 · 03 以獨立證據驗收](../../../.local/aase-concept-flows/verified/zh-1280/four-gates-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/four-gates-03.png) | 執行 ∥ 驗收 | 工具成功和驗收失敗可以同時成立；下一步是補驗缺失，而非宣稱完成。 |
| [沙箱限制與權限 · 01 把能力交給執行環境約束](../../../.local/aase-concept-flows/verified/zh-1280/sandbox-boundary-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/sandbox-boundary-01.png) | 宣告能力 ∥ 實際權限 | 在教學模型裡，輸入通過授權後才取得合成結果。 |
| [沙箱限制與權限 · 02 切換授權的範圍](../../../.local/aase-concept-flows/verified/zh-1280/sandbox-boundary-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/sandbox-boundary-02.png) | 提議動作 → 沙箱邊界、沙箱邊界 → 分支判斷 | 試著允許寫入後，再取消路徑核准。接著換成對外連線，看看哪一個設定能放行。 |
| [沙箱限制與權限 · 03 核對執行環境](../../../.local/aase-concept-flows/verified/zh-1280/sandbox-boundary-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/sandbox-boundary-03.png) | 政策判斷 → 事件、事件 → 驗證證據 | 教學結果能解釋哪條規則擋下操作。實際隔離需要環境證據。 |
| [可觀測性訊號 · 01 讀懂三種訊號](../../../.local/aase-concept-flows/verified/zh-1280/observability-signals-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/observability-signals-01.png) | 日誌 ∥ 指標 ∥ 追蹤 | 三種證據合看，可以定位哪一個操作成功或被攔截。 |
| [可觀測性訊號 · 02 依任務與呼叫比對](../../../.local/aase-concept-flows/verified/zh-1280/observability-signals-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/observability-signals-02.png) | 任務識別碼 → 追蹤、呼叫識別碼 → 追蹤 | 拒絕會增加拒絕計數，不會出現讀取耗時。 |
| [可觀測性訊號 · 03 再查驗收證據](../../../.local/aase-concept-flows/verified/zh-1280/observability-signals-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/observability-signals-03.png) | 觀測紀錄 ∥ 驗收 | 可判斷發生過哪個操作。尚未看到對應驗收案例。 |
| [不可信資料的指令界線 · 01 先標記文字的來源](../../../.local/aase-concept-flows/verified/zh-1280/prompt-injection-boundary-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/prompt-injection-boundary-01.png) | 當前任務 ∥ 外部文件 | 切換備忘錄的聲稱，觀察限制存取的筆記仍被拒絕。把資源改為摘要，確認原先核准的讀取可以執行。 |
| [不可信資料的指令界線 · 02 核對動作是否越界](../../../.local/aase-concept-flows/verified/zh-1280/prompt-injection-boundary-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/prompt-injection-boundary-02.png) | 核准範圍 → 政策判斷、提議動作 → 政策判斷 | 改動備忘錄的說法仍無法開啟第二項資源。 |
| [不可信資料的指令界線 · 03 把拒絕記成可查證事件](../../../.local/aase-concept-flows/verified/zh-1280/prompt-injection-boundary-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/prompt-injection-boundary-03.png) | 拒絕 → 事件、事件 → 審查 | 即使文件可能影響模型建議，授權結果仍取決於獨立政策。 |
| [逾時、重試與冪等性 · 01 先判斷結果是否已知](../../../.local/aase-concept-flows/verified/zh-1280/timeout-retry-idempotency-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/timeout-retry-idempotency-01.png) | 觀測紀錄 ∥ 結果未知 | 只有證據標示未執行，才能把它和未知結果分開。 |
| [逾時、重試與冪等性 · 02 依紀錄決定下一步](../../../.local/aase-concept-flows/verified/zh-1280/timeout-retry-idempotency-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/timeout-retry-idempotency-02.png) | 逾時 → 查證副作用、查證副作用 → 分支判斷 | 未知分支不會將紀錄直接改成失敗，也不會發送第二次執行。 |
| [逾時、重試與冪等性 · 03 核對服務是否做去重](../../../.local/aase-concept-flows/verified/zh-1280/timeout-retry-idempotency-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/timeout-retry-idempotency-03.png) | 呼叫識別碼 → 去重比對、去重比對 → 已記錄副作用 | 逾時後把第一次已寫入設為開啟，再模擬重送並比較是否去重。寫入數由 1 變為 2，或留在 1。 |
| [部分成功與功能驗收 · 01 先保留已完成的動作](../../../.local/aase-concept-flows/verified/zh-1280/partial-success-verification-01.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/partial-success-verification-01.png) | 觀測紀錄 ∥ 缺漏項目 | 可以證明有修改，但還沒證明排程符合需求。 |
| [部分成功與功能驗收 · 02 試兩科與三科界線](../../../.local/aase-concept-flows/verified/zh-1280/partial-success-verification-02.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/partial-success-verification-02.png) | 日期類型 → 分支判斷、科目數 → 分支判斷 | 以兩個鄰近輸入核對界線。 |
| [部分成功與功能驗收 · 03 再決定是否交付](../../../.local/aase-concept-flows/verified/zh-1280/partial-success-verification-03.png) · [英文手機](../../../.local/aase-concept-flows/verified/en-320/partial-success-verification-03.png) | 需求規格 → 驗收、測試 → 驗收 | 只看到工具成功時，保持待驗收。 |

## 本機驗收

應用程式提交為 `bc12c56e3e7da3a695f482375aa82593cd321afc`。以該提交的獨立目錄執行 frozen install、型別檢查及靜態建置，再從靜態 HTTP 伺服器核對畫面。逐幕資料連結收錄桌面中文與窄版英文。六張章節圖集各自彙整該章所有概念的第二幕。[六個代表畫面](../../../.local/aase-concept-flows/review.jpg)

| 驗收範圍 | 實測結果 |
|---|---|
| FIG-02、FIG-04、FIG-06、FIG-07 | 120 幕 × 2 語系 × 4 種寬度，共 960 張圖。320、390、768、1280 CSS px 均檢查可見 SVG 標題、圖中文字邊界、舞臺內容與頁面溢位；含情境的幕逐一切換選項，核對教材結果。 |
| HTML-01、HTML-03、HTML-04、INT-01 | AASE immersive 29/29，包括無 JS 閱讀、鍵盤、雙語、手機、放大文字、計算與權限。HTTP 請求課 14/14。這兩套測試另涵蓋 1366、1440 與 1920 px 等配置。 |
| 圖形與輸入連動 | Chromium 與 WebKit 各操作切詞、嵌入查表、Softmax、容量、四關及注意力遮罩六個案例。比對 SVG 實際輸出，包括第 42 列的四個座標、同分時加權結果 4.000、授權拒絕後兩關略過。 |
| 工程與靜態輸出 | 單元測試 456/456、型別檢查 0 錯誤與警告。靜態驗證通過 512 頁、雙語連結與 1,062 個原樣資產。 |

逐幕掃描發現的 320 px 長選項撐寬、圖內長字串越界與緊湊桌面場景超高均已修正。新版採四種寬度瀏覽器驗證；實體手機的觸感與學習者對全部新版圖像的理解度仍可另行觀察。本機重建沿用前次的發布界線與[全站既有測試紀錄](08-release-readiness.md)。

[桌面與窄版紀錄](../../../.local/aase-concept-flows/final-scenes.log) · [平板與 390 px 紀錄](../../../.local/aase-concept-flows/final-tablet-phone.log) · [跨引擎操作](../../../.local/aase-concept-flows/final-state.log) · [靜態輸出驗證](../../../.local/aase-concept-flows/final-release.log)
