# CEH M09-05 | Reference Answers

## 1. Why can we not immediately conclude that Alex maliciously stole data?

A record initially identifies which account performed an action, not necessarily which person operated it or with what intent. Verify at least two things: was the download approved and required for work? Did Alex actually perform it, or was the account or session compromised? Also establish whether the record represents a completed download or merely a request, which data was involved, and whether it reached an unapproved recipient.

Figure 2's red dashed arrow is only a possible boundary-crossing path. Figure 4 requires checking records and work context rather than treating an alert as a verdict of malicious behavior.

## 2. Can MFA alone prevent an authorized person from misusing legitimate access?

No. MFA primarily helps authenticate the claimant. If the real Alex passes authentication, Alex may still misuse an available function. Add appropriate controls at Figure 2's purpose / sharing authorization boundary: limit which data can be exported, require another authorized person to approve disclosure, restrict recipients or transfer channels to approved destinations, and preserve audit records.

DLP may help identify or block sensitive-data transfers, but cannot guarantee coverage of every case. A DLP alert alone does not establish malice. Authentication, authorization and oversight address different problems.

## 3. What does an exposed copy of an identification document establish?

Under the question's stated conditions, the document copy has been exposed and sensitive identity information is at risk of misuse. It does not establish that an existing account has been taken over, that a fraudulent application succeeded, or that a particular financial loss occurred. Those claims need separate evidence.

Correct application information shows that the applicant possesses the information; it does not establish that the applicant is its rightful holder or is authorized to use it. The new-service application on the right of Figure 3 needs an appropriate identity-proofing process that checks the evidence and the applicant's connection to that identity. Knowing the information is not the same as being the person. Preserve necessary evidence and use trusted channels to address suspected misuse without exposing more personal information.
