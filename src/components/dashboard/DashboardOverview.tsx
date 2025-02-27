import React from 'react';
import { MessageSquare, Users, Clock, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardOverviewProps {
  totalChats: number;
  totalMessages: number;
  averageResponseTime: number;
  activeChats: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  totalChats,
  totalMessages,
  averageResponseTime,
  activeChats,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Chats */}
      <Link to="/chat-history" className="block">
        <div className="p-6 bg-white rounded-lg shadow transition-transform hover:transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 text-white bg-blue-500 rounded-full">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Chats</p>
              <p className="text-2xl font-semibold text-gray-900">{totalChats}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Active Chats */}
      <Link to="/live-chat" className="block">
        <div className="p-6 bg-white rounded-lg shadow transition-transform hover:transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 text-white bg-green-500 rounded-full">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Chats</p>
              <p className="text-2xl font-semibold text-gray-900">{activeChats}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Average Response Time */}
      <Link to="/analytics" className="block">
        <div className="p-6 bg-white rounded-lg shadow transition-transform hover:transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 text-white bg-yellow-500 rounded-full">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">{averageResponseTime}s</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Total Messages */}
      <Link to="/analytics" className="block">
        <div className="p-6 bg-white rounded-lg shadow transition-transform hover:transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 text-white bg-purple-500 rounded-full">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMessages}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DashboardOverview;