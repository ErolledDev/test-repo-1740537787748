import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import KeywordMetrics from '../components/analytics/KeywordMetrics';
import { getCurrentUser } from '../lib/supabase';
import { getAnalyticsData } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clock, MessageSquare, Users, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    totalChats: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    chatDuration: 0,
    visitorSatisfaction: 0,
    keywordMatches: {},
    dailyChats: [0, 0, 0, 0, 0, 0, 0],
    responseTimeByDay: [0, 0, 0, 0, 0, 0, 0]
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
        
        // Fetch analytics data
        const data = await getAnalyticsData(user.id, timeRange);
        
        // Generate mock data for charts
        const mockDailyChats = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 5);
        const mockResponseTimes = Array.from({ length: 7 }, () => Math.random() * 3 + 7);
        
        setAnalyticsData({
          totalChats: data.total_chats || 0,
          totalMessages: data.total_messages || 0,
          averageResponseTime: data.average_response_time || 0,
          chatDuration: data.chat_duration || 0,
          visitorSatisfaction: data.visitor_satisfaction || 0,
          keywordMatches: data.keyword_matches || {},
          dailyChats: mockDailyChats,
          responseTimeByDay: mockResponseTimes
        });
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
          <AnalyticsCard
            title="Total Chats"
            value={analyticsData.totalChats}
            icon={<MessageSquare className="w-6 h-6" />}
            color="bg-blue-500"
          />
          
          <AnalyticsCard
            title="Total Messages"
            value={analyticsData.totalMessages}
            icon={<BarChart3 className="w-6 h-6" />}
            color="bg-purple-500"
          />
          
          <AnalyticsCard
            title="Avg. Response Time"
            value={`${analyticsData.averageResponseTime}s`}
            icon={<Clock className="w-6 h-6" />}
            color="bg-yellow-500"
          />
          
          <AnalyticsCard
            title="Satisfaction"
            value={`${analyticsData.visitorSatisfaction}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="bg-green-500"
            trend={{ value: 5, isPositive: true }}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          <AnalyticsChart
            title="Daily Chats"
            data={analyticsData.dailyChats}
            labels={getLabels()}
            color="#4F46E5"
            height={240}
          />
          
          <AnalyticsChart
            title="Response Time (seconds)"
            data={analyticsData.responseTimeByDay}
            labels={getLabels()}
            color="#EAB308"
            height={240}
          />
        </div>
        
        {/* Keyword Matches */}
        <div className="mb-6">
          <KeywordMetrics keywordMatches={analyticsData.keywordMatches} />
        </div>
        
        {/* Additional Metrics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chat Duration */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Chat Duration</h3>
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