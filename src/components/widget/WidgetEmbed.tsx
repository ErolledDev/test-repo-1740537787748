import React, { useState, useEffect } from 'react';
import { Copy, Check, Code } from 'lucide-react';

interface WidgetEmbedProps {
  userId: string;
  customDomain?: string;
}

const WidgetEmbed: React.FC<WidgetEmbedProps> = ({ 
  userId, 
  customDomain = 'widgeto.netlify.app' 
}) => {
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState<'script' | 'iframe'>('script');
  
  const getScriptCode = () => {
    return `<script src="https://${customDomain}/widget.js"></script>
<script>
  new BusinessChatPlugin({
    uid: '${userId}'
  });
</script>`;
  };

  const getIframeCode = () => {
    return `<iframe 
  src="https://${customDomain}/embed/${userId}" 
  width="100%" 
  height="600px" 
  frameborder="0"
  allow="microphone"
></iframe>`;
  };

  const getCode = () => {
    return embedType === 'script' ? getScriptCode() : getIframeCode();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Embed Widget</h2>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setEmbedType('script')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                embedType === 'script'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              JavaScript Snippet
            </button>
            <button
              onClick={() => setEmbedType('iframe')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                embedType === 'iframe'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Iframe Embed
            </button>
          </div>
          
          <p className="text-gray-600 mb-2">
            {embedType === 'script' 
              ? 'Add this code to your website to integrate the chat widget:' 
              : 'Use this iframe code to embed the chat widget in a specific area:'}
          </p>
          
          <div className="p-4 overflow-x-auto font-mono text-sm bg-gray-100 rounded">
            <pre>{getCode()}</pre>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleCopyCode}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-md">
          <h3 className="text-sm font-medium mb-2">Installation Tips</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {embedType === 'script' ? (
              <>
                <li>Add this code just before the closing <code>&lt;/body&gt;</code> tag</li>
                <li>The widget will automatically load when your page loads</li>
              </>
            ) : (
              <>
                <li>Add this iframe where you want the chat widget to appear</li>
                <li>You can adjust the width and height as needed</li>
              </>
            )}
            <li>You can customize the appearance in Widget Settings</li>
            <li>Test the widget after installation to ensure it works correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WidgetEmbed;