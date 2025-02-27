import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Settings, MessageSquare, Upload } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Chat Widget Platform',
      description: 'Let\'s set up your chat widget in a few simple steps.',
      icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
      component: (
        <div className="text-center">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
            alt="Chat Widget Platform" 
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
          <p className="text-gray-600 mb-6">
            Our platform helps you engage with your website visitors in real-time. 
            Follow this quick setup guide to get started with your customized chat widget.
          </p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                1
              </div>
              <p className="ml-3 text-left text-gray-700">Customize your widget appearance</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                2
              </div>
              <p className="ml-3 text-left text-gray-700">Set up automated keyword responses</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                3
              </div>
              <p className="ml-3 text-left text-gray-700">Deploy your widget to your website</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'widget-settings',
      title: 'Customize Your Widget',
      description: 'Personalize how your chat widget looks and behaves.',
      icon: <Settings className="w-6 h-6 text-indigo-600" />,
      component: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                placeholder="Your Business Name"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="primary_color"
                  name="primary_color"
                  defaultValue="#4F46E5"
                  className="w-10 h-10 p-0 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  defaultValue="#4F46E5"
                  name="primary_color_text"
                  className="block w-full ml-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="welcome_message" className="block text-sm font-medium text-gray-700 mb-1">
              Welcome Message
            </label>
            <textarea
              id="welcome_message"
              name="welcome_message"
              rows={3}
              placeholder="Hello! How can I help you today?"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="bg-indigo-50 p-4 rounded-md">
            <p className="text-sm text-indigo-700">
              <strong>Tip:</strong> You can further customize your widget in the Widget Settings page after completing this setup.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'keyword-responses',
      title: 'Set Up Keyword Responses',
      description: 'Create automated responses for common questions.',
      icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
      component: (
        <div>
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-4">
              <div className="p-4 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                      Keyword
                    </label>
                    <input
                      type="text"
                      id="keyword"
                      name="keyword"
                      placeholder="pricing"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="synonyms" className="block text-sm font-medium text-gray-700 mb-1">
                      Synonyms (comma separated)
                    </label>
                    <input
                      type="text"
                      id="synonyms"
                      name="synonyms"
                      placeholder="cost, price, plans"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-1">
                  Response
                </label>
                <textarea
                  id="response"
                  name="response"
                  rows={3}
                  placeholder="Our pricing starts at $9.99/month for the basic plan. You can find more details on our pricing page at example.com/pricing."
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
            >
              + Add Another Keyword Response
            </button>
          </div>
          <div className="bg-indigo-50 p-4 rounded-md">
            <p className="text-sm text-indigo-700">
              <strong>Tip:</strong> You can add more keyword responses and fine-tune them in the Keyword Responses page later.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'deployment',
      title: 'Deploy Your Widget',
      description: 'Get the code to add your widget to your website.',
      icon: <Upload className="w-6 h-6 text-indigo-600" />,
      component: (
        <div>
          <div className="bg-gray-100 p-4 rounded-md mb-6 font-mono text-sm overflow-x-auto">
            <pre>{`<script src="https://widgeto.netlify.app/widget.js"></script>
<script>
  new BusinessChatPlugin({
    uid: 'your-user-id'
  });
</script>`}</pre>
          </div>
          <div className="mb-6">
            <button
              type="button"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Copy Code
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Installation Instructions</h4>
              <ol className="list-decimal pl-5 text-sm text-indigo-700 space-y-1">
                <li>Copy the code above</li>
                <li>Paste it just before the closing <code>&lt;/body&gt;</code> tag on your website</li>
                <li>Save and publish your website</li>
                <li>Your chat widget will now appear on your website</li>
              </ol>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> You can also deploy your widget through our deployment page for more options and custom domains.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Setup Complete!',
      description: 'You\'re all set to start chatting with your visitors.',
      icon: <Check className="w-6 h-6 text-indigo-600" />,
      component: (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Congratulations!</h3>
          <p className="text-gray-600 mb-6">
            Your chat widget is now set up and ready to use. You can further customize it and manage your conversations from the dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Customize your widget further</li>
                <li>• Add more keyword responses</li>
                <li>• Deploy to your website</li>
                <li>• Monitor conversations</li>
              </ul>
            </div>
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <a href="#" className="text-indigo-600 hover:text-indigo-800">Documentation</a></li>
                <li>• <a href="#" className="text-indigo-600 hover:text-indigo-800">Video Tutorials</a></li>
                <li>• <a href="#" className="text-indigo-600 hover:text-indigo-800">API Reference</a></li>
                <li>• <a href="#" className="text-indigo-600 hover:text-indigo-800">Support</a></li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      if (!completed.includes(steps[currentStep].id)) {
        setCompleted([...completed, steps[currentStep].id]);
      }
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Progress bar */}
      <div className="bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-900">{currentStepData.title}</h2>
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{currentStepData.description}</p>
        <div className="relative">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : completed.includes(step.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {completed.includes(step.id) ? (
                  <Check className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        {currentStepData.component}
      </div>

      {/* Navigation buttons */}
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        <div>
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Skip Setup
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {currentStep < steps.length - 1 ? (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            'Complete Setup'
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingWizard;