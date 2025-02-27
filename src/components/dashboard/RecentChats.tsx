import React from 'react';
import { format } from 'date-fns';
import { ChatSession } from '../../types';
import { MessageSquare, User, Clock } from 'lucide-react';

interface RecentChatsProps {
  chats: ChatSession[];
  onViewChat: (chatId: string) => void;
}

const RecentChats: React.FC<RecentChatsProps> = ({ chats, onViewChat }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Recent Chats</h2>
        <a href="/chat-history" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          View all
        </a>
      </div>
      
      <div className="divide-y divide-gray-200">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6">
            <MessageSquare className="w-12 h-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No recent chats</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div key={chat.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 text-white bg-indigo-100 rounded-full">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {chat.visitor_name || `Visitor ${chat.visitor_id.substring(0, 8)}`}
                    </h3>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {format(new Date(chat.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onViewChat(chat.id)}
                  className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200"
                >
                  View
                </button>
              </div>
              
              <div className="mt-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  chat.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : chat.status === 'agent_assigned' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {chat.status === 'active' 
                    ? 'Active' 
                    : chat.status === 'agent_assigned' 
                    ? 'Agent Assigned' 
                    : 'Closed'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentChats;