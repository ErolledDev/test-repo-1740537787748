import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import RecentChats from '../components/dashboard/RecentChats';
import WidgetCodeGenerator from '../components/widget/WidgetCodeGenerator';
import { getChatSessions, getAnalyticsData } from '../lib/api';
import { getCurrentUser } from '../lib/supabase';
import { ChatSession } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Settings, MessageSquare, BarChart3 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    totalChats: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    activeChats: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUserName(user.email?.split('@')[0] || 'User');
        setUserId(user.id);
        
        // Fetch chat sessions
        const chatSessions = await getChatSessions(user.id);
        setChats(chatSessions);
        
        // Fetch analytics data
        const analytics = await getAnalyticsData(user.id);
        
        // Calculate active chats
        const activeChatCount = chatSessions.filter(chat => 
          chat.status === 'active' || chat.status === 'agent_assigned'
        ).length;
        
        setAnalyticsData({
          totalChats: analytics.total_chats || 0,
          totalMessages: analytics.total_messages || 0,
          averageResponseTime: analytics.average_response_time || 0,
          activeChats: activeChatCount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleViewChat = (chatId: string) => {
    navigate(`/live-chat`);
  };

  if (loading) {
    return (
      <Layout title="Dashboard" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" userName={userName}>
      <div className="space-y-6">
        <DashboardOverview
          totalChats={analyticsData.totalChats}
          totalMessages={analyticsData.totalMessages}
          averageResponseTime={analyticsData.averageResponseTime}
          activeChats={analyticsData.activeChats}
        />
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Widget Settings</h3>
              <Settings className="w-6 h-6" />
            </div>
            <p className="mb-4 text-indigo-100">
              Customize your chat widget appearance and behavior
            </p>
            <button 
              onClick={() => navigate('/widget-settings')}
              className="flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-white rounded-md hover:bg-indigo-50"
            >
              Customize Widget
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <div className="p-6 bg-gradient-to-r from <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Live Chat</h3>
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="mb-4 text-green-100">
              Respond to active chat sessions in real-time
            </p>
            <button 
              onClick={() => navigate('/live-chat')}
              className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-white rounded-md hover:bg-green-50"
            >
              Go to Live Chat
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Analytics</h3>
              <BarChart3 className="w-6 h-6" />
            </div>
            <p className="mb-4 text-purple-100">
              View detailed analytics and performance metrics
            </p>
            <button 
              onClick={() => navigate('/analytics')}
              className="flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-white rounded-md hover:bg-purple-50"
            >
              View Analytics
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentChats chats={chats.slice(0, 5)} onViewChat={handleViewChat} />
          <WidgetCodeGenerator userId={userId} />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
  )
}