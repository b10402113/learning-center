# 設計 YouTube 視頻串流平台

## 📝 課程概述

本章探討如何設計一個全球級視頻串流平台（如 YouTube、Netflix、Hulu），涵蓋視頻上傳、轉碼處理、CDN 分發、串流播放等核心流程。透過容量估算、高層次架構設計到深入優化，我們將學習如何處理大流量、低延遲、高成本的技術挑戰，並掌握 DAG 模型、並行化設計、成本優化等關鍵技術。這是一個展現分散式系統設計能力的經典案例。

## 核心觀念與實作解析

### YouTube 的規模與挑戰

在開始設計前，我們先看看 YouTube 2020 年的**驚人數據**：

- 每月活躍用戶：20 億
- 每日觀看視頻數：50 億
- 美國成年人使用率：73%
- 創作者數量：5000萬
- 2019 年廣告收入：151億美元（年增 36%）
- 占全球移動網路流量：37%
- 支援語言：80種

**為什麼這些數據很重要？**
這告訴我們系統必須處理**全球級流量**、**海量數據儲存**、**高營收壓力**，以及**多語言支援需求**。設計時必須考慮擴展性、成本控制與跨區域部署。

### 需求澄清與範圍界定

在面試中，第一步是**釐清核心功能**。YouTube 功能繁多（評論、分享、喜歡、播放列表、訂閱等），我們需要聚焦。

**關鍵提問：**

- **核心功能**：上傳視頻與觀看視頻
- **支援客戶端**：Mobile App、Web Browser、Smart TV
- **用戶規模**：500萬 DAU
- **平均使用時間**：每日 30 分鐘
- **國際用戶**：大部分為國際用戶
- **視頻解析度**：支援大多數解析度與格式
- **加密需求**：需要
- **檔案大小限制**：最大 1GB（專注中小型視頻）
- **是否使用雲端服務**：建議利用現有雲端服務（AWS、Google Cloud、Microsoft Azure）

**為什麼建議使用雲端服務？**

1. **面試時間有限**：選擇合適技術比解釋技術細節更重要
2. **實務考量**：連 Netflix、Facebook 都不會自建所有基礎設施（Netflix 用 AWS，Facebook 用 Akamai CDN）
3. **成本與複雜度**：自建 scalable blob storage 或 CDN 極度複雜且昂貴

### 容量估算：成本是關鍵考量

**基礎假設：**

- 500萬 DAU
- 每人每天觀看 5 個視頻
- 10% 用戶每天上傳 1 個視頻
- 平均視頻大小：300 MB

**儲存空間計算：**

```
每日儲存需求 = 5,000,000 users × 10% × 300 MB
            = 150 TB
```

**CDN 成本估算（關鍵洞察）：**

假設使用 Amazon CloudFront CDN：

- 美國流量成本：每 GB $0.02
- 100% 流量來自美國（簡化計算）

```
每日 CDN 成本 = 5,000,000 users × 5 videos × 0.3GB × $0.02
            = $150,000/day
```

**每月 CDN 成本 ≈ $4.5 million**

**為什麼這個計算很重要？**
CDN 成本極高，這是我們必須在深入設計中優化的核心問題。即使是大型客戶，雲端供應商雖會降價，但成本仍然可观。

### 高層次設計：三大核心組件

系統拆分為三個主要部分：

**1. Client（客戶端）**

- 電腦、手機、Smart TV
- 發送請求並接收視頻串流

**2. CDN（內容分發網路）**

- 儲存視頻檔案
- 按下播放鍵後，視頻從 CDN 串流傳送

**3. API Servers**

- 處理除視頻串流外的所有請求
- 包括：推薦系統、生成上傳 URL、更新元數據、用戶註冊等

**為什麼要分離 API Servers 和視頻串流？**
因為視頻串流需要專門的 CDN 基礎設施，而 API Servers 處理的是相對輕量的業務邏輯。分離可以讓我們獨立擴展與優化各個部分。

### 視頻上傳流程詳解

**流程拆分為兩個並行過程：**

- **Flow A**：上傳實際視頻檔案
- **Flow B**：更新視頻元數據（檔名、大小、格式等）

#### Flow A：上傳視頻檔案

**核心組件介紹：**

1. **Load Balancer**
   - 將請求均勻分配到 API Servers

2. **API Servers**
   - 所有用戶請求（除視頻串流外）都經過此層

3. **Metadata DB**
   - 儲存視頻元數據
   - 已分片（sharded）與複製以滿足效能與高可用性

4. **Metadata Cache**
   - 快取視頻元數據與用戶物件以提升效能

5. **Original Storage（Blob Storage）**
   - 儲存原始視頻
   - Blob（Binary Large Object）：以單一實體儲存的二進位資料集合

6. **Transcoding Servers**
   - 視頻轉碼（Video Encoding）
   - 將視頻轉換為不同格式（MPEG、HLS等），適配不同設備與網路環境

7. **Transcoded Storage**
   - 儲存轉碼後的視頻檔案

8. **CDN**
   - 快取轉碼後的視頻
   - 串流播放時從 CDN 取得

9. **Completion Queue**
   - 儲存轉碼完成事件的訊息佇列

10. **Completion Handler**
    - 從 Completion Queue 提取事件
    - 更新 Metadata Cache 和 DB

**詳細執行步驟：**

1. **上傳原始視頻**到 Original Storage
2. **Transcoding Servers**從 Original Storage 取得視頻並開始轉碼
3. 轉碼完成後，兩個並行步驟：
   - **3a**: 轉碼視頻送往 Transcoded Storage → 分發到 CDN
   - **3b**: 轉碼完成事件進入 Completion Queue
4. **Completion Handler**持續從 Queue 提取事件：
   - 更新 Metadata DB 和 Cache
5. **API Servers**通知客戶端視頻已成功上傳並可播放

#### Flow B：更新元數據

在視頻上傳的同時，客戶端並行發送請求更新元數據：

- API Servers 更新 Metadata Cache 和 DB
- 確保元數據與視頻檔案同步

**為什麼要並行處理？**
因為元數據更新與視頻上傳是獨立操作，並行處理可提升整體效能，避免等待。

### 視頻串流流程：串流協議是關鍵

**核心概念：串流 vs 下載**

- **下載**：整個視頻複製到設備
- **串流**：設備持續從遠端接收視頻串流，可立即播放並連續觀看

**為什麼串流很重要？**
使用者不想等待整個視頻下載完成，串流技術讓他們能立即開始觀看。

#### 串流協議（Streaming Protocols）

**主流協議介紹：**

- **MPEG-DASH**：Dynamic Adaptive Streaming over HTTP
- **Apple HLS**：HTTP Live Streaming
- **Microsoft Smooth Streaming**
- **Adobe HDS**：HTTP Dynamic Streaming

**不需要記住這些名稱，但要理解核心概念：**
不同協議支援不同的視頻編碼與播放器。設計時需根據使用案例選擇合適協議。

**串流流程：**

1. 視頻直接從 CDN 串流
2. 距離使用者最近的 Edge Server 提供視頻
3. 延遲極低

### 深入設計：視頻轉碼的核心技術

#### 為什麼需要視頻轉碼？

**四大核心原因：**

1. **儲存空間優化**
   - 原始視頻占用巨大空間
   - 一小時高畫質視頻（60fps）可能占用數百 GB

2. **跨設備兼容性**
   - 不同設備、瀏覽器支援不同格式
   - 必須編碼為多種格式確保兼容

3. **網路環境適配**
   - 高網路带宽用戶：提供高解析度視頻
   - 低網路带宽用戶：提供低解析度視頻
   - 確保高品質且流暢播放

4. **網路條件變化**
   - 移動設備網路環境易變化
   - 需自動或手動切換視頻品質

**視頻編碼格式組成：**

1. **Container（容器）**
   - 如「篮子」裝載視頻、音頻、元數據
   - 檔案副檔名識別：.avi, .mov, .mp4

2. **Codecs（編解碼器）**
   - 壓縮與解壓縮算法
   - 目標：減少視頻大小並保持品質
   - 常見：H.264, VP9, HEVC

#### DAG 模型：實現靈活性與並行性

**挑戰：**

- 轉碼計算密集且耗時
- 不同創作者有不同處理需求（水印、縮略圖、高畫質等）

**解決方案：DAG（Directed Acyclic Graph）模型**

**核心思想：**

- 定義任務為階段（stages）
- 任務可順序執行或並行執行
- 客戶端程式師可自定義任務

**DAG 範例：**
原始視頻拆分為：

- Video
- Audio
- Metadata

**Video 可執行的任務：**

- Inspection（檢查品質）
- Video Encodings（轉碼為不同解析度）
- Thumbnail（生成或提取縮略圖）
- Watermark（添加水印）

**Audio 任務：**

- Audio Encoding

**為什麼 DAG 重要？**
提供抽象層，讓系統能靈活支援不同處理流程，並保持高並行性。

#### 視頻轉碼架構詳解

**六大核心組件：**

**1. Preprocessor**

四個主要職責：

1. **Video Splitting**
   - 按 GOP（Group of Pictures）alignment 拆分視頻
   - GOP：特定順序排列的帧組，每個 chunk 可獨立播放（通常幾秒長）

2. **Old Client Support**
   - 老舊設備可能不支援視頻拆分
   - Preprocessor 代為拆分

3. **DAG Generation**
   - 根據客戶端程式師的配置檔生成 DAG
   - 配置檔定義任務節點與邊

4. **Cache Data**
   - 快取分段視頻
   - 儲存 GOPs 和元數據到 Temporary Storage
   - 失敗時可重試

**2. DAG Scheduler**

- 將 DAG 拆分為任務階段
- 放入 Resource Manager 的 Task Queue

**範例流程：**

- Stage 1：Video, Audio, Metadata
- Stage 2：Video Encoding, Thumbnail, Audio Encoding

**3. Resource Manager**

管理資源分配效率，包含：

- **Task Queue**：待執行任務（優先級佇列）
- **Worker Queue**：Worker 利用資訊（優先級佇列）
- **Running Queue**：當前執行任務與 Worker 資訊
- **Task Scheduler**：選擇最佳 Task/Worker 配對

**執行流程：**

1. Task Scheduler 從 Task Queue 取得最高優先級任務
2. 從 Worker Queue 取得最佳 Worker
3. 指示 Worker 執行任務
4. 將 Task/Worker 配對放入 Running Queue
5. 任務完成後從 Running Queue 移除

**4. Task Workers**

執行 DAG 中定義的任務：

- 不同 Worker 可執行不同任務
- Video Encoding Worker
- Audio Encoding Worker
- Thumbnail Worker
- Watermark Worker

**5. Temporary Storage**

多種儲存系統，根據：

- 資料型態
- 資料大小
- 存取頻率
- 資料生命週期

選擇：

- **Metadata**：存取頻率高、大小小 → 快取在 Memory
- **Video/Audio**：放在 Blob Storage
- 視頻處理完成後釋放資料

**6. Encoded Video**

最終輸出範例：

```
funny_720p.mp4
funny_480p.mp4
funny_360p.mp4
```

### 系統優化策略

#### 速度優化一：並行化視頻上傳

**問題：** 上傳整個視頓效率低

**解決方案：** 按 GOP alignment 拆分為小 chunks

**優點：**

- 上傳失敗時可快速恢復
- 客戶端可實現拆分邏輯提升速度

**實作：** 客戶端將視頻拆分為 GOP chunks，並行上傳

#### 速度優化二：靠近用戶的上傳中心

**策略：** 在全球設置多個上傳中心

- 美國用戶 → 北美上傳中心
- 中國用戶 → 亞洲上傳中心

**實作：** 使用 CDN 作為上傳中心

#### 速度優化三：全面並行化

**問題：** 系統模組耦合度高，難以並行

**原流程：**

```
Original Storage → Download → Encoding → CDN
```

每個步驟依賴前一個步驟輸出，難以並行。

**解決方案：引入 Message Queue**

**範例：**

- **引入前**：Encoding 模組必須等待 Download 模組輸出
- **引入後**：Encoding 模組不需等待，只要有事件在 Queue 就可並行執行

**為什麼 Message Queue 能解耦？**
因為模組間透過佇列通信，而非直接依賴，各模組可獨立並行運作。

#### 安全優化一：Pre-signed Upload URL

**核心思想：** 確保只有授權用戶能上傳視頻到正確位置

**流程：**

1. 客戶端向 API Servers 請求 Pre-signed URL
2. API Servers 返回 Pre-signed URL（含存取權限）
3. 客戶端使用 Pre-signed URL 上傳視頻

**不同雲端服務的命名：**

- Amazon S3：Pre-signed URL
- Microsoft Azure：Shared Access Signature

#### 安全優化二：保護視頻內容

**三大安全選項：**

**1. DRM Systems（Digital Rights Management）**

- Apple FairPlay
- Google Widevine
- Microsoft PlayReady

**2. AES Encryption**

- 加密視頻並配置授權政策
- 播放時解密
- 確保只有授權用戶可觀看

**3. Visual Watermarking**

- 視頻上添加圖像浮水印
- 包含識別資訊（公司 logo 或名稱）

#### 成本優化：CDN 是最大支出

**觀察：YouTube視頤呈長尾分佈**

- 少數熱門視頻被頻繁存取
- 大量視頤幾乎無觀看者

**四大優化策略：**

**1. 熱門視頤放 CDN，其他放高容量儲存伺服器**

- 熱門視頤 → CDN（快速分發）
- 其他視頤 → 自建儲存伺服器（成本較低）

**2. 不流行內容不需儲存多個編碼版本**

- 短視頤可按需編碼（On-demand Encoding）

**3. 地區性熱門視頤不分發到其他地區**

- 某視頤只在特定國家流行 → 不分發到全球 CDN

**4. 自建 CDN並與 ISP 合作**

- Netflix模式：自建 CDN + 合作 ISP
- ISP（如 Comcast、AT&T、Verizon）遍布全球且靠近用戶
- 提升觀看體驗並降低带宽費用

**為什這些優化有效？**
基於內容流行度、用戶存取模式、視頤大小等歷史數據分析，精準配置資源。

### 錯誤處理機制

大型系統錯誤不可避免，需建立容錯機制。

**錯誤分類：**

**1. Recoverable Error（可恢復錯誤）**

- 如：視頤分段轉碼失敗
- 策略：重試數次，若持續失敗則返回錯誤碼

**2. Non-recoverable Error（不可恢復錯誤）**

- 如：視頤格式異常
- 策略：停止相關任務並返回錯誤碼

**各組件錯誤處理 Playbook：**

| 組件                        | 錯誤處理策略                          |
| --------------------------- | ------------------------------------- |
| Upload Error                | 重試數次                              |
| Split Video Error           | 老舊客戶端無法拆分 → Server端代為拆分 |
| Transcoding Error           | 重試                                  |
| Preprocessor Error          | 重新生成 DAG                          |
| DAG Scheduler Error         | 重新排程任務                          |
| Resource Manager Queue Down | 使用 Replica                          |
| Task Worker Down            | 在新 Worker 重試                      |
| API Server Down             | Stateless → 路由到其他 Server         |
| Metadata Cache Server Down  | 使用 Replica節點                      |
| Metadata DB Master Down     | 提升 Slave為新 Master                 |
| Metadata DB Slave Down      | 使用其他 Slave，啟動新節點            |

### 延伸討論

#### API Tier 擴展

- API Servers 是 Stateless → 容易水平擴展

#### Database 擴展

- 可討論 Database Replication 和 Sharding

#### Live Streaming（即時串流）

**與非即時串流的相似處：**

- 都需上傳、編碼、串流

**差異：**

- **延遲需求更高**：需不同串流協議
- **並行性需求較低**：小 chunk 已即時處理
- **錯誤處理不同**：耗時錯誤處理不可接受

#### Video Takedowns（視頤下架）

移除違反版權、色情、非法內容的視頤：

- 上傳過程中由系統偵測
- 透過用戶標記（User Flagging）發現
