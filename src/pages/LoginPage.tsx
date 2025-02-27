import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { MessageCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left side - Branding */}
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 text-white bg-indigo-600 rounded-full">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Chat Widget Platform</h1>
            <p className="mb-6 text-gray-600">
              Engage with your website visitors in real-time with our customizable chat widget.
            </p>
            <div className="p-4 mt-4 text-left bg-white rounded-lg shadow">
              <h3 className="mb-2 text-lg font-medium text-gray-900">Key Features</h3>
              <ul className="pl-5 space-y-1 text-sm text-gray-600 list-disc">
                <li>Customizable chat widget</li>
                <li>Keyword-based responses</li>
                <li>Real-time chat monitoring</li>
                <li>Detailed analytics</li>
                <li>Live agent takeover</li>
              </ul>
            </div>
          </div>
          
          {/* Right side - Login Form */}
          <div className="flex items-center justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;