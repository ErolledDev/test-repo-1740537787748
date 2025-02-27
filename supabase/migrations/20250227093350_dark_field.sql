/*
  # Fix Users Table

  1. Changes
     - Create users table if it doesn't exist
     - Add proper RLS policies for users table
     - Fix references to users table
*/

-- Create users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'users') THEN
    CREATE TABLE users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email text UNIQUE NOT NULL,
      role text NOT NULL DEFAULT 'user',
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can insert own data"
      ON users
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Add public access policy for auth functions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Allow public to create users'
  ) THEN
    CREATE POLICY "Allow public to create users"
      ON users
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;