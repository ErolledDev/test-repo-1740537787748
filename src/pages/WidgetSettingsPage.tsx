import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import WidgetPreview from '../components/widget/WidgetPreview';
import { getWidgetSettings, updateWidgetSettings, getKeywordResponses } from '../lib/api';
import { getCurrentUser } from '../lib/supabase';
import { WidgetSettings, KeywordResponse } from '../types';
import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw } from 'lucide-react';

const WidgetSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<WidgetSettings>({
    id: '',
    user_id: '',
    business_name: 'My Business',
    primary_color: '#4F46E5',
    secondary_color: '#EEF2FF',
    position: 'bottom-right',
    icon: 'message-circle',
    welcome_message: 'Hello! How can I help you today?',
    is_active: true,
    auto_open: false,
    open_delay: 3,
    hide_on_mobile: false,
    created_at: '',
    updated_at: ''
  });
  
  const [keywordResponses, setKeywordResponses] = useState<KeywordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUserName(user.email?.split('@')[0] || 'User');
        
        const widgetSettings = await getWidgetSettings(user.id);
        const responses = await getKeywordResponses(user.id);
        
        if (widgetSettings) {
          setSettings(widgetSettings);
        } else {
          // If no settings exist, we'll use the defaults
          setSettings(prev => ({
            ...prev,
            user_id: user.id
          }));
        }
        
        if (responses) {
          setKeywordResponses(responses);
        }
      } catch (error) {
        console.error('Error fetching widget settings:', error);
        setError('Failed to load widget settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'open_delay') {
      setSettings(prev => ({
        ...prev,
        [name]: parseInt(value) || 3
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear any previous success/error messages
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedSettings = await updateWidgetSettings(settings);
      
      if (updatedSettings) {
        setSettings(updatedSettings);
        setSuccess('Widget settings saved successfully!');
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving widget settings:', error);
      setError('Failed to save widget settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Widget Settings" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Widget Settings" userName={userName}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Customize Your Chat Widget</h2>
          <p className="text-gray-600">
            Personalize how your chat widget appears and functions on your website.
          </p>
        </div>
        
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-md">
            {success}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Settings Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-900">Business Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="business_name"
                      name="business_name"
                      value={settings.business_name}
                      onChange={handleChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="welcome_message" className="block text-sm font-medium text-gray-700">
                      Welcome Message
                    </label>
                    <textarea
                      id="welcome_message"
                      name="welcome_message"
                      rows={3}
                      value={settings.welcome_message}
                      onChange={handleChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Appearance */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-900">Appearance</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700">
                      Primary Color
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        type="color"
                        id="primary_color"
                        name="primary_color"
                        value={settings.primary_color}
                        onChange={handleChange}
                        className="w-10 h-10 p-0 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={settings.primary_color}
                        onChange={handleChange}
                        name="primary_color"
                        className="block w-full ml-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Used for the widget button, header, and bot messages.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700">
                      Secondary Color
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        type="color"
                        id="secondary_color"
                        name="secondary_color"
                        value={settings.secondary_color}
                        onChange={handleChange}
                        className="w-10 h-10 p-0 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={settings.secondary_color}
                        onChange={handleChange}
                        name="secondary_color"
                        className="block w-full ml-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Used for user message bubbles and accents.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Widget Position
                    </label>
                    <select
                      id="position"
                      name="position"
                      value={settings.position}
                      onChange={handleChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Advanced Settings */}
              <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Advanced Settings</h3>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {showAdvanced ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showAdvanced && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="auto_open"
                        name="auto_open"
                        checked={settings.auto_open}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="auto_open" className="block ml-2 text-sm font-medium text-gray-700">
                        Auto-open chat widget
                      </label>
                    </div>
                    
                    {settings.auto_open && (
                      <div>
                        <label htmlFor="open_delay" className="block text-sm font-medium text-gray-700">
                          Open Delay (seconds)
                        </label>
                        <input
                          type="number"
                          id="open_delay"
                          name="open_delay"
                          min="0"
                          max="60"
                          value={settings.open_delay}
                          onChange={handleChange}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hide_on_mobile"
                        name="hide_on_mobile"
                        checked={settings.hide_on_mobile}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="hide_on_mobile" className="block ml-2 text-sm font-medium text-gray-700">
                        Hide on mobile devices
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Status */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-900">Widget Status</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={settings.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_active" className="block ml-2 text-sm font-medium text-gray-700">
                    Enable Chat Widget
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  When disabled, the chat widget will not appear on your website.
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Widget Preview */}
          <div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Live Preview</h3>
              <p className="mb-4 text-sm text-gray-600">
                This is how your chat widget will appear on your website.
              </p>
              
              <WidgetPreview settings={settings} keywordResponses={keywordResponses} />
            </div>
            
            <div className="p-6 mt-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Integration Code</h3>
              <p className="mb-4 text-sm text-gray-600">
                Add this code to your website to display the chat widget:
              </p>
              
              <div className="p-4 overflow-x-auto font-mono text-sm bg-gray-100 rounded">
                <pre>{`<script src="https://widgeto.netlify.app/widget.js"></script>
<script>
  new BusinessChatPlugin({
    uid: '${settings.user_id}'
  });
</script>`}</pre>
              </div>
              
              <button 
                className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<script src="https://widgeto.netlify.app/widget.js"></script>\n<script>\n  new BusinessChatPlugin({\n    uid: '${settings.user_id}'\n  });\n</script>`
                  );
                  setSuccess('Integration code copied to clipboard!');
                  setTimeout(() => setSuccess(null), 3000);
                }}
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WidgetSettingsPage;