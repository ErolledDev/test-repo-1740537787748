import { createClient } from '@supabase/supabase-js';

// These would typically come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (data.user && !error) {
    // Create a user record in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        { 
          id: data.user.id,
          email: data.user.email,
          role: 'user'
        }
      ]);
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
    }
    
    // Create default widget settings for the user
    const { error: settingsError } = await supabase
      .from('widget_settings')
      .insert([
        {
          user_id: data.user.id,
          business_name: 'My Business',
          primary_color: '#4F46E5',
          secondary_color: '#EEF2FF',
          position: 'bottom-right',
          icon: 'message-circle',
          welcome_message: 'Hello! How can I help you today?',
          is_active: true
        }
      ]);
    
    if (settingsError) {
      console.error('Error creating widget settings:', settingsError);
    }
  }
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
}