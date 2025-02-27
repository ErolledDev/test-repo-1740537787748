import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Bell, Check, Trash2, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'chat' | 'system' | 'alert';
}

const NotificationsPage: React.FC = () => {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New chat session',
      message: 'A visitor has started a new chat session.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      type: 'chat'
    },
    {
      id: '2',
      title: 'Keyword response updated',
      message: 'Your keyword response for "pricing" has been updated.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      read: false,
      type: 'system'
    },
    {
      id: '3',
      title: 'Widget deployed successfully',
      message: 'Your chat widget has been deployed to production.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      type: 'system'
    },
    {
      id: '4',
      title: 'Subscription expiring soon',
      message: 'Your subscription will expire in 7 days. Please renew to avoid service interruption.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      type: 'alert'
    },
    {
      id: '5',
      title: 'Chat session closed',
      message: 'A chat session has been closed by the visitor.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      read: true,
      type: 'chat'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Apply filters
  const filteredNotifications = notifications.filter(notification => {
    // Apply search filter
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    // Apply read filter
    const matchesRead = 
      readFilter === 'all' || 
      (readFilter === 'read' && notification.read) || 
      (readFilter === 'unread' && !notification.read);
    
    return matchesSearch && matchesType && matchesRead;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <div className="p-2 text-white bg-green-500 rounded-full"><Bell className="w-4 h-4" /></div>;
      case 'alert':
        return <div className="p-2 text-white bg-red-500 rounded-full"><Bell className="w-4 h-4" /></div>;
      case 'system':
        return <div className="p-2 text-white bg-blue-500 rounded-full"><Bell className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 text-white bg-gray-500 rounded-full"><Bell className="w-4 h-4" /></div>;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(timestamp, 'h:mm a');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM d, yyyy');
    }
  };

  return (
    <Layout title="Notifications">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            <p className="text-gray-600">
              Stay updated with important events and alerts
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </button>
            
            <button
              onClick={clearAllNotifications}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </button>
          </div>
        </div>
        
        <div className="mb-6 bg-white rounded-lg shadow">
          <div className="flex flex-col p-4 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="flex space-x-4">
              <div>
                <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 sr-only">
                  Type
                </label>
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-gray-400" />
                  <select
                    id="typeFilter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="chat">Chat</option>
                    <option value="system">System</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="readFilter" className="block text-sm font-medium text-gray-700 sr-only">
                  Status
                </label>
                <select
                  id="readFilter"
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Bell className="w-12 h-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-gray-500">
                {notifications.length === 0 
                  ? "You don't have any notifications yet" 
                  : "No notifications match your filters"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                >
                  <div className="flex items-start p-4">
                    <div className="flex-shrink-0 mr-4">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex ml-4 space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-indigo-600 rounded hover:bg-indigo-100"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-600 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;