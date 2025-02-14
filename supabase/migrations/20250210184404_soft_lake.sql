-- Drop existing policies and table
DROP POLICY IF EXISTS "Enable read/write for all users" ON users;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id text PRIMARY KEY,
  email text,
  display_name text,
  photo_url text,
  provider text,
  created_at timestamptz DEFAULT now(),
  last_sign_in timestamptz
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);