-- Update blogs table to add slug column if it doesn't exist
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;

-- Create index on slug
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs (slug);

-- Update existing rows to have slugs based on titles
UPDATE blogs 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;