# M05-02 | Asset Inventory and Assessment Scope

Remember this first: know what needs protection, confirm what may be examined in this assessment, and only then choose tools.

The previous lesson distinguished vulnerability assessment from penetration testing. If a manager asks you to assess the company for vulnerabilities, you cannot immediately scan every visible device: what assets the company has and which assets this engagement authorizes you to test are different questions.

## 1. Understand it through a home inspection

When hiring a technician to inspect a water leak, first identify the rooms, pipes and equipment. That is an inventory. Then specify that this visit covers only the kitchen and bathroom, with no opening walls or entering a neighbor's home. That is scope. Seeing a neighbor's pipe does not authorize you to dismantle it; not entering a room also prevents you from concluding that the entire building has no leaks.

## 2. An asset is more than a computer

An asset is something valuable that needs protection. An asset inventory records the assets, their purposes, responsible parties and status.

Think in terms of devices such as laptops, servers and switches; software and services such as websites, databases and cloud services; data such as orders or design files; and administrative identities and service dependencies. If a test machine contains real orders, judging it solely by the name “test machine” may underestimate the impact.

[CIS Control 1](https://www.cisecurity.org/controls/inventory-and-control-of-enterprise-assets) emphasizes inventories that cover physical, virtual, remote and cloud environments. Software, data and accounts also need corresponding inventories; a device list cannot cover everything on its own.

## 3. What should a useful inventory record?

For a synthetic test website, record:
- Stable asset identifier: WEB-TEST-01.
- Name, location and environment: a test ordering website.
- Responsible role: the website maintenance team.
- Software and versions: verified by an administrator.
- Purpose and data: functional testing with synthetic orders.
- Connections and dependencies: uses a test database.
- Information source and verification time: helps identify stale information.

An IP address is a clue, not a permanent identity. A device may have several addresses, and the same address may be assigned to different devices at different times. Combine asset identifiers, hostnames, cloud resource IDs and verification times rather than merging records solely because their IP addresses match.

## 4. Assessment scope defines this engagement's boundaries

Assessment scope specifies the objects and questions covered by this engagement, as well as excluded actions. “Test the company website” is not specific enough. Confirm:

- Which website, environment and interfaces? Which hosts or third-party services are excluded?
- What test identity may be used? Are checks read-only, or are data changes permitted?
- From where and during which time window will the work run?
- When must testing stop and who must be notified if service problems arise, sensitive information is unexpectedly encountered, or an unknown target appears?
- What evidence will be retained, where will it be stored and who may access it?

These details usually belong in an assessment plan and Rules of Engagement, or ROE: the agreed rules for conducting the testing. [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) discusses authorized targets, exclusions, permitted activities, data handling and incident response. A third-party environment also requires consideration of that party's consent and restrictions.

An asset appearing in the company's inventory does not authorize testing it in this engagement; scanner visibility is not authorization either.

## 5. Work through a complete synthetic example

A company has test website A, production database B and external payment service C. This engagement authorizes only the review of A's security settings and version. A's configuration refers to B, and its pages also redirect to C.

The correct approach is to record B and C as dependencies; check the authorization and confirm that both are outside scope; examine only the authorized A; and, if necessary, propose a separate assessment of B and C to the responsible person. Report “the specified items on A were examined; B and C were not tested,” rather than “the entire ordering system is secure.”

The observation is “A's configuration refers to B.” The inference is “B may affect the overall risk.” Whether testing B is authorized remains a separate question.

## 6. Not finding something does not establish its absence

An inventory may omit an offline laptop, a temporarily created cloud host or a service visible only from a particular network segment. Not finding it in one scan does not establish that it does not exist.

Cross-check management inventories, cloud resource lists, software management records and authorized network information. Mark conflicting information as unconfirmed. Retain evidence of who confirmed ownership, when versions were checked, what was included and what was not assessed, so the report does not overstate coverage.

## Five-minute tabletop exercise

List a synthetic test website, production database and external payment service. For each, record its purpose, responsible role, data type and information source. Circle the only website authorized for testing, then write down two exclusions and stop conditions. This is a tabletop exercise, not a real authorization document, and requires no connection to any system.

## Quick check

You find another database's address in a website that you are authorized to test, but the database is outside the authorized scope. What would you record, and what would you do next?

The core questions are: who or what am I testing, what authorizes the test, and how much scope can the result represent?
