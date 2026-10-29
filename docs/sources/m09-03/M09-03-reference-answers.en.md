# CEH M09-03 | Reference explanation

This is teaching material, not a record of a learner's submitted answer or verified understanding. Keep it collapsed by default on the website. Do not place it in the actual learner Q&A or answer fields.

## 1. Can the three concepts coexist?

Yes. If a deceptive attack is confirmed, the SMS component is **smishing**, the voice-based inducement is **vishing**, and claiming to be the IT help desk is **impersonation**.

The first two mainly describe channels; the third describes a claimed identity. They are not mutually exclusive. Knowing the project name establishes only possession of that information, not a genuine IT identity. Evidence of tailoring to the employee could additionally support a targeted-phishing description, but the question does not require inventing a background-information collection process.

## 2. How should the request be verified outside the arranged chain?

Pause disclosure, login approval, and software installation, then end the suspicious call. Do not use the number dictated in the text, and do not treat the displayed caller ID as a trusted directory.

Use the established company help desk, an existing directory, or a previously verified official entry point. Check whether the request, ticket, and responsible staff member exist, what operations are needed, and which approvals apply. An independent source matters more than merely switching to a phone or another app. A verified identity still needs authorization for the specific action.

## 3. Can account compromise and data disclosure already be concluded?

**Not yet, but timely, risk-appropriate protective action is warranted.**

The available information includes receipt of the text and call and the employee's report of sharing a login code. This represents possible authentication-information exposure and should be reported promptly through the official channel. Protection should not wait for confirmed loss.

Open questions include what operation the code related to, whether it was valid, whether login or another verification completed, whether the operator was authorized, what subsequent actions occurred, and whether information was accessed or disclosed without authorization. Cross-check times, authentication and login records, account and permission changes, devices, tickets, and data activity.

The responsible owner can evaluate account protection, revocation of suspicious sessions, or device handling under the organization's procedures. Do not supply another code or reopen suspicious content for testing, and do not erase all evidence yourself.

In short: **address known risk promptly; establish successful compromise and data disclosure with their own evidence.**

## Basis

- [Canadian Centre for Cyber Security: Vishing](https://www.cyber.gc.ca/en/what-voice-phishing-vishing-itsap00102)
- [Canadian Centre for Cyber Security: Smishing](https://www.cyber.gc.ca/en/guidance/smishing-protect-yourself-sms-attacks-itsap00103)
- [NIST SP 800-63B-4: Phishing resistance](https://pages.nist.gov/800-63-4/sp800-63b.html#phishres)

The explanation separates official terminology from reasoning about this fictional scenario; it does not represent a real incident.
