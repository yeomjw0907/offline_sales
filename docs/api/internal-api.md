# Internal API

## 1. API Principles

- Internal APIs should be server-owned and session-aware.
- All write endpoints must enforce role checks.
- Validation should happen both at the API boundary and in shared domain logic.

## 2. Partner Endpoints

### `POST /api/partners/apply`

Creates or updates a pending partner application.

Request body:

```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "partner@example.com",
  "activityRegion": "서울 마포구",
  "acquisitionChannel": "알바몬",
  "activityType": "offline",
  "intro": "선택 입력",
  "requiredConsent": true,
  "marketingConsent": false
}
```

### `GET /api/partner/dashboard`

Returns partner metrics, recent performance, and settlement summary.

### `GET /api/partner/materials`

Returns published materials and links for partners.

### `POST /api/partner/payout-account`

Creates or updates payout account information for the logged-in partner.

## 3. Admin Partner Endpoints

### `GET /api/admin/partners`

Returns paginated partner profiles with filters.

### `POST /api/admin/partners/{partnerId}/approve`

Approves a pending partner and issues a referral code.

### `POST /api/admin/partners/{partnerId}/deactivate`

Deactivates a partner while preserving historical records.

### `POST /api/admin/partners/{partnerId}/regenerate-code`

Super-admin-only endpoint for code replacement.

## 4. Admin Performance Endpoints

### `GET /api/admin/performance`

Returns performance records with filters.

### `POST /api/admin/performance`

Creates a manual pilot-start performance record.

Request body:

```json
{
  "storeName": "레디 필라테스 성수점",
  "contactPhone": "010-2222-3333",
  "region": "서울 성동구",
  "referralCode": "RTM4K82",
  "pilotStartedAt": "2026-04-11"
}
```

### `PATCH /api/admin/performance/{leadId}`

Updates a performance record.

## 5. Settlement Endpoints

### `GET /api/admin/settlements`

Returns settlement records by month and partner.

### `POST /api/admin/settlements/generate`

Generates scheduled settlements for eligible records.

### `POST /api/admin/settlements/{settlementId}/mark-paid`

Marks a settlement as paid and stores payment metadata.

## 6. Materials Endpoints

### `GET /api/admin/materials`

Returns all material records.

### `POST /api/admin/materials`

Creates a material record.

### `PATCH /api/admin/materials/{materialId}`

Updates a material record.

## 7. Logging Expectations

- Approval
- deactivation
- code regeneration
- performance create/update/delete
- settlement paid
- material publish/update

All of these should create admin activity log records.

## 8. External Integration Endpoints

These endpoints are for machine-to-machine integration and do not use session auth.

### `POST /api/integrations/readytalk/referral-codes/verify`

Validates a referral code for the ReadyTalk system using the shared API key.

### `POST /api/webhooks/readytalk/pilot-started`

Accepts a ReadyTalk pilot-start event, validates the referral code, and writes into `merchant_leads`.
