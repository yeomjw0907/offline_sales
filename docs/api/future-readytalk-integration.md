# Future Ready Talk Integration

## 1. Goal

Replace manual performance entry with a validated event flow from Ready Talk once the product team is ready to expose it.

## 2. Recommended Contract

Ready Talk should send a pilot-start event whenever a merchant successfully starts the pilot with a referral code.

## 3. Suggested Event Payload

```json
{
  "eventType": "pilot_started",
  "eventId": "evt_20260413_001",
  "merchantExternalId": "merchant_12345",
  "storeName": "레디 필라테스 성수점",
  "contactPhone": "010-2222-3333",
  "region": "서울 성동구",
  "referralCode": "RTM4K82",
  "pilotStartedAt": "2026-04-11T14:00:00+09:00"
}
```

## 4. Suggested Endpoint

### `POST /api/webhooks/readytalk/pilot-started`

Responsibilities:

- verify request signature
- deduplicate by external event ID
- validate referral code
- find partner profile
- create or update store performance record
- preserve external merchant ID for later reconciliation

## 5. Additional Recommended Fields

- store address
- business registration number if operationally permitted
- merchant contact person
- source channel

## 6. Compatibility Requirement

The automated flow should write into the same `merchant_leads` and `settlements` structures as the MVP manual flow. That keeps dashboards and payout logic unchanged.

## 7. Migration Strategy

1. Keep the current admin manual entry flow live.
2. Add external IDs and webhook tables when integration starts.
3. Allow both manual and automated records for a transition period.
4. Deactivate manual entry only when the event flow is stable.
