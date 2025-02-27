/*
  # Fix Schema Structure

  1. Changes
     - Add missing columns to widget_settings table
     - Fix references to auth.users in chat_sessions table
     - Add proper existence checks for all tables and functions
     - Ensure all tables have proper RLS policies
*/

-- Add missing columns to widget_settings if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'widget_settings' AND column_name = 'auto_open'
  ) THEN
    ALTER TABLE widget_settings ADD COLUMN auto_open boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'widget_settings' AND column_name = 'open_delay'
  ) THEN
    ALTER TABLE widget_settings ADD COLUMN open_delay integer NOT NULL DEFAULT 3;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'widget_settings' AND column_name = 'hide_on_mobile'
  ) THEN
    ALTER TABLE widget_settings ADD COLUMN hide_on_mobile boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Fix chat_sessions agent_id reference if needed
DO $$ 
BEGIN
  -- Check if the constraint exists
  IF EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'chat_sessions_agent_id_fkey'
  ) THEN
    -- Drop the existing constraint
    ALTER TABLE chat_sessions DROP CONSTRAINT chat_sessions_agent_id_fkey;
    
    -- Add the correct constraint
    ALTER TABLE chat_sessions 
    ADD CONSTRAINT chat_sessions_agent_id_fkey 
    FOREIGN KEY (agent_id) REFERENCES auth.users(id);
  END IF;
END $$;

-- Ensure public access policies exist for widget data
DO $$ 
BEGIN
  -- Check if the policy exists for widget_settings
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'widget_settings' AND policyname = 'Public can read widget settings'
  ) THEN
    CREATE POLICY "Public can read widget settings"
      ON widget_settings
      FOR SELECT
      TO anon
      USING (true);
  END IF;

  -- Check if the policy exists for keyword_responses
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'keyword_responses' AND policyname = 'Public can read active keyword responses'
  ) THEN
    CREATE POLICY "Public can read active keyword responses"
      ON keyword_responses
      FOR SELECT
      TO anon
      USING (is_active = true);
  END IF;
END $$;

-- Ensure all tables have the updated_at trigger
DO $$ 
BEGIN
  -- Check if the trigger exists for widget_settings
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_widget_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_widget_settings_updated_at
    BEFORE UPDATE ON widget_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Check if the trigger exists for keyword_responses
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_keyword_responses_updated_at'
  ) THEN
    CREATE TRIGGER update_keyword_responses_updated_at
    BEFORE UPDATE ON keyword_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Check if the trigger exists for chat_sessions
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_chat_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;