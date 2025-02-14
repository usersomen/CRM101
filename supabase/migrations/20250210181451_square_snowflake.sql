/*
  # Update Users Table and Policies

  1. Changes
    - Drop existing policies and table
    - Recreate users table with simplified structure
    - Create new policies for anonymous access

  2. Security
    - Allow anonymous users to manage data
    - Maintain data integrity through application-level checks
*/

-- Drop existing policies and table
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON users;
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

-- Create policy for anonymous access
CREATE POLICY "Allow anonymous access"
  ON users
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated access
CREATE POLICY "Allow authenticated access"
  ON users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);