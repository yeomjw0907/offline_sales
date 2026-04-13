# Auth and Roles

## 1. Authentication Model

- Kakao login is the primary sign-in method for partners.
- The same auth system can be used for admins and super admins.
- Role data should be stored in the app database, not inferred from Kakao.

## 2. Core Auth Rules

- A user record should be created on first successful Kakao login.
- Role defaults to `partner` unless assigned otherwise by internal admin setup.
- If a `partner` user has no profile, redirect to the application form.
- If a partner profile is `pending`, redirect to a waiting state.
- If a partner profile is `inactive`, show a restricted dashboard state.

## 3. Roles

### partner

- view personal dashboard
- view referral code and QR
- view own performance and settlement data
- submit or update payout account details
- view partner materials

### admin

- approve partners
- deactivate partners
- create and edit manual performance entries
- view and manage settlement records
- manage partner-facing materials

### super_admin

- all admin permissions
- reassign attributed performance records
- regenerate referral codes
- manage admin accounts and roles
- access full action logs
- access payout-sensitive fields

## 4. Route Protection Rules

- Partner routes require signed-in users with `partner` role.
- Admin routes require `admin` or `super_admin`.
- Super-admin-only routes require `super_admin`.
- Server-side permission checks must be duplicated even if the UI hides buttons.

## 5. Session Handling

- Use secure HTTP-only cookies for sessions.
- Expire and refresh sessions through the auth provider defaults or stricter internal policy.
- Re-validate role and profile state on protected route entry.

## 6. Edge Cases

- Partner tries to open admin routes: deny access.
- Admin without partner profile opens partner route: redirect or block.
- Inactive partner logs in: allow sign-in, but limit actions.
