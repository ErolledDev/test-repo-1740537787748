import React from 'react';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';

interface DeploymentHistoryItem {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'in_progress';
  url?: string;
  version?: string;
}

interface DeploymentHistoryProps {
  deployments: DeploymentHistoryItem[];
}

const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ deployments }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Deployment History</h3>
      </div>
      
      <div className="p-6">
        {deployments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No deployment history available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deployments.map((deployment) => (
                  <tr key={deployment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(deployment.timestamp), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        deployment.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : deployment.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {deployment.status === 'success' 
                          ? 'Success' 
                          : deployment.status === 'in_progress'
                          ? 'In Progress'
                          : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deployment.version || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deployment.url ? (
                        <a 
                          href={deployment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          View
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentHistory;