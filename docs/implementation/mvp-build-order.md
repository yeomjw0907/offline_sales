# MVP Build Order

## 1. Foundation

1. Set up Next.js, TypeScript, Tailwind, auth, and database.
2. Add route groups for public, partner, and admin areas.
3. Add role-based access helpers.

## 2. Data Model

1. Create core tables:
   - users
   - partner_profiles
   - partner_payout_accounts
   - partner_materials
   - merchant_leads
   - settlements
   - settlement_items
   - admin_activity_logs
2. Add indexes and constraints.

## 3. Auth and Partner Onboarding

1. Implement Kakao login.
2. Create partner application form.
3. Implement pending-state handling.

## 4. Admin Approval

1. Build pending partner list.
2. Add approve/deactivate actions.
3. Add referral code generation and QR generation.

## 5. Partner Dashboard

1. Build dashboard summary cards.
2. Add recent performance list.
3. Add materials page.
4. Add payout-account form.

## 6. Manual Performance Operations

1. Build performance entry form.
2. Add duplicate warnings.
3. Add performance list and edit flow.

## 7. Settlement Operations

1. Build monthly settlement generation logic.
2. Add settlement list and detail pages.
3. Add paid-state update flow.

## 8. Privacy and Legal Pages

1. Add privacy policy page.
2. Add terms page.
3. Add consent version tracking.

## 9. Final Hardening

1. Add admin logs.
2. Add empty states and error handling.
3. Add mobile QA for partner flows.
4. Add desktop QA for admin flows.
