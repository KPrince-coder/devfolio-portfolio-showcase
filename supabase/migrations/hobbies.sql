-- Create hobbies table
CREATE TABLE IF NOT EXISTS public.hobbies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_key TEXT DEFAULT 'heart' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for hobbies"
ON public.hobbies FOR SELECT
TO public
USING (true);

-- Allow admin full access
CREATE POLICY "Admin full access for hobbies"
ON public.hobbies FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM admin_users
        WHERE admin_users.id = auth.uid()
    )
);

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.hobbies
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
