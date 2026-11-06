# Installation and restoration guide

These instructions restore the exported scenario structures in a Make account. They do not transfer the original account's credentials, live webhooks, Data Store contents, or connected service authorizations.

## Before importing

Have access to:
- the Make account where the scenarios will run;
- the Tally form used by the intake scenario;
- the approver's email account;
- permission to create/use a Make Data Store;
- the Make AI provider connection required by the agent.

## Recommended restoration order

### 1. Restore or create the shared Data Store

The source exports refer to Data Store ID `242031`. In a different Make account, create a Data Store with a compatible record structure and select that same newly created Data Store in both scenarios.

Suggested record fields based on the exports:
- `status` (text)
- `decision` (text)
- `created_at` (text/date)
- `request_id` (text)

The record key is the generated UUID token.

### 2. Import Change Request Approval Handler

1. Create a new scenario in Make.
2. Import `scenarios/change-request-approval-handler.blueprint.json`.
3. Reconfigure the Custom Webhook trigger and create a new webhook.
4. Re-select the Data Store created in step 1 for both Data Store modules.
5. Save the scenario and copy the newly generated webhook URL.
6. Run a controlled test with a test token before enabling it.

### 3. Import Integration Tally

1. Create another scenario.
2. Import `scenarios/integration-tally.blueprint.json`.
3. Reconnect the Tally Watch New Response trigger to the intended form.
4. Reconnect/configure the Make AI provider connection.
5. Review the agent prompt and output schema.
6. Re-select the same Data Store created in step 1.
7. Reconnect the Google Email module and replace `REPLACE_WITH_APPROVER_EMAIL`.
8. In the email HTML, replace both occurrences of `REPLACE_WITH_APPROVAL_HANDLER_WEBHOOK_URL` with the new webhook URL from step 2. Keep the query parameters and Make mapping expressions for `token` and `decision`.
9. Save and test the scenario.

## Reconnect, do not copy credentials

The blueprint contains account-specific connection and webhook references. Reauthorize the connections in the target Make account. Do not try to reuse exported connection IDs as credentials.

## Final activation

Keep both scenarios disabled until end-to-end tests pass. Activate the approval handler first, then activate the Tally intake scenario.
