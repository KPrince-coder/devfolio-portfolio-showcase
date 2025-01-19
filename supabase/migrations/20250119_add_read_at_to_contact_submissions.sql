-- Add read_at timestamp column to contact_submissions table
ALTER TABLE contact_submissions ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;

-- Update existing read messages with current timestamp
UPDATE contact_submissions 
SET read_at = CURRENT_TIMESTAMP 
WHERE is_read = true;
