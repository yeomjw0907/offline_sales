create table if not exists public.integration_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  event_id text not null,
  merchant_external_id text,
  payload jsonb not null,
  status text not null,
  linked_merchant_lead_id uuid references public.merchant_leads(id),
  processed_at timestamptz,
  failed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists integration_events_provider_event_type_event_id_key
  on public.integration_events (provider, event_type, event_id);

create index if not exists integration_events_provider_status_idx
  on public.integration_events (provider, status);

create index if not exists integration_events_merchant_external_id_idx
  on public.integration_events (merchant_external_id);
