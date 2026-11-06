# Workflow guide

## Tally intake and triage

The Tally trigger passes the complete incoming webhook payload to the AI agent. The agent returns these fields:
- `classification`
- `component`
- `category`
- `priority`
- `summary`
- `detailed_description`
- `acceptance_criteria`
- `clarification_questions`
- `duplicate_notes`

Only records classified exactly as `actionable` proceed through the approval-token and approval-email modules in the exported blueprint. The supplied export does not show separate handling routes for `needs_clarification` or `spam`.

## Approval token

For an actionable request, the Tally scenario:
- generates a UUID key;
- creates a Data Store record with `status=pending` and `decision=pending`;
- stores the timestamp and AI summary as `request_id`;
- includes the token in approve and reject email links.

## Approval handler

The handler retrieves the record using the incoming token. It updates the record only if the existing status is `pending` and the incoming decision is `approve` or `reject`. It then sets the status to `approved` or `rejected`.

## Current limitations visible in the exports

1. The approval handler's webhook response module is not visibly filtered based on whether the update succeeded. It may return the same success message even when the token is missing, already used, or the decision is invalid. Test and improve this before production.
2. The approval links invoke a webhook through links in an email. Some email security scanners may automatically visit links. Consider a confirmation page or a two-step decision flow before using this pattern for high-impact approvals.
3. The exported flow records `request_id` as the AI-generated summary, not as a unique Tally response ID.
4. The supplied exports do not include a GitHub Issue creation module.
5. The AI output includes `needs_clarification` and `spam`, but the exported scenario only shows an actionable filter. No explicit clarification or spam handling branch is included in these blueprints.
