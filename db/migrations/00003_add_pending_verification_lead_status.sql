-- Adds a new lead status to gate ReadyTalk webhook leads behind admin approval.
-- Webhook-created leads start as 'pending_verification' until admin promotes
-- them to 'pilot_started', which is the only status the settlement generator
-- picks up.
alter type public.merchant_lead_status
  add value if not exists 'pending_verification' before 'pilot_started';
