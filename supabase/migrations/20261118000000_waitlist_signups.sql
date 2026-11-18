-- Waitlist signups written only by the /api/waitlist serverless function (service role).
create table if not exists public.waitlist_signups (
    id          bigint generated always as identity primary key,
    email       text        not null check (char_length(email) <= 254 and email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    product     text        not null check (product in ('nycdeli', 'hottiesthathit', 'petpodcast', 'clo')),
    created_at  timestamptz not null default now(),
    unique (email, product)
);

-- RLS on with no policies: anon/authenticated roles can neither read nor write.
alter table public.waitlist_signups enable row level security;
alter table public.waitlist_signups force row level security;
revoke all on public.waitlist_signups from anon, authenticated;
