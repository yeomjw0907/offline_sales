# ERD 관계 개요

## 핵심 관계

- `users` 1:1 `partner_profiles`
  - 파트너 사용자일 때만 프로필이 생성된다.

- `partner_profiles` 1:N `partner_payout_accounts`
  - 계좌 변경 이력을 남기고 현재 활성 계좌를 하나 둔다.

- `partner_profiles` 1:N `merchant_leads`
  - 하나의 파트너는 여러 매장 실적을 가진다.

- `partner_profiles` 1:N `settlements`
  - 월별 정산 레코드가 생성된다.

- `settlements` 1:N `settlement_items`
  - 한 번의 월 정산에는 여러 실적 건이 묶인다.

- `merchant_leads` 1:N `settlement_items`
  - 한 매장 실적은 하나의 정산 건에만 포함된다.

- `users` 1:N `admin_activity_logs`
  - 관리자 액션 기록 추적용이다.

## 텍스트 ERD

```text
users
 ├─< partner_profiles
 ├─< admin_activity_logs
 └─< merchant_leads (created_by / updated_by)

partner_profiles
 ├─< partner_payout_accounts
 ├─< merchant_leads
 └─< settlements

settlements
 └─< settlement_items >─ merchant_leads
```

## 확장 포인트

- 추후 Ready Talk API 연동 시 `merchant_leads`에 외부 `merchant_external_id`를 추가할 수 있다.
- 추후 카카오 알림이 붙으면 `notification_logs` 테이블을 추가할 수 있다.
