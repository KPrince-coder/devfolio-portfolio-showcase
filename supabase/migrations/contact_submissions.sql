-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email column
CREATE INDEX idx_contact_submissions_email ON contact_submissions (email);

-- Create index on created_at column
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions (created_at);