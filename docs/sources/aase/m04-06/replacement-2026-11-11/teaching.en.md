# M04-06 | Error recovery, accessibility and usability

Good software helps users understand what happened, correct a problem and continue their work after an error.

This lesson expands the M04-06 material through examples from shopping, hospitals, banking, government services and AI software.

You need three concepts:

1. Error recovery: can users correct a problem and continue working?
2. Accessibility: can people with different abilities and ways of operating a system use it?
3. Usability: can users achieve their original goal efficiently and with little confusion?

The concepts are related, but each asks a different question.

## 1. Error recovery: preserve the user's effort

Imagine filling out a government subsidy application.

You have spent 25 minutes entering personal details, household income and bank account information, and uploading supporting documents.

You press Submit and see:

@figure1

This design gives users little help.

They cannot identify what needs correction and may lose all their earlier work.

A more useful design says:

@figure2

A useful recovery design combines three elements:

@figure3

### Three errors need different responses

Different errors should receive feedback that matches their causes.

| Error type | Plain-language meaning | Recovery direction |
| --- | --- | --- |
| Missing data | The user has omitted something | Identify the omission and let them complete it |
| Technical failure | The system itself has failed | Preserve data, explain the failure and offer appropriate retry or help |
| Stale result | An earlier check no longer matches the current input | Withdraw the result's valid status and require a new check |

Consider a bank loan application:

Scenario A: monthly income is blank. Identify that omission while keeping the name, address and other values.

Scenario B: the bank server is temporarily unreachable. Explain that this query did not finish and allow a retry after connectivity returns. For a payment or formal transaction, retry must also prevent duplicate submission.

Scenario C: an eligibility estimate passed, but monthly income was then changed from 80,000 to 50,000. The earlier eligible result may no longer apply. Withdraw its valid status and calculate again.

Stale results deserve particular attention: the program may keep running while users make decisions based on outdated information.

## 2. Accessibility: people operate computers in different ways

Accessibility asks whether people can complete a task when they cannot see the screen clearly, use a mouse or distinguish colors, or when they need assistive technology.

This includes people who use assistive technology.

These needs also arise in everyday situations.

A doctor may operate equipment while wearing gloves; factory staff may work in bright light or noise; an older person may enlarge text; an engineer with a broken mouse may rely on a keyboard.

### Errors need more than color

Imagine a checkout form with three fields, one of which contains an error.

- A weak design changes only the field's color to red.
- A better design combines a red border, an error icon and wording such as “Postal code format is incorrect; enter three or five digits,” when that matches the service's actual rules. Postal-code length depends on the service and region; three or five digits is only the supplied example.

Color can help recognition, but it must not be the only source of information. WCAG 2.2 criterion 1.4.1, Use of Color, addresses this requirement.

A practical reference is the US CMS Design System's form error pattern:

@figure4

The example combines a summary at the top, links to the affected fields and messages beside those fields. It provides information beyond a red outline. 

Source: CMS Design System, Error validation. Its surname-length and US date-format rules belong to that example, rather than every service.

### Complete the task without a mouse

A hospital appointment website may work with a mouse yet fail in these keyboard situations:

- Tab moves through the page but cannot select an appointment date.
- The date picker receives focus but cannot be exited.
- There is no visible indication of the currently focused button.
- Enter cannot activate confirmation.

These are keyboard accessibility problems.

Recognize these common keys:

| Key | Common purpose |
| --- | --- |
| Tab | Move to the next focusable component |
| Shift + Tab | Move to the previous component |
| Enter | Activate an applicable button, link or other component |
| Space | Operate applicable buttons or checkboxes |
| Esc | Close certain dialogs, menus or other components |

Actual key behavior depends on the component type.

Focus identifies the component ready to receive keyboard input.

It tells you who receives the next command.

Without visible focus, operating a page resembles pressing elevator buttons in the dark without knowing what will happen next.

WCAG requires keyboard operation for relevant functionality and a visible focus indicator. A specific exception concerns functionality inherently dependent on a continuous movement path.

### A label needs a programmatic relationship

Two relationships are easy to confuse:

Visual relationship: text appears beside an input.

Programmatic relationship: the system knows that the text names that input.

For example:

```
<label for="email">電子郵件</label>
<input id="email" type="email"
       aria-describedby="emailError"
       aria-invalid="true">
<p id="emailError">請輸入有效的電子郵件地址</p>
```

The original Chinese code is retained in both editions. The label means “Email” and the message means “Enter a valid email address.”

- label tells users what the field is.
- for and id explicitly connect the label to the input.
- aria-describedby associates additional instructions or an error message with the field.
- aria-invalid indicates that the current input value is invalid.

These relationships help screen readers and other assistive technology interpret the form. Adding ARIA alone does not establish accessibility: test actual operation and message announcements.

## 3. Usability: being operable does not ensure a convenient task

An airline booking site illustrates the difference between accessibility and usability.

Suppose it meets major keyboard and screen-reader technical requirements, but changing a ticket takes 17 pages and users cannot find the change fee.

The site may provide some accessible capabilities while remaining difficult to use.

| Comparison | Accessibility | Usability |
| --- | --- | --- |
| Main question | Can different users operate it? | Can they complete their goal smoothly? |
| Typical problem | A date field cannot be operated by keyboard | The ticket-change process is too complicated |
| Improvement | Correct semantics, keyboard support and clear focus | Simpler workflows, clear feedback and less effort |
| Verification | Technical checks and assistive-technology testing | Observe real users performing tasks |

Neither kind of evidence replaces the other.

## 4. Design a recovery path users can finish

M04-05 introduced input, processing, missing information or failure, and completion. Now examine how users can move safely between those states.

The conceptual flow can be extended for business needs, such as awaiting review, submitted or cancelled.

@figure5

Consider an AI document-analysis system.

A user uploads a report and analysis finishes. They replace the original with a newer version, but the screen still shows the old report as complete and offers its download button.

This is a data-consistency problem as well as a feedback problem.

Bind analysis results to the input version. When input changes, mark earlier results stale, prevent exporting them as current results, and validate the version again on the backend. A user bypassing the interface must not receive an outdated result presented as valid for the new input.

## 5. What evidence supports a usable design?

Keep different levels of evidence distinct.

| Verification method | What it can establish | What it cannot directly establish |
| --- | --- | --- |
| Wireframe | Error messages and recovery paths have been planned | The system actually operates |
| Automated tool | Some semantic, contrast or other defects | The absence of every barrier |
| Manual keyboard test | The specified operation path was tested | Every user can use the system |
| Assistive-technology test | Experience with particular tools and environments | Compatibility with all assistive technology |
| Participant task test | Where actual participants encounter difficulty | Everyone will get the same result |

Tab reaching every button does not establish whole-site WCAG conformance. Five participants completing a task does not establish the absence of accessibility problems.

### Minimum practical exercise

Choose a system you are designing, such as hospital appointments, hotel booking, thesis upload or an AI Agent console.

1. Draw input, processing, error and completion screens.
2. Design different messages and recovery actions for missing data, technical failure and stale results.
3. Define a complete task: deliberately omit data → correct it → recheck → succeed → change input → invalidate the old result.
4. Replay the entire path with a keyboard, checking visible focus, sensible order and absence of keyboard traps.
5. Record design expectations separately from actual tests in wireframe-notes.md.

Acceptance requires observable results at each step and accurate status for unfinished or stale work; a green checkmark alone cannot establish that.

## 6. Check your understanding

Answer this integrated scenario without writing code.

A medical AI website analyzes images uploaded by doctors. Three problems have been found:

Problem A: a network interruption during upload erases the clinical notes already entered.

Problem B: Tab reaches the analysis button, but focus has no visible indication.

Problem C: after a new image is uploaded, the previous image's AI report remains downloadable and is marked complete.

Answer these questions:

1. Which UX, accessibility or system-correctness problems are involved in A, B and C?
2. How would you fix each problem? Does the fix belong to the frontend, backend or both?
3. An engineer says an automated scan means accessibility verification has passed. What further evidence would you request?

After thinking through your answers, open the reference explanations and compare the reasoning. Connect these ideas to M05 specifications and M08 verification.
