create table page_views (
  id uuid default uuid_generate_v4() primary key,
  path text not null,
  user_agent text,
  referrer text,
  timestamp timestamptz default now(),
  session_id text,
  user_id uuid references auth.users(id),
  ip_address text,
  country text,
  device_type text,
  browser text
);

-- Create index for faster queries
create index idx_page_views_timestamp on page_views(timestamp);
create index idx_page_views_path on page_views(path);