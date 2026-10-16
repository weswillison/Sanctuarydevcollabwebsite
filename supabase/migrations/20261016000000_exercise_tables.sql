-- Shared tables for interactive exercises on sanctuarydc.org.
-- One set of tables serves every exercise; the `exercise` column says which.
-- The public site (anon role) may INSERT only. Reading is for the dashboard
-- and service role, never the browser.

create table if not exists public.exercise_responses (
  id          uuid primary key,              -- generated in the browser so leads/follow-ups can link to it
  exercise    text not null,                 -- e.g. 'fit-and-carry'
  version     text not null,                 -- question set version
  answers     jsonb not null,
  results     jsonb not null,
  source      jsonb,                         -- path, referrer, utm tags
  created_at  timestamptz not null default now()
);

create table if not exists public.exercise_leads (
  id               uuid primary key default gen_random_uuid(),
  response_id      uuid not null references public.exercise_responses(id) on delete cascade,
  exercise         text not null,
  name             text not null check (char_length(name) between 1 and 200),
  church           text not null check (char_length(church) between 1 and 200),
  role             text check (char_length(role) <= 200),
  email            text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  consent_updates  boolean not null default false,
  created_at       timestamptz not null default now()
);

create table if not exists public.exercise_followups (
  id           uuid primary key default gen_random_uuid(),
  response_id  uuid not null references public.exercise_responses(id) on delete cascade,
  exercise     text not null,
  kind         text not null,                -- e.g. 'deep-dive:caretakers', 'reflection'
  data         jsonb not null,
  created_at   timestamptz not null default now()
);

create index if not exists exercise_responses_exercise_created on public.exercise_responses (exercise, created_at desc);
create index if not exists exercise_leads_email on public.exercise_leads (lower(email));
create index if not exists exercise_followups_response on public.exercise_followups (response_id);

alter table public.exercise_responses enable row level security;
alter table public.exercise_leads     enable row level security;
alter table public.exercise_followups enable row level security;

-- Insert-only access for the public site.
create policy "anon can insert responses" on public.exercise_responses
  for insert to anon with check (true);
create policy "anon can insert leads" on public.exercise_leads
  for insert to anon with check (true);
create policy "anon can insert followups" on public.exercise_followups
  for insert to anon with check (true);

grant insert on public.exercise_responses, public.exercise_leads, public.exercise_followups to anon;
revoke select, update, delete on public.exercise_responses, public.exercise_leads, public.exercise_followups from anon;

-- A handy view for reviewing leads alongside their results in the dashboard.
create or replace view public.exercise_leads_with_results
with (security_invoker = true) as
select
  l.created_at,
  l.exercise,
  l.name,
  l.church,
  l.role,
  l.email,
  l.consent_updates,
  r.results->>'quadrant'       as quadrant,
  (r.results->'fit'->>'score')::numeric   as fit_score,
  (r.results->'carry'->>'score')::numeric as carry_score,
  r.results->'flagged'         as flagged_drivers,
  r.id                         as response_id
from public.exercise_leads l
join public.exercise_responses r on r.id = l.response_id;
