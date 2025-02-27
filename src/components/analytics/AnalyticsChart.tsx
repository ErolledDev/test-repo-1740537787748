import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsChartProps {
  title: string;
  data: number[];
  labels: string[];
  color: string;
  type?: 'bar' | 'line';
  height?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  labels,
  color,
  type = 'bar',
  height = 200
}) => {
  // Calculate the maximum value for scaling
  const maxValue = Math.max(...data, 1);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40">
          <BarChart3 className="w-12 h-12 text-gray-300" />
          <p className="mt-2 text-gray-500">No data available</p>
        </div>
      ) : (
        <div style={{ height: `${height}px` }} className="relative">
          <div className="flex items-end h-full space-x-1">
            {data.map((value, index) => {
              const heightPercent = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t transition-all duration-300 ease-in-out`}
                    style={{ 
                      height: `${heightPercent}%`, 
                      backgroundColor: color,
                      minHeight: value > 0 ? '4px' : '0'
                    }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                    {labels[index]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;