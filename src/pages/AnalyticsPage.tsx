import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { getCurrentUser } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clock, MessageSquare, Users, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [timeRange, setTimeRange] = useState('7d');
  const navigate = useNavigate();

  // Mock data for analytics
  const analyticsData = {
    totalChats: 156,
    totalMessages: 1243,
    averageResponseTime: 8.5,
    chatDuration: 4.2,
    visitorSatisfaction: 92,
    keywordMatches: {
      'pricing': 42,
      'support': 38,
      'features': 27,
      'account': 21,
      'billing': 18,
      'other': 34
    },
    dailyChats: [12, 18, 15, 22, 19, 24, 16, 20, 25, 17, 21, 23, 19, 26],
    responseTimeByDay: [9.2, 8.7, 8.1, 7.9, 8.3, 8.6, 8.2, 7.8, 8.0, 8.4, 8.5, 8.3, 8.1, 7.7]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUserName(user.email?.split('@')[0] || 'User');
        
        // In a real app, you would fetch analytics data here
        // const analytics = await getAnalyticsData(user.id, timeRange);
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, timeRange]);

  // Helper function to get labels for charts based on time range
  const getLabels = () => {
    const today = new Date();
    const labels = [];
    
    if (timeRange === '7d') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
    } else if (timeRange === '14d') {
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (timeRange === '30d') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }
    
    return labels;
  };

  // Get data for the selected time range
  const getChartData = () => {
    const labels = getLabels();
    let chatData = [];
    let responseTimeData = [];
    
    if (timeRange === '7d') {
      chatData = analyticsData.dailyChats.slice(-7);
      responseTimeData = analyticsData.responseTimeByDay.slice(-7);
    } else if (timeRange === '14d') {
      chatData = analyticsData.dailyChats;
      responseTimeData = analyticsData.responseTimeByDay;
    } else if (timeRange === '30d') {
      // In a real app, you would have 30 days of data
      // Here we're just repeating the data we have
      chatData = [...analyticsData.dailyChats, ...analyticsData.dailyChats.slice(0, 16)];
      responseTimeData = [...analyticsData.responseTimeByDay, ...analyticsData.responseTimeByDay.slice(0, 16)];
    }
    
    return {
      labels,
      chatData,
      responseTimeData
    };
  };

  const { labels, chatData, responseTimeData } = getChartData();

  // Calculate the maximum value for the chat data to set the chart height
  const maxChatValue = Math.max(...chatData);
  const maxResponseTimeValue = Math.max(...responseTimeData);

  if (loading) {
    return (
      <Layout title="Analytics" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics" userName={userName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
            <p className="text-gray-600">
              Track and analyze your chat widget performance.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="7d">Last 7 Days</option>
              <option value="14d">Last 14 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Chats */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 text-white bg-blue-500 rounded-full">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Chats</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalChats}</p>
              </div>
            </div>
          </div>

          {/* Total Messages */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 text-white bg-purple-500 rounded-full">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalMessages}</p>
              </div>
            </div>
          </div>

          {/* Average Response Time */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 text-white bg-yellow-500 rounded-full">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.averageResponseTime}s</p>
              </div>
            </div>
          </div>

          {/* Visitor Satisfaction */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 text-white bg-green-500 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Satisfaction</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.visitorSatisfaction}%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          {/* Daily Chats Chart */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Daily Chats</h3>
            <div className="h-64">
              <div className="flex items-end h-52 space-x-2">
                {chatData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ 
                        height: `${(value / maxChatValue) * 100}%`,
                        minHeight: '4px'
                      }}
                    ></div>
                    <span className="mt-2 text-xs text-gray-500">{labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Response Time Chart */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Response Time (seconds)</h3>
            <div className="h-64">
              <div className="flex items-end h-52 space-x-2">
                {responseTimeData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-yellow-500 rounded-t"
                      style={{ 
                        height: `${(value / maxResponseTimeValue) * 100}%`,
                        minHeight: '4px'
                      }}
                    ></div>
                    <span className="mt-2 text-xs text-gray-500">{labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Keyword Matches */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Keyword Matches</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(analyticsData.keywordMatches).map(([keyword, count]) => (
              <div key={keyword} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{keyword}</span>
                    <span className="text-sm font-semibold text-indigo-600">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-indigo-500 rounded-full" 
                      style={{ 
                        width: `${(count / Math.max(...Object.values(analyticsData.keywordMatches))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Metrics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chat Duration */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Average Chat Duration</h3>
            <div className="flex items-center">
              <div className="p-4 text-white bg-indigo-100 rounded-full">
                <Clock className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-gray-900">{analyticsData.chatDuration} min</p>
                <p className="text-sm text-gray-500">Average time spent in conversation</p>
              </div>
            </div>
          </div>
          
          {/* Visitor Engagement */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Visitor Engagement</h3>
            <div className="flex items-center">
              <div className="p-4 text-white bg-green-100 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-gray-900">78%</p>
                <p className="text-sm text-gray-500">Of visitors engage with the chat widget</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;