# Product Requirements

## 1. Functional Requirements

### 1.1 Authentication

- Partners must be able to sign in with Kakao.
- Admin and super admin users must be able to sign in through the same auth system.
- A signed-in user must be mapped to a single app role.

### 1.2 Partner Onboarding

- A new partner must complete an application form after first sign-in.
- Required fields:
  - name
  - phone number
  - email
  - activity region
  - acquisition channel
  - activity type
- Optional field:
  - short introduction
- The system must store consent timestamps for required and optional consents.

### 1.3 Partner Approval

- Admin users must be able to review pending applications.
- Approval must issue a fixed referral code.
- Rejection or deactivation must preserve user history.

### 1.4 Referral Attribution

- One referral code belongs to one active partner profile.
- Store-level attribution is confirmed at pilot start.
- A store already attributed to one partner must not be re-attributed by default.
- Super admins must be able to override attribution when needed.

### 1.5 Performance Management

- Admins must be able to enter pilot-start performance manually.
- Admin entry must require:
  - store name
  - contact phone
  - region
  - referral code
  - pilot start date
- The system must warn when a potential duplicate exists.

### 1.6 Partner Dashboard

- Partners must be able to view:
  - referral code
  - QR code
  - monthly performance count
  - lifetime performance count
  - estimated payout
  - scheduled settlement amount
  - paid amount
  - recent performance records
  - sales materials and links

### 1.7 Settlement Management

- Settlement must be calculated on a monthly cycle.
- The monthly operational checkpoint is the 10th.
- Gross payout is `performance_count * 20,000 KRW`.
- Net payout is gross minus `3.3%` withholding.
- Admins must be able to mark a settlement as paid.
- The system must keep a settlement history by partner and month.

### 1.8 Sales Materials

- Admins must be able to publish and update partner-facing materials.
- Materials may be links, downloadable files, or short notes.
- Partners must always see the latest published version.

## 2. Non-Functional Requirements

### 2.1 Product Characteristics

- The app should feel simple enough for non-technical operators.
- Manual admin entry should be faster than spreadsheet-based operations.
- The system should support future automation without schema rewrites.

### 2.2 Security

- Payout account data must be encrypted at rest.
- Role-based access must protect admin and settlement actions.
- Every admin write action should be logged.

### 2.3 Performance

- Main dashboard pages should load quickly on mobile networks.
- Large admin lists should support pagination and filtering.

### 2.4 Reliability

- Manual entries should be recoverable through logs and edit history.
- Settlement records must remain stable even if a partner later becomes inactive.

### 2.5 UX

- Mobile-first partner use is the default.
- Admin use is desktop-first but still responsive.

## 3. Success Criteria

- A partner can apply and reach `pending` status without operator assistance.
- An admin can approve a partner and issue a code in one flow.
- An admin can register a pilot-start record in under one minute.
- A partner can verify personal performance and payout status without asking manually.
- Monthly settlement can be prepared from the system without spreadsheet reconciliation.
