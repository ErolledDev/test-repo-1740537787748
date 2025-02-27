import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/supabase';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { MessageCircle } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
        
        if (hasCompletedOnboarding === 'true') {
          navigate('/dashboard');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/login');
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleOnboardingComplete = () => {
    // Mark onboarding as completed
    const saveCompletion = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
        }
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
    };
    
    saveCompletion();
    navigate('/dashboard');
  };

  const handleSkipOnboarding = () => {
    // Mark onboarding as completed but skipped
    const saveSkipped = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
          localStorage.setItem(`onboarding_skipped_${user.id}`, 'true');
        }
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
    };
    
    saveSkipped();
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-indigo-600 rounded-full">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Chat Widget Platform</h1>
          <p className="mt-2 text-gray-600">Let's get your chat widget set up in just a few minutes.</p>
        </div>
        
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onSkip={handleSkipOnboarding} 
        />
      </div>
    </div>
  );
};

export default OnboardingPage;