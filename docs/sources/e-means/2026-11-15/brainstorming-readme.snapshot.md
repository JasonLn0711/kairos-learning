# e-means 方法學習與證據整理

本紀錄完整保存使用者提供的 e-means／k-means 文字與八張圖，將原理、
公式、作者實驗與待查核主張分開，並逐張重繪供閱讀。這是一份來源與方法筆記，
採用前仍需目標資料的品質—時間驗證。

Canonical Idea OS：[idea_000062](../structured/idea_000062_e_means_clustering_evidence_and_embedding_index_tradeoffs.yaml)，`structured`、`59/100`（依既有規則重算；非實驗或論文品質分數）。

## 閱讀入口

1. [完整教學整理](lesson.md)：十四章、全部實質小節、推導、數值表、三道理解題及八張重繪。
2. [核對與更動筆記](verification-notes.md)：公式條件、數字回查、未核實來源、參考解與採用關卡。
3. [原稿逐節對照](source-map.md)：原稿章節和八張圖各自的落點。
4. [八圖規格與目視核對](figure-specifications.md)：圖示語意、方向、數字與重繪調整。
5. [供稿原文](source/pasted-text-1.txt)、[隨文說明](source/request-passage.md)、[原圖1](source/image-1.png)至[原圖8](source/image-8.png)：source preserved。
6. [原始附件清冊](source-manifest.json)與[驗證回條](validation.json)：位元組保存與本次檢查。

## FIRST PRINCIPLE

- 稀缺資源：來源忠實度、注意力、計算預算、可比較證據與下游品質。
- canonical home：本資料夾持有原文、重繪、推導和查核；Idea OS YAML持有狀態與連結。
- Planning角色：日誌、週定位、成熟度、容量Unknown、下一關；不複製完整文章或原圖。
- 採納內容：把e-means列為固定embedding分群／量化的候選求解方法；保留同目標、不同更新策略的理解。
- 下一關：先明確目標資料、初始化、loss定義、計時範圍與Recall門檻，再決定是否另行啟動重現。
- scope control：本次無GPU訓練、模型服務、產品替換、論文週選或個人學習完成主張。

## 強連結及其用途

| 既有入口 | 與本紀錄的具體關係 | 使用界線 |
|---|---|---|
| [AI Scientist research OS](../structured/idea_000019_codex_wrapped_ai_scientist_research_os.yaml) | 將固定品質比較時間、固定預算比較品質及消融契約連回可驗證研究流程 | 文件整理與真實重現分開 |
| [視覺可靠部署](../structured/idea_000022_yolo_to_foundation_vision_reliable_deployment_decision_system.yaml) | 視覺embedding的量化／候選搜尋可比較MSE與實際ReID／檢索品質 | 不把分群MSE當身份正確率或現場驗收 |
| [165互動表徵](../structured/idea_000036_165_antifraud_consultation_interaction_science.yaml) | trajectory embedding的候選分群方式與表徵偏差檢查 | 保留同意／隱私界線；不以cluster推定受害或心理狀態 |
| [共享GPU模型服務](../structured/idea_000043_shared_gpu_model_owner_inference_service.yaml) | 記憶體預算、GX10規格核對、CPU/GPU實作差異 | 未啟動服務或假設硬體容量 |
| [Idea OS分群程式](../../idea_os/clustering_engine.py) | 現有流程依merge-readiness圖取連通分量；本次是候選方法與現況的對照 | 不把這段程式誤認k-means，不直接替換 |
| [embedding分群CLI](../../scripts/embedding_cluster.py) | 目前呼叫同一關係圖分群引擎；檔名不代表已計算embedding | 演算法名稱與實際執行證據分開 |
| [W46日誌](../../../planning-everything-track/weeks/2026-W46/days/2026-11-15.md#e-means-study-2026-11-15) | 本次供稿、重繪與查核成果 | 容量Unknown；不把agent整理當本人學習分鐘 |
| [W46週計畫](../../../planning-everything-track/weeks/2026-W46/weekly-plan.md#e-means-study-2026-11-15) | 週級可回查定位 | 維持候選參考，不新增固定時段或未完成欠額 |
| [Brainstorming專案定位](../../../planning-everything-track/data/projects/2026-04-brainstorming-lab.md#e-means-study-2026-11-15) | 從Planning專案入口回到正本 | 詳細來源留在本repo |

相關Idea OS連結為雙向；原有研究方向、停／延後清單與啟動條件保持各自有效。

## 最小壓力測試（尚未啟動）

情境：文件embedding包含近重複、跨主題相近文字與少量稀有主題，重建IVF索引。
失敗模式：e-means訓練更快或MSE更低，卻因不平衡分區／表徵偏差損害Recall@10。
最小觀察：先固定允許使用的向量、查詢與參考鄰居，列出同初始化、seeds、
精度與計時區間，並明列train/test MSE、Recall@10、建置時間與峰值記憶體。
人類決策：只有在既定召回／延遲門檻不退步且端到端成本下降時，才考慮採用；
品質退步或瓶頸不在訓練則保留現有方法。沒有資料與門檻時先停在契約整理。
