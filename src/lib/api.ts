import { supabase } from './supabase';
import { KeywordResponse, WidgetSettings, ChatSession, Message } from '../types';

// Widget Settings API
export async function getWidgetSettings(userId: string): Promise<WidgetSettings | null> {
  const { data, error } = await supabase
    .from('widget_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching widget settings:', error);
    return null;
  }
  
  return data as WidgetSettings;
}

export async function updateWidgetSettings(settings: Partial<WidgetSettings>): Promise<WidgetSettings | null> {
  const { data, error } = await supabase
    .from('widget_settings')
    .update(settings)
    .eq('id', settings.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating widget settings:', error);
    return null;
  }
  
  return data as WidgetSettings;
}

// Keyword Responses API
export async function getKeywordResponses(userId: string): Promise<KeywordResponse[]> {
  const { data, error } = await supabase
    .from('keyword_responses')
    .select('*')
    .eq('user_id', userId)
    .order('priority', { ascending: false });
  
  if (error) {
    console.error('Error fetching keyword responses:', error);
    return [];
  }
  
  return data as KeywordResponse[];
}

export async function createKeywordResponse(response: Omit<KeywordResponse, 'id' | 'created_at' | 'updated_at'>): Promise<KeywordResponse | null> {
  const { data, error } = await supabase
    .from('keyword_responses')
    .insert(response)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating keyword response:', error);
    return null;
  }
  
  return data as KeywordResponse;
}

export async function updateKeywordResponse(response: Partial<KeywordResponse>): Promise<KeywordResponse | null> {
  const { data, error } = await supabase
    .from('keyword_responses')
    .update(response)
    .eq('id', response.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating keyword response:', error);
    return null;
  }
  
  return data as KeywordResponse;
}

export async function deleteKeywordResponse(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('keyword_responses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting keyword response:', error);
    return false;
  }
  
  return true;
}

// Chat History API
export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }
  
  return data as ChatSession[];
}

export async function getChatSessionMessages(sessionId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_session_id', sessionId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching chat session messages:', error);
    return [];
  }
  
  return data as Message[];
}

export async function updateChatSession(session: Partial<ChatSession>): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .update(session)
    .eq('id', session.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating chat session:', error);
    return null;
  }
  
  return data as ChatSession;
}

// Widget Data API
export async function getWidgetData(uid: string) {
  // This would be a public endpoint that the widget.js script calls
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', uid)
    .single();
  
  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return null;
  }
  
  const userId = user.id;
  
  const [settings, keywordResponses] = await Promise.all([
    getWidgetSettings(userId),
    getKeywordResponses(userId)
  ]);
  
  return {
    settings,
    keywordResponses
  };
}