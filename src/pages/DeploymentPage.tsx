import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { getCurrentUser } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Code, Upload, Check, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import WidgetCodeGenerator from '../components/widget/WidgetCodeGenerator';

const DeploymentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState<'not_deployed' | 'deploying' | 'deployed'>('not_deployed');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setUserId(user.id);
        
        // In a real app, you would fetch deployment status from your API
        // For now, we'll simulate it
        setTimeout(() => {
          setDeploymentStatus('not_deployed');
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching deployment data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setError(null);
    
    try {
      // Simulate deployment process
      setDeploymentStatus('deploying');
      
      // In a real app, this would be an API call to your deployment service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setDeploymentStatus('deployed');
      setDeploymentUrl('https://your-widget-name.netlify.app');
    } catch (error) {
      console.error('Deployment error:', error);
      setError('Failed to deploy widget. Please try again.');
      setDeploymentStatus('not_deployed');
    } finally {
      setIsDeploying(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Deployment" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Deployment" userName={userName}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Widget Deployment</h2>
          <p className="text-gray-600">
            Deploy your chat widget to make it available on your website.
          </p>
        </div>
        
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Deployment Status */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Deployment Status</h3>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 mr-2 rounded-full ${
                  deploymentStatus === 'not_deployed' ? 'bg-gray-400' :
                  deploymentStatus === 'deploying' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}></div>
                <span className="font-medium text-gray-700">
                  {deploymentStatus === 'not_deployed' ? 'Not Deployed' :
                   deploymentStatus === 'deploying' ? 'Deploying...' :
                   'Deployed'}
                </span>
              </div>
              
              {deploymentStatus === 'deployed' && deploymentUrl && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-600">Your widget is live at:</p>
                  <div className="flex items-center">
                    <a 
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      {deploymentUrl}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(deploymentUrl);
                      }}
                      className="p-1 ml-2 text-gray-500 hover:text-gray-700"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleDeploy}
              disabled={isDeploying || deploymentStatus === 'deploying'}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isDeploying || deploymentStatus === 'deploying' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : deploymentStatus === 'deployed' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Redeploy Widget
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Deploy Widget
                </>
              )}
            </button>
          </div>
          
          {/* Deployment Settings */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Deployment Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  id="domain"
                  placeholder="widget.yourdomain.com"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to use the default domain.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable_ssl"
                  checked
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="enable_ssl" className="block ml-2 text-sm font-medium text-gray-700">
                  Enable SSL (HTTPS)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto_deploy"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="auto_deploy" className="block ml-2 text-sm font-medium text-gray-700">
                  Auto-deploy on settings change
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Integration Code */}
        <div className="p-6 mt-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Integration Code</h3>
          <p className="mb-4 text-gray-600">
            Add this code to your website to display the chat widget:
          </p>
          
          <WidgetCodeGenerator 
            userId={userId} 
            customDomain={deploymentUrl ? new URL(deploymentUrl).hostname : undefined}
          />
        </div>
        
        {/* Deployment History */}
        <div className="p-6 mt-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Deployment History</h3>
          
          {deploymentStatus === 'not_deployed' ? (
            <div className="text-center py-6 text-gray-500">
              <p>No deployment history available</p>
            </div>
          ) : (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date().toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1.0.0
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DeploymentPage;