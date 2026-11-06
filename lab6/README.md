# Intelligent Requirement Triage Agent

A Make.com automation project that receives client change requests through Tally, uses an AI agent to classify and structure them, and sends actionable requests for approval by email. A second Make scenario records approval or rejection decisions using one-time tokens stored in a Make Data Store.

> **Current exported scope:** The supplied blueprints implement Tally intake, AI triage, approval email delivery, and approval-state recording. They do **not** currently create GitHub Issues. A GitHub integration must be added separately after the approval step if GitHub task creation is required.

## Repository contents

```text
.
├── README.md
├── LICENSE
├── .gitignore
├── scenarios/
│   ├── integration-tally.blueprint.json
│   └── change-request-approval-handler.blueprint.json
├── agent/
│   ├── agent-instructions.md
│   ├── classification-rules.md
│   └── output-schema.json
├── knowledge-base/
│   └── README.md
├── documentation/
│   ├── system-architecture.md
│   ├── workflow-guide.md
│   ├── installation-guide.md
│   └── testing-guide.md
└── examples/
    ├── sample-client-request.md
    └── sample-ai-output.json
```

## Architecture

1. Tally receives a new submission.
2. The Make AI Agent classifies it and returns structured fields.
3. Actionable requests create a pending approval token in a Make Data Store.
4. An email is sent with approve/reject links.
5. The approval-handler scenario retrieves the token and updates its status when the token is pending and the decision is valid.

See [`documentation/system-architecture.md`](documentation/system-architecture.md) for the diagram and module details.

## Quick start

1. Read [`documentation/installation-guide.md`](documentation/installation-guide.md).
2. Restore the **Change Request Approval Handler** first and create a new webhook.
3. Restore **Integration Tally** and connect the same Data Store.
4. Reconnect Tally, Make AI provider and Google Email.
5. Replace the email placeholder and approval-handler webhook URL placeholder in the email module.
6. Test using [`documentation/testing-guide.md`](documentation/testing-guide.md).
7. Activate the approval handler first, then the Tally scenario.

## Security and portability

- The blueprint copies in this repository are sanitized: the approver email is replaced with `REPLACE_WITH_APPROVER_EMAIL`, and the embedded approval webhook endpoint is replaced with `REPLACE_WITH_APPROVAL_HANDLER_WEBHOOK_URL`.
- Reconnect all services in your own Make account. Exported connection IDs, webhook IDs and Data Store IDs are environment-specific references, not portable credentials.
- Do not commit API keys, OAuth tokens, live webhook URLs, client submissions, or other secrets.
- Treat approval links as sensitive. Review the security notes in the workflow guide before production use.

## AI agent

The prompt and output schema extracted from the supplied Integration Tally blueprint are in [`agent/`](agent/).

## License

MIT. Review and update the copyright holder if needed before publishing.
