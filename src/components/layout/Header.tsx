import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, X, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/supabase';

interface HeaderProps {
  title: string;
  userName?: string;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  userName = 'User',
  notificationCount = 0
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock notifications for demo
  const notifications = [
    {
      id: '1',
      title: 'New chat session',
      message: 'A visitor has started a new chat session.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'Keyword response updated',
      message: 'Your keyword response for "pricing" has been updated.',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'Widget deployed successfully',
      message: 'Your chat widget has been deployed to production.',
      time: '2 days ago',
      read: true
    }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div ref={notificationsRef} className="absolute right-0 z-10 w-80 mt-2 overflow-hidden bg-white rounded-md shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-2 text-center border-t">
                <Link 
                  to="/notifications" 
                  className="block w-full px-4 py-2 text-sm font-medium text-indigo-600 rounded hover:bg-indigo-50"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <div className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-full">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{userName}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showProfileMenu && (
            <div ref={profileMenuRef} className="absolute right-0 z-10 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-lg">
              <div className="py-1">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <Link 
                  to="/widget-settings" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;