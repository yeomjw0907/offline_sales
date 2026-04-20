# Indexes and Constraints

## 1. Users

- `users.id` primary key
- unique index on `users.kakao_id`
- optional unique index on `users.email` when present and normalized

## 2. Partner Profiles

- `partner_profiles.id` primary key
- unique index on `partner_profiles.user_id`
- unique index on `partner_profiles.referral_code`
- index on `partner_profiles.status`
- index on `partner_profiles.activity_region`

## 3. Payout Accounts

- `partner_payout_accounts.id` primary key
- index on `partner_payout_accounts.partner_profile_id`
- partial unique rule recommended:
  - one active payout account per partner

## 4. Partner Materials

- `partner_materials.id` primary key
- index on `partner_materials.is_published`
- index on `partner_materials.sort_order`

## 5. Merchant Leads

- `merchant_leads.id` primary key
- index on `merchant_leads.partner_profile_id`
- index on `merchant_leads.referral_code`
- index on `merchant_leads.pilot_started_at`
- index on `merchant_leads.status`
- composite index on `(store_name, contact_phone)`
- composite index on `(store_name, region)`

### Suggested Integrity Rules

- foreign key from `merchant_leads.partner_profile_id` to `partner_profiles.id`
- soft duplicate warning through application logic

## 6. Settlements

- `settlements.id` primary key
- index on `settlements.partner_profile_id`
- index on `settlements.settlement_month`
- unique constraint on `(partner_profile_id, settlement_month)`

## 7. Settlement Items

- `settlement_items.id` primary key
- index on `settlement_items.settlement_id`
- unique constraint on `settlement_items.merchant_lead_id`

## 8. Admin Activity Logs

- `admin_activity_logs.id` primary key
- index on `admin_activity_logs.admin_user_id`
- index on `admin_activity_logs.target_type`
- index on `admin_activity_logs.target_id`
- index on `admin_activity_logs.created_at`

## 9. Integration Events

- `integration_events.id` primary key
- unique constraint on `(provider, event_type, event_id)`
- index on `(provider, status)`
- index on `merchant_external_id`
- optional foreign key from `integration_events.linked_merchant_lead_id` to `merchant_leads.id`
