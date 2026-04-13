# offline_sales docs

This repository starts as the planning and system-design workspace for the Ready Talk partner recruitment and operations platform.

## Folder Tree

```text
offline_sales/
├─ README.md
├─ docs/
│  ├─ README.md
│  ├─ api/
│  │  ├─ future-readytalk-integration.md
│  │  └─ internal-api.md
│  ├─ architecture/
│  │  ├─ auth-and-roles.md
│  │  ├─ security-and-privacy.md
│  │  ├─ stack-and-routing.md
│  │  └─ system-architecture.md
│  ├─ design/
│  │  └─ DESIGN.md
│  ├─ implementation/
│  │  ├─ launch-checklist.md
│  │  └─ mvp-build-order.md
│  ├─ legal/
│  │  ├─ privacy-policy-outline.md
│  │  └─ terms-outline.md
│  └─ product/
│     ├─ requirements.md
│     ├─ user-flows.md
│     ├─ service-overview.md
│     ├─ operations.md
│     └─ screens.md
└─ db/
   ├─ README.md
   ├─ indexes-and-constraints.md
   ├─ tables.md
   ├─ erd-overview.md
   └─ state-and-settlement-rules.md
```

## Document Roles

- `docs/design/DESIGN.md`
  - Defines the Notion-inspired UI direction, tone, layout rules, and component behavior.
- `docs/product/`
  - Defines product scope, operator workflows, partner flows, and screen-level requirements.
- `docs/architecture/`
  - Defines the recommended stack, routing, auth model, privacy posture, and system boundaries.
- `docs/api/`
  - Defines the internal app API and the future Ready Talk integration contract.
- `docs/implementation/`
  - Defines the order of work, release readiness, and launch checks.
- `docs/legal/`
  - Defines implementation-ready outlines for the public privacy policy and terms pages.
- `db/`
  - Defines the data model, table structure, relationships, statuses, and settlement rules.

## Current Scope

- Kakao login for partners
- Admin approval before referral code issuance
- Referral-code-based attribution
- Pilot-start-based performance confirmation
- Manual performance entry by admins
- Monthly settlement on the 10th
- Payout after 3.3% withholding
