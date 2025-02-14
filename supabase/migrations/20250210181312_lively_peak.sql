/*
  # Fix Users Table RLS Policies

  1. Changes
    - Drop existing policies and recreate them with proper authentication checks
    - Add UPSERT policy to allow authenticated users to insert/update their own data
    - Add service role bypass for system operations

  2. Security
    - Maintain user data isolation
    - Allow users to manage only their own data
    - Enable proper user synchronization
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

-- Create unified policy for CRUD operations
CREATE POLICY "Users can manage their own data"
  ON users
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Allow upsert operations for authenticated users
CREATE POLICY "Users can upsert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

-- Allow the service role to bypass RLS
ALTER TABLE users FORCE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage all users"
  ON users
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');