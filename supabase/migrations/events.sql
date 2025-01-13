create table events (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null,
  properties jsonb default '{}',
  timestamp timestamptz default now(),
  session_id text,
  user_id uuid references auth.users(id),
  page_path text
);

-- Create index for faster queries
create index idx_events_timestamp on events(timestamp);
create index idx_events_name on events(event_name);