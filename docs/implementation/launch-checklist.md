# Launch Checklist

## 1. Product Readiness

- Partner application flow works end to end.
- Admin approval flow works end to end.
- Referral code generation is unique and stable.
- Manual performance entry updates dashboard metrics correctly.
- Settlement calculation is verified with test cases.

## 2. Privacy and Compliance

- Privacy policy page is published.
- Terms page is published.
- Required and optional consents are split.
- Consent timestamps are stored.
- Payout account data is encrypted.

## 3. Role and Security Checks

- Partner cannot access admin routes.
- Admin cannot access super-admin-only actions without permission.
- Sensitive write actions are logged.
- Secrets are configured in production env vars only.

## 4. Operational Readiness

- Sales materials are uploaded and visible.
- Ready Talk direct link is configured.
- Payout account collection flow is tested.
- Settlement status update flow is tested.
- Admins know the monthly settlement process for the 10th.

## 5. QA

- Mobile partner dashboard checked on major device sizes.
- Application form validation checked.
- Duplicate performance warning tested.
- Settlement totals cross-checked manually.

## 6. Post-Launch Monitoring

- Track failed logins
- track partner application submission failures
- track admin performance-entry failures
- track payout-account submission failures
- track settlement generation failures
