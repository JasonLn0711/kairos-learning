# M03-05 | Success Metrics, Hypotheses and Requirement Records: How Do We Know a System Helps?

This lesson determines whether the system you build merely runs or actually solves the problem.

Remember this principle: delivering a feature does not establish that a goal has been achieved. Achievement needs evidence, and you must define how to obtain that evidence beforehand.

Imagine spending a month developing an AI system and reporting to your manager:

“We completed 20 features, wrote 10,000 lines of code, and the AI can generate reports automatically!”

Your manager might ask just one question:

“How much faster is the work that used to take half an hour? Have errors decreased?”

That is the core question for today.

## 1. Connect Requirements with Evidence

First, connect the parts of the software development process.

@figure1

The crucial distinction is that requirements specify what a system should do; hypotheses explain why a design might work; metrics define how to judge the outcome.

Keep these three concepts distinct.

## 2. Functional and Task Metrics: System Success and User Success

Suppose you are developing an AI document-intake system.

Users upload documents, the system checks for missing items, and it generates a report.

How can you tell whether it works well?

You need two perspectives.

@figure2

Why must these metrics be recorded separately?

Imagine a system with a “Check for missing items” button.

Engineers find that every click performs the check correctly: the functional metric reaches 100%.

Actual users, however, cannot find the button.

In that situation:

- The feature may pass its engineering test.
- The user's task may still fail.

The reverse also holds. A user successfully generating one report does not establish that the system has passed every safety and exception check.

A useful system needs evidence both that its behavior is correct and that users can accomplish their tasks.

## 3. Calculate Success Metrics: The Denominator Matters

Now work through the arithmetic.

Suppose there are six synthetic test records: four have missing information and two are complete.

| Case | Data status | System behavior |
| ---- | ---- | ---- |
| A | Missing name | Export blocked |
| B | Missing telephone number | Export blocked |
| C | Missing attachment | Export blocked |
| D | Missing identity information | Incorrectly allowed export |
| E | Complete data | Export allowed |
| F | Complete data | Export allowed |

The measure we want is the missing-input blocking rate.

Formula: missing-input blocking rate = successfully blocked missing-input cases / all missing-input cases × 100%.

Therefore: 3/4 × 100% = 75%.

@figure3

Remember three points.

First, the denominator must match the target of your question. We are asking whether missing input is blocked, so the denominator is the four incomplete records, rather than all six.

Second, percentages cannot replace raw counts. Although 75% may sound acceptable, 3/4 exposes the one missed case. This fails the particular acceptance requirement.

Third, no test does not mean success. If there are no missing-input cases, the denominator is zero and the rate cannot be calculated. Record “not measured / not applicable” rather than 100%.

There is another trap: blocking all six records also produces a missing-input blocking rate of 100%, while preventing complete records from being processed.

Pair this metric with functional tests such as whether complete data can be exported correctly, so that optimizing one number does not prevent useful work.

## 4. Establish Whether Users Really Finish Faster

Suppose an AI product claims:

“Our product saves five minutes when producing a report.”

Your first question should be:

How were those five minutes measured?

Consider two timing methods.

@figure4

The apparent saving is five minutes, but the workflows use different starting points.

That comparison is unfair.

Use the same task, data of comparable difficulty, and matching start and end conditions as far as possible. Record whether users receive additional assistance.

For example, define the interval as:

“From the first time the user sees the assigned data until they obtain a correct report matching the current data.”

Even with that definition, consider this:

If a user tries the old system first and the new system second, they may finish faster simply because they now know the task.

This is the practice effect.

A single observed time difference therefore cannot establish that the new system caused the improvement. A stronger comparison can vary workflow order across participants or use different tasks of equivalent difficulty.

Timing only successful participants also creates a problem. If half abandon the task, you cannot report the mean time of the successful half without disclosing the failures.

## 5. Hypotheses: Beliefs Need Testing

This distinction matters especially in AI development.

To help users correct their own data, suppose you design this feature:

“When information is missing, display the names of the missing fields.”

You expect users to fill in the information themselves.

But remember:

This is a design hypothesis, not an established fact.

It may fail for several reasons.

Users may not understand the field name. They may know what is missing but not where to get it. They may know the source but lack permission to access it.

Turn the idea into a statement that can be tested.

| Item | Concrete example |
| ---- | ---- |
| Hypothesis | Explicitly listing missing fields helps users correct their own data |
| Test method | Ask users to complete an assigned correction task without hints |
| Observations | Unprompted completion rate, where users get stuck and why |
| Disconfirming condition | Users understand the message but repeatedly cannot find the source data |
| Next step | Investigate how data is obtained or improve the feedback design |

The disconfirming condition is particularly useful.

It asks:

What result would make me willing to revise the original idea?

Scientific research and engineering verification share this question.

A research paper proposes a hypothesis, obtains evidence through experiments, and then draws a conclusion.

Software engineering follows the same logic, with evidence potentially coming from functional tests, user task tests or operational data.

## 6. Requirement Records: Preserve the Reason for Changes

The final core concept is traceability: being able to follow a requirement back to its source and decisions.

Imagine this development situation.

The original requirement says:

“Users may export a report after completing the data check.”

The engineer implements the feature.

Testing then reveals a problem.

@figure5

This is a common type of problem.

The original requirement may be incomplete without being wrong.

Instead of silently overwriting the original, record:

| Record type | Example |
| ---- | ---- |
| R-01 requirement | Missing items must prevent complete-report export |
| H-01 hypothesis | Clear missing-input feedback helps users correct data independently |
| M-01 metric | Every specified missing-input case must be blocked |
| C-01 change | Input edits invalidate the previous check result |
| Reason | A stale check result could otherwise allow export |
| Acceptance evidence | Testing pending; no evidence obtained yet |

Why is this table useful?

Three months later, a new engineer may ask: “Why must users check again every time they edit the data?”

The record points to the original requirement, discovered risk, decision rationale, and the test that verifies the rule.

This is requirements traceability. It supports long-term maintenance as well as document management.

H, M, R and C are demonstration category codes in this lesson, rather than a mandatory standard.

## 7. Start Applying This with One Document

An MVP does not necessarily need a large requirements-management system.

Start with a Markdown file named problem.md that holds the essential information together.

Here is a compact example. The Chinese template is preserved identically in both editions; it records the problem, R-01, unverified H-01, M-01/M-02 with their denominators and unmeasured results, C-01 with its reason, and pending evidence.

```
# AI 文件收件系統

## 問題
使用者常因資料缺漏，產生不完整報告。

## 需求 R-01
缺件時不得完整匯出報告。

## 假設 H-01
顯示缺漏欄位可以協助使用者自行修正。

狀態：尚未驗證

## 功能指標 M-01
名稱：缺漏阻擋率
公式：阻擋成功數 / 指定缺漏案例數
要求：指定案例全數阻擋
結果：未測量

## 任務指標 M-02
名稱：無提示完成率
公式：無提示完成者 / 開始任務者
結果：未測量

## 變更 C-01
修改輸入後，舊檢查結果必須失效。

理由：避免以過期結果匯出。

## 待補證據
- 功能測試結果
- 使用者測試紀錄
- 驗收決策
```

In the template, the problem is incomplete reports caused by missing data. R-01 prohibits complete-report export when required items are missing. H-01 proposes that naming missing fields will help users correct data themselves; its status remains unverified. M-01 names the blocking rate, divides successful blocks by specified missing-input cases and requires all those cases to be blocked; its result remains unmeasured. M-02 divides unprompted completions by everyone who starts the task; its result also remains unmeasured. C-01 invalidates the old check after an input edit, to prevent export based on stale results. Functional test results, user test records and the acceptance decision are still needed. The document's value comes from the questions it answers, rather than its field count.

Anyone opening it should be able to tell:

“What problem are we solving? What do we currently believe? How will we judge success? What has actually been tested? Why are we making a change?”

That makes the document useful during development, acceptance and maintenance.

## 8. Place This Lesson in the Wider Engineering Process

Think of M03-05 as a bridge between requirements engineering and software testing.

| Question | Engineering concept |
| ---- | ---- |
| What should the system do? | Requirements Engineering |
| Why might this design work? | Hypothesis |
| How will we judge its performance? | Metrics / Acceptance Criteria |
| How do we obtain reliable results? | Testing / Evaluation |
| Where did each rule come from? | Requirements Traceability |
| What happens when results differ from expectations? | Change Management |

Distinguish three frequently confused terms:

Verification: did we build the system correctly according to the specified requirements?

Validation: does the system meet the real needs of users doing their work?

Evaluation: measuring system performance and limitations using defined metrics and methods.

Correctly identifying missing input is important verification evidence. Users successfully completing correction tasks can provide validation evidence.

These evidence types complement one another, and each requires more than an unsupported claim.

## 9. Check Your Understanding

This is a new synthetic scenario. Try answering first; the questions stay visible here, and reference answers can be expanded in “Understanding checks and reference explanations” below.

A hospital is testing an AI document-checking system.

Engineers prepare five missing-input cases. Four are blocked, but one still allows export.

Four participants start the task: two finish independently, one needs a staff hint, and one abandons it.

The project manager claims: “We expect to save each user eight minutes, so the system already has value for release.”

Answer these questions:

1. What is the missing-input blocking rate? Does it pass a requirement that every specified missing-input case be blocked?
2. What is the unprompted completion rate? Should the person needing a hint remain in the denominator?
3. Is “saving eight minutes” currently a hypothesis, a measured result, or a formal conclusion? How would you verify it?
4. If input edits leave the previous check result active, what requirement would you add? What change records would you retain?

The lesson's main point is to provide reliable, relevant evidence that the original problem has improved, rather than counting activities completed.

Next, M04-01 introduces HCI, UI and UX. Today's question—whether users can complete their tasks—supports the later work on user experience design and usability testing.
