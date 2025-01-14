-- Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    icon_key VARCHAR NOT NULL DEFAULT 'link',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for social_links"
ON public.social_links
FOR SELECT
TO public
USING (true);

-- Allow admin full access
CREATE POLICY "Admin full access for social_links"
ON public.social_links
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon_key) VALUES
    ('GitHub', 'https://github.com', 'github'),
    ('LinkedIn', 'https://linkedin.com', 'linkedin'),
    ('Twitter', 'https://twitter.com', 'twitter'),
    ('Email', 'mailto:contact@example.com', 'mail');
