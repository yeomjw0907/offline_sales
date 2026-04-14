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

## Post Deploy Smoke Test (10 minutes)

1. Login flow
   - Partner login (`/login`) shows loading state and redirects correctly.
   - Admin login (`/admin/login`) succeeds for admin accounts only.
2. Admin performance
   - Create one performance record from `/admin/performance/new`.
   - Confirm list reflects latest record on `/admin/performance`.
3. Materials actions
   - Toggle one material publish status and verify immediate feedback.
   - Delete one test material and verify item-level loading indicator.
4. Partner detail actions
   - Open one partner detail page and trigger suspend action.
   - Confirm action progress message and error feedback rendering.
5. Settlement generation
   - Trigger monthly generation once and verify success or “no target” message.
6. API tracing
   - For any failed API call, check response includes `requestId`.
   - Confirm server logs include the same `requestId` for troubleshooting.
