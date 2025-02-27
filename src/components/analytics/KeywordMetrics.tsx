import React from 'react';

interface KeywordMetricsProps {
  keywordMatches: Record<string, number>;
}

const KeywordMetrics: React.FC<KeywordMetricsProps> = ({ keywordMatches }) => {
  // Convert to array and sort by count (descending)
  const keywordArray = Object.entries(keywordMatches)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count);
  
  // Find the maximum count for scaling
  const maxCount = Math.max(...keywordArray.map(item => item.count), 1);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Keyword Matches</h3>
      
      {keywordArray.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No keyword data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {keywordArray.map(({ keyword, count }) => (
            <div key={keyword} className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{keyword}</span>
                  <span className="text-sm font-semibold text-indigo-600">{count}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-indigo-500 rounded-full" 
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordMetrics;