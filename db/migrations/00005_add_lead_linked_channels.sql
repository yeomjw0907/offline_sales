-- ReadyTalk supports multiple channels (Kakao Talk / Instagram DM / Naver
-- TalkTalk / website widget). Until now our lead row only knew that *some*
-- channel got linked. Stores which specific channels are linked so we can
-- diagnose merchant-by-merchant and report adoption by channel.
alter table public.merchant_leads
  add column if not exists linked_channels text[] not null default '{}';

create index if not exists merchant_leads_linked_channels_idx
  on public.merchant_leads using gin (linked_channels);
