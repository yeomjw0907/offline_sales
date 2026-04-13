# System Architecture

## 1. Architecture Goal

Build a lightweight partner operations platform that starts with manual operational input, but can later accept automated pilot-start events from Ready Talk without changing the user-facing model.

## 2. Primary Boundaries

### This App Owns

- partner authentication
- partner application and approval
- referral code issuance
- manual performance registration
- settlement calculation and records
- partner dashboard
- admin dashboard
- sales materials publishing

### Ready Talk Owns

- merchant signup
- merchant pilot-start process
- merchant product experience
- future referral-code input surface inside Ready Talk

## 3. High-Level Components

- `Web App`
  - partner and admin UI
- `App Backend`
  - auth callbacks
  - API handlers
  - role checks
  - settlement logic
- `Database`
  - users
  - partner profiles
  - store performance
  - settlements
  - materials
  - admin logs
- `File/Asset Storage`
  - sales PDFs and QR assets
- `Future Integration Layer`
  - Ready Talk webhook/event endpoint

## 4. Recommended Runtime Model

- One Next.js application serves both web UI and internal APIs.
- Database access is centralized in the app backend.
- Admin write operations are server-side only.
- Sensitive data should never be trusted from client-only logic.

## 5. Core Data Movement

### Partner path

`Kakao Login -> app user -> partner profile -> approval -> referral code -> dashboard`

### Performance path

`Admin input -> store performance record -> partner dashboard metrics -> settlement grouping`

### Settlement path

`eligible performance -> monthly settlement -> payment completion -> paid totals`

## 6. Upgrade Path

The current system is intentionally designed to support:

- replacing manual performance entry with Ready Talk events
- adding Kakao notifications later
- adding stronger reconciliation by external merchant IDs
- adding exports or accounting integrations later
