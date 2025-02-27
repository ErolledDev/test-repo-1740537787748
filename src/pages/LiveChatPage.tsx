import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import LiveChatPanel from '../components/chat/LiveChatPanel';
import { getChatSessions, updateChatSession } from '../lib/api';
import { getCurrentUser } from '../lib/supabase';
import { ChatSession } from '../types';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, User, Clock, Search, Filter } from 'lucide-react';

const LiveChatPage: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
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
        
        const sessions = await getChatSessions(user.id);
        setChatSessions(sessions);
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Poll for new chats every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...chatSessions];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        (session.visitor_name && session.visitor_name.toLowerCase().includes(term)) ||
        session.visitor_id.toLowerCase().includes(term) ||
        (session.visitor_email && session.visitor_email.toLowerCase().includes(term))
      );
    }
    
    // Sort by created_at (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setFilteredSessions(filtered);
  }, [chatSessions, statusFilter, searchTerm]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const handleUpdateSession = (updatedSession: ChatSession) => {
    setChatSessions(chatSessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  if (loading) {
    return (
      <Layout title="Live Chat" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  const selectedChatSession = chatSessions.find(session => session.id === selectedChat);

  return (
    <Layout title="Live Chat" userName={userName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Live Chat</h2>
            <p className="text-gray-600">
              Manage active conversations with your website visitors in real-time.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="ml-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="agent_assigned">Agent Assigned</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {filteredSessions.length} {filteredSessions.length === 1 ? 'chat' : 'chats'} found
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {filteredSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No chat sessions found</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredSessions.map((session) => (
                      <li
                        key={session.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedChat === session.id ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => handleSelectChat(session.id)}
                      >
                        <div className="px-4 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-10 h-10 text-white bg-indigo-100 rounded-full">
                                <User className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {session.visitor_name || `Visitor ${session.visitor_id.substring(0, 8)}`}
                                </p>
                                {session.visitor_email && (
                                  <p className="text-xs text-gray-500">{session.visitor_email}</p>
                                )}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              session.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : session.status === 'agent_assigned' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {session.status === 'active' 
                                ? 'Active' 
                                : session.status === 'agent_assigned' 
                                ? 'Agent Assigned' 
                                : 'Closed'}
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>
                              {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {/* Chat Panel */}
          <div className="lg:col-span-2">
            {selectedChatSession ? (
              <LiveChatPanel 
                session={selectedChatSession} 
                onClose={handleCloseChat}
                onUpdateSession={handleUpdateSession}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-lg shadow">
                <MessageSquare className="w-16 h-16 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Chat Selected</h3>
                <p className="mt-1 text-gray-500">
                  Select a chat from the list to start responding
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiveChatPage;