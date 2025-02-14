/*
  # Update Users Table and Policies for Anonymous Access

  1. Changes
    - Drop existing policies and table
    - Recreate users table with simplified structure
    - Create new policies for anonymous and authenticated access

  2. Security
    - Enable anonymous access for read/write operations
    - Maintain data integrity through application-level checks
*/

-- Drop existing policies and table
DROP POLICY IF EXISTS "Allow anonymous access" ON users;
DROP POLICY IF EXISTS "Allow authenticated access" ON users;
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

-- Create a single policy for all operations
CREATE POLICY "Enable read/write for all users"
  ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);