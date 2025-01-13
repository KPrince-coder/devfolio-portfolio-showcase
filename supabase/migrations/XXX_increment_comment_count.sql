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
$$ language plpgsql;
