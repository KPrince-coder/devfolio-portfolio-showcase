-- Add new columns to blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time TEXT,
ADD COLUMN IF NOT EXISTS author_avatar TEXT,
ADD COLUMN IF NOT EXISTS category TEXT;

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0
);

-- Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blog_id, user_id)
);

-- Create blog_bookmarks table
CREATE TABLE IF NOT EXISTS blog_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blog_id, user_id)
);

-- Create helpful indexes
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_blog_id ON blog_bookmarks(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user_id ON blog_bookmarks(user_id);

-- Create function to update comment count
CREATE OR REPLACE FUNCTION increment_comment_count(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blogs
    SET comment_count = (
        SELECT COUNT(*)
        FROM blog_comments
        WHERE blog_id = post_id
    )
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blogs
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic like count updates
CREATE OR REPLACE FUNCTION update_blog_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs SET like_count = like_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blogs SET like_count = like_count - 1 WHERE id = OLD.blog_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_likes_trigger
AFTER INSERT OR DELETE ON blog_likes
FOR EACH ROW
EXECUTE FUNCTION update_blog_like_count();

-- Set up RLS policies
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_comments
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

CREATE POLICY "Users can delete their own comments"
    ON blog_comments FOR DELETE
    TO authenticated
    USING (author_id = auth.uid());

-- Create RLS policies for blog_likes
CREATE POLICY "Anyone can read likes"
    ON blog_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage their likes"
    ON blog_likes FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- Create RLS policies for blog_bookmarks
CREATE POLICY "Authenticated users can manage their bookmarks"
    ON blog_bookmarks FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_comment_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;

-- Update the blogs table permissions
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blogs"
    ON blogs FOR SELECT
    USING (published = true);

CREATE POLICY "Authenticated users can create blogs"
    ON blogs FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own blogs"
    ON blogs FOR UPDATE
    TO authenticated
    USING (author = auth.uid()::text);
