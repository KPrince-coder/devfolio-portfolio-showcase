create table visitors (
  id uuid default uuid_generate_v4() primary key,
  session_id text unique,
  first_seen timestamptz default now(),
  last_seen timestamptz default now(),
  visit_count int default 1,
  country text,
  city text,
  device_type text,
  browser text,
  os text,
  user_id uuid references auth.users(id)
);

-- Create index for faster queries
create index idx_visitors_session on visitors(session_id);