# Stack and Routing

## 1. Recommended Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui or equivalent primitives tuned to the Notion-like design system

### Backend

- Next.js Route Handlers for internal APIs
- Server Actions only where the UX clearly benefits from them

### Database

- PostgreSQL
- Recommended option: Supabase Postgres

### Auth

- Kakao OAuth provider
- Session-based auth through NextAuth/Auth.js or Supabase Auth with Kakao provider

### Hosting

- Vercel for app hosting
- Managed Postgres for persistence

### File Storage

- Supabase Storage or equivalent object storage for partner materials and QR assets

## 2. Why This Stack

- Works well with Vercel deployment
- Easy to build admin and partner interfaces in one codebase
- Good long-term path from manual MVP to event-driven automation
- AI coding tools can implement this stack quickly and consistently

## 3. Route Map

### Public

- `/`
  - product intro or entry point
- `/privacy`
  - privacy policy
- `/terms`
  - service terms

### Auth

- `/login`
  - Kakao login entry
- `/auth/callback/kakao`
  - OAuth callback

### Partner

- `/partner/apply`
  - application form
- `/partner`
  - dashboard home
- `/partner/materials`
  - sales materials
- `/partner/settlement`
  - payout status and account details
- `/partner/profile`
  - account and partner info

### Admin

- `/admin`
  - overview dashboard
- `/admin/partners`
  - partner list and approval
- `/admin/partners/[partnerId]`
  - partner detail
- `/admin/performance`
  - performance list
- `/admin/performance/new`
  - manual performance entry
- `/admin/settlements`
  - settlement list
- `/admin/settlements/[settlementId]`
  - settlement detail
- `/admin/materials`
  - sales materials management
- `/admin/team`
  - admin management, super admin only
- `/admin/logs`
  - admin action logs, super admin only

## 4. Suggested App Folder Shape

```text
app/
  (public)/
  (auth)/
  (partner)/
  (admin)/
  api/
components/
  partner/
  admin/
  shared/
lib/
  auth/
  db/
  settlements/
  validation/
  permissions/
```

## 5. Suggested API Folder Shape

```text
app/api/
  auth/
  partners/
  performance/
  settlements/
  materials/
  webhooks/
```

## 6. Implementation Notes

- Keep role checks on the server.
- Put settlement calculation in a shared server-side module, not in UI code.
- Centralize referral code generation and duplicate-store checks in backend services.
