export type Glyph = 'sheet'|'strip'|'matrix'|'vector'|'operator'|'gate'|'vault'|'lens'|'machine'|'meter'|'stamp'|'clock'|'person'|'message';
export type ObjectSpec = { glyph: Glyph; zh: string; en: string };
const groups: Record<Glyph,string> = {
  sheet: `text|輸入文字|Input text
form|申請表|Form
external|外部文件|External text
requirement|需求規格|Specification
task|當前任務|Current task
history|歷史對話|History
sources|來源文件|Sources
rules|指令|Instructions
failedUse|未依規格產出|Application error
residual|殘差路徑|Residual
normalization|正規化|Normalization
rule|判斷規則|Rule
summary|摘要|Summary
handoff|交接紀錄|Handoff
revision|修訂版本|Revision
version|文件版本|Version
openWork|未完事項|Open work
artifact|交付物|Artifact
patch|程式變更|Patch
fixture|測試資料|Fixture
plan|行動順序|Plan
claim|宣稱|Claim
original|原始排列|Original
authority|有效規格|Authority
args|參數|Arguments
proposal|動作提議|Proposal
advertised|宣告能力|Advertised
expected|預期結果|Expected
input|輸入|Input
output|輸出|Output
day|日期類型|Day type
subjects|科目數|Subjects
distractors|干擾文本|Distractors`,
  strip: `token|詞元|Token
pieces|切分結果|Pieces
tokens|詞元序列|Tokens
ids|ID 序列|Token IDs
id|列索引|Row ID
prefix|已知前綴|Prefix
nextToken|下一詞元|Next token
newPrefix|新前綴|New prefix
pos1|位置 1|Position 1
pos2|位置 2|Position 2
pos3|位置 3|Position 3
front|開頭|Beginning
middle|中間|Middle
end|結尾|End
position|位置資訊|Position
placement|證據位置|Placement
ordered|含位置表示|Ordered input
reordered|交換位置|Reordered
requestId|呼叫識別碼|Call ID
taskId|任務識別碼|Task ID`,
  matrix: `matrix|嵌入矩陣|Embeddings
vocab|詞彙表|Vocabulary
mask|因果遮罩|Causal mask
headA|注意力頭 A|Head A
headB|注意力頭 B|Head B
attention|注意力|Attention
keys|可見的鍵|Visible keys`,
  vector: `vector|輸出向量|Vector
row21|第 21 列|Row 21
row42|第 42 列|Row 42
query|查詢|Query
keyA|鍵 A|Key A
keyB|鍵 B|Key B
valueA|值 A|Value A
valueB|值 B|Value B
mixed|混合向量|Mixed vector
weights|正規化權重|Weights
scores|匹配分數|Scores
distribution|候選分布|Distribution
probability|生成機率|Probability`,
  operator: `tokenizer|切分器|Tokenizer
expA|指數 A|Exp A
expB|指數 B|Exp B
sum|共同分母|Sum
partA|加權貢獻 A|2 × wA
partB|加權貢獻 B|6 × wB
weighted|加權和|Weighted sum
concat|串接|Concatenate
projection|投影|Projection
feedforward|前饋運算|Feed-forward
select|選取|Select
load|載入|Load
repair|補正|Repair
revise|調整行動|Revise
dedup|去重比對|Deduplicate
control|控制邏輯|Control`,
  gate: `schema|格式檢查|Schema
authorization|授權|Authorize
policy|政策判斷|Policy
decision|分支判斷|Decision
scope|核准範圍|Scope
sandbox|沙箱邊界|Sandbox
security|安全控制|Security
capability|實際權限|Capability
allow|允許|Allow
deny|拒絕|Deny
stop|停止|Stop
unknown|結果未知|Unknown`,
  vault: `archive|封存區|Archive
cache|計算快取|Cache
keyCache|鍵快取|Key cache
valueCache|值快取|Value cache
memory|外部記憶|Memory
workspace|工作區|Workspace`,
  lens: `visible|可見範圍|Visible scope
grounding|來源核對|Grounding
verify|核對|Verify
inspect|查證副作用|Check effect
diagnosis|診斷|Diagnosis
retrieval|擷取|Retrieval
review|審查|Review
observation|觀察結果|Observation
observed|觀測紀錄|Observed
symptom|症狀|Symptom
conflict|規格衝突|Conflict
missing|缺漏項目|Missing`,
  machine: `model|語言模型|Model
runtime|執行環境|Runtime
execution|執行|Execution
agent|代理決策|Agent
workflow|固定流程|Workflow
tools|工具集合|Tools
tool|工具|Tool
host|主機|Host
interface|共用介面|Interface
orchestration|編排|Orchestration
harness|外部支援|Harness
action|提議動作|Action
reproduce|重現測試|Reproduce
write|寫入動作|Write
transport|訊息傳遞|Transport`,
  meter: `count|詞元數|Count
capacity|容量上限|Capacity
fixed|固定配置|Fixed
reserve|輸出預留|Reserve
used|使用量|Used
fits|可容納|Fits
over|超額|Overflow
scoreA|分數 A|Score A
scoreB|分數 B|Score B
metric|指標|Metric`,
  stamp: `evidence|驗證證據|Evidence
tests|測試|Tests
verification|驗收|Verification
receipt|交付紀錄|Receipt
result|工具結果|Result
effect|已記錄副作用|Effect
cacheHit|快取命中|Cache hit`,
  clock: `weekday|平日|Weekday
weekend|週末|Weekend
timeout|逾時|Timeout
timing|耗時量測|Timing
record|留下紀錄|Record
logs|日誌|Logs
trace|追蹤|Trace
event|事件|Event
telemetry|可觀測性|Observability`,
  person: `user|使用者|User
reviewer|審查者|Reviewer`,
  message: `packet|本次輸入|Input packet
context|脈絡|Context
message|請求訊息|Request
response|回應|Response
chat|對話介面|Chat
reply|答覆|Reply`
};
export const objects: Record<string,ObjectSpec> = {};
for (const [kind, entries] of Object.entries(groups)) {
  for (const line of entries.split('\n')) {
    const [id,zh,en] = line.split('|');
    objects[id] = {glyph:kind as Glyph,zh,en};
  }
}
