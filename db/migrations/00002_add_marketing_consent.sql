alter table public.partner_profiles
  add column marketing_consent boolean not null default false,
  add column marketing_consent_at timestamptz;
