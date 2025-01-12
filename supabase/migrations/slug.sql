alter table blogs add column slug text;
create index blogs_slug_idx on blogs (slug);

-- alter table blogs add column if not exists slug text;
-- create index if not exists blogs_slug_idx on blogs (slug);