import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import RecentChats from '../components/dashboard/RecentChats';
import { getChatSessions } from '../lib/api';
import { getCurrentUser } from '../lib/supabase';
import { ChatSession } from '../types';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
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
        
        const chatSessions = await getChatSessions(user.id);
        setChats(chatSessions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleViewChat = (chatId: string) => {
    navigate(`/chat-history/${chatId}`);
  };

  // Calculate dashboard metrics
  const totalChats = chats.length;
  const activeChats = chats.filter(chat => chat.status === 'active').length;
  const totalMessages = 120; // This would come from an API in a real app
  const averageResponseTime = 8; // This would come from an API in a real app

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
          totalChats={totalChats}
          totalMessages={totalMessages}
          averageResponseTime={averageResponseTime}
          activeChats={activeChats}
        />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentChats chats={chats.slice(0, 5)} onViewChat={handleViewChat} />
          
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Widget Integration</h2>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Add the following code to your website to integrate the chat widget:
              </p>
              <div className="p-4 overflow-x-auto font-mono text-sm bg-gray-100 rounded">
                <pre>{`<script src="https://mydomain123.netlify.app/widget.js"></script>
<script>
  new BusinessChatPlugin({
    uid: '2ff3b1da-9421-48fa-9bfb-bd644e726567'
  });
</script>`}</pre>
              </div>
              <button className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;