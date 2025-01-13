-- Function to increment comment count
create or replace function increment_comment_count(post_id uuid)
returns void as $$
begin
  update blogs
  set comment_count = (
    select count(*)
    from blog_comments
    where blog_id = post_id
  )
  where id = post_id;
end;
$$ language plpgsql security definer;

-- Function to increment view count
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update blogs
  set view_count = coalesce(view_count, 0) + 1
  where id = post_id;
end;
$$ language plpgsql security definer;

-- Grant execute permissions
grant execute on function increment_comment_count(uuid) to authenticated;
grant execute on function increment_view_count(uuid) to authenticated;
