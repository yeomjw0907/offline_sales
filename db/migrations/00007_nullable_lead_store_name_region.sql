-- signup_completed arrives before the store is created, so storeName/region
-- may not be available yet. Make both columns nullable so the lead can be
-- created at signup and filled in when a later lifecycle event provides them.
alter table public.merchant_leads
  alter column store_name drop not null,
  alter column region     drop not null;
