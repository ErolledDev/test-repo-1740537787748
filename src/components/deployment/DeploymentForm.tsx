import React, { useState } from 'react';
import { Upload, RefreshCw, ExternalLink } from 'lucide-react';
import { deployWidget } from '../../lib/deploy';
import { WidgetSettings } from '../../types';

interface DeploymentFormProps {
  userId: string;
  widgetSettings: WidgetSettings;
  onDeployStart: () => void;
  onDeploySuccess: (result: any) => void;
  onDeployError: (error: string) => void;
  isDeploying: boolean;
}

const DeploymentForm: React.FC<DeploymentFormProps> = ({
  userId,
  widgetSettings,
  onDeployStart,
  onDeploySuccess,
  onDeployError,
  isDeploying
}) => {
  const [customDomain, setCustomDomain] = useState('');
  const [autoRedeploy, setAutoRedeploy] = useState(false);

  const handleDeploy = async () => {
    onDeployStart();
    
    try {
      const result = await deployWidget({
        userId,
        widgetSettings,
        provider: 'netlify'
      });
      
      if (result.success) {
        onDeploySuccess(result);
      } else {
        onDeployError(result.error || 'Deployment failed');
      }
    } catch (error: any) {
      onDeployError(error.message || 'Deployment failed');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Deploy Widget</h3>
      </div>
      
      <div className="p-6">
        <p className="mb-4 text-gray-600">
          Deploy your chat widget to make it available on your website.
        </p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="custom-domain" className="block text-sm font-medium text-gray-700">
              Custom Domain (Optional)
            </label>
            <input
              type="text"
              id="custom-domain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="widget.yourdomain.com"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isDeploying}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave blank to use the default Netlify domain.
            </p>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-redeploy"
              checked={autoRedeploy}
              onChange={(e) => setAutoRedeploy(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={isDeploying}
            />
            <label htmlFor="auto-redeploy" className="ml-2 block text-sm text-gray-700">
              Auto-redeploy when widget settings change
            </label>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <h4 className="text-sm font-medium text-blue-800 mb-2">What happens when you deploy?</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
            <li>Your widget will be deployed to Netlify</li>
            <li>You'll get a unique URL for your widget</li>
            <li>Your widget will be available for embedding on any website</li>
            <li>All your settings and keyword responses will be included</li>
          </ul>
        </div>
        
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isDeploying ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Deploy Widget
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeploymentForm;