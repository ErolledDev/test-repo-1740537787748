import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WidgetSettingsPage from './pages/WidgetSettingsPage';
import KeywordResponsesPage from './pages/KeywordResponsesPage';
import ChatHistoryPage from './pages/ChatHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LiveChatPage from './pages/LiveChatPage';
import HelpCenterPage from './pages/HelpCenterPage';
import NotificationsPage from './pages/NotificationsPage';
import DeploymentPage from './pages/DeploymentPage';
import ProfilePage from './pages/ProfilePage';
import { getCurrentUser } from './lib/supabase';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/widget-settings" element={user ? <WidgetSettingsPage /> : <Navigate to="/login" />} />
        <Route path="/keyword-responses" element={user ? <KeywordResponsesPage /> : <Navigate to="/login" />} />
        <Route path="/chat-history" element={user ? <ChatHistoryPage /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={user ? <AnalyticsPage /> : <Navigate to="/login" />} />
        <Route path="/live-chat" element={user ? <LiveChatPage /> : <Navigate to="/login" />} />
        <Route path="/help-center" element={user ? <HelpCenterPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <NotificationsPage /> : <Navigate to="/login" />} />
        <Route path="/deployment" element={user ? <DeploymentPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;