# MVP, scope and exclusions: how much belongs in the first version?

The most important idea in this lesson: an MVP is not the barest possible product. It uses the least work needed to complete something useful that can be verified.

This lesson teaches a major software engineering skill: deciding what to do, what to leave for later, and how to tell when the work is complete.

That decision can matter even more than writing code. Choose the wrong scope and even a powerful AI Coding Agent may simply build unnecessary features faster.

This plain-language lesson develops the scope method from the original M03-04 v1.0.2 teaching.

## 1. Understand MVP through a restaurant

Suppose you want to open a restaurant that eventually offers 100 dishes.

There are two development approaches.

Approach A: finish everything at once.

Design 100 dishes, membership, reservations, delivery and reward points. The first customer only gets a meal six months later.

Approach B: make one boxed meal well.

Choose one meal, establish ordering, confirmation, preparation, out-of-stock handling and delivery, then invite customers to actually buy it.

This captures the central idea of an MVP.

@figure1

Even though the second restaurant sells only one meal, customers can complete a purchase.

A beautiful menu without the ability to serve food cannot verify the complete meal-collection task.

Therefore:

MVP = minimum necessary capabilities + a complete core flow + a verifiable result.

## 2. What does an MVP verify?

An easily missed point follows.

An MVP reduces uncertainty, rather than merely saving development time.

Suppose you want an AI document-processing system.

Possible capabilities include:

- Read documents automatically.
- Identify missing information.
- Generate reports automatically.
- Support multiple users.
- Query historical cases.
- Send emails automatically.

Each may have value, but you may not yet know which users need most.

The first question is not:

“How many features can we build?”

It is:

“What do we most need to establish first?”

For example:

Can users discover missing information before report export, complete it and obtain a correct report?

Until this is answered, membership, statistical charts and advanced AI models may not reduce the most important risk.

This is what distinguishes an MVP from a feature list.

## 3. Design an MVP in practice

Continue with the course’s synthetic intake case.

Suppose a report requires three fields: case name, date and owner. These field names are illustrative assumptions.

The first version needs only the following work:

@figure2

These five steps form a minimum complete workflow.

One detail is essential:

After previewing a report, a user might return and edit the input. The system must not continue treating the old report as current.

Therefore, edits must invalidate the old result and require another check.

This is a correctness constraint, not an optional feature that can be removed to shrink the MVP.

## 4. How should requirements be classified?

Think of the course’s three scope states as three boxes.

| Category | Plain meaning | Example |
| --- | --- | --- |
| In scope: first version | Must be done now | Data checks, correction and report export |
| Deferred | May be done later, with a condition for reopening | Shared use and historical queries |
| Out of scope: excluded from this version | Responsibilities this version explicitly does not take on | Official intake, real personal data and automatic external notifications |

The distinction between deferred and excluded work matters.

Deferring shared use does not promise it for the next version. Confirm user roles, permissions, data isolation and operational needs before deciding again.

Excluding official intake means that the project does not assume that business responsibility. A request to add it may require redefining the project.

This helps prevent Scope Creep: continually adding requests during development without reassessing time, cost and risk.

## 5. What if people keep requesting features?

Your first version is planned. Someone asks:

“Could we also upload 100 documents at once?”

It sounds like adding a batch-import button.

But consider the following:

What happens if document 37 has a problem? Does everything stop, or does processing continue? How are errors reported? Can it be rerun? Could rerunning create duplicate reports?

One feature may add an entire workflow, not just a button.

Use this simple decision model.

Decision matrix for new requirements.

| Decision question | Suggested response |
| --- | --- |
| Is the core task impossible without it? | Include it in the necessary first-version scope |
| Is it helpful without affecting this verification? | Defer it and record the condition for reopening |
| Does it introduce a new security or business responsibility? | Reassess scope and authorization |
| Would adding it exceed the planned time? | Present trade-offs for the scope owner to decide |

For batch import, explain that including it now may require deferring other work or adding development and testing time.

Never silently remove missing-input checks or necessary tests to meet the schedule.


## 6. What counts as a completed MVP?

Neither an AI Agent saying “the code is done” nor a website opening establishes completion.

Define Acceptance Criteria first so that different people can check consistently.

For example:

| Test situation | Expected result |
| --- | --- |
| All three required fields are complete | Allow a correct report to be generated |
| One required field is missing | Show missing-input feedback and block complete export |
| The user supplies missing information | Allow export after checking again |
| The user edits input after preview | Invalidate the old result and require a new check |
| The user does not know how to supply missing information | Observe whether feedback is clear enough and record problems |

The first four primarily check system behavior. The last observes whether users can actually operate it successfully.

Both matter; keep their evidence distinct.

These are proposed acceptance cases. They do not mean tests have actually run and passed.

## 7. What document should we produce?

The required artifact is problem.md.

It is a planning document, rather than code, that developers, AI Agents and requirement owners can all understand.

Use this simplified example for practice:

```
# MVP 範圍定義

## 核心問題
使用者能否在匯出前發現並修正必要欄位缺漏？

## 第一版
- 輸入必要欄位
- 檢查缺漏
- 提示並允許修正
- 重新檢查
- 預覽與匯出

## 必要約束
- 缺件不得完整匯出
- 修改資料後舊結果必須失效

## 延後
- 歷史查詢
  - 重新啟動條件：確認保存與刪除規則
- 多人共用
  - 重新啟動條件：確認角色、權限及資料隔離

## 本版不做
- 正式受理
- 處理真實個資
- 自動對外通知

## 完成條件
- 缺件測試通過
- 補齊重查測試通過
- 修改後重查測試通過
- 完成使用者操作觀察
```

This document means an AI Coding Agent does not have to guess which features establish completion.

However, problem.md is this lesson’s requirements artifact; it does not replace later technical specifications, test design or security review.

## 8. MVP, Prototype and PoC: what differs?

These terms often appear together, but answer different questions.

| Concept | Main question |
| --- | --- |
| Prototype | Does this design look and feel reasonable to operate? |
| PoC: Proof of Concept | Is the key technology feasible? |
| MVP: Minimum Viable Product | Can the smallest complete capability deliver value and test a key assumption? |

They can overlap. An operable prototype can test an MVP workflow. But a successful technical PoC does not establish that users need the product.

M03-04 applies the MVP method of minimum complete scope to a teaching prototype. Completing a classroom demo does not establish market validation for a production product.

## 9. The central decision sequence

Remember this decision order:

Ask what to establish → choose a minimum complete flow → retain necessary constraints → explicitly record exclusions → define acceptance evidence → begin development.

This applies whether you later use Svelte, SvelteKit, Rust or an AI Coding Agent.

Technology choices answer “How will we implement it?” MVP scope decisions answer “What is worth building in this version?” Keep that order.

## 10. Check your understanding

You are developing an AI document-analysis system. The first version asks whether AI can correctly identify missing information and help users correct it.

Consider four development directions.

A. Prioritize a beautiful home page and login interface.

B. Complete upload, missing-input checks, correction and revalidation.

C. Add multiple models, collaboration and batch processing at once.

D. Let AI generate reports first and postpone correctness tests.

Which would you choose, and why?

Use the reference explanation below to check your reasoning.
