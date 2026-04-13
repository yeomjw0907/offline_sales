# 테이블 설계

## 1. users

카카오 로그인 기반 기본 사용자 테이블

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| kakao_id | text | 카카오 고유 식별값 |
| name | text | 이름 |
| phone | text | 전화번호 |
| email | text | 이메일 |
| role | enum | `partner`, `admin`, `super_admin` |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 2. partner_profiles

파트너 운영 정보

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | users FK |
| status | enum | `pending`, `active`, `inactive` |
| referral_code | text | 고유 추천인 코드 |
| activity_region | text | 활동 지역 |
| acquisition_channel | text | 유입경로 |
| activity_type | text | 오프라인/온라인/둘 다 |
| intro | text | 간단한 소개 |
| approved_by | uuid | users FK, 승인 관리자 |
| approved_at | timestamptz | 승인일 |
| deactivated_at | timestamptz | 비활성 일시 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 3. partner_payout_accounts

정산용 계좌 정보

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| partner_profile_id | uuid | partner_profiles FK |
| bank_name | text | 은행명 |
| account_number_encrypted | text | 암호화된 계좌번호 |
| account_holder_name | text | 예금주명 |
| is_active | boolean | 현재 사용 여부 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 4. partner_materials

파트너에게 노출할 자료/링크

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| title | text | 자료명 |
| type | enum | `link`, `file`, `note` |
| url | text | 링크 또는 파일 경로 |
| description | text | 설명 |
| is_published | boolean | 노출 여부 |
| sort_order | integer | 노출 순서 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 5. merchant_leads

실적 입력용 매장 단위 데이터

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| store_name | text | 상호명 |
| contact_phone | text | 연락처 |
| region | text | 지역 |
| referral_code | text | 입력된 추천인 코드 |
| partner_profile_id | uuid | 귀속 파트너 |
| pilot_started_at | date | 파일럿 시작일 |
| status | enum | `pilot_started`, `settlement_ready`, `paid` |
| created_by | uuid | users FK, 등록 관리자 |
| updated_by | uuid | users FK, 수정 관리자 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 6. settlements

월별 정산 헤더

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| partner_profile_id | uuid | partner_profiles FK |
| settlement_month | text | 예: `2026-04` |
| total_cases | integer | 정산 대상 건수 |
| gross_amount | integer | 공제 전 총액 |
| withholding_tax_amount | integer | 3.3% 공제액 |
| net_amount | integer | 실지급액 |
| status | enum | `scheduled`, `paid` |
| paid_at | timestamptz | 지급일 |
| processed_by | uuid | users FK |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 7. settlement_items

정산 상세 건별 연결

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| settlement_id | uuid | settlements FK |
| merchant_lead_id | uuid | merchant_leads FK |
| case_amount | integer | 건당 정산액 |
| created_at | timestamptz | 생성일 |

## 8. admin_activity_logs

관리자 액션 로그

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| admin_user_id | uuid | users FK |
| action_type | text | 승인, 수정, 정산 처리 등 |
| target_type | text | partner, lead, settlement 등 |
| target_id | uuid | 대상 ID |
| before_data | jsonb | 변경 전 값 |
| after_data | jsonb | 변경 후 값 |
| created_at | timestamptz | 생성일 |
