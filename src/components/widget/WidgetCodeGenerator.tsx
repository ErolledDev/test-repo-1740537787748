import React, { useState } from 'react';
import { Copy, Check, Code, Download } from 'lucide-react';

interface WidgetCodeGeneratorProps {
  userId: string;
  customDomain?: string;
}

const WidgetCodeGenerator: React.FC<WidgetCodeGeneratorProps> = ({ 
  userId, 
  customDomain = 'widgeto.netlify.app' 
}) => {
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customOptions, setCustomOptions] = useState({
    position: 'bottom-right',
    autoOpen: false,
    delay: 3,
    hideOnMobile: false
  });
  
  const getScriptCode = () => {
    let scriptCode = `<script src="https://${customDomain}/widget.js"></script>
<script>
  new BusinessChatPlugin({
    uid: '${userId}'`;
    
    if (showAdvanced) {
      scriptCode += `,
    position: '${customOptions.position}'`;
      
      if (customOptions.autoOpen) {
        scriptCode += `,
    autoOpen: true,
    openDelay: ${customOptions.delay}`;
      }
      
      if (customOptions.hideOnMobile) {
        scriptCode += `,
    hideOnMobile: true`;
      }
    }
    
    scriptCode += `
  });
</script>`;
    
    return scriptCode;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getScriptCode());
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([getScriptCode()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'chat-widget-code.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCustomOptions({
        ...customOptions,
        [name]: checked
      });
    } else if (name === 'delay') {
      setCustomOptions({
        ...customOptions,
        [name]: parseInt(value) || 0
      });
    } else {
      setCustomOptions({
        ...customOptions,
        [name]: value
      });
    }
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
          <pre>{getScriptCode()}</pre>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
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
          <button 
            onClick={handleDownloadCode}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <Code className="w-4 h-4 mr-1" />
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          
          {showAdvanced && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Widget Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={customOptions.position}
                    onChange={handleOptionChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoOpen"
                    name="autoOpen"
                    checked={customOptions.autoOpen}
                    onChange={handleOptionChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoOpen" className="ml-2 block text-sm text-gray-700">
                    Auto-open chat widget
                  </label>
                </div>
                
                {customOptions.autoOpen && (
                  <div>
                    <label htmlFor="delay" className="block text-sm font-medium text-gray-700">
                      Open Delay (seconds)
                    </label>
                    <input
                      type="number"
                      id="delay"
                      name="delay"
                      min="0"
                      max="60"
                      value={customOptions.delay}
                      onChange={handleOptionChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hideOnMobile"
                    name="hideOnMobile"
                    checked={customOptions.hideOnMobile}
                    onChange={handleOptionChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hideOnMobile" className="ml-2 block text-sm text-gray-700">
                    Hide on mobile devices
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-md">
          <h3 className="text-sm font-medium mb-2">Installation Tips</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Add this code just before the closing <code>&lt;/body&gt;</code> tag</li>
            <li>The widget will automatically load when your page loads</li>
            <li>You can customize the appearance in Widget Settings</li>
            <li>Test the widget after installation to ensure it works correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WidgetCodeGenerator;