/*
  # Create users table for Firebase auth sync

  1. New Tables
    - `users`: Stores user information synced from Firebase
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text,
  display_name text,
  photo_url text,
  provider text,
  created_at timestamptz DEFAULT now(),
  last_sign_in timestamptz
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);