import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided in environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (data.user && !error) {
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
          is_active: true,
          auto_open: false,
          open_delay: 3,
          hide_on_mobile: false
        }
      ]);
    
    if (settingsError) {
      console.error('Error creating widget settings:', settingsError);
    }
  }
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Check if user exists in the users table
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // If user doesn't exist in the users table, create them
      if (userError && userError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              role: 'user'
            }
          ]);
        
        if (insertError) {
          console.error('Error creating user record:', insertError);
        }
      }
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
}

export async function updateUserProfile(updates: {
  display_name?: string;
  password?: string;
  current_password?: string;
  avatar_url?: string;
}) {
  try {
    // If updating password
    if (updates.password) {
      if (!updates.current_password) {
        throw new Error('Current password is required to set a new password');
      }
      
      const { error } = await supabase.auth.updateUser({
        password: updates.password
      });
      
      if (error) throw error;
    }
    
    // If updating other user metadata
    if (updates.display_name || updates.avatar_url) {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: updates.display_name,
          avatar_url: updates.avatar_url
        }
      });
      
      if (error) throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  return { error };
}