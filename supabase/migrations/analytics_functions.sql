-- Function to check analytics access
create or replace function get_analytics_access()
returns table (
  can_view boolean,
  can_edit boolean
) security definer as $$
begin
  return query
  select 
    true as can_view,  -- Modify this based on your access control logic
    true as can_edit;  -- Modify this based on your access control logic
end;
$$ language plpgsql;

-- Create the analytics functions
create or replace function get_dashboard_analytics(start_date timestamp, end_date timestamp)
returns json language plpgsql security definer as $$
declare
  result json;
begin
  with visit_stats as (
    select
      date_trunc('day', timestamp) as date,
      count(distinct session_id) as unique_visitors,
      count(*) as page_views
    from page_views
    where timestamp between start_date and end_date
    group by 1
    order by 1
  )
  select json_build_object(
    'dates', (select array_agg(date::text) from visit_stats),
    'visitors', (select array_agg(unique_visitors) from visit_stats),
    'pageViews', (select array_agg(page_views) from visit_stats)
  ) into result;
  
  return result;
end; $$;

-- Blog performance function
create or replace function get_blog_performance()
returns table (
  title text,
  views bigint,
  likes bigint,
  comments bigint
) security definer as $$
begin
  return query
  select 
    b.title,
    coalesce(ba.views, 0) as views,
    coalesce(ba.likes, 0) as likes,
    coalesce(ba.comments, 0) as comments
  from blogs b
  left join blog_analytics ba on ba.blog_id = b.id
  order by ba.views desc nulls last
  limit 10;
end;
$$ language plpgsql;

-- Geographic stats function
create or replace function get_geo_stats()
returns table (
  country text,
  value bigint,
  code text,
  trend numeric
) security definer as $$
begin
  return query
  with current_stats as (
    select 
      country,
      count(*) as visits
    from page_views
    where 
      country is not null and
      timestamp > now() - interval '30 days'
    group by country
  ),
  previous_stats as (
    select 
      country,
      count(*) as visits
    from page_views
    where 
      country is not null and
      timestamp between now() - interval '60 days' and now() - interval '30 days'
    group by country
  )
  select
    cs.country,
    cs.visits as value,
    cs.country as code,
    coalesce(
      round(((cs.visits::numeric - ps.visits::numeric) / nullif(ps.visits, 0) * 100)::numeric, 1),
      0
    ) as trend
  from current_stats cs
  left join previous_stats ps on cs.country = ps.country
  order by cs.visits desc
  limit 10;
end;
$$ language plpgsql;

-- Device stats function
create or replace function get_device_stats()
returns json security definer as $$
declare
  result json;
begin
  select json_build_object(
    'desktop', coalesce(sum(case when device_type = 'desktop' then 1 else 0 end), 0),
    'mobile', coalesce(sum(case when device_type = 'mobile' then 1 else 0 end), 0),
    'tablet', coalesce(sum(case when device_type = 'tablet' then 1 else 0 end), 0)
  )
  into result
  from page_views
  where timestamp > now() - interval '30 days';
  
  return result;
end;
$$ language plpgsql;
