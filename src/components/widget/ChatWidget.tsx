import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Paperclip, Smile, User } from 'lucide-react';
import { WidgetSettings } from '../../types';

interface ChatWidgetProps {
  settings: WidgetSettings;
  userId: string;
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
  initialMessages?: Array<{
    id: string;
    content: string;
    sender: 'user' | 'bot' | 'agent';
    timestamp: Date;
  }>;
  isDemo?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  settings, 
  userId, 
  onSendMessage, 
  onClose,
  initialMessages = [],
  isDemo = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: 'user' | 'bot' | 'agent';
    timestamp: Date;
  }>>(initialMessages.length > 0 ? initialMessages : [
    {
      id: '1',
      content: settings.welcome_message || 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (onClose && !isOpen === false) {
      onClose();
    }
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
    
    if (onSendMessage) {
      onSendMessage(message);
    }
    
    if (isDemo) {
      // Simulate bot response in demo mode
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          content: 'This is a preview of how your chat widget will respond to user messages.',
          sender: 'bot' as const,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
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

  // Convert hex color to RGB for opacity support
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };

  // Get primary color with opacity
  const getPrimaryColorWithOpacity = (opacity: number) => {
    const rgb = hexToRgb(settings.primary_color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  };

  return (
    <div className="relative">
      {/* Widget Button */}
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <button
          onClick={toggleChat}
          style={{ backgroundColor: settings.primary_color || '#4F46E5' }}
          className="flex items-center justify-center w-14 h-14 text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
          aria-label={isOpen ? "Close chat" : "Open chat"}
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
        <div 
          className={`fixed ${getPositionClasses()} mb-16 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col z-50`}
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* Header */}
          <div 
            style={{ backgroundColor: settings.primary_color || '#4F46E5' }}
            className="flex items-center justify-between px-4 py-3 text-white"
          >
            <h3 className="font-medium">{settings.business_name || 'Business Chat'}</h3>
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
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
                      : msg.sender === 'agent'
                      ? `bg-green-600 text-white`
                      : `bg-${settings.primary_color || 'indigo'}-600 text-white`
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' 
                      ? settings.secondary_color || '#EEF2FF' 
                      : msg.sender === 'agent'
                      ? '#16a34a'
                      : settings.primary_color || '#4F46E5',
                    color: msg.sender === 'user' ? '#1F2937' : '#FFFFFF'
                  }}
                >
                  {msg.sender === 'agent' && (
                    <div className="flex items-center mb-1 text-xs font-medium">
                      <User className="w-3 h-3 mr-1" />
                      <span>Agent</span>
                    </div>
                  )}
                  {msg.content}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-3 max-w-[80%] mr-auto">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: settings.primary_color || '#4F46E5',
                    color: '#FFFFFF'
                  }}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between mt-2 text-gray-400">
              <button 
                type="button" 
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Insert emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;