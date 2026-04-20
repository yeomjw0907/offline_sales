# Table Drafts

## 1. users

| column | type | description |
|---|---|---|
| id | uuid | PK |
| kakao_id | text | Kakao account identifier |
| name | text | display name |
| phone | text | phone number |
| email | text | email address |
| role | enum | `partner`, `admin`, `super_admin` |
| created_at | timestamptz | created timestamp |
| updated_at | timestamptz | updated timestamp |

## 2. partner_profiles

| column | type | description |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | users FK |
| status | enum | `pending`, `active`, `inactive` |
| referral_code | text | unique referral code |
| activity_region | text | operating region |
| acquisition_channel | text | acquisition source |
| activity_type | text | offline / online |
| intro | text | short introduction |
| approved_by | uuid | users FK |
| approved_at | timestamptz | approval timestamp |
| deactivated_at | timestamptz | deactivation timestamp |
| created_at | timestamptz | created timestamp |
| updated_at | timestamptz | updated timestamp |

## 3. partner_payout_accounts

| column | type | description |
|---|---|---|
| id | uuid | PK |
| partner_profile_id | uuid | partner_profiles FK |
| bank_name | text | bank name |
| account_number_encrypted | text | encrypted account number |
| account_holder_name | text | account holder |
| is_active | boolean | currently active account |
| created_at | timestamptz | created timestamp |
| updated_at | timestamptz | updated timestamp |

## 4. partner_materials

| column | type | description |
|---|---|---|
| id | uuid | PK |
| title | text | material title |
| type | enum | `link`, `file`, `note` |
| url | text | link or file path |
| description | text | material description |
| is_published | boolean | published flag |
| sort_order | integer | display order |
| created_at | timestamptz | created timestamp |
| updated_at | timestamptz | updated timestamp |

## 5. merchant_leads

| column | type | description |
|---|---|---|
| id | uuid | PK |
| store_name | text | store name |
| contact_phone | text | merchant contact phone |
| region | text | area or district |
| referral_code | text | submitted referral code |
| partner_profile_id | uuid | partner_profiles FK |
| pilot_started_at | date | pilot start date |
| status | enum | `pilot_started`, `settlement_ready`, `paid` |
| created_by | uuid | users FK |
| updated_by | uuid | users FK |
| created_at | timestamptz | created timestamp |
| updated_at | timestamptz | updated timestamp |

## 6. settlements

| column | type | description |
|---|---|---|
| id | uuid | PK |
| partner_profile_id | uuid | partner_profiles FK |
| settlement_month | text | month key such as `2026-04` |
| total_cases | integer | case count |
| gross_amount | integer | pre-tax total |
| withholding_tax_amount | integer | 3.3% withholding |
| net_amount | integer | net payout |
| status | enum | `scheduled`, `paid` |
| paid_at | timestamptz | payout timestamp |
| processed_by | uuid | users FK |
| created_at | timestamptz | created timestamp |
| updated_at | timestamptz | updated timestamp |

## 7. settlement_items

| column | type | description |
|---|---|---|
| id | uuid | PK |
| settlement_id | uuid | settlements FK |
| merchant_lead_id | uuid | merchant_leads FK |
| case_amount | integer | payout amount for the case |
| created_at | timestamptz | created timestamp |

## 8. admin_activity_logs

| column | type | description |
|---|---|---|
| id | uuid | PK |
| admin_user_id | uuid | users FK |
| action_type | text | admin action name |
| target_type | text | target entity type |
| target_id | uuid | target id |
| before_data | jsonb | state before change |
| after_data | jsonb | state after change |
| created_at | timestamptz | created timestamp |

## 9. integration_events

| column | type | description |
|---|---|---|
| id | uuid | PK |
| provider | text | integration provider, currently `readytalk` |
| event_type | text | event name such as `pilot_started` |
| event_id | text | external event identifier |
| merchant_external_id | text | external merchant identifier |
| payload | jsonb | raw webhook payload |
| status | text | `received`, `processed`, `failed` |
| linked_merchant_lead_id | uuid | optional FK to `merchant_leads.id` |
| processed_at | timestamptz | processed timestamp |
| failed_at | timestamptz | failed timestamp |
| error_message | text | latest processing error |
| created_at | timestamptz | created timestamp |
| updated_at | timestamptz | updated timestamp |
