# M02-01 | Reference Answers

## 1. Same browser, different data flows

For an existing snippet, the main arrow is “Me → Search platform.” Opening the target website changes it to “Me → Target website or its hosting service.” The tool is the same, but the recipient differs. Under this lesson's direct-interaction definition, the latter is not zero interaction. Ordinary browsing still does not equal vulnerability scanning.

## 2. Third-party DNS does not guarantee no indirect interaction

There is no such guarantee. A resolver may answer from a valid cache or query other servers. You need information about caching, forwarding, and the actual resolution path; a tool or resolver name is insufficient. The source seen by the authoritative service may also be the resolver rather than the original requester.

## 3. Three pieces of evidence support three limited conclusions

An old job advertisement supports only that a public document mentioned a skill at that time. A service response supports that a response occurred under a particular request, time, and observation point. An owner's current inventory can support asset ownership and status within its coverage. None alone proves that a system can be compromised. Versions, configuration, reachability, and actual weaknesses still require separately authorized verification.

## 4. A new clue does not automatically expand the scope

Record the source, time, possible relationship, and uncertainty as an item awaiting confirmation. Ask the responsible owner to verify it and update authorization first if necessary. Already permitted analysis of supplied records can continue, but do not directly probe the new host. Follow established stopping and reporting rules when scope is unclear or unusual conditions arise.
