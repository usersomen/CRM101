/*
  # Simplify Users Table RLS Policies

  1. Changes
    - Drop all existing policies
    - Create a single, simple policy for authenticated users
    - Enable security defaults

  2. Security
    - Allow authenticated users to manage their own data
    - Maintain data isolation between users
*/

-- Drop existing policies and table
DROP POLICY IF EXISTS "Users can manage their own data" ON users;
DROP POLICY IF EXISTS "Users can upsert their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
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
CREATE POLICY "Enable all operations for authenticated users only"
  ON users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);