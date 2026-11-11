# M03-03 | As-Is, To-Be and User Flow: turning work into useful software

Before developing software, understand how people currently do the work, how they want to do it in future, and what should happen when something goes wrong.

Whether you are developing hospital appointment booking, factory management, an online shop, an internal banking tool or an AI Agent, first understand three concepts:

- As-Is (current workflow): How is this task done now?
- To-Be (target workflow): How should it work better in future?
- User Flow: Which actions, decisions and branches must a user follow in the new system to complete the task?

Their relationship can be expressed in one sentence:

As-Is helps identify problems, To-Be helps design improvements, and User Flow helps check that the proposed approach can actually be followed.

That is why software development cannot begin only with “Should we use React, Python or a particular AI model?” Technology implements the work; first establish what the work requires.

## 1. Understand the concepts through everyday work

Suppose you run a restaurant and order ingredients from a supplier every morning.

As-Is: the current way of working

The manager checks the refrigerator, writes missing ingredients on paper and phones the supplier. If nobody answers, the manager must call again later.

Problems: time spent, missed items and incomplete records.

To-Be: the proposed improved way

The manager opens an ordering system showing stock and suggested purchase quantities, confirms the quantities and submits an order. The supplier receives a notification.

Goals: reduce repeated work, lower the chance of missing items and retain records.

User Flow: how will someone actually operate it?

Sign in → check stock → adjust quantities → confirm → submit.

But what if ingredients are unavailable, prices change, the network fails or the manager cancels? Each situation needs an explicit path.

The To-Be above is a design hypothesis, not demonstrated performance improvement. Before launch, check the accuracy of the data, whether the manager will adopt the system and whether the new method adds work.

@figure1

This is the purpose of Requirements Engineering: understand whether the system can improve real work, beyond imagining an attractive interface.

## 2. Fix the start and endpoint before comparing workflows

Fix the comparison scope before judging whether a workflow improves the task.

Imagine two people comparing travel from Taipei to Kaohsiung.

Person A says, “Driving takes me four hours.”

Person B says, “High-speed rail takes only one and a half hours.”

But A counts the trip from home to the destination, while B counts only time on the train and excludes travel to and from the stations.

These measurements do not support a fair comparison.

The same applies to work processes.

Suppose a hospital wants to improve appointment booking:

| Comparison | As-Is | To-Be |
| --- | --- | --- |
| Start | Patient decides to book an outpatient appointment | Patient decides to book an outpatient appointment |
| Actions | Phone, ask about times and confirm details | Select specialty and time online, then confirm details |
| Endpoint | Obtain a valid booking or cancel | Obtain a valid booking or cancel |
| Special cases | No slots or incorrect details | No slots or incorrect details |

Both sides must handle the same task before you can reasonably compare time, cost, error rate or completion rate.

If As-Is includes connecting the call, hospital review, check-in and consultation, while To-Be includes only clicking “Book”, the comparison has different boundaries.

### Five elements for defining a task

Task definition = actor + trigger + end state + success condition + scope

For online appointment booking:

Actor: the patient making the appointment.

Trigger: the patient wants to book a particular outpatient visit.

End State: a successful booking with confirmation details, or cancellation.

Success Condition: the system actually creates a valid appointment and the patient can confirm its details.

Scope: booking operations are included; subsequent diagnosis and treatment are excluded.

These five elements form a practical framework, not a mandatory standard.

A “Success” message alone does not establish business success. There must also be corresponding evidence, such as an appointment record actually being created.

## 3. As-Is: understand work as it happens

Think of As-Is as a record of work in the field.

Suppose factory equipment faults are handled by maintenance staff:

1. An operator notices abnormal equipment behavior.
2. The operator phones a supervisor.
3. The supervisor contacts maintenance.
4. A maintenance worker assesses the equipment on site.
5. After repair, the worker completes a paper record.
6. The supervisor confirms that the equipment can resume operation.

This is one possible As-Is workflow.

Recording these six steps still leaves important questions unanswered.

What if the supervisor is absent, parts are unavailable or the fault recurs? Who can find the previous record? Could somebody restart the equipment before its safety check is complete?

These apparently small situations often explain why a system is needed.

### How can you establish a credible As-Is?

Build it progressively from three kinds of evidence:

| Evidence | What it can answer | Limitation |
| --- | --- | --- |
| SOPs, forms and existing documents | How work is supposed to happen | Does not establish actual practice |
| Interviews with staff | How they believe they complete the work | Habitual actions may be omitted |
| Observation and operational records | What actually happens and where work gets stuck | Coverage and representativeness need consideration |

Keep observed current practice separate from your assumptions about it.

For example:

“The factory normally requires supervisor approval before requesting maintenance.”

Without interviews, records or a supporting policy, mark this as an assumption to confirm, rather than a verified fact.

This follows GOV.UK's Discovery approach: before committing to construction, understand users' work, existing arrangements, constraints and relationships with other teams.

## 4. To-Be: redesign work and allocate responsibility

Suppose the factory maintenance system is about to introduce AI.

An initial suggestion might be:

“Let AI diagnose faults, schedule maintenance and decide when production resumes.”

This assigns responsibilities of very different kinds to AI together.

A more suitable To-Be might be:

| Work | Human responsibility | System or AI responsibility |
| --- | --- | --- |
| Detect a fault | Operator reports the abnormality | Record the information |
| Analyze the fault | Maintenance worker interprets and confirms | AI suggests possible causes and retrieves history |
| Schedule maintenance | Supervisor confirms priority | Show available staff and parts |
| Perform repairs | Maintenance worker performs the work | Record progress |
| Resume operation | Authorized person confirms safety conditions | Retain confirmation evidence |

This involves three layers:

First, improve information. Information previously scattered across phone calls, paper and personal memory is presented together.

Second, improve work. The system provides needed information more quickly, reducing repeated manual lookups.

Third, improve decisions. AI can offer suggestions, while authorized people retain responsibility for confirming high-risk decisions.

When designing To-Be, ask:

“Which activities should be removed, simplified, automated or kept with people?”

Also ask whether an existing step is necessary for safety, legal or quality reasons.

Some apparently redundant steps serve necessary purposes. The shortest process is not automatically the right To-Be.

## 5. User Flow: make the software operations explicit

The preceding sections describe ways of working.

Now focus on what the user encounters while operating the software.

The lesson uses a field-completeness prototype. The user enters an application number, applicant code and document type. The system checks required fields for omissions and produces a completeness report.

Distinguish these terms:

- Completeness: Are all required fields filled?
- Correctness: Is the entered content correct?
- Authenticity: Is the information genuine and trustworthy?
- Acceptance: Has the business officially accepted the case under its rules?

Checking that all three fields contain values establishes only the specified field-completeness rule. It does not establish correctness or approval.

### Read the workflow diagram

To-Be User Flow: the completeness-checking prototype

The following diagram combines the success path and exception handling.

@figure2

Read the decision conditions and where each outcome leads.

### Common User Flow terminology

| Term | Plain-language meaning |
| --- | --- |
| Actor | Who operates the system or participates in the task |
| Trigger | What starts the flow |
| Action | What the user or system does |
| Decision | A condition that determines the next step |
| Happy Path | How completion works when everything goes as expected |
| Exception Path | What happens when information is missing or another problem occurs |
| Recovery Path | How to return to a state where work can continue |
| End State | An explicit outcome such as success, cancellation or failure |

The Happy Path describes normal conditions, not all system behavior.

For an online shop:

The normal flow is “choose products → cart → payment → order confirmed”.

Payment failure, insufficient stock, an expired discount code and checkout abandonment must also have defined paths.

## 6. Why must editing input invalidate an old result?

This is a central M03-03 design rule and a common source of errors in AI software.

Suppose an insurer has an AI quotation system.

The user first enters:

@figure3

The user then changes coverage to TWD 3,000,000.

What happens if the screen shows TWD 3,000,000 but the downloaded PDF still contains the old quote for TWD 1,000,000?

The visible input and output document disagree.

This is a Stale Result problem.

Each result must remain tied to the input that produced it; updating the screen alone does not establish that relationship.

@exercise-stale

Express the rule as an implication:

Valid result ⇒ current input matches the validated input.

In practice, a front-end “checked” flag is insufficient. If multiple people or systems can change the data, use backend versions, snapshots or hashes to confirm consistency, and validate again when the operation actually executes.

This principle applies across industries.

| Industry | Possible problem after an edit | Required design response |
| --- | --- | --- |
| Banking | A customer changes the loan amount but the report uses old data | Invalidate old calculations and review results |
| Healthcare | Updated patient data still shows an old risk analysis | Mark versions and reassess |
| E-commerce | Cart edits retain the previous checkout amount | Recalculate totals |
| Logistics | A changed delivery address retains freight based on the old address | Recalculate and confirm |
| AI Agent | Changed task requirements leave the Agent executing an old plan | Recheck the plan and execution authorization |

Workflow design therefore connects to software state management, data consistency and safety governance.

## 7. User Flow, User Journey and System Architecture

These diagrams answer different questions even though they are often mixed together.

User Flow

Focuses on a specific task: where the user clicks, what they do and how they recover from problems.

Example: how a patient completes one booking on a hospital website.

User Journey / Experience Map

Focuses on a longer experience that can span times, people, places and services.

Example: a patient's experience from feeling unwell and finding a hospital through booking, consultation and follow-up.

System Architecture

Focuses on how technical components collaborate.

Example: how the booking website calls an API, how the database stores appointments, how authentication works and how duplicate bookings are prevented.

@figure5

A Swimlane Diagram can additionally separate responsibilities into lanes, such as patient, booking system and hospital reception.

More formal workflows across organizations may use BPMN (Business Process Model and Notation).

You do not need to learn every diagram standard at once.

For this lesson, clearly define what the user needs to accomplish, how they accomplish it and what happens on exceptions.

GOV.UK's Experience Map guide likewise includes users' actions, thoughts and feelings over time and their contact with multiple services, rather than only operations within one system.

## 8. Apply the concepts in AI-assisted software engineering

Write the analysis in a requirements document that both people and AI can understand, such as `problem.md`.

This document provides a basis for design, implementation and verification; it is not executable code.

Return to restaurant ordering for a simplified example.

```

# 任務：建立食材訂貨要求

## 角色
主要使用者：餐廳店長
交接對象：食材供應商

## 任務邊界
起點：店長取得需要訂購的食材清單
終點：訂貨要求已記錄並送出，或取消
不包含：供應商正式接單、送貨與付款

## As-Is（待訪談確認）
1. 店長盤點食材
2. 手寫訂貨清單
3. 打電話提出訂貨要求
4. 記錄已提出的要求

## To-Be（待驗證設計）
1. 選擇食材
2. 輸入訂購數量
3. 系統檢查必填資訊
4. 店長預覽內容
5. 店長確認送出
6. 系統記錄送出結果

## 例外與回復路徑
- 缺漏：提示缺少資訊，保留已填資料
- 修改：使舊預覽失效，重新檢查
- 送出失敗：顯示未確認送出，提供安全重試
- 取消：結束操作，不送出新要求

## 待確認事項
- 供應商能否接收電子訂單？
- 重試是否可能造成重複訂貨？
- 取消後是否保留草稿？
- 供應商接受訂單如何確認？

```

The document lets you establish the work before choosing a front-end framework, database or AI model.

You can give it to an AI Coding Agent such as OpenCode and ask:

“Use `problem.md` to organize the User Flow, exception scenarios and testable requirements. Do not assume the supplier has accepted the order, and do not expand into official payment functionality before confirming requirements.”

This makes development scope and outcomes easier to control than simply requesting “an intelligent ordering website”.

### From workflow to implementation

Distinguish the shared workflow analysis from the two parallel concerns of interfaces and requirements/tests.

@figure6

Workflow design supplies behavioral requirements that an architecture must satisfy; it does not directly determine the technical architecture.

## 9. Check whether you can apply the lesson

A practical acceptance exercise for M03-03 is to walk through several events and check for paths that cannot be followed.

@exercise-walkthrough

The four cases are a minimum walkthrough, not every exception. A formal system needs additional tests based on business risk, including insufficient permission, data conflicts and external service failures.

If a reader must invent what should happen after an event, the requirement still needs definition.

## 10. Five things to carry into your next design

1. Define the same task. As-Is and To-Be need comparable actors, starts, endpoints and scope.
2. Establish evidence for current practice. Do not turn an imagined workflow into a factual SOP.
3. Allocate human and system responsibilities clearly; improvement does not require total automation.
4. Define exception exits and recovery for omissions, edits, cancellation and failure, alongside the Happy Path.
5. Use workflows as a basis for interface design, specifications, tests and system controls.

Keep this criterion in mind:

A useful flow lets users complete the work correctly, recover from problems and understand responsibilities and outcomes, rather than simply minimizing the number of boxes.

## Understanding check: apply the ideas in another industry

Suppose a company is preparing an AI-assisted employee travel-expense system.

Employees currently organize receipts, fill in Excel and email finance manually. The proposal lets employees upload receipts, has AI recognize amounts and dates and prepare a reimbursement draft, then asks employees to confirm it and submit it to finance for review.

Answer four questions:

Q1 | Define the start, endpoint and business activities outside the first version's scope.

Q2 | Write an As-Is and a To-Be flow, distinguishing human and AI responsibilities.

Q3 | AI reads a receipt as TWD 1,500, and the employee changes it to TWD 15,000. What should happen to the previous check, and why?

Q4 | Define the next step and recovery path for an unreadable receipt, employee cancellation and a network failure during submission.

Reference explanations can be expanded in the final understanding check. These questions do not establish that a learner has submitted answers or passed practical acceptance.

Answering independently, especially explaining rechecking after an edit and recovery after failure, demonstrates application of the lesson's central concepts.
