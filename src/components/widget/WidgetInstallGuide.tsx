import React, { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

interface WidgetInstallGuideProps {
  userId: string;
}

const WidgetInstallGuide: React.FC<WidgetInstallGuideProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'wordpress' | 'shopify' | 'custom'>('wordpress');
  const [copied, setCopied] = useState(false);
  
  const getCode = () => {
    return `<script src="https://widgeto.netlify.app/widget.js"></script>
<script>
  new BusinessChatPlugin({
    uid: '${userId}'
  });
</script>`;
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
        <h2 className="text-lg font-medium text-gray-900">Installation Guide</h2>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('wordpress')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'wordpress'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              WordPress
            </button>
            <button
              onClick={() => setActiveTab('shopify')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'shopify'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shopify
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'custom'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Custom Website
            </button>
          </div>
        </div>
        
        {activeTab === 'wordpress' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">WordPress Installation</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  1
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Log in to your WordPress admin dashboard.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  2
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Go to <strong>Appearance</strong> &gt; <strong>Theme Editor</strong>.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  3
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Select your theme's <strong>footer.php</strong> file from the list on the right.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  4
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Paste the following code just before the closing <code>&lt;/body&gt;</code> tag:
                  </p>
                  <div className="mt-2 p-4 bg-gray-100 rounded font-mono text-sm overflow-x-auto">
                    <pre>{getCode()}</pre>
                  </div>
                  <button 
                    onClick={handleCopyCode}
                    className="mt-2 flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  5
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Click <strong>Update File</strong> to save your changes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  6
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Visit your website to verify that the chat widget appears.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-700">
                <strong>Alternative:</strong> You can also use a WordPress plugin like "Insert Headers and Footers" to add the code without editing theme files.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'shopify' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Shopify Installation</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  1
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Log in to your Shopify admin dashboard.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  2
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Go to <strong>Online Store</strong> &gt; <strong>Themes</strong>.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  3
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Find your current theme and click <strong>Actions</strong> &gt; <strong>Edit code</strong>.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  4
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    In the Layout folder, click on <strong>theme.liquid</strong>.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  5
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Paste the following code just before the closing <code>&lt;/body&gt;</code> tag:
                  </p>
                  <div className="mt-2 p-4 bg-gray-100 rounded font-mono text-sm overflow-x-auto">
                    <pre>{getCode()}</pre>
                  </div>
                  <button 
                    onClick={handleCopyCode}
                    className="mt-2 flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  6
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Click <strong>Save</strong> to apply your changes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> If you're using Shopify 2.0, you might need to edit the <strong>theme.liquid</strong> file in the Layout folder instead.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'custom' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Custom Website Installation</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  1
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Access your website's HTML files through your hosting provider or FTP client.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  2
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Open the HTML file(s) where you want the chat widget to appear (usually <code>index.html</code> or your template files).
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  3
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Paste the following code just before the closing <code>&lt;/body&gt;</code> tag:
                  </p>
                  <div className="mt-2 p-4 bg-gray-100 rounded font-mono text-sm overflow-x-auto">
                    <pre>{getCode()}</pre>
                  </div>
                  <button 
                    onClick={handleCopyCode}
                    className="mt-2 flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  4
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Save the file(s) and upload them back to your server if necessary.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  5
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">
                    Visit your website to verify that the chat widget appears.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetInstallGuide;