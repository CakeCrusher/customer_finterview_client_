-- Simple users table for testing Supabase connection
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  company text NOT NULL,
  created_at timestamptz DEFAULT now()
);