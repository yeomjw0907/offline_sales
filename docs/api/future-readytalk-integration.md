# Future ReadyTalk Integration

## 1. Goal

Replace manual performance entry with a validated ReadyTalk event flow while keeping the current admin workflow as a fallback.

## 2. Implemented integration surface

### Referral code verification

`POST /api/integrations/readytalk/referral-codes/verify`

Purpose:

- verify the referral code before ReadyTalk accepts or saves it
- reject inactive or regenerated codes
- return the matched partner context for operator confirmation if needed

### Pilot started webhook

`POST /api/webhooks/readytalk/pilot-started`

Purpose:

- accept pilot-started events from ReadyTalk
- validate the referral code again on the server side
- create `merchant_leads` records in the same structure used by the admin manual flow
- use `integration_events` for event-level idempotency

## 3. Current payload

```json
{
  "eventId": "evt_20260420_001",
  "merchantExternalId": "merchant_12345",
  "storeName": "Ready Coffee Seongsu",
  "contactPhone": "010-2222-3333",
  "region": "Seoul Seongdong-gu",
  "referralCode": "RTM4K82",
  "pilotStartedAt": "2026-04-20T14:00:00+09:00"
}
```

## 4. Authentication

- use a shared API key via `x-api-key`
- every ReadyTalk machine-to-machine request must include the key
- the current implementation also accepts `Authorization: Bearer <key>`

## 5. Current compatibility rule

The webhook writes into the existing `merchant_leads` structure so the current dashboards and settlement generation continue to work unchanged.

## 6. Event idempotency

The current implementation stores ReadyTalk receipts in `integration_events` and uses `(provider, event_type, event_id)` as the idempotency key.

The webhook also keeps a secondary duplicate check against lead data so the same merchant record is not inserted twice even if payload delivery is retried.

## 7. Stored event fields

The current integration event record stores:

- `provider`
- `event_type`
- `event_id`
- `merchant_external_id`
- raw payload
- processing status
- linked `merchant_lead_id`

## 8. Migration strategy

1. Keep the current admin manual entry flow live.
2. Run verification API plus webhook in parallel with the manual process.
3. Monitor `integration_events` and reconcile any failed webhook rows.
4. Deactivate manual entry only after a monitored transition period.
