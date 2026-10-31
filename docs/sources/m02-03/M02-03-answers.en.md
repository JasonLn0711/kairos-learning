# M02-03 Reference answers

## answer-1 | Search results, rules, and security evidence

(1) No. A snippet establishes only what the search service displayed at query time. Check the original resource within authorization to establish its current public status, and record the time. Do not turn an old snippet into a claim about the present.

(2) No. robots.txt instructs cooperative crawlers; it does not enforce permissions. noindex is an indexing rule and also cannot replace access control for private content.

(3) No. The header could describe a proxy, contain an old string, or use a simplified label. The version, configuration, applicability conditions, and actual weakness require separately authorized verification.

(4) Within approved scope, the owner should compare access by unauthenticated, ordinary-user, and permitted-user roles, checking whether the server enforces authorization for each identity and resource. Preserve scope, account roles, times, and outcomes. Search absence or an isolated status code does not replace complete access-control verification.

## answer-noindex | Access design for a private PDF

A person with the full URL can still download this publicly served PDF. noindex manages search indexing; website access settings govern file delivery. For members-only access, the server authenticates the user, authorizes that member to read this PDF, and then delivers the file. Verify signed-out, signed-in but unpermitted, and permitted roles, checking actual content and responses.
