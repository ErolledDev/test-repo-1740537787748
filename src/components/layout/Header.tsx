import React from 'react';
import { Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ title, userName = 'User' }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-full">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;