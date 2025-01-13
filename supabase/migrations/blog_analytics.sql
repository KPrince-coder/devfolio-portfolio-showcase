create table blog_analytics (
  id uuid default uuid_generate_v4() primary key,
  blog_id uuid references blogs(id),
  views int default 0,
  unique_views int default 0,
  likes int default 0,
  comments int default 0,
  avg_time_on_page interval,
  bounce_rate numeric(5,2),
  last_updated timestamptz default now()
);

-- Create index for faster queries
create index idx_blog_analytics_blog_id on blog_analytics(blog_id);