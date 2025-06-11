/*
  # Interview Platform Database Schema

  1. New Tables
    - `users` - User accounts with email authentication
    - `interviews` - Interview configurations with status tracking
    - `tasks` - Individual interview tasks with AI behavior settings
    - `criteria` - Evaluation criteria for general and task-specific scoring
    - `supporting_files` - File attachments for tasks

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure proper data isolation between users

  3. Enums
    - `criterion_scope` - general or task-specific criteria
    - `criterion_type` - rating, numeric, boolean, or text scoring
    - `ai_behavior` - AI interaction levels
    - `interview_status` - draft, live, or closed states
*/

-- Create custom types
CREATE TYPE criterion_scope AS ENUM ('general', 'task');
CREATE TYPE criterion_type AS ENUM ('rating', 'numeric', 'boolean', 'text');
CREATE TYPE ai_behavior AS ENUM ('passive', 'neutral', 'active', 'very_active');
CREATE TYPE interview_status AS ENUM ('draft', 'live', 'closed');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = email);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status interview_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own interviews"
  ON interviews
  FOR ALL
  TO authenticated
  USING (auth.email() = owner_email)
  WITH CHECK (auth.email() = owner_email);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  ai_behavior ai_behavior NOT NULL,
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  req_audio BOOLEAN NOT NULL DEFAULT true,
  req_screen_share BOOLEAN NOT NULL DEFAULT false,
  req_webcam BOOLEAN NOT NULL DEFAULT false,
  req_file_upload BOOLEAN NOT NULL DEFAULT false,
  task_order INTEGER NOT NULL CHECK (task_order >= 0),
  UNIQUE (interview_id, task_order)
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage tasks for own interviews"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    interview_id IN (
      SELECT id FROM interviews WHERE owner_email = auth.email()
    )
  )
  WITH CHECK (
    interview_id IN (
      SELECT id FROM interviews WHERE owner_email = auth.email()
    )
  );

-- Supporting files table
CREATE TABLE IF NOT EXISTS supporting_files (
  id SERIAL PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL
);

ALTER TABLE supporting_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage supporting files for own tasks"
  ON supporting_files
  FOR ALL
  TO authenticated
  USING (
    task_id IN (
      SELECT t.id FROM tasks t
      JOIN interviews i ON t.interview_id = i.id
      WHERE i.owner_email = auth.email()
    )
  )
  WITH CHECK (
    task_id IN (
      SELECT t.id FROM tasks t
      JOIN interviews i ON t.interview_id = i.id
      WHERE i.owner_email = auth.email()
    )
  );

-- Criteria table
CREATE TABLE IF NOT EXISTS criteria (
  id UUID PRIMARY KEY,
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type criterion_type NOT NULL,
  scope criterion_scope NOT NULL,
  CHECK (
    (scope = 'general' AND interview_id IS NOT NULL AND task_id IS NULL) OR
    (scope = 'task' AND task_id IS NOT NULL AND interview_id IS NULL)
  )
);

ALTER TABLE criteria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage criteria for own interviews"
  ON criteria
  FOR ALL
  TO authenticated
  USING (
    (interview_id IS NOT NULL AND interview_id IN (
      SELECT id FROM interviews WHERE owner_email = auth.email()
    )) OR
    (task_id IS NOT NULL AND task_id IN (
      SELECT t.id FROM tasks t
      JOIN interviews i ON t.interview_id = i.id
      WHERE i.owner_email = auth.email()
    ))
  )
  WITH CHECK (
    (interview_id IS NOT NULL AND interview_id IN (
      SELECT id FROM interviews WHERE owner_email = auth.email()
    )) OR
    (task_id IS NOT NULL AND task_id IN (
      SELECT t.id FROM tasks t
      JOIN interviews i ON t.interview_id = i.id
      WHERE i.owner_email = auth.email()
    ))
  );

-- Interview stats table (optional)
CREATE TABLE IF NOT EXISTS interview_stats (
  interview_id UUID PRIMARY KEY REFERENCES interviews(id) ON DELETE CASCADE,
  invited INTEGER NOT NULL DEFAULT 0 CHECK (invited >= 0),
  completed INTEGER NOT NULL DEFAULT 0 CHECK (completed >= 0),
  graded INTEGER NOT NULL DEFAULT 0 CHECK (graded >= 0)
);

ALTER TABLE interview_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view stats for own interviews"
  ON interview_stats
  FOR SELECT
  TO authenticated
  USING (
    interview_id IN (
      SELECT id FROM interviews WHERE owner_email = auth.email()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interviews_owner_email ON interviews(owner_email);
CREATE INDEX IF NOT EXISTS idx_tasks_interview_id ON tasks(interview_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(interview_id, task_order);
CREATE INDEX IF NOT EXISTS idx_criteria_interview_id ON criteria(interview_id);
CREATE INDEX IF NOT EXISTS idx_criteria_task_id ON criteria(task_id);
CREATE INDEX IF NOT EXISTS idx_supporting_files_task_id ON supporting_files(task_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();