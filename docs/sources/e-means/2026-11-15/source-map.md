# 完整供稿與整理版對照

| 原稿章節／小節 | 整理位置 | 保存方式 |
|---|---|---|
| 一、核心結論：e-means 不是發明新的分群目標，而是改進尋找答案的方法 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 二、先建立整個知識地圖 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 三、什麼是 k-means？先用一個生活案例理解 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 3.1 k-means 的三個基本元素 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 3.2 為什麼使用距離平方？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 四、傳統 k-means（Lloyd's Algorithm）到底如何運作？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 4.1 用六個數字實際操作一次 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 4.2 為什麼這樣更新一定不會增加當前的 loss？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 4.3 Loss 一直下降，為什麼結果仍然可能不好？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 五、e-means 如何改變整個訓練過程？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 5.1 全量更新 vs 小批次更新 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 5.2 Exponential Moving Average（EMA）：為什麼需要記憶？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 六、e-means 真正的數學核心：它不是直接平均 centroid | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 6.1 為每個群維護兩個統計量 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 6.2 手算兩次更新 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 6.3 更深一層：推導 e-means 的有效學習率 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 6.4 e-means 和傳統 MiniBatchKMeans 的差別 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 七、為什麼 e-means 不只更快，還可能找到更好的結果？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 7.1 Cosine Schedule：為什麼一開始要敢動，後面要穩？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 7.2 為什麼 mini-batch 的隨機性反而可能是優勢？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 7.3 Dead-cluster Revival：避免浪費群中心 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 7.4 Finalization：最後為什麼還要重新計算平均值？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 八、Scaling Laws：e-means 最值得研究的另一項貢獻 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 8.1 為什麼這件事重要？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 8.2 第一條公式：預測 batch size | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 8.3 第二條公式：預測初始更新步長 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 8.4 為什麼這些公式不能被當成普遍定律？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 九、回到你提供的圖片：究竟應該怎麼解讀？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 9.1 左邊與中間：Voronoi Diagram 是什麼？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 9.2 右邊：Training Loss 曲線究竟顯示什麼？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 十、原始論文的實驗證據有多強？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 10.1 但有反面證據嗎？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 十一、更深的理論連結：e-means 與 EM、SGD、GPU 計算的關係 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 11.1 e-means 和 Expectation-Maximization 是同一回事嗎？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 11.2 時間複雜度真的改變了嗎？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 11.3 為什麼 GPU 特別適合這類工作？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 十二、e-means 在現代 AI 系統中能做什麼？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 12.1 RAG 與向量資料庫 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 12.2 資料集治理與去重 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 12.3 語音與醫療影像 AI | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 十三、如果要嚴謹地驗證 e-means，應該怎麼做？ | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 研究上的實際判斷 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 十四、最後，把整篇論文濃縮成一個可以帶走的觀念 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |
| 理解檢查 | [lesson.md](lesson.md) 同名章節 | 原文完整保存；編輯改動另列核對筆記 |

十四章與理解檢查均完整保留。favicon、來源平台重複標籤與原稿失去互動程式的滑桿文字已整理；未刪除實質論點。

| 圖 | 原始附件 | 重繪 | 對應章節 |
|---|---|---|---|
| 1 | [image-1.png](source/image-1.png) | [figure-01.png](figures/figure-01.png) | 三 |
| 2 | [image-2.png](source/image-2.png) | [figure-02.png](figures/figure-02.png) | 4.1 |
| 3 | [image-3.png](source/image-3.png) | [figure-03.png](figures/figure-03.png) | 4.3 |
| 4 | [image-4.png](source/image-4.png) | [figure-04.png](figures/figure-04.png) | 5.1 |
| 5 | [image-5.png](source/image-5.png) | [figure-05.png](figures/figure-05.png) | 5.2 |
| 6 | [image-6.png](source/image-6.png) | [figure-06.png](figures/figure-06.png) | 七 |
| 7 | [image-7.png](source/image-7.png) | [figure-07.png](figures/figure-07.png) | 7.1 |
| 8 | [image-8.png](source/image-8.png) | [figure-08.png](figures/figure-08.png) | 12.1 |
