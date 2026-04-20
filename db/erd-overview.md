# ERD Overview

## Core Relationships

- `users` 1:1 `partner_profiles`
- `users` 1:N `admin_activity_logs`
- `users` 1:N `merchant_leads` via `created_by` / `updated_by`
- `partner_profiles` 1:N `partner_payout_accounts`
- `partner_profiles` 1:N `merchant_leads`
- `partner_profiles` 1:N `settlements`
- `settlements` 1:N `settlement_items`
- `merchant_leads` 1:1 `settlement_items`
- `integration_events` N:1 `merchant_leads` through `linked_merchant_lead_id`

## Text ERD

```text
users
 ├─ partner_profiles
 ├─ admin_activity_logs
 └─ merchant_leads

partner_profiles
 ├─ partner_payout_accounts
 ├─ merchant_leads
 └─ settlements

settlements
 └─ settlement_items ──> merchant_leads

integration_events
 └─ merchant_leads
```

## Extension Notes

- `integration_events` exists for webhook receipt logging, idempotency, and reconciliation.
- External integrations should deduplicate on event identity before business-record insertion.
- `merchant_external_id` should remain integration-scoped rather than replacing internal lead ids.
