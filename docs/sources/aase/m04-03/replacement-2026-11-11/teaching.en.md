# Information architecture and visual hierarchy: help users know what to do

A useful interface helps people find information, recognize what needs attention now, and identify their next action.

Imagine visiting a hospital to register, see a clinician, pay and collect medication.

The hospital may have advanced equipment and attractive interiors. Yet an unmarked registration desk, confusing payment and pharmacy windows, or signs full of unfamiliar abbreviations can still leave you lost.

Software interfaces raise the same problem.

Before designing the screen, distinguish three questions:

| Concept | Plain explanation | Question it addresses |
| --- | --- | --- |
| Information architecture (IA) | Classify and name things, and define their relationships | Where is what I need? |
| Navigation | Provide ways to reach those things | How do I get there? |
| Visual hierarchy | Make different levels of importance perceptible | What should I notice and do first? |

These concepts interact but describe different decisions. Organize information relationships before choosing sidebars, tabs and buttons.

## 1. Information architecture: organize before presenting

Begin with categories and names that the intended users can understand.

### Supermarket and student-service categories

Imagine a large supermarket.

Without useful categories

Milk, laundry detergent, cookies and batteries are mixed together, making shoppers search repeatedly.

Group goods around shoppers’ needs

Fresh food, drinks and cleaning products occupy recognizable areas. Shoppers can predict where to look.

New shelving and better lighting alone do not establish these relationships. A useful product classification and placement scheme does.

The same reasoning applies to a website.

Suppose a university student-service site offers these functions:

Course registration, tuition payment, scholarship applications, grade lookup, parking permits, faculty research projects, classroom reservations and graduation clearance.

One organization follows the university's administrative units:

- Academic Affairs
- Student Affairs
- General Affairs
- Research and Development

This reflects the institution's internal organization.

Another organization follows the work students want to complete:

- Courses and grades
- Tuition and financial support
- Campus life and facilities
- Research and graduation

This reflects users' tasks.

Which is always better?

Neither is universally better. Grouping by responsible office may suit administrative staff. For new students, task-based categories are usually a useful starting hypothesis to test.

An IA principle follows:

Organize information around users' understanding of the domain. Avoid adopting the team's or institution's internal divisions without checking whether those divisions help the intended users.

### IA is broader than a sitemap

The nested regions distinguish the broader practice from its structural artifact.

@figure 1

Nielsen Norman Group's diagram places the sitemap inside website-structure planning, which is itself part of the broader practice of information architecture.

IA also covers content inventory, content quality audits, user research, classification and naming.

Think of IA as planning a city, a sitemap as a map of its districts, and navigation as roads and signs.

A more attractive menu alone cannot resolve poorly organized information.

## 2. Navigation: help people reach information

If information architecture is the supermarket's classification of goods, navigation is its signs and aisles.

For example, an ecommerce site may classify products into clothing, appliances, food and home goods. That classification is part of its IA.

How do customers reach those categories?

They might use a top menu, sidebar, search field, product filters or category links on the homepage.

These are navigation components.

@figure 2

A sitemap describes relationships among content. People using the site usually move through menus, search and links rather than inspecting the complete map.

### Why not choose a sidebar first?

Suppose an online registration service only needs three steps:

1. Enter personal details.
2. Confirm registration information.
3. Complete registration.

A simple three-step interface may be enough.

Adding a left menu, top tabs and a right toolbar just to make the service look professional can make the task harder.

An enterprise platform with hundreds of functions, however, may need a sidebar, search and multiple navigation levels.

Choose navigation forms according to information complexity, user tasks and context of use.

## 3. Visual hierarchy: make important information noticeable

Imagine an aircraft cockpit.

During flight, altitude, speed and warnings have a different immediate importance from seat-adjustment settings.

Giving every item equally large text and equally vivid colors makes the priorities harder to distinguish.

Interfaces have the same issue.

Visual hierarchy uses size, position, spacing, contrast and grouping to help users distinguish levels of importance.

Nielsen Norman Group includes visual hierarchy among its visual-design principles.

### Compare two information arrangements

Compare how the two screens present state, problems and the next action.

@figure 3

These are explanatory sketches, with no working controls or evidence from user testing.

The two arrangements contain similar functions, but the second helps users answer three questions:

- What state am I in now?
- What problem needs attention?
- What should I do next?

Visual hierarchy supports those judgments.

### Five common ways to establish visual hierarchy

The table organizes five aspects of a candidate visual arrangement.

| Method | Plain explanation | Example |
| --- | --- | --- |
| Scale | Make more important headings easier to notice | A page title is larger than supporting information |
| Position | Place information needed now where people can find it | Put the payment total near the confirmation action |
| Contrast | Use visual differences to distinguish importance | Distinguish primary and secondary actions |
| Spacing | Keep related information close and separate unrelated content | Group the order amount with the payment button |
| Grouping | Place information serving the same task together | Separate patient details from test results |

Not every important item needs larger type, bold text or vivid color.

If every button stands out equally, users still have to guess which action matters now.

A useful hierarchy provides appropriate differences among information levels.

## 4. Primary action: the priority changes with state

Consider an airport self-service check-in kiosk.

Before a reservation has been entered, the primary action is to look up the booking.

After the booking is found, it may become confirming the flight and travelers.

Only after check-in is complete does printing a boarding pass become appropriate.

Displaying booking lookup, check-in confirmation and boarding-pass printing with equal emphasis in every state, without their preconditions, conceals the order of the work.

These actions have dependencies.

@figure 4

This example distinguishes four states. Passing a completeness check does not establish formal review or approval.

The primary action follows the user's current state, reducing the need to guess among unrelated buttons.

Keep important errors visible when simplifying an interface.

For example, if a medical system lacks information required for a test, show that omission explicitly even if it occurs infrequently. Hiding it in advanced settings makes it harder to resolve.

## 5. Mobile and desktop: preserve meaning as layout changes

Responsive design adapts an interface's presentation to screen size and interaction methods.

Suppose a desktop layout places data entry on the left and instructions on the right.

On a phone, these areas usually stack vertically.

If the instructions say to check the conditions before submitting, the mobile order must make them available before that action.

@figure 5

Visual position can change while the meaningful information order remains intact.

WCAG 2.2's Meaningful Sequence criterion requires a correct reading sequence to be programmatically determinable when presentation order affects meaning.

Independent cards need not all have one mandatory order. Check whether reordering changes the intended meaning.

### Field names also need attention

Suppose a text field contains this hint:

“Enter application ID”

This is a placeholder.

It usually disappears when the user starts typing.

A more reliable approach keeps “Application ID” visible as a label and supplies a format example separately.

The code must also associate the label with the input so assistive technologies such as screen readers can identify the control.

Interface design helps people with different abilities and devices understand and operate the service.

## 6. Apply the concepts across industries

The following examples identify different content relationships and immediate priorities.

| Industry | Information-architecture question | What visual hierarchy should emphasize |
| --- | --- | --- |
| Healthcare | How should patient details, tests, medication and treatment be grouped? | Clinical information needing attention and important warnings |
| Ecommerce | How should products be classified and filtered? | Price, specifications, stock and purchasing actions |
| Banking | How should accounts, transfers, investments and loans be organized? | Amount, recipient, transaction confirmation and risk notices |
| Manufacturing | How should equipment, work orders, maintenance and quality data be organized? | Abnormal equipment, pending work orders and downtime alerts |
| Education | How should courses, materials, assignments and tests be grouped? | Current progress, the next learning task and unfinished work |
| Government services | How should applications, lookups, missing-document requests and tracking be classified? | Current case status, deadlines and the next action |

These examples share principles, but no fixed layout serves every industry.

A clinical dashboard and a shopping site both need hierarchy. Their requirements for warnings, information density and action restrictions can differ substantially.

## 7. Start with a repeatable design process

Turn the concepts into a process that leads from user tasks to a testable interface.

@figure 6

A wireframe uses simple boxes, text and arrangement to show how an interface will work. Detailed icons, color treatment and animation can wait.

Two research methods can provide evidence for the information structure:

Card sorting asks users to group cards labeled with functions or topics according to their own understanding. It explores possible categories in their mental models.

Tree testing starts with a proposed hierarchy and asks people to find an item, such as a parking-permit application. It tests whether they can find the destination without relying on polished visual design.

The first method explores groupings; the second evaluates an established structure.

### Record the result in wireframe-notes.md

Use this simplified template in a practice project:

```
# M04-03 畫面資訊與線框規劃

## 1. 使用者與任務
使用者：案件承辦人
目標：檢查三項必要資料是否完整

## 2. 內容清單
- 申請編號
- 申請人代號
- 文件類型
- 必填說明
- 檢查動作
- 缺漏與修正方式
- 當次檢查結果
- 預覽與匯出

## 3. 資訊分組
- 任務與限制
- 資料輸入
- 檢查動作與結果
- 次要說明及診斷

## 4. 主要動作
- 未檢查：檢查資料
- 檢查中：顯示處理狀態
- 缺件：補填並重新檢查
- 完整：預覽、匯出當次結果

## 5. 閱讀順序
任務 → 必要資料 → 檢查 → 結果

## 6. 待驗證事項
- 使用者能理解分類與欄位名稱嗎？
- 錯誤是否有文字說明及修正方法？
- 手機閱讀順序是否合理？
- 鍵盤能否依合理順序操作？
- Label 是否與輸入控制項正確關聯？
```

The shared project template above retains its original Chinese text in both language editions. The English reading of the template is: 1) User and task: case handler; check whether three required fields are complete. 2) Content inventory: application ID, applicant code, document type, required-field instructions, check action, omissions and corrections, result of the current check, preview and export. 3) Information groups: task and constraints; data entry; check action and results; secondary instructions and diagnostics. 4) Primary action: unchecked—check data; checking—show processing status; missing—fill in and check again; complete—preview and export the current result. 5) Reading order: task → required data → check → result. 6) To verify: do users understand the categories and field names? Are errors explained in text with a correction? Is the mobile reading order sensible? Can the keyboard follow a reasonable order? Are labels programmatically associated with their controls?

This record establishes content, workflow, states and validation conditions before frontend implementation begins.

It also makes requirements clearer when handing the work to a human engineer or an AI coding agent.

## 8. Five common mistakes

Use these failure patterns to review a candidate interface.

1. Design an attractive screen before investigating user needs. The resulting workflow may not support the task.
2. Treat IA as menu design. A menu is one way of presenting the information structure.
3. Give all buttons equal emphasis. The primary action becomes unclear and increases the judgment required.
4. Represent errors by color alone. Provide text explaining the problem and how to correct it.
5. Test only the desktop appearance. This misses mobile layout, keyboard use, screen readers and actual operation order.

## 9. Check your understanding of M04-03

The three questions appear in the understanding-check section below. Choose an answer yourself before expanding the reference explanation; this page does not submit or save answers.

Organize information first, decide how users will reach it, and then use visual hierarchy to guide attention and action.

Continue with M04-04 on wireframes to turn categories, states and primary actions into a concrete screen plan.
