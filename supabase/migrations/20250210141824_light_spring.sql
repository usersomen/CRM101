/*
  # Update users table ID type

  1. Changes
    - Change id column type from uuid to text to support Firebase auth IDs
    
  2. Security
    - Recreate RLS policies with updated id type comparison
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;

-- Drop and recreate the users table with text id
DROP TABLE IF EXISTS users;

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

-- Recreate policies with text comparison
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);