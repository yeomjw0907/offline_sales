# User Flows

## 1. Partner Application Flow

1. User opens the service and chooses Kakao login.
2. System creates or finds the user record.
3. If no partner profile exists, the user is sent to the application form.
4. User enters partner application details and submits consent.
5. System stores the profile with `pending` status.
6. User sees a waiting screen explaining that approval is required before activity.

## 2. Admin Approval Flow

1. Admin opens the pending partner list.
2. Admin reviews applicant information.
3. Admin approves the applicant.
4. System issues a unique referral code and stores approver metadata.
5. Partner status becomes `active`.
6. Partner dashboard now shows referral code, QR, and materials.

## 3. Partner Activity Flow

1. Partner copies or shares the referral code.
2. Partner may also use a QR that embeds the same code.
3. Merchant enters the referral code during the Ready Talk pilot-start process.
4. Admin later confirms the pilot start and manually registers the store.
5. The record appears in the partner dashboard as a counted performance.

## 4. Manual Performance Entry Flow

1. Admin receives pilot-start information from operational channels.
2. Admin opens the performance entry screen.
3. Admin inputs store name, contact phone, region, referral code, and pilot start date.
4. System runs duplicate checks against existing store records.
5. If no serious conflict exists, the admin saves the record.
6. The store is attributed to the partner tied to the referral code.

## 5. Settlement Flow

1. Around the monthly settlement cycle, admin filters unpaid performance records.
2. System groups eligible records by partner and settlement month.
3. System calculates gross payout, withholding, and net payout.
4. Admin reviews the settlement summary.
5. Admin completes the payment outside the system.
6. Admin marks the settlement as `paid` and records the payment date.
7. Partner dashboard updates paid amount and settlement history.

## 6. Payout Account Collection Flow

1. A partner becomes eligible for payout.
2. Admin or system prompts the partner to enter account details.
3. Partner submits bank name, account holder name, and account number.
4. The system stores the encrypted account record.
5. Admin uses the active account record during payment processing.

## 7. Deactivation Flow

1. Admin decides a partner should no longer be active.
2. Admin changes the partner status to `inactive`.
3. Partner loses the ability to operate as an active partner.
4. Historical performance and settlements remain unchanged.

## 8. Future Automated Integration Flow

1. Ready Talk emits a pilot-start event with store info and referral code.
2. The app validates the payload.
3. The app finds the partner by referral code.
4. The app creates or updates the store performance record automatically.
5. The same dashboard and settlement logic continue to work without structural changes.
