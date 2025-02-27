import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send, User, Bot, Clock, X, Check, Phone, Video, Paperclip } from 'lucide-react';
import { ChatSession, Message } from '../../types';
import { updateChatSession, getChatSessionMessages } from '../../lib/api';
import { 
  subscribeToNewMessages, 
  unsubscribeFromNewMessages, 
  sendMessage as sendSocketMessage,
  joinChatRoom,
  leaveChatRoom
} from '../../lib/socket';

interface LiveChatPanelProps {
  session: ChatSession;
  onClose: () => void;
  onUpdateSession: (session: ChatSession) => void;
}

const LiveChatPanel: React.FC<LiveChatPanelProps> = ({ 
  session, 
  onClose,
  onUpdateSession
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState(session.agent_notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await getChatSessionMessages(session.id);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Join the chat room
    joinChatRoom(session.id);
    
    // Subscribe to new messages
    subscribeToNewMessages(session.id, (newMessage) => {
      if (newMessage.sender_type !== 'agent') {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    });

    return () => {
      // Leave the chat room and unsubscribe when component unmounts
      leaveChatRoom(session.id);
      unsubscribeFromNewMessages(session.id);
    };
  }, [session.id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setSending(true);
    
    try {
      // Create the message object
      const newMessage: Omit<Message, 'id' | 'created_at'> = {
        chat_session_id: session.id,
        sender_type: 'agent',
        sender_id: 'agent-1', // This would be the actual agent ID
        content: message
      };
      
      // Add to local state immediately for UI responsiveness
      const tempMessage: Message = {
        ...newMessage,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      setMessages([...messages, tempMessage]);
      setMessage('');
      
      // Send via socket
      sendSocketMessage(newMessage);
      
      // Update session status if it's not already agent_assigned
      if (session.status !== 'agent_assigned') {
        const updatedSession = await updateChatSession({
          id: session.id,
          status: 'agent_assigned'
        });
        
        if (updatedSession) {
          onUpdateSession(updatedSession);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    
    try {
      const updatedSession = await updateChatSession({
        id: session.id,
        agent_notes: notes
      });
      
      if (updatedSession) {
        onUpdateSession(updatedSession);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCloseChat = async () => {
    try {
      const updatedSession = await updateChatSession({
        id: session.id,
        status: 'closed'
      });
      
      if (updatedSession) {
        onUpdateSession(updatedSession);
        onClose();
      }
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 mr-2 bg-white rounded-full">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium">
              {session.visitor_name || `Visitor ${session.visitor_id.substring(0, 8)}`}
            </h3>
            {session.visitor_email && (
              <p className="text-xs opacity-80">{session.visitor_email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 text-white rounded-full hover:bg-indigo-700"
            title="Voice call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button 
            className="p-1 text-white rounded-full hover:bg-indigo-700"
            title="Video call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCloseChat}
            className="p-1 text-white rounded-full hover:bg-indigo-700"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-600 bg-gray-100 border-b">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>Started {format(new Date(session.created_at), 'MMM d, yyyy h:mm a')}</span>
        </div>
        <div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_type === 'visitor' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_type === 'visitor'
                      ? 'bg-gray-100 text-gray-800'
                      : msg.sender_type === 'bot'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  <div className="flex items-center mb-1 text-xs">
                    {msg.sender_type === 'visitor' ? (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        <span>Visitor</span>
                      </>
                    ) : msg.sender_type === 'bot' ? (
                      <>
                        <Bot className="w-3 h-3 mr-1" />
                        <span>Bot</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        <span>Agent</span>
                      </>
                    )}
                  </div>
                  <p>{msg.content}</p>
                  <div className="mt-1 text-xs opacity-70">
                    {format(new Date(msg.created_at), 'h:mm a')}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex">
          <button
            type="button"
            className="p-2 text-gray-500 border-t border-l border-b border-gray-300 rounded-l-md hover:bg-gray-50"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={session.status === 'closed'}
          />
          <button
            type="submit"
            disabled={sending || session.status === 'closed'}
            className="px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-r-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {sending ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      
      {/* Notes */}
      <div className="p-3 border-t">
        <h4 className="mb-2 text-sm font-medium text-gray-700">Agent Notes</h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Add notes about this conversation..."
        />
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
  );
};

export default LiveChatPanel;