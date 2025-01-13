
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS author_avatar text;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users on delete cascade primary key,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Add indexes
CREATE INDEX IF NOT EXISTS blogs_view_count_idx ON blogs(view_count);
CREATE INDEX IF NOT EXISTS blogs_category_idx ON blogs(category);