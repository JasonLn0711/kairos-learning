# M04-04 | Wireframe: design behavior before adding color

When designing software, first establish whether users understand the screen, know what to do, and can recover from errors. Visual polish comes after those questions.

A wireframe rehearses interactions before implementation using simple boxes, text, buttons and arrows.

UI/UX designers, product managers, software engineers, AI Agent developers, and people planning hospital, banking or government digital services can all use this technique.

This lesson develops four abilities:

1. Express what users need to see and do with inexpensive sketches.
2. Plan normal, processing, failure and completed states.
3. Ask someone else to walk through the sketch and identify confusing choices.
4. Distinguish evidence from a sketch from behavior that still requires executable software tests.

## 1. Why draw a wireframe before developing software?

Imagine opening a restaurant. A designer immediately produces an attractive plan with marble counters, pendant lighting and wooden furniture.

After opening, however, you discover:

- Customers do not know where to order.
- After ordering, they do not know where to wait.
- They cannot work out how to correct an order.
- A failed payment still produces an “Order complete” message.
- Staff routes between the kitchen and counter interfere with each other.

The service workflow needs attention alongside the decoration.

Software has the same problem. React, Figma or an AI Coding Agent can quickly produce a professional-looking screen, yet that appearance alone does not establish that users can complete their work.

Wireframes let the team examine a direction cheaply, before investing heavily in implementation.

@figure1

This is a typical explanatory order, not a requirement for a strict waterfall process. A team can revise requirements, sketches and prototypes repeatedly.

The GOV.UK Service Manual recommends using prototypes to explore and test designs, choosing paper sketches or code prototypes according to the question being investigated.

## 2. What belongs in a wireframe?

Consider a shipping-data checking system for a logistics company.

An employee enters three fields: recipient, delivery address and contact telephone. The system checks whether each field has a value, then allows preview and export of a shipping-data draft.

For this example, completeness checking does not establish that the address exists or the telephone number is valid.

Before choosing blue or green buttons, sketch four situations.

@figure2

These are low-fidelity teaching sketches. Their button labels do not execute checks.

Users do not have to visit all four screens in sequence:

- If all three fields are filled and checking is immediate, input can go directly to completion.
- An omitted address leads to the missing-data state.
- A remote server request may require a processing state.
- A server fault is a technical failure; do not describe it as missing user data.

These differences introduce states and state transitions: the current situation and the events that change it.

## 3. Connect the screens through explicit transitions

A common mistake is drawing only the successful interaction: fill in the data → submit → display success. This is the happy path.

Real use also includes omissions, waits, faults and edits.

@figure3

Decision nodes express a condition, and directed connections name the events that change states. The supplied reference uses dashed rounded rectangles rather than diamonds for its decisions. The conditions and branches carry the meaning.

Three industry examples explain why this matters.

Bank transfer: complete fields do not establish that a bank has transferred money. Actual debit completion needs separate confirmation. A timed-out transaction may have executed, so immediately sending the transfer again can duplicate it.

Hospital appointment: complete appointment fields do not establish a successful booking. The system must actually reserve a session or available place.

AI Agent tool: a research-report task may be waiting for a tool, missing information, experiencing a tool failure, or holding a generated report for human review. Drawing only an instruction screen and a completed report omits important intermediate states.

A success message must describe what has actually been established. Unverified outcomes require a different status.

## 4. Why add annotations beside a screen?

A wireframe shows a screen's approximate appearance but cannot fully specify its behavior.

A “Submit” button leaves several questions open:

- Should the button be locked after activation?
- Should entered content survive a lost connection?
- Can the user cancel?
- Does the previous approval remain valid if the data changes?

Behavior annotations record those rules.

@figure4

The reference is Balsamiq's file-upload example. Uploading can end in success or failure; the alternative paths should share the same uploading state rather than being mistaken for two separate required processes.

Record these decisions in wireframe-notes.md. For the logistics example:

```
# Shipping-data wireframe behavior notes

## Check data
Trigger: user selects “Check data”
Condition: check the three required fields

## Missing data
Display: identify the omitted fields
Retain: all other entered values
Allowed actions: fill omissions and check again

## Technical failure
Display: the check cannot currently be completed
Allowed actions: safely retry or try later
Restriction: do not claim that checking succeeded

## Check passed
Display: three-field completeness check passed
Allowed actions: preview and export
Restriction: address and telephone validity remain unverified

## Edit after completion
Trigger: any field changes
Result: the previous check is invalidated
Next action: check again
```

The drawing explains the screen; the notes specify its rules.

Pay particular attention to editing after completion. If a doctor changes medication information after a medical record was reviewed, continuing to display “Reviewed” could falsely imply that the new content was approved too.

This affects data consistency, permissions, workflow and safety as well as interface design.

## 5. Low, medium and high fidelity

Fidelity describes how closely a design resembles the eventual product's appearance and interaction detail.

| Type | Plain-language description | Question it can investigate |
| --- | --- | --- |
| Low-fidelity | Paper-like boxes and text | Are fields, actions and flow reasonable? |
| Mid-fidelity | More precise grayscale layout with realistic content | Are information arrangement and reading order clear? |
| High-fidelity | Visual design close to the product | Are typography, color, hierarchy and detail appropriate? |
| Interactive prototype | Clickable controls, screen changes and simulated interaction | Can users operate the proposed interaction smoothly? |

These categories can overlap. A high-fidelity screen can also be part of an interactive prototype.

An architect might first discuss room locations using a hand-drawn floor plan, then make precise drawings, and later test the experience with a 3D model or physical samples.

Choose a proportionate method for the question. Expensive validation is unnecessary when a cheap sketch can answer it; a sketch still cannot establish tested interactive behavior.

## 6. How can you check whether a wireframe helps?

In a walkthrough, another person follows a scenario through the sketch and explains what to do next.

Give the logistics-system participant two task cards.

@figure5

Do not reveal the answer at the start. Observe whether the sketch supplies enough clues for the person to understand the action.

Different methods support different conclusions:

| Method | Supported conclusion | What it does not directly establish |
| --- | --- | --- |
| Self-review | Obvious design contradictions were found | Actual users will understand it |
| Another person's walkthrough | How that person interpreted the sketch in the stated scenario | Every user can complete the task |
| Interactive prototype testing | Interaction behavior on the specified device and scenario | Production performance and security |
| Executable software tests | Program behavior within the tested scope | Reliability in untested situations |

Accessibility also starts with sketches. Even a monochrome design should plan field labels, error text and sensible reading order.

A red border alone is insufficient error identification. WCAG 2.2 Success Criterion 3.3.1 requires automatically detected input errors to identify the affected item and describe the error in text.

Planning a reading order on paper does not establish screen-reader or keyboard behavior in executable software.

## 7. Complete the practice task

Retain two artifacts.

wireframe.svg is a browser-readable four-state wireframe. SVG means Scalable Vector Graphics; a text editor can change its labels and shapes.

wireframe-notes.md is a Markdown behavior specification covering transitions, retained input, error recovery, rechecking after edits and untested behavior.

1. Download aase-v1-workshop.zip from the workshop resources.
2. Copy reference/wireframe.svg and preserve the original reference.
3. Adapt the synthetic scenario to an industry such as hospital registration, logistics or a banking form.
4. Edit the SVG text and check that the browser displays it without clipping.
5. Record triggers, allowed actions, recovery and editing rules in wireframe-notes.md.
6. Walk through missing data and editing after completion, recording at least one reason for revision.

The deliverable is an understandable, discussable interface-specification draft with traceable design reasons. A working website is a later layer.

## 8. Engineering ideas to retain

Wireframes connect requirements engineering with implementation.

M03 asks which problem to solve. M04-03 information architecture organizes the information. M04-04 turns requirements into screens, actions and states. Later specification-driven development and tests translate those decisions into executable rules.

For every screen, ask four questions: What does the user know now? What can they do? What happens next? How can they recover from an error?

## 9. Check your understanding

Answer in your own words; formal terminology is unnecessary.

1. A hospital-registration wireframe contains name, identity number, appointment date and a “Confirm appointment” button. Does this establish a complete registration process? Which important states are missing?

2. A loan applicant submits data and the system says “Three required fields are complete.” Can the state now be labeled “Loan approved”? Explain why.

3. An AI Agent task interface has success and failure screens but has not been implemented. Can the team claim that interruption, retry, permissions and security have been verified? What should be tested next?
