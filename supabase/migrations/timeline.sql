-- Create experiences table if it doesn't exist
CREATE TABLE IF NOT EXISTS experiences (
    -- Unique identifier for the experience
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic experience details
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Array columns for technologies and achievements
    technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
    achievements TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Optional styling and icon metadata
    icon_key TEXT DEFAULT 'code',
    color TEXT DEFAULT 'bg-blue-600',

    -- Timestamp tracking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to automatically update the updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION IF NOT EXISTS update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column if it doesn't exist
CREATE TRIGGER IF NOT EXISTS update_experiences_modtime
BEFORE UPDATE ON experiences
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Experiences are viewable by everyone" ON experiences;
DROP POLICY IF EXISTS "Experiences can only be modified by admin" ON experiences;

-- Create policies if they don't exist
CREATE POLICY IF NOT EXISTS "Experiences are viewable by everyone" 
ON experiences FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Experiences can only be modified by admin" 
ON experiences FOR ALL 
USING (auth.uid() = 'your-admin-uuid');

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_experiences_year ON experiences(year);
CREATE INDEX IF NOT EXISTS idx_experiences_company ON experiences(company);

-- Add a comment to the table if it doesn't exist
COMMENT ON TABLE experiences IS 'Stores professional experiences and timeline information';

-- Insert some initial experience data if the table is empty
INSERT INTO experiences (
    year, 
    title, 
    company, 
    description, 
    technologies, 
    achievements, 
    icon_key, 
    color
) SELECT 
    '2022-2023',
    'Senior Software Engineer',
    'Tech Innovations Inc.',
    'Led development of scalable web applications using modern technologies',
    ARRAY['React', 'TypeScript', 'Node.js', 'AWS'],
    ARRAY[
        'Reduced application load time by 40%', 
        'Implemented microservices architecture',
        'Led team of 5 developers'
    ],
    'code',
    'bg-blue-600'
WHERE NOT EXISTS (SELECT 1 FROM experiences);