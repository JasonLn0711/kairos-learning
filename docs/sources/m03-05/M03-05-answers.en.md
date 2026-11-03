# M03-05 Reference Answers

## answer-port-label | 1. Entry-point number and service identity

`open` describes the port state observed in this test. `https` may be a familiar name from a port table or a result of additional service detection; first establish how it was produced. Even a response consistent with HTTPS requires further checks for the product, complete version and deployment position. Preserve the original output and probing method, and leave unverified product/version fields pending.

## answer-null-probe | 2. An established connection already contacts the target

Establishing TCP exchanges network packets with the target and may create service logs. “NULL” means that no application-layer probe content has yet been sent, not that no interaction occurred. Authorization and service-impact considerations still apply. Analyzing previously and lawfully collected traffic without making a new connection is a different, passive observation method.

## answer-backend-evidence | 3. Complete the backend and patch evidence

Obtain at least three categories: first, proxy/backend architecture and the origin of the response string, to establish which layer it describes; second, the backend's running program, complete package version and vendor revision; third, vendor advisories, backport and installation records, and the configuration conditions required for the weakness to apply. Where relevant, confirm that the service has reloaded the patched version. Record external responses separately from internal evidence before assessing applicability.

## answer-banner-patching | 4. Validate disclosure reduction and patching separately

Hiding the version can be recorded as “version disclosure reduced” after checking the actual post-change response. “Vulnerability fixed” needs separate evidence: package/advisory comparison, patch installation results, running-version and configuration checks, and the corresponding authorized validation. Both tasks can be scheduled together, but neither substitutes for the other.
