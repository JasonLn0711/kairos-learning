# M04-01 | How do HCI, UI and UX differ?

The central idea of this lesson is that designing a system should help people understand it, operate it correctly and complete what they actually want to do.

This lesson uses everyday life, healthcare, banking, logistics, government services and AI software development as examples.

## 1. Start with an everyday example

Imagine visiting a hospital and using its self-service check-in kiosk.

You insert your National Health Insurance card, confirm your appointment information, complete check-in and go to the consultation room to wait.

This apparently simple activity involves three different design questions.

@figure1

The important point in this example is:

An attractive, straightforward kiosk UI can still be part of a poor overall UX.

The user's actual task is to receive medical care smoothly, rather than merely operate the kiosk successfully.

This follows Nielsen Norman Group's view of UX: the experience covers the user's interactions with the product, service and organization as a whole. Appearance alone cannot establish its quality.

## 2. What distinguishes the three concepts?

Compare their questions and methods to see what each perspective contributes.

| Comparison | HCI: human–computer interaction | UI: user interface | UX: user experience |
| --- | --- | --- | --- |
| Core question | How do people understand and operate technology? | How does the interface present information and respond? | Does the whole experience meet their needs? |
| Main focus | Cognition, behavior and interaction capabilities | Screens, controls and prompts | Workflow, outcomes and feelings |
| Common methods | Behavioral observation and cognitive research | Interface design and prototyping | User research and journey analysis |
| Example of success | Knowing what to do next | Finding and operating a button | Completing the task and obtaining the service |

HCI, UI and UX are not three completely separate work phases, nor does one necessarily contain the others.

HCI is an interdisciplinary research and design field; UI is the interface through which people interact with a system; UX concerns the quality of the overall experience. Their concerns overlap considerably.

@figure2

Figma's conceptual illustration shows overlapping HCI, UI and UX concerns, with interaction design (IxD) at their intersection. It is a way to understand relationships, rather than a strict academic classification of sets.

UI is not limited to screens. A voice assistant's spoken prompts, a vehicle's physical control panel and an ATM's keys can all be user interfaces.

## 3. HCI: why do users misunderstand a system?

HCI provides an important foundation: an engineer's knowledge of how the software works does not establish what users understand.

For example, a banking system displays “Review completed.”

The engineer may mean, “The system has finished checking whether all information is present.”

A bank employee may interpret it as, “This loan has been approved.”

The same message produces two different interpretations.

This involves an important HCI concept: the mental model.

### 1. Mental model: the user's internal map of system operation

When using an unfamiliar washing machine for the first time, you may expect pressing “Start” to begin washing immediately, based on previous experience.

This machine may first require you to select the water level, program and temperature.

The user's expectation and the system's actual behavior differ.

Good interaction design should align behavior with reasonable expectations, or provide enough information to help users form an accurate understanding.

### 2. Feedback: the system must respond after an action

Suppose you press “Pay” on a shopping website.

Nothing changes on screen.

You cannot tell whether payment succeeded, so you press again, potentially creating a duplicate order.

This is a feedback problem.

The system should make its current state clear: for example, “Processing payment,” “Payment successful; order number …” or “Payment failed; no charge was made.”

### 3. Error prevention: help avoid errors before displaying them

For example, a pharmacy system lets a pharmacist add medication to a collection list.

If a prescription has an unusual dosage, the system should provide more than a vague “Error code 203” at the end.

A better approach may identify the issue, help check the original prescription and require appropriate confirmation under professional procedures.

These designs concern how people understand information, make decisions and reduce operating errors.

These three concepts align with Nielsen's usability heuristics, including visibility of system status, familiar language and error prevention.

## 4. Practice with six industries

The following hypothetical scenarios help you locate problems through different perspectives.

| Industry and task | UI problem | HCI problem | UX problem |
| --- | --- | --- | --- |
| Healthcare: online appointment | Unclear date picker | Patient thinks selecting a date completes booking | Patient cannot find check-in after arriving |
| Banking: loan application | Submit button is hard to notice | Customer confuses completeness checks with loan approval | Customer must re-enter information at a branch |
| Logistics: package tracking | Delivery status text is too small | “Out for delivery” is misunderstood | Package goes to the wrong location and complaints are difficult |
| Education: online learning | Chapter navigation is hard to find | Student does not know whether a quiz is complete | Student finishes the course but cannot apply it |
| Manufacturing: production control | Alarm message is hard to notice | Operator cannot distinguish alarm priorities | Production cannot resume smoothly after the fault is cleared |
| AI: voice assistant | Recording status is unclear | User does not know whether AI is listening | Speech is recognized correctly but no appointment is completed |

The table does not imply that each problem belongs to only one category.

For example, “Out for delivery” may simultaneously involve UI information presentation, HCI interpretation and a UX gap in delivery expectations.

The three perspectives complement one another rather than divide problems into mutually exclusive classes.

## 5. Understand the relationship through user action

Read this simplified interaction structure from the user's goal to the overall outcome.

@figure3

This structure highlights an important distinction:

Correct software behavior, an interface people can use, and users completing their actual task are three levels of success.

For example, AI correctly identifying complete application information does not establish that users know the check is complete. Knowing that information is complete also does not establish that the application procedure is finished.

## 6. What is usability?

Usability is another term often confused with UX.

It concerns whether specified users, in a specified context, can achieve goals with effectiveness, efficiency and satisfaction.

ISO 9241-11:2018 provides the framework for understanding these three dimensions.

| Dimension | Plain-language question | Possible measurements |
| --- | --- | --- |
| Effectiveness | Was the task completed correctly? | Task completion rate and error rate |
| Efficiency | How many resources were required? | Completion time and number of actions |
| Satisfaction | Did use meet expectations? | Questionnaires, interviews and subjective assessments |

For a self-service ticket machine, measuring only how long buying a ticket takes is insufficient.

Fast operation with frequent purchases of the wrong ticket does not demonstrate successful design.

If everyone buys the correct ticket but a first attempt takes fifteen minutes, there may also be room for improvement.

Accessibility also matters: for example, keyboard-only operation, support for assistive technology and readable text. These requirements should be part of the design work rather than treated as decorative additions.

## 7. Case study: redesign an application intake system

Return to the official lesson's scenario.

Suppose we are designing a government application intake system. Case workers must check the application information and export a check report.

Compare the original system with a candidate change.

@figure4

Both interfaces are illustrations, not results from actual user testing.

### Start with HCI to investigate the cause

What does the user think when seeing “Success”?

Ask directly: “What state do you think this application is in now?”

If the answer is that it has been submitted, the state communicated by the system differs from the user's interpretation.

### Use UI design to propose a change

In addition to readable typography, distinguish “Fields complete,” “Check completed,” “Formally submitted” and “Officially accepted,” and explain the next action.

If the backend does not distinguish these states, changing message text alone will not resolve the problem.

### Use UX to examine the whole task

Even after a case worker exports the report, the workflow remains awkward if the next worker must look up and enter all information again.

Test whether the whole task can be completed as well as whether a button can be pressed.

## 8. How can we demonstrate an improvement in UX?

This section connects design with engineering verification.

AI saying “UX optimized” does not establish an actual improvement.

Use the following process:

1. Define the user and task: for example, a case worker using the system for the first time must identify missing information and correct it.
2. Observe existing problems: record specific cases of fields being hard to find, prompts being misunderstood or applications being mistaken for submitted ones.
3. Propose a change hypothesis: specific guidance beside incomplete fields should help users find and correct problems.
4. Design comparable tests: representative users operate the existing and candidate versions under similar conditions.
5. Evaluate results: compare completion rates, errors, time and how accurately users explain the state.

Unit tests can establish whether checking logic meets its specification; they cannot directly establish whether people understand a message.

NIST describes usability testing as representative users performing representative tasks, with evidence such as completion rates, time, errors and subjective responses.

## 9. Apply this lesson in AI-assisted software engineering

When asking an AI agent, ChatGPT or another coding agent to design an interface, avoid relying only on:

> Design a modern, simple, attractive interface with excellent UX.

This description leaves the actual work problem undefined.

A more useful requirement includes five elements:

### 1. Who uses it

A case worker using the system for the first time.

### 2. What they need to do

Find and correct missing information in an application.

### 3. What difficulty they face

They see only “Invalid information” and do not know which field has a problem.

### 4. What change to propose

Show the specific error, cause and correction method beside the relevant field.

### 5. How to demonstrate usefulness

Give users a missing-information case and observe whether they can understand it and complete the correction independently.

Use the following instruction when handing the work to AI.

### Example AI design request

This request first asks for reviewable design artifacts, followed by hypotheses requiring user testing.

```text
請設計一個供第一次使用的承辦人檢查與補正案件資料的網頁介面。

使用者任務：找出缺少的必要欄位並完成補正。
現有問題：系統只顯示「資料錯誤」，使用者不知道哪裡有問題。

設計假設：在欄位旁顯示具體錯誤原因與修正建議，可協助使用者自行完成補正。

要求：
- 區分欄位檢查完成、已送件、已受理等系統狀態。
- 提供清楚的下一步。
- 考慮鍵盤操作及錯誤復原。

請先產出文字線框稿、介面狀態與互動流程，不要直接開始寫程式。

最後列出需要透過真人任務測試驗證的假設，不得宣稱已改善 UX。
```

The copyable request above is preserved in its original Chinese. In English: design a page for first-time case workers to check and correct application information. The task is to identify and fill missing required fields; the current problem is a generic “Invalid information” message that does not identify the affected field. The hypothesis is that specific causes and correction guidance beside each field help users complete corrections independently. Distinguish check completion, submission and acceptance; provide a clear next action; consider keyboard operation and recovery. Produce text wireframes, interface states and interaction flows before coding. Finally, list hypotheses requiring human task testing and do not claim an established UX improvement. This is the engineering principle of the lesson: AI should design against observable user problems and produce results that can be evaluated.

## Connection to the next lesson

M04-02, Task Analysis, builds on this: before drawing an interface, identify the user's work steps, roles, information needs and exceptional situations.

## 10. Check your understanding

Try answering before opening the reference explanations. The three questions retain their original choices, followed by a practical exercise.

1. A banking app has a clear transfer button, but users do not understand the difference between “Scheduled transfer” and “Immediate transfer.” Which perspective should you prioritize when investigating the cause?

UI

HCI

UX

2. A shopping website is attractive and fast, but returning a purchase requires repeated calls to customer service. Which perspective mainly helps address the problem?

UI

HCI

UX

3. AI makes an error message clearer and all program tests pass. Does this establish that UX has improved?

Yes, because the program is correct

No, evidence from users performing tasks is still needed

Yes, because the wording is clearer

Practical exercise: choose healthcare, banking, logistics or another industry. Propose a UI change hypothesis and explain how to test whether it helps.

This page provides reference explanations. Save your own answers and reasoning separately for discussion or later review.

Take this principle forward: understand people's work and behavior, design the interface, then use evidence of users completing tasks to judge whether the design helps.
