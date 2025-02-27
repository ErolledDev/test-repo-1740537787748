import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  userRole?: 'user' | 'admin' | 'reseller';
  userName?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  userRole = 'user',
  userName = 'User'
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} userName={userName} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;