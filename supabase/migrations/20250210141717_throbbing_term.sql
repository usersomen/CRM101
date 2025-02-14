/*
  # Create users table and policies

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Firebase auth.uid()
      - `email` (text)
      - `display_name` (text)
      - `photo_url` (text)
      - `provider` (text)
      - `created_at` (timestamptz)
      - `last_sign_in` (timestamptz)

  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users to:
      - Read their own data
      - Update their own data
      - Insert their own data
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

CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);