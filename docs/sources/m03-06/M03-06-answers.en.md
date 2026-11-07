# M03-06 Reference Answers

## answer-ttl | Does TTL 61 confirm the system?

TTL 61 is the remaining value at the observation point; the initial value and decrements along the path affect it. An initial value of 64 with one decrement per hop supports three decrements only under those synthetic assumptions. Different systems and settings can produce the same TTL, so additional response features, network context and administrator evidence are needed. Record observations separately from assumptions.

## answer-active-passive | How do active and passive collection differ?

Analyzing authorized existing packets uses traffic that already occurred; the recording and observation location limit what can be learned. Nmap -O sends additional probes and observes responses, making it active identification. Both approaches require appropriate permission. Passive observation does not authorize collecting other people's traffic.

## answer-proxy | How should front-end and back-end clues be checked?

First determine where the external TCP connection terminates. If it terminates at the front end, investigate that device using the stack fingerprint. Check the service self-description against its actual source and the running back-end program. Preserve each observation's location, time, tool and raw response, then confirm using architecture settings, device versions and update records. Different clues can describe different layers rather than demonstrate that one result is necessarily wrong.

## answer-confidence | How should a candidate or no exact match be recorded?

Label the result as a tool inference or candidate, preserving the original name, score, missing responses and warnings. A 95% feature-match score is not automatically a real-world accuracy rate; no exact match does not mean that no operating system exists. An authorized administrator should verify the target device, complete system and kernel versions, package patch records and intermediary devices. Until then, do not record the candidate as a verified version or established vulnerability.
