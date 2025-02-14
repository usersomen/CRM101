/*
  # Create ML-related tables

  1. New Tables
    - `interactions`: Stores user interactions for ML training
    - `nlp_vocabs`: Stores vocabulary for NLP processing
    - `model_versions`: Tracks ML model versions and performance

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  query text NOT NULL,
  response text NOT NULL,
  intent text,
  feedback numeric,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create NLP vocabularies table
CREATE TABLE IF NOT EXISTS nlp_vocabs (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  vocab text[] NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create model versions table
CREATE TABLE IF NOT EXISTS model_versions (
  user_id uuid REFERENCES auth.users,
  model_type text,
  version numeric,
  performance jsonb,
  PRIMARY KEY (user_id, model_type)
);

-- Enable RLS
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nlp_vocabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_versions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can access their own interactions"
  ON interactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own vocab"
  ON nlp_vocabs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own model versions"
  ON model_versions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);