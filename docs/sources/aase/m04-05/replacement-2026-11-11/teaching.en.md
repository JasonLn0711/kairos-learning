# M04-05 | Progressive disclosure, minimalism and essential states

A useful interface puts the information needed for a sound decision in front of the user at the right time.

Imagine registering for a hospital appointment, withdrawing cash at an ATM or paying online. You usually do not need to know how many servers run the system, how its database works or which parameters its code accepts. You want answers to these questions:

- What do I need to do now?
- What is the system doing?
- Is something wrong, and how can I resolve it?
- Have I actually finished?

This lesson connects Progressive Disclosure, Minimalist Design and Visibility of System Status.

The original lesson uses a data-checking website. Its deliverables are wireframes for four states and a design check based on observing an actual task.

## 1. What is progressive disclosure?

Show what the user needs now, and reveal additional functionality when it becomes relevant.

Consider printing a document.

@figure1

The functionality remains available at two levels rather than being removed.

Nielsen Norman Group's design article explains that deferring advanced options can reduce the burden on beginners. The designer must distinguish primary from secondary functions and make the advanced functions easy to discover.

The following three figures show an advanced-settings entry, the arrangement of basic and advanced settings, and an Accordion panel. These are static wireframes; the depicted actions do not change settings.

@figure2

The orange outline in Figure 2 identifies a discoverable advanced entry. Other settings remain identifiable. Which settings belong in the advanced area depends on the intended user and task.

@figure3

Figure 3 retains the comparison between company name, Email and advanced API settings. The reference fades advanced settings on the right; this rendition replaces that treatment with an explicit “Advanced settings ▸” entry so low contrast or a disabled appearance does not mislead the reader. The sample header is placeholder text, not a real credential.

@figure4

The three headings in Figure 4 remain visible, while only the middle panel shows its content. Down/up symbols indicate collapsed/expanded states, not a process. NN/G notes that collapsing content also increases discovery and interaction costs. Principles that readers need to follow continuously and essential status information should remain visible. This page therefore displays its figures and teaching body directly, using native disclosure only for the reference answers at the end.

## 2. Minimalist design retains information needed for decisions

Imagine reading an airport departure display.

You need the gate, departure time and any delay. If a designer hides “Flight delayed” on a details page to make the screen cleaner, you could miss a critical notification.

That minimalist treatment removes information needed for the task.

Useful minimalism reduces information irrelevant to the current task while retaining what the user needs.

Use this decision table:

| Information type | Presentation |
| --- | --- |
| Essential to the current task | Display directly |
| Affects safety, risk or the next action | Display directly with a clear message |
| Function needed only in some situations | Put it in advanced settings |
| Internal diagnostics or development information | Put it in an administration or debugging interface |

For example, an online bank transfer should clearly show the destination account, amount, fee and transfer result. Database connection pools and API Timeout settings need not appear on an ordinary customer's screen.

This follows NN/G's Aesthetic and Minimalist Design heuristic: unrelated information competes for attention with relevant information.

Remember: information that does not affect the current decision can wait; information affecting judgment, risk or action should not be casually hidden.

## 3. Essential states: tell users what is happening

Status visibility deserves explicit design attention.

Suppose you press “Withdraw 5,000” at an ATM, and the screen does not respond.

What would you think?

You might suspect the press was missed and try again, or assume the machine has failed and leave.

The system may be processing the request without telling you.

This illustrates Visibility of System Status.

An interface should explain the current state, the outcome of an action and the next action available.

Understanding an operation through four states:

The fictional document-checking system below accepts three fields, checks completeness and allows document generation after confirmation.

@figure5

Two details matter here.

First, missing data and system failure need different messages. A missing document type calls for completing the field. An unreachable server calls for an explanation that checking failed and instructions for safe retry, rather than telling users to re-enter data.

Second, “complete” needs a defined scope. Passing a data check does not mean an agency has formally received an application. Generating a bank document does not mean a loan has been approved. Producing an AI diagnostic report does not mean a clinician has reviewed it.

UX and the system's Business Rules must make the same promise.

## 4. Applying the principle across industries

Compare the current decisions in six industries before deciding which information can wait.

| Industry scenario | Primary information that must remain visible | Information that can wait |
| --- | --- | --- |
| E-commerce | Price, shipping cost, payment result, order status | Internal product codes, advanced recommendation settings |
| Medical appointments | Specialty, date, queue number, registration outcome | Connection diagnostics, administrator settings |
| Bank transfers | Recipient, account, amount, transaction outcome | API diagnostics, system logs |
| Factory equipment | Operating state, hazard alarms, emergency stop | Nonessential detailed diagnostic parameters |
| AI document analysis | Upload state, analysis progress, missing data, result | Model temperature, debug logs, polling parameters |
| Cybersecurity | Critical alerts, risks, items requiring action | Low-level packet details, development debugging information |

There is an essential qualification: importance depends on the user's role and current task.

API diagnostics may be irrelevant to an ordinary bank customer but central to an engineer investigating a transfer-system failure.

A single minimalist interface cannot serve every role equally well. Ask: “Who uses this screen, and what decision do they need to make now?”

## 5. Progressive disclosure and staged disclosure

Staged Disclosure is a related concept that the original lesson did not explore in detail and that is easy to confuse with progressive disclosure.

| Dimension | Progressive disclosure | Staged disclosure |
| --- | --- | --- |
| Core idea | Show common functions first and defer secondary functions | Divide necessary work into several steps |
| Example | Expand advanced settings when printing | Enter address, payment and confirmation during checkout |
| Must the user open the later screens? | Usually no | Usually yes |
| Main purpose | Reduce functional complexity | Reduce information load within a single step |

Both can coexist. A shop can divide checkout into three steps and offer optional “Special delivery options” within the shipping step.

NN/G distinguishes these two patterns in its progressive-disclosure article.

## 6. When data changes, what happens to the old result?

This is where interface design meets software engineering.

Suppose the document check reports that all three fields are complete, and the user then deletes the document type.

If the screen still says “Check passed” and allows export, it creates a problem:

The successful result no longer describes the current data.

The diagram compares the alternatives:

@figure6

This concerns State Consistency and whether a validation result is still valid.

A practical implementation strategy is:

```
currentVersion = 3
validatedVersion = 3
→ export allowed

User changes the data:
currentVersion = 4
validatedVersion = 3
→ no direct export; revalidation required
```

Hiding the export button in the frontend does not establish backend safety.

A caller can invoke the backend API directly. The backend must still check completeness, export permission and whether validation applies to the current data version.

This is why the original lesson asks for “input changes invalidate the old result” to be specified in spec.md and covered by tests.

## 7. Usability and accessibility need more than color, icons and hints

Suppose a form gives an invalid field a red border but no explanation.

Some people cannot distinguish the colors, some use screen readers, and others simply do not know what the border means.

Compare these treatments:

Weak treatment: a red border and an exclamation mark.

Better treatment: “Required field: choose a document type” near that field, optionally accompanied by a red border.

A placeholder—the example or hint inside a field—does not replace a continuously visible Label. The placeholder often disappears as soon as the user types.

W3C's WCAG guidance requires information beyond color alone. Dynamic status messages should also be programmatically available so assistive technology can announce relevant changes without moving focus. The guidance on labels or instructions explains how users identify the input expected from them.

## 8. Verify behavior as well as appearance

Translate impressions of quality into observable behavior.

After drawing the checking site's wireframe, ask someone unfamiliar with the system to use synthetic data deliberately missing a document type.

Give them this task:

“Check whether this data can be handed off. If it cannot, correct it and export it.”

Do not point out the missing field. Observe whether the person discovers it, searches unrelated settings, understands what completion means and realizes that changing data calls for another check.

Use an acceptance matrix to turn UX quality into testable observations:

| Acceptance item | Example criterion |
| --- | --- |
| State recognition | Can explain the current progress in their own words |
| Error correction | Finds and corrects the omission without guidance |
| Input retention | Correcting one field does not require re-entering everything |
| Result correctness | Changed data cannot reuse the old validation result |
| Accessibility | Can understand without relying on color or mouse hover |

These are proposed acceptance conditions, not measured outcomes. One peer session can expose problems but cannot establish that all users will have the same experience.

## 9. Deliverables for this lesson

The original M04-05 deliverables are a four-state Wireframe and at least one interface revision grounded in an observation.

A minimal complete version can be an SVG containing four screens, a Figma design or paper sketches. Each screen should explain what the user sees, what they know and what they can do next. Explain how changed data invalidates the old result, and retain an anonymous observation record and a before/after comparison.

You do not need a complete frontend and backend at this stage. Check the interaction and information arrangement before investing in implementation.

## 10. Understanding check

Try the three questions below before opening the reference answers.

Question 1 | Concept identification

An AI document system's main screen contains “Upload file”, “Processing”, “Processing failed” and “Model temperature”. With progressive disclosure, which items should remain visible and which can wait? Why?

Question 2 | Applying the principle

A bank-transfer screen says “Transfer complete” when only the request has reached the bank's server and the transaction is unconfirmed. Which design principle does this violate, and how would you change the screen?

Question 3 | Engineering practice

An AI report passes validation. The user then changes the original data, but the system still allows the old report to be downloaded. Alongside changing the UI, what mechanisms should the backend and tests include?

The lesson connects three responsibilities:

Minimalism reduces unnecessary burden; progressive disclosure schedules when information appears; essential states tell users where they are and what they can do next.

Designing these together helps people understand, operate and trust a system that appears simple.
