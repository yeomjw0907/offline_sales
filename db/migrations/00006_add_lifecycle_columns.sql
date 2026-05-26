-- Lifecycle v2 webhook receives signup/trial/channel/activated events.
-- - activated_at tracks AI first-response confirmation (post settlement event)
-- - merchant_external_id is ReadyTalk's stable merchant identifier; lets us
--   correlate multiple lifecycle events to the same lead without depending on
--   store_name + contact_phone matching
-- - pilot_started_at becomes nullable so a lead row can exist after a
--   signup_completed event arrives, before channel_linked supplies the date
alter table public.merchant_leads
  add column if not exists activated_at        timestamptz,
  add column if not exists merchant_external_id text;

alter table public.merchant_leads
  alter column pilot_started_at drop not null;

create unique index if not exists merchant_leads_merchant_external_id_uniq
  on public.merchant_leads (merchant_external_id)
  where merchant_external_id is not null;
