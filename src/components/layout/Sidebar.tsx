import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  History, 
  BarChart, 
  LogOut,
  Users,
  MessageCircle,
  HelpCircle,
  Bell,
  Upload
} from 'lucide-react';
import { signOut } from '../../lib/supabase';

interface SidebarProps {
  userRole?: 'user' | 'admin' | 'reseller';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole = 'user' }) => {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full min-h-screen p-3 bg-white shadow w-60">
      <div className="space-y-3">
        <div className="flex items-center justify-center p-3">
          <h2 className="text-xl font-bold text-indigo-600">Chat Widget</h2>
        </div>
        <div className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/live-chat"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <MessageCircle className="w-5 h-5" />
                <span>Live Chat</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/widget-settings"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <Settings className="w-5 h-5" />
                <span>Widget Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/keyword-responses"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <MessageSquare className="w-5 h-5" />
                <span>Keyword Responses</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chat-history"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <History className="w-5 h-5" />
                <span>Chat History</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <BarChart className="w-5 h-5" />
                <span>Analytics</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/deployment"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <Upload className="w-5 h-5" />
                <span>Deployment</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/help-center"
                className={({ isActive }) =>
                  `flex items-center p-2 space-x-3 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help Center</span>
              </NavLink>
            </li>
            
            {/* Admin and Reseller specific links */}
            {(userRole === 'admin' || userRole === 'reseller') && (
              <li>
                <NavLink
                  to={userRole === 'admin' ? '/secret/admin' : '/secret/reseller'}
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                    }`
                  }
                >
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full p-2 space-x-3 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;