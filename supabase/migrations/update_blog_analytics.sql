create or replace function update_blog_analytics()
returns trigger as $$
begin
  -- Update blog analytics when a new page view is recorded
  if TG_TABLE_NAME = 'page_views' and NEW.path like '/blog/%' then
    insert into blog_analytics (blog_id, views)
    values (
      (select id from blogs where slug = substring(NEW.path from '/blog/(.*)$')),
      1
    )
    on conflict (blog_id)
    do update set
      views = blog_analytics.views + 1,
      last_updated = now();
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Create trigger
create trigger trigger_update_blog_analytics
after insert on page_views
for each row
execute function update_blog_analytics();