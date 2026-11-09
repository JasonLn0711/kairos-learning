# M04-01｜How do HCI, UI and UX differ?

The main idea of this lesson is:

Design a system so people can understand it, operate it correctly and complete their actual work; an attractive screen alone does not achieve that goal.

HCI, UI and UX provide three perspectives for checking whether the design achieves it.

## 1. Start with a restaurant ordering kiosk

Imagine ordering at a McDonald’s self-service kiosk.

You want to choose your food quickly, pay and collect your meal. Admiring the kiosk’s design is not the purpose of your visit.

This simple process raises three questions.

1. UI: how is the screen presented?

The burger images, prices, quantities, checkout button and back control are all parts of the UI (User Interface).

A checkout button that is too small, unreadable text or a price hidden in an obscure location are UI design problems.

2. HCI: how do people understand and operate the machine?

Suppose you see a button labeled “Done.”

You might think pressing it completes payment, although it only finishes meal selection.

The question extends beyond the button’s appearance: why does the user interpret it that way?

HCI (Human–Computer Interaction) studies interactions between people’s cognition, behavior, operating abilities and technology.

Can an older person understand the screen? Can a wheelchair user reach the buttons? Does the user know what to do next?

3. UX: how does the whole process work out?

Suppose you select and pay for your meal smoothly but do not know where to collect it.

The kiosk may be easy to use while the overall experience is poor.

UX (User Experience) considers entering the restaurant, ordering, paying, waiting, collecting the meal and getting help when something goes wrong, as well as the kiosk itself.

## 2. Compare the three perspectives in one table

Compare the questions each perspective asks to decide what to examine.

| Concept | Plain-language meaning | Main question |
| --- | --- | --- |
| HCI: human–computer interaction | Studies how people understand and use technology | Why does the person operate it this way? |
| UI: user interface | The interface people perceive and operate | How should buttons, text and feedback be designed? |
| UX: user experience | The overall experience from starting to finishing | Can the person complete the actual work smoothly? |

These are not three independent boxes.

HCI is an interdisciplinary research and design field; UI is the contact interface between a person and a system; UX is the overall experience of use. The perspectives overlap and influence one another.

## 3. Return to the intake system we are designing

Suppose we are developing a simple web page that lets a case worker check whether information is complete and export a report.

The original process is:

@figure1

A problem appears: the case worker sees “Success” and assumes the case has been officially accepted.

The system has only confirmed that three required fields are filled in.

This is a typical design problem.

@figure2

## 4. Examine a UI change directly

These are illustrative screens, not an actual system or test results.

@figure3

The candidate appears clearer, but the scientific distinction matters:

A designer’s judgment that a screen is clearer does not establish that users understand it better.

The change still needs testing.

## 5. How can we establish an improvement?

Treat “improving UX” as design work that requires evidence.

| Question to test | Possible method |
| --- | --- |
| Do users understand “fields complete”? | Ask them to explain the current state in their own words |
| Do users know how to supply missing information? | Give them a missing-information scenario and observe whether they find and correct the field |
| Can they operate without a mouse? | Complete the task using Tab, Enter and other keyboard controls |
| Can the next worker continue using the report? | Have the receiving role complete a specified follow-up task with it |

Also distinguish these concepts:

- Functional correctness: does the program follow its rules?
- Usability: can people complete the specified task effectively and efficiently?
- UX: what are the overall feelings and outcomes before, during and after use?

For example, successfully blocking all 100 missing-input test cases supports the checking logic for those cases. It does not establish that 100 users understand the error message.

## 6. How should you ask AI to design an interface?

An earlier request might have been:

> Please make this web page prettier and improve UX.

That request leaves AI to decide what improvement means. It may only change colors, animations and shadows.

A better request describes five things:

A verifiable design requirement

Who uses it → what they do → what difficulty they face → what to change → how to test it

User: a case worker using the system for the first time

Task: identify and correct the missing document type

Problem: the user does not know which field is incomplete

Candidate change: show a specific error and correction guidance beside the field

Verification: give a missing-information scenario and observe whether the user can correct it independently

This changes a request for visual polish into a request to solve an observable usage problem.

Until tested, the candidate remains a design hypothesis; it cannot be described as verified effective.

## 7. How does this lesson connect to the next?

M04-01 uses HCI, UI and UX to identify problems from three perspectives.

M04-02, Task Analysis, goes further by breaking down the actual work:

The user receives a case

Finds the required information

Fills in the form

Finds and corrects omissions

Checks and exports the report

Hands it to the next case worker

Task analysis starts by asking who performs each step, what information is needed, how success is judged and what happens when something goes wrong, before drawing screens.

Understanding this work before designing a wireframe reduces the risk of an attractive interface that cannot support the actual task.

## Check your understanding

Try these three questions first. You do not need specialist terminology.

1. A user sees “Success” and mistakenly thinks the case has been submitted. Which perspective—HCI, UI or UX—would you first use to investigate the cause, and why?

2. The interface is simple, buttons are clear and users can export reports, but the next worker must re-enter everything. Which perspective mainly reveals the problem?

3. AI redesigns missing-information feedback with a prettier screen and more specific wording. What evidence is needed before saying the change helps?

Answer independently, then expand the reference explanations below to check your reasoning.

Keep this relationship in mind: UI is the interface people operate; HCI helps us understand interactions between people and systems; UX keeps the whole task the user needs to complete in view.
