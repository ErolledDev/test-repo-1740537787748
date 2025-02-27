export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'reseller';
  subscription: Subscription;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'basic' | 'premium' | 'reseller';
  status: 'active' | 'inactive' | 'trial';
  expires_at: string;
  created_at: string;
  created_by?: string;
}

export interface WidgetSettings {
  id: string;
  user_id: string;
  business_name: string;
  primary_color: string;
  secondary_color: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  icon: string;
  welcome_message: string;
  is_active: boolean;
  auto_open?: boolean;
  open_delay?: number;
  hide_on_mobile?: boolean;
  created_at: string;
  updated_at: string;
}

export interface KeywordResponse {
  id: string;
  user_id: string;
  keyword: string;
  response: string;
  synonyms: string[];
  regex_pattern?: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  visitor_id: string;
  visitor_name?: string;
  visitor_email?: string;
  status: 'active' | 'closed' | 'agent_assigned';
  agent_id?: string;
  agent_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_session_id: string;
  sender_type: 'visitor' | 'bot' | 'agent';
  sender_id: string;
  content: string;
  created_at: string;
}

export interface AnalyticsData {
  total_chats: number;
  total_messages: number;
  average_response_time: number;
  keyword_matches: Record<string, number>;
  chat_duration: number;
  visitor_satisfaction?: number;
}

export interface DeploymentConfig {
  provider: 'netlify' | 'vercel' | 'github-pages';
  deployId?: string;
  deployUrl?: string;
  claimUrl?: string;
  customDomain?: string;
  autoRedeploy?: boolean;
}