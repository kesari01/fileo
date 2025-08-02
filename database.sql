-- Fileo Database Schema
-- Run this in your Supabase SQL editor

-- Create the files table
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_files_expires_at ON files(expires_at);
CREATE INDEX idx_files_created_at ON files(created_at);
CREATE INDEX idx_files_download_count ON files(download_count);

-- Enable Row Level Security (RLS)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for MVP)
-- In production, you might want more restrictive policies
CREATE POLICY "Allow all operations" ON files
  FOR ALL USING (true);

-- Optional: Create a function to clean up expired files
CREATE OR REPLACE FUNCTION cleanup_expired_files()
RETURNS void AS $$
BEGIN
  DELETE FROM files 
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- This is commented out as pg_cron might not be available in all Supabase plans
-- SELECT cron.schedule('cleanup-expired-files', '0 2 * * *', 'SELECT cleanup_expired_files();'); 