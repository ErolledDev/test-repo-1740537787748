import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface WidgetScriptProps {
  userId: string;
}

const WidgetScript: React.FC<WidgetScriptProps> = ({ userId }) => {
  const [copied, setCopied] = useState(false);
  
  const scriptCode = `<script src="https://mydomain123.netlify.app/widget.js"></script>
<script>
  new BusinessChatPlugin({
    uid: '${userId}'
  });
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Widget Integration</h2>
      </div>
      <div className="p-6">
        <p className="mb-4 text-gray-600">
          Add the following code to your website to integrate the chat widget:
        </p>
        <div className="p-4 overflow-x-auto font-mono text-sm bg-gray-100 rounded">
          <pre>{scriptCode}</pre>
        </div>
        <button 
          onClick={handleCopyCode}
          className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
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
    </div>
  );
};

export default WidgetScript;