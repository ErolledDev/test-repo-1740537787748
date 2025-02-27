import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MessageSquare, Clock, ThumbsUp } from 'lucide-react';

interface ConversationMetricsProps {
  metrics: {
    totalConversations: number;
    averageResponseTime: number;
    satisfactionRate: number;
    conversationsByDay: Array<{ name: string; value: number }>;
    responseTimeByDay: Array<{ name: string; value: number }>;
    topIntents: Array<{ name: string; count: number }>;
  };
}

const ConversationMetrics: React.FC<ConversationMetricsProps> = ({ metrics }) => {
  const { 
    totalConversations, 
    averageResponseTime, 
    satisfactionRate,
    conversationsByDay,
    responseTimeByDay,
    topIntents
  } = metrics;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Conversation Metrics</h3>
      </div>
      
      <div className="p-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-blue-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total Conversations</p>
                <p className="text-2xl font-semibold text-blue-900">{totalConversations}</p>
                <p className="text-xs text-blue-700">
                  Across all channels
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Avg. Response Time</p>
                <p className="text-2xl font-semibold text-purple-900">{averageResponseTime}s</p>
                <p className="text-xs text-purple-700">
                  First response time
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-green-100 rounded-full">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Satisfaction Rate</p>
                <p className="text-2xl font-semibold text-green-900">{satisfactionRate}%</p>
                <p className="text-xs text-green-700">
                  Based on user feedback
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
          {/* Conversations by Day */}
          <div>
            <h4 className="mb-4 text-base font-medium text-gray-700">Conversations by Day</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={conversationsByDay}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Conversations']} />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Response Time by Day */}
          <div>
            <h4 className="mb-4 text-base font-medium text-gray-700">Response Time by Day</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={responseTimeByDay}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}s`, 'Response Time']} />
                  <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Top Intents */}
        <div>
          <h4 className="mb-4 text-base font-medium text-gray-700">Top Conversation Intents</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topIntents.map((intent, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{intent.name}</span>
                  <span className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                    {intent.count}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-indigo-600 rounded-full" 
                    style={{ width: `${(intent.count / Math.max(...topIntents.map(i => i.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationMetrics;