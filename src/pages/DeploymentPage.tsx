import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import DeploymentForm from '../components/deployment/DeploymentForm';
import DeploymentStatus from '../components/deployment/DeploymentStatus';
import DeploymentHistory from '../components/deployment/DeploymentHistory';
import WidgetCodeGenerator from '../components/widget/WidgetCodeGenerator';
import { getCurrentUser } from '../lib/supabase';
import { getWidgetSettings } from '../lib/api';
import { WidgetSettings } from '../types';
import { useNavigate } from 'react-router-dom';
import { getDeploymentStatus } from '../lib/deploy';

const DeploymentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState('');
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<'not_deployed' | 'deploying' | 'deployed'>('not_deployed');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [claimUrl, setClaimUrl] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mock deployment history
  const deploymentHistory = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      status: 'success' as const,
      url: deploymentUrl || undefined,
      version: '1.0.0'
    }
  ];

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
        
        // Fetch widget settings
        const settings = await getWidgetSettings(user.id);
        setWidgetSettings(settings);
        
        // Check if already deployed (in a real app, this would be stored in the database)
        // For now, we'll simulate it with localStorage
        const savedDeploymentId = localStorage.getItem('widget_deployment_id');
        const savedDeploymentUrl = localStorage.getItem('widget_deployment_url');
        const savedClaimUrl = localStorage.getItem('widget_claim_url');
        
        if (savedDeploymentId && savedDeploymentUrl) {
          setDeploymentId(savedDeploymentId);
          setDeploymentUrl(savedDeploymentUrl);
          setClaimUrl(savedClaimUrl);
          setDeploymentStatus('deployed');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deployment data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleDeployStart = () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');
    setError(null);
  };

  const handleDeploySuccess = (result: any) => {
    setIsDeploying(false);
    setDeploymentStatus('deployed');
    setDeploymentId(result.deployId);
    setDeploymentUrl(result.deployUrl);
    setClaimUrl(result.claim_url);
    
    // Save deployment info (in a real app, this would be stored in the database)
    localStorage.setItem('widget_deployment_id', result.deployId);
    localStorage.setItem('widget_deployment_url', result.deployUrl);
    if (result.claim_url) {
      localStorage.setItem('widget_claim_url', result.claim_url);
    }
  };

  const handleDeployError = (errorMessage: string) => {
    setIsDeploying(false);
    setDeploymentStatus('not_deployed');
    setError(errorMessage);
  };

  const handleRedeploy = () => {
    if (widgetSettings) {
      handleDeployStart();
      // Use the existing deploymentId for redeployment
      import('../../lib/deploy').then(({ deployWidget }) => {
        deployWidget({
          userId,
          widgetSettings,
          provider: 'netlify',
          deployId: deploymentId || undefined
        }).then(result => {
          if (result.success) {
            handleDeploySuccess(result);
          } else {
            handleDeployError(result.error || 'Redeployment failed');
          }
        }).catch(error => {
          handleDeployError(error.message || 'Redeployment failed');
        });
      });
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
          {/* Deployment Status or Form */}
          {deploymentStatus === 'deployed' && deploymentUrl && deploymentId ? (
            <DeploymentStatus 
              deployId={deploymentId}
              deployUrl={deploymentUrl}
              claimUrl={claimUrl || undefined}
              onRedeploy={handleRedeploy}
              isRedeploying={isDeploying}
            />
          ) : (
            <DeploymentForm 
              userId={userId}
              widgetSettings={widgetSettings!}
              onDeployStart={handleDeployStart}
              onDeploySuccess={handleDeploySuccess}
              onDeployError={handleDeployError}
              isDeploying={isDeploying}
            />
          )}
          
          {/* Integration Code */}
          <div className="md:row-span-2">
            <WidgetCodeGenerator 
              userId={userId} 
              customDomain={deploymentUrl ? new URL(deploymentUrl).hostname : undefined}
            />
          </div>
        </div>
        
        {/* Deployment History */}
        {deploymentStatus === 'deployed' && (
          <div className="mt-6">
            <DeploymentHistory deployments={deploymentHistory} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeploymentPage;