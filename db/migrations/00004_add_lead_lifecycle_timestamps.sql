-- Track each lead's progression through the ReadyTalk funnel so the admin
-- can see where prospects drop off, not just whether they qualified for
-- commission. signup_at and trial_requested_at are nullable until ReadyTalk
-- starts emitting matching events; channel_linked_at is filled by the
-- existing pilot-started webhook (semantically the same moment).
alter table public.merchant_leads
  add column if not exists signup_at         timestamptz,
  add column if not exists trial_requested_at timestamptz,
  add column if not exists channel_linked_at  timestamptz;

create index if not exists merchant_leads_channel_linked_at_idx
  on public.merchant_leads (channel_linked_at);
