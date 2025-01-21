-- Drop existing projects table if it exists
DROP TABLE IF EXISTS projects;

-- Create storage bucket for project images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for project images bucket
CREATE POLICY "Public Access to Project Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'project-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own project images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'project-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'project-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own project images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'project-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    technologies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Allow authenticated users to view all projects
CREATE POLICY "Allow authenticated users to view all projects"
ON projects FOR SELECT
TO authenticated
USING (true);

-- Allow public to view all projects
CREATE POLICY "Allow public to view all projects"
ON projects FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert their own projects
CREATE POLICY "Allow authenticated users to insert their own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own projects
CREATE POLICY "Allow authenticated users to update their own projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own projects
CREATE POLICY "Allow authenticated users to delete their own projects"
ON projects FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX projects_created_at_idx ON projects(created_at DESC);

-- Grant permissions to authenticated users
GRANT ALL ON projects TO authenticated;
-- Grant select to public (anonymous users)
GRANT SELECT ON projects TO public;
