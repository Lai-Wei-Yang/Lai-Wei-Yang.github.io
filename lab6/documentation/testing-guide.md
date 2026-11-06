# Testing guide

Use test submissions and a test Data Store before production.

| Test | Input / action | Expected behavior based on the exported design |
|---|---|---|
| Clear cosmetic request | Tally request to change a button colour | AI should classify actionable and assign Low priority; token and email branches should run |
| Core function failure | Login no longer works | AI should classify actionable and assign High priority |
| Ambiguous request | "Dashboard looks weird" | AI should classify needs_clarification; actionable-only branches should not run |
| Irrelevant promotion | Promotional spam | AI should classify spam; actionable-only branches should not run |
| Approve | Click approve for a pending token | Record status becomes approved |
| Reject | Click reject for a pending token | Record status becomes rejected |
| Replay decision | Reuse a token after it has been decided | Update filter should prevent a second status update |
| Invalid token | Submit an unknown token | Verify error handling; current exported flow may not provide a distinct failure response |
| Invalid decision | Submit a decision other than approve/reject | Verify error handling; update filter should not pass |

Record the Make execution result for each test. Do not test with a real client or production approval token.
