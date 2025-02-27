import React from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { WidgetSettings } from '../../types';

interface WidgetPreviewProps {
  settings: WidgetSettings;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Array<{
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>>([
    {
      id: '1',
      content: settings.welcome_message || 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        content: 'This is a preview of how your chat widget will respond to user messages.',
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getPositionClasses = () => {
    switch (settings.position) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className="relative w-full h-[500px] border border-gray-200 rounded-lg bg-gray-100 overflow-hidden">
      {/* Widget Button */}
      <div className={`absolute ${getPositionClasses()}`}>
        <button
          onClick={toggleChat}
          style={{ backgroundColor: settings.primary_color || '#4F46E5' }}
          className="flex items-center justify-center w-14 h-14 text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          {!isOpen ? (
            <MessageCircle className="w-6 h-6" />
          ) : (
            <X className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`absolute ${getPositionClasses()} mb-16 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col`}>
          {/* Header */}
          <div 
            style={{ backgroundColor: settings.primary_color || '#4F46E5' }}
            className="flex items-center justify-between px-4 py-3 text-white"
          >
            <h3 className="font-medium">{settings.business_name || 'Business Chat'}</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 max-w-[80%] ${
                  msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? `bg-${settings.secondary_color || 'indigo'}-100 text-gray-800`
                      : `bg-${settings.primary_color || 'indigo'}-600 text-white`
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' 
                      ? settings.secondary_color || '#EEF2FF' 
                      : settings.primary_color || '#4F46E5',
                    color: msg.sender === 'user' ? '#1F2937' : '#FFFFFF'
                  }}
                >
                  {msg.content}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                style={{ backgroundColor: settings.primary_color || '#4F46E5' }}
                className="px-4 py-2 text-white rounded-r-md hover:opacity-90"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WidgetPreview;