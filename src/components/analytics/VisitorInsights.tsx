import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Clock, MessageSquare } from 'lucide-react';

interface VisitorInsightsProps {
  visitorData: {
    newVisitors: number;
    returningVisitors: number;
    averageSessionDuration: number;
    conversionRate: number;
    topReferrers: Array<{ name: string; value: number }>;
    deviceBreakdown: Array<{ name: string; value: number }>;
  };
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const VisitorInsights: React.FC<VisitorInsightsProps> = ({ visitorData }) => {
  const { 
    newVisitors, 
    returningVisitors, 
    averageSessionDuration, 
    conversionRate,
    topReferrers,
    deviceBreakdown
  } = visitorData;

  const totalVisitors = newVisitors + returningVisitors;
  const newVisitorsPercentage = totalVisitors > 0 ? Math.round((newVisitors / totalVisitors) * 100) : 0;
  
  const visitorTypeData = [
    { name: 'New Visitors', value: newVisitors },
    { name: 'Returning Visitors', value: returningVisitors }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Visitor Insights</h3>
      </div>
      
      <div className="p-6">
        {/* Visitor Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-indigo-100 rounded-full">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">Total Visitors</p>
                <p className="text-2xl font-semibold text-indigo-900">{totalVisitors}</p>
                <p className="text-xs text-indigo-700">
                  {newVisitorsPercentage}% new visitors
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Avg. Session</p>
                <p className="text-2xl font-semibold text-green-900">{averageSessionDuration}m</p>
                <p className="text-xs text-green-700">
                  Time spent on site
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-yellow-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Conversion Rate</p>
                <p className="text-2xl font-semibold text-yellow-900">{conversionRate}%</p>
                <p className="text-xs text-yellow-700">
                  Visitors who start a chat
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Device Breakdown */}
          <div>
            <h4 className="mb-4 text-base font-medium text-gray-700">Device Breakdown</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Visitors']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top Referrers */}
          <div>
            <h4 className="mb-4 text-base font-medium text-gray-700">Top Referrers</h4>
            <div className="space-y-4">
              {topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{referrer.name}</span>
                      <span className="text-sm text-gray-500">{referrer.value}</span>
                    </div>
                    <div className="w-full h-1 mt-1 bg-gray-200 rounded-full">
                      <div 
                        className="h-1 rounded-full" 
                        style={{ 
                          width: `${(referrer.value / Math.max(...topReferrers.map(r => r.value))) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorInsights;