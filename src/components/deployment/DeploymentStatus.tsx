import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, RefreshCw } from 'lucide-react';
import { getDeploymentStatus } from '../../lib/deploy';

interface DeploymentStatusProps {
  deployId: string;
  deployUrl: string;
  claimUrl?: string;
  onRedeploy: () => void;
  isRedeploying: boolean;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  deployId,
  deployUrl,
  claimUrl,
  onRedeploy,
  isRedeploying
}) => {
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      setChecking(true);
      try {
        const status = await getDeploymentStatus(deployId);
        if (status.success && status.claimed) {
          setClaimed(true);
        }
      } catch (error) {
        console.error('Error checking deployment status:', error);
      } finally {
        setChecking(false);
      }
    };
    
    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [deployId]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(deployUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Deployment Status</h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="font-medium text-gray-900">Deployed Successfully</span>
          {checking && (
            <RefreshCw className="w-4 h-4 ml-2 text-gray-500 animate-spin" />
          )}
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Your widget is live at:</p>
          <div className="flex items-center">
            <a 
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 mr-2 truncate"
            >
              {deployUrl}
              <ExternalLink className="w-4 h-4 inline-block ml-1" />
            </a>
            <button
              onClick={handleCopyUrl}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Copy URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {claimUrl && !claimed && (
          <div className="bg-yellow-50 p-4 rounded-md mb-6">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Claim Your Netlify Site</h4>
            <p className="text-sm text-yellow-700 mb-2">
              To manage your deployment and set up a custom domain, claim your Netlify site:
            </p>
            <a 
              href={claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
            >
              Claim Site on Netlify
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        )}
        
        <button
          onClick={onRedeploy}
          disabled={isRedeploying}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isRedeploying ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Redeploying...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Redeploy Widget
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeploymentStatus;