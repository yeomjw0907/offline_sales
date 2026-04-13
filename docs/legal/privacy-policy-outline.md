# Privacy Policy Outline

## Purpose

This document is an implementation-ready outline for the public privacy page. It is not final legal advice, but it defines the sections the app should support before launch.

## Recommended Sections

### 1. Data Controller

- operator name
- business name
- contact email
- privacy contact channel

### 2. Personal Data Collected

#### Partner application

- name
- phone number
- email
- activity region
- acquisition channel
- activity type
- optional intro

#### Partner operations

- referral code
- performance history
- settlement history

#### Settlement

- bank name
- account holder name
- account number
- other settlement-required information

#### Technical data

- login records
- device/session logs
- service access logs

### 3. Purposes of Processing

- partner recruitment and review
- partner account management
- referral/performance tracking
- settlement processing
- customer support and service operation
- optional marketing communication if separately consented

### 4. Retention Period

- keep application and operational data while needed for service operation
- keep settlement and accounting data as required for business operations and law
- define deletion or archival rules for inactive users

### 5. Third-Party Provision

- state whether data is provided to any third party
- if none, clearly say so
- if later added, specify recipient, purpose, items, and retention basis

### 6. Processing Delegation

- hosting vendor
- database/storage vendor
- messaging vendor if used
- analytics vendor if used

### 7. Rights of Data Subjects

- access
- correction
- deletion
- suspension of processing
- consent withdrawal where applicable

### 8. Destruction Procedure and Method

- deletion timing
- logical deletion
- physical or irreversible deletion policy for stored files

### 9. Security Measures

- access control
- encryption
- log monitoring
- minimum-permission policy

### 10. Privacy Contact

- privacy manager or responsible contact
- contact email
- response channel

### 11. Policy Change Notice

- effective date
- versioning
- notice method for changes

## Implementation Notes

- Track consent version and timestamp in the database.
- Keep the policy page versioned in source control.
- Make sure the actual public page matches the live data-handling behavior.

## Official Reference Sources

- PIPC example and disclosure structure:
  - https://www.pipc.go.kr/np/default/page.do?mCode=H010000000
- Korea law portal:
  - https://www.law.go.kr/
