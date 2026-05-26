-- =============================================
-- STEP 1: Enums
-- =============================================

create type public.user_role as enum ('partner', 'admin', 'super_admin');
create type public.partner_status as enum ('pending', 'active', 'inactive');
create type public.merchant_lead_status as enum ('pilot_started', 'settlement_ready', 'paid');
create type public.settlement_status as enum ('scheduled', 'paid');
create type public.material_type as enum ('link', 'file', 'note');

-- =============================================
-- STEP 2: Tables (dependency order)
-- =============================================

create table public.users (
  id           uuid primary key default gen_random_uuid(),
  kakao_id     text not null unique,
  name         text,
  email        text,
  phone        text,
  role         public.user_role not null default 'partner',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.partner_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  status              public.partner_status not null default 'pending',
  referral_code       text unique,
  intro               text,
  acquisition_channel text,
  activity_region     text,
  activity_type       text,
  approved_at         timestamptz,
  approved_by         uuid,
  deactivated_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.merchant_leads (
  id                  uuid primary key default gen_random_uuid(),
  partner_profile_id  uuid references public.partner_profiles(id),
  referral_code       text not null,
  store_name          text not null,
  contact_phone       text not null,
  region              text not null,
  status              public.merchant_lead_status not null default 'pilot_started',
  pilot_started_at    timestamptz not null,
  created_by          uuid not null,
  updated_by          uuid,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.partner_materials (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  type         public.material_type not null,
  description  text,
  url          text,
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.partner_payout_accounts (
  id                       uuid primary key default gen_random_uuid(),
  partner_profile_id       uuid not null references public.partner_profiles(id) on delete cascade,
  bank_name                text not null,
  account_holder_name      text not null,
  account_number_encrypted text not null,
  is_active                boolean not null default true,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create table public.settlements (
  id                     uuid primary key default gen_random_uuid(),
  partner_profile_id     uuid not null references public.partner_profiles(id),
  settlement_month       text not null,
  status                 public.settlement_status not null default 'scheduled',
  total_cases            integer not null default 0,
  gross_amount           numeric not null default 0,
  withholding_tax_amount numeric not null default 0,
  net_amount             numeric not null default 0,
  paid_at                timestamptz,
  processed_by           uuid,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table public.settlement_items (
  id                uuid primary key default gen_random_uuid(),
  settlement_id     uuid not null references public.settlements(id) on delete cascade,
  merchant_lead_id  uuid not null references public.merchant_leads(id),
  case_amount       numeric not null,
  created_at        timestamptz not null default now()
);

create table public.admin_activity_logs (
  id            uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  action_type   text not null,
  target_type   text not null,
  target_id     uuid,
  before_data   jsonb,
  after_data    jsonb,
  created_at    timestamptz not null default now()
);

create table public.integration_events (
  id                      uuid primary key default gen_random_uuid(),
  provider                text not null,
  event_type              text not null,
  event_id                text not null,
  merchant_external_id    text,
  payload                 jsonb not null,
  status                  text not null,
  linked_merchant_lead_id uuid references public.merchant_leads(id),
  processed_at            timestamptz,
  failed_at               timestamptz,
  error_message           text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- =============================================
-- STEP 3: Indexes
-- =============================================

create index on public.partner_profiles (user_id);
create index on public.partner_profiles (status);
create index on public.merchant_leads (partner_profile_id);
create index on public.merchant_leads (referral_code);
create index on public.settlements (partner_profile_id);
create index on public.settlements (settlement_month);
create index on public.settlement_items (settlement_id);
create index on public.settlement_items (merchant_lead_id);
create unique index on public.integration_events (provider, event_type, event_id);
create index on public.integration_events (provider, status);
create index on public.integration_events (merchant_external_id);

-- =============================================
-- STEP 4: RLS (service role bypasses by default)
-- =============================================

alter table public.users enable row level security;
alter table public.partner_profiles enable row level security;
alter table public.merchant_leads enable row level security;
alter table public.partner_materials enable row level security;
alter table public.partner_payout_accounts enable row level security;
alter table public.settlements enable row level security;
alter table public.settlement_items enable row level security;
alter table public.admin_activity_logs enable row level security;
alter table public.integration_events enable row level security;
