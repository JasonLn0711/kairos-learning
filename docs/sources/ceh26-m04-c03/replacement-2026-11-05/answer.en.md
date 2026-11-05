Question 1 A: A listing does not establish that every file's contents were leaked. This test establishes that the specified test identity can see three filenames; it provides no evidence of a content download.

Question 1 B: Yes. If policy prohibits ordinary employees from learning salary filenames, visibility of employee_salary.xlsx itself warrants investigation. Compare the actual identity, expected permissions, and test scope; do not generalize a listing into a content-disclosure finding.

Question 2 A: No. EHLO advertising STARTTLS is capability information. Establish actual protection through evidence of the STARTTLS upgrade, TLS handshake, certificate validation, and related results. TLS protects that transport segment; it does not automatically encrypt mail end to end.

Question 2 B: No. Advertising AUTH does not establish successful authentication. Obtain the actual authentication exchange and success result, and confirm the identity used. Do not send real credentials over an unprotected connection.

Question 2 C: Within explicit authorization, test actual acceptance/rejection against the forwarding policy for source, authenticated identity, and destination. Preserve the corresponding commands, complete replies, configuration, or logs. Use administrator-controlled test senders/recipients and synthetic content; avoid third-party mail or spam. Normal server-to-server delivery, EHLO, or one successful RCPT step does not establish an open relay. Keep the result unconfirmed if policy or receiving outcomes were not checked.
