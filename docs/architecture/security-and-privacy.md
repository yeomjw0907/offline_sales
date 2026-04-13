# Security and Privacy

## 1. Security Baseline

- Use HTTPS everywhere in production.
- Store secrets only in server-side environment variables.
- Encrypt payout account data at rest.
- Keep write operations behind server-side role checks.
- Log admin writes and settlement actions.

## 2. Personal Data Collected

### Application stage

- name
- phone number
- email
- activity region
- acquisition channel
- activity type
- short introduction if provided
- consent timestamps

### Settlement stage

- bank name
- account holder name
- account number
- additional tax-related information only when operationally required

### Store performance stage

- store name
- contact phone
- region
- referral code
- pilot start date

## 3. Privacy Design Rules

- Separate application data collection from payout data collection.
- Do not ask for payout data at initial application.
- Collect only the minimum data needed for operations.
- Restrict payout-data access to the smallest set of roles.
- Publish a privacy policy and terms page before launch.

## 4. Sensitive Data Handling

- Account numbers must be encrypted.
- Avoid collecting resident registration numbers in the MVP.
- If future tax operations require stronger identification data, redesign that flow explicitly.

## 5. Retention Guidance

- Keep partner application and operational records while the partner program is active.
- Keep settlement records and admin logs according to accounting and operational needs.
- If a user leaves the program, preserve only what is required for operational, accounting, or legal reasons.

## 6. Recommended Compliance Notes

These are implementation-oriented compliance guidelines, not formal legal advice.

- Split required and optional consents.
- Keep records of consent time and version.
- Make privacy-policy updates traceable.
- Document processors or vendors used for hosting, storage, and messaging.
- Expose a contact channel for privacy requests.

## 7. Official Reference Sources

- Korea Personal Information Protection Commission privacy policy example:
  - https://www.pipc.go.kr/np/default/page.do?mCode=H010000000
- Korea law portal references for privacy-law duties:
  - https://www.law.go.kr/
- National Tax Service references for withholding practice:
  - https://www.nts.go.kr/
