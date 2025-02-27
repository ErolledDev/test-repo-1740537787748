import React from 'react';
import { WidgetSettings, KeywordResponse } from '../../types';
import ChatWidget from './ChatWidget';

interface WidgetPreviewProps {
  settings: WidgetSettings;
  keywordResponses?: KeywordResponse[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ settings, keywordResponses = [] }) => {
  return (
    <div className="relative w-full h-[500px] border border-gray-200 rounded-lg bg-gray-100 overflow-hidden">
      <div className="absolute top-4 left-4 text-sm text-gray-500">
        Preview Mode
      </div>
      <ChatWidget 
        settings={settings} 
        userId={settings.user_id} 
        keywordResponses={keywordResponses}
        isDemo={true}
      />
    </div>
  );
};

export default WidgetPreview;