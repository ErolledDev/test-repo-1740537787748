/*
  # Create chat widget platform tables

  1. New Tables
    - `widget_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `business_name` (text)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `position` (text)
      - `icon` (text)
      - `welcome_message` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `keyword_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `keyword` (text)
      - `response` (text)
      - `synonyms` (text[])
      - `regex_pattern` (text)
      - `is_active` (boolean)
      - `priority` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `visitor_id` (text)
      - `visitor_name` (text)
      - `visitor_email` (text)
      - `status` (text)
      - `agent_id` (uuid, references users.id)
      - `agent_notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `messages`
      - `id` (uuid, primary key)
      - `chat_session_id` (uuid, references chat_sessions.id)
      - `sender_type` (text)
      - `sender_id` (text)
      - `content` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create widget_settings table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'widget_settings') THEN
    CREATE TABLE widget_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      business_name text NOT NULL DEFAULT 'My Business',
      primary_color text NOT NULL DEFAULT '#4F46E5',
      secondary_color text NOT NULL DEFAULT '#EEF2FF',
      position text NOT NULL DEFAULT 'bottom-right',
      icon text NOT NULL DEFAULT 'message-circle',
      welcome_message text NOT NULL DEFAULT 'Hello! How can I help you today?',
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE widget_settings ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can read own widget settings"
      ON widget_settings
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own widget settings"
      ON widget_settings
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own widget settings"
      ON widget_settings
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create keyword_responses table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'keyword_responses') THEN
    CREATE TABLE keyword_responses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      keyword text NOT NULL,
      response text NOT NULL,
      synonyms text[] DEFAULT '{}',
      regex_pattern text,
      is_active boolean NOT NULL DEFAULT true,
      priority integer NOT NULL DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE keyword_responses ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can read own keyword responses"
      ON keyword_responses
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own keyword responses"
      ON keyword_responses
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own keyword responses"
      ON keyword_responses
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own keyword responses"
      ON keyword_responses
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create chat_sessions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'chat_sessions') THEN
    CREATE TABLE chat_sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      visitor_id text NOT NULL,
      visitor_name text,
      visitor_email text,
      status text NOT NULL DEFAULT 'active',
      agent_id uuid REFERENCES auth.users(id),
      agent_notes text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can read own chat sessions"
      ON chat_sessions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own chat sessions"
      ON chat_sessions
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own chat sessions"
      ON chat_sessions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create messages table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'messages') THEN
    CREATE TABLE messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
      sender_type text NOT NULL,
      sender_id text NOT NULL,
      content text NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can read own messages"
      ON messages
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM chat_sessions
          WHERE chat_sessions.id = messages.chat_session_id
          AND chat_sessions.user_id = auth.uid()
        )
      );

    CREATE POLICY "Users can insert own messages"
      ON messages
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM chat_sessions
          WHERE chat_sessions.id = messages.chat_session_id
          AND chat_sessions.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create functions to update updated_at timestamp
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create triggers for updated_at columns
    CREATE TRIGGER update_widget_settings_updated_at
    BEFORE UPDATE ON widget_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_keyword_responses_updated_at
    BEFORE UPDATE ON keyword_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;