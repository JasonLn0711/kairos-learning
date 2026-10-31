# M02-04 Reference Answers

## answer-1 | A CDN address does not prove the origin server

No. An A record shows the address returned by this lookup; a CDN can proxy multiple websites. There is insufficient evidence that this address is exclusive to the coffee shop. It certainly does not place the entire CDN within the authorized testing scope.

## answer-2 | Different roles are not interchangeable

No. A registrar provides domain registration services and is not necessarily the website operator. If holder information is not public, record that public information is insufficient; do not guess a name or ownership.

## answer-3 | A timeout does not mean nonexistence

No. A timeout means a response did not arrive in time, possibly because of network or service conditions. NXDOMAIN is the response status stating that the queried name does not exist. Even when receiving NXDOMAIN, retain the source, time, and query conditions.

## answer-4 | Let someone else repeat the check under known conditions

At minimum, retain the authorized scope, query date and time zone, source or resolver, network viewpoint, complete name, record type, response status, and original values. Include TTL when available, and separate observations from ownership that remains unverified.
