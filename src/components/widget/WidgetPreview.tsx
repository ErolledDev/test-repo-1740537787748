import React from 'react';
import { WidgetSettings } from '../../types';
import ChatWidget from './ChatWidget';

interface WidgetPreviewProps {
  settings: WidgetSettings;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ settings }) => {
  return (
    <div className="relative w-full h-[500px] border border-gray-200 rounded-lg bg-gray-100 overflow-hidden">
      <ChatWidget 
        settings={settings} 
        userId={settings.user_id} 
        isDemo={true}
      />
    </div>
  );
};

export default WidgetPreview;