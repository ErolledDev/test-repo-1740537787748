import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { getChatSessions, getChatSessionMessages, updateChatSession } from '../lib/api';
import { getCurrentUser } from '../lib/supabase';
import { ChatSession, Message } from '../types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Filter, Download, MessageSquare, User, Clock, X, Check } from 'lucide-react';

const ChatHistoryPage: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [agentNotes, setAgentNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
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
        setFilteredSessions(sessions);
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
    
    setFilteredSessions(filtered);
  }, [chatSessions, statusFilter, searchTerm]);

  const handleViewChat = async (chatId: string) => {
    setSelectedChat(chatId);
    setLoadingMessages(true);
    
    try {
      const messages = await getChatSessionMessages(chatId);
      setChatMessages(messages);
      
      // Get agent notes
      const session = chatSessions.find(s => s.id === chatId);
      setAgentNotes(session?.agent_notes || '');
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    setChatMessages([]);
    setAgentNotes('');
  };

  const handleSaveNotes = async () => {
    if (!selectedChat) return;
    
    setSavingNotes(true);
    
    try {
      const updatedSession = await updateChatSession({
        id: selectedChat,
        agent_notes: agentNotes
      });
      
      if (updatedSession) {
        // Update the session in the list
        setChatSessions(chatSessions.map(session => 
          session.id === selectedChat ? { ...session, agent_notes: agentNotes } : session
        ));
      }
    } catch (error) {
      console.error('Error saving agent notes:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const exportChatHistory = (format: 'csv' | 'json') => {
    if (filteredSessions.length === 0) return;
    
    let content: string;
    let filename: string;
    let type: string;
    
    if (format === 'csv') {
      // Create CSV content
      const headers = ['id', 'visitor_name', 'visitor_email', 'status', 'created_at', 'updated_at'];
      content = [
        headers.join(','),
        ...filteredSessions.map(session => [
          session.id,
          `"${(session.visitor_name || '').replace(/"/g, '""')}"`,
          `"${(session.visitor_email || '').replace(/"/g, '""')}"`,
          session.status,
          session.created_at,
          session.updated_at
        ].join(','))
      ].join('\n');
      
      filename = `chat_history_${new Date().toISOString().split('T')[0]}.csv`;
      type = 'text/csv';
    } else {
      // Create JSON content
      content = JSON.stringify(filteredSessions, null, 2);
      filename = `chat_history_${new Date().toISOString().split('T')[0]}.json`;
      type = 'application/json';
    }
    
    // Create a blob and download link
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Layout title="Chat History" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Chat History" userName={userName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Chat History</h2>
            <p className="text-gray-600">
              View and manage past conversations with your website visitors.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => exportChatHistory('csv')}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            
            <button
              onClick={() => exportChatHistory('json')}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </button>
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
                      <option value="closed">Closed</option>
                      <option value="agent_assigned">Agent Assigned</option>
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
                        onClick={() => handleViewChat(session.id)}
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
                              {format(new Date(session.created_at), 'MMM d, yyyy h:mm a')}
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
          
          {/* Chat Detail */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <div className="bg-white rounded-lg shadow h-full flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chat Details
                  </h3>
                  <button
                    onClick={handleCloseChat}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {loadingMessages ? (
                  <div className="flex items-center justify-center flex-1 p-6">
                    <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="flex flex-col flex-1">
                    <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <MessageSquare className="w-12 h-12 text-gray-400" />
                          <p className="mt-2 text-gray-500">No messages in this chat</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender_type === 'visitor' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                  message.sender_type === 'visitor'
                                    ? 'bg-indigo-100 text-gray-800'
                                    : message.sender_type === 'bot'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-indigo-600 text-white'
                                }`}
                              >
                                <div className="text-xs mb-1">
                                  {message.sender_type === 'visitor'
                                    ? 'Visitor'
                                    : message.sender_type === 'bot'
                                    ? 'Bot'
                                    : 'Agent'}
                                </div>
                                <p>{message.content}</p>
                                <div className="text-xs mt-1 opacity-70">
                                  {format(new Date(message.created_at), 'h:mm a')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Agent Notes</h4>
                      <div className="flex">
                        <textarea
                          value={agentNotes}
                          onChange={(e) => setAgentNotes(e.target.value)}
                          rows={3}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Add notes about this conversation..."
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleSaveNotes}
                          disabled={savingNotes}
                          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {savingNotes ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Save Notes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-lg shadow">
                <MessageSquare className="w-16 h-16 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Chat Selected</h3>
                <p className="mt-1 text-gray-500">
                  Select a chat from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatHistoryPage;