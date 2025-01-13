-- Update existing blogs table to include analytics fields
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS viewcount bigint DEFAULT 0;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS likes bigint DEFAULT 0;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS hasliked boolean DEFAULT false;

-- Create blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
    author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name text NOT NULL,
    content text NOT NULL,
    likes bigint DEFAULT 0,
    parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create blog likes table to track user likes
CREATE TABLE IF NOT EXISTS blog_likes (
    blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (blog_id, user_id)
);

-- Create comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    comment_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (comment_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);

-- Create function to update blog like count
CREATE OR REPLACE FUNCTION update_blog_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs SET likes = likes + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blogs SET likes = likes - 1 WHERE id = OLD.blog_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog likes
CREATE TRIGGER blog_likes_trigger
AFTER INSERT OR DELETE ON blog_likes
FOR EACH ROW
EXECUTE FUNCTION update_blog_like_count();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE blogs SET viewcount = viewcount + 1 WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can read comments"
    ON blog_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON blog_comments FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
    ON blog_comments FOR UPDATE
    TO authenticated
    USING (author_id = auth.uid());

-- Likes policies
CREATE POLICY "Anyone can read likes"
    ON blog_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can add/remove likes"
    ON blog_likes FOR ALL
    TO authenticated
    USING (user_id = auth.uid());
