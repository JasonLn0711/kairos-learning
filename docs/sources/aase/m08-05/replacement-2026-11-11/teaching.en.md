# M08-05 | Task-based Usability Testing

Working software does not establish that people can use it. Ask users to carry out realistic tasks, observe where they succeed or get stuck, and improve the design using that evidence.

## 1. What is task-based usability testing?

Imagine opening a restaurant with a self-service ordering kiosk. Engineers confirm that the touchscreen works, menus appear, items enter the cart, credit-card payments work, and orders reach the kitchen. The system passes their tests.

Customers then struggle to find vegetarian food, cancel selected items, or tell whether payment succeeded. Some stop because they fear being charged twice. The engineers established that the system operates; customers still need to complete an order successfully.

Task-based usability testing gives participants a specific goal instead of asking them to browse a screen or merely say whether they like it. For example: “Order for three friends, including one who does not eat meat, and confirm that the order was submitted successfully.” Observe whether they find the menu, handle the dietary restriction, change quantities, pay, and recognize the result.

Tell participants what they need to accomplish without naming the buttons to press. Keep observed behavior, possible explanations, and improvement hypotheses separate.

## 2. How does it differ from other software tests?

Software quality raises four different questions.

| Test | Question | Example |
| --- | --- | --- |
| Unit test | Does program logic produce the right result? | Is the product discount correct? |
| UI test | Do controls and screens operate as expected? | Does checkout open the payment page? |
| Usability test | Can users complete the work themselves? | Can customers find how to cancel an order? |
| Security test | Does the system prevent unauthorized actions? | Can user A access user B’s order? |

These tests complement one another. A system can pass all its automated tests and still fail a usability test.

### Three aspects of usability

| Aspect | Plain meaning | Evidence to consider |
| --- | --- | --- |
| Effectiveness | Can people accomplish the task? | Whether the intended task is completed |
| Efficiency | How much effort does it require? | Time, steps, and repeated attempts |
| Satisfaction | How does the experience feel? | Clarity, reassurance, and confidence |

Two people may both book an outpatient appointment online, while one takes two minutes and the other takes fifteen and remains unsure whether the booking worked. Completion alone does not make the experiences equivalent.

## 3. The complete workflow

Use the six stages below to connect a research question to a retest.

@figure1

This is a continuing improvement cycle. After a retest, use the findings to decide the next research question. GOV.UK’s research guidance recommends specific, believable tasks that fit participants’ circumstances without suggesting the method of completion.

## 4. Designing tasks across industries

Convert instructions about controls into goals about work.

| Industry | Leading instruction | Suitable task |
| --- | --- | --- |
| Healthcare | Click booking, then internal medicine. | Book an internal medicine appointment for next week. |
| Finance | Open reports and click export. | Prepare a report your supervisor can review. |
| E-commerce | Press the cart’s delete icon. | Remove an item you no longer want from your order. |
| Education | Open grades and click download. | Obtain your grade record for this semester. |
| Logistics | Open tracking and enter the number. | A customer asks where their parcel is; find its latest status. |

A suitable task need not be shorter. The facilitator must leave the interface’s clues for participants to discover. Supplying those clues measures how well someone follows instructions instead of how clearly the design communicates.

## 5. Distinguish observation, inference, and hypothesis

In a bank reporting system, a user changes data, does not regenerate the report, and downloads the old file. It is tempting to say, “They definitely do not know they must check again after editing.” Their thoughts have not yet been established. Separate the record into three layers.

| Layer | Example |
| --- | --- |
| Observation | After changing data, the user downloaded a report without running validation again. |
| Inference | The user may expect data edits to update the report automatically. |
| Hypothesis | Showing “Results are outdated; validate again” after edits may reduce old-report downloads. |

An observation records what happened. An inference offers a possible explanation. A hypothesis proposes a claim to test. The user might already know that validation is needed but have been distracted, or the old report might still have appeared current. Keep possibilities distinct from facts. This discipline also applies to scientific research, medical diagnosis, security investigations, and business management.

## 6. Recording a test

The following record illustrates how to preserve the scenario, behavior, result, possible cause, and proposed retest.

@figure2

This is a fictional teaching example, with no claim that a human test occurred. Distinguish independent completion, assisted completion, and non-completion. If the facilitator identifies a button before the participant succeeds, record assisted completion. For timing, agree on start and end events and how assistance time will be handled before collecting measurements, so definitions stay consistent.

## 7. Improving a design after observing a problem

Suppose the working explanation is that users do not realize edits require a newly generated report. The team can make the system’s status clearer. Compare the existing presentation with the proposed design below.

@figure3

Visibility of System Status means people can understand what is happening now. Error Prevention means reducing the opportunity to download the wrong report before having to repair the consequences. Both appear in Nielsen Norman Group’s ten usability heuristics.

A proposed improvement still needs evidence of its effect. Ask participants to perform comparable tasks again and check whether they recognize the report status and obtain the correct result. When comparing versions, consider differences in familiarity and testing conditions.

## 8. Four common misunderstandings

These four judgments affect participant selection, facilitation, and interpretation.

### A friend’s successful attempt establishes usability

Friends can reveal early problems. When the actual audience is nurses, bank credit staff, or warehouse managers, recruit people with relevant work experience. A few participants’ results cannot automatically be generalized to everyone.

### Facilitators must never help

Help is possible. Record when, why, and what prompt was given, and distinguish assisted from independent completion. Helping someone who is completely stuck can allow the session to reveal other problems.

### Task completion means there is no problem

A person may need more than a dozen attempts before succeeding. Their process can still expose design problems even when the final result is correct.

### Usability testing replaces security and functional checks

Ease of use does not establish correct permissions, accurate calculations, or accessibility. Verify those separately. Obtain appropriate consent for human testing and explain how records will be used. Prefer safe synthetic data; establish retention, access, and privacy arrangements before recording video or handling real personal data.

## 9. Turn the lesson into an executable task

Use the course’s intake-data validation system for a small exercise. Prepare three tasks and provide their information in stages. First supply an application with a missing document type and ask whether a complete report can be produced. Then supply the document type and ask for a report a colleague can inspect. Finally withdraw the document type and ask whether the earlier validation result remains valid.

Invite one voluntary peer to try the synthetic tasks without revealing the action path. Record actual behavior, assistance, and completion. Choose one worthwhile problem and propose a design hypothesis that can be retested. This completes the lesson’s minimal practice; formal product acceptance requires representative users, tasks, and environments.

## 10. Check your understanding

A hospital develops an electronic medical record system. Engineers establish that its functions work, but nurses trying it cannot find how to cancel an incorrect medical order. A researcher concludes, “The nurses must be unfamiliar with computers.” Which response best follows task-based usability testing?

A. Send the nurses to computer training and end the test.

B. Tell them which button to press and record a pass after they succeed.

C. Record where they get stuck, ask how they understood the situation, propose a design improvement hypothesis, and retest.

D. Keep the interface because the program tests passed.

Usability depends on whether target users can complete work effectively, efficiently, and with reasonable confidence in a specific context. Improve it using observed behavior, rather than relying only on a developer’s intuition.
