/**
 * Chat Widget Plugin
 * Version: 1.0.0
 */
(function() {
  class BusinessChatPlugin {
    constructor(options) {
      this.options = {
        uid: null,
        position: 'bottom-right',
        autoOpen: false,
        openDelay: 3,
        hideOnMobile: false,
        ...options
      };
      
      if (!this.options.uid) {
        console.error('Chat Widget: User ID is required');
        return;
      }
      
      this.initialized = false;
      this.widgetElement = null;
      this.isOpen = false;
      this.messages = [];
      this.settings = {
        business_name: 'Business Chat',
        primary_color: '#4F46E5',
        secondary_color: '#EEF2FF',
        welcome_message: 'Hello! How can I help you today?'
      };
      
      // Check if we should hide on mobile
      if (this.options.hideOnMobile && window.innerWidth < 768) {
        return;
      }
      
      this.init();
    }
    
    async init() {
      try {
        // Fetch widget settings from API
        await this.fetchSettings();
        
        // Create visitor ID or get from storage
        this.visitorId = this.getVisitorId();
        
        // Create widget DOM elements
        this.createWidgetElements();
        
        // Add event listeners
        this.addEventListeners();
        
        // Auto open if enabled
        if (this.options.autoOpen) {
          setTimeout(() => {
            this.openWidget();
          }, this.options.openDelay * 1000);
        }
        
        this.initialized = true;
      } catch (error) {
        console.error('Chat Widget: Initialization failed', error);
      }
    }
    
    async fetchSettings() {
      try {
        // In a real implementation, this would fetch from your API
        // For demo purposes, we'll use the default settings
        // const response = await fetch(`https://api.example.com/widget/${this.options.uid}`);
        // this.settings = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Chat Widget: Failed to fetch settings', error);
      }
    }
    
    getVisitorId() {
      let visitorId = localStorage.getItem('chat_widget_visitor_id');
      
      if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('chat_widget_visitor_id', visitorId);
      }
      
      return visitorId;
    }
    
    createWidgetElements() {
      // Create main container
      this.widgetElement = document.createElement('div');
      this.widgetElement.className = 'chat-widget-container';
      this.widgetElement.style.cssText = `
        position: fixed;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      `;
      
      // Set position
      switch (this.options.position) {
        case 'bottom-right':
          this.widgetElement.style.bottom = '20px';
          this.widgetElement.style.right = '20px';
          break;
        case 'bottom-left':
          this.widgetElement.style.bottom = '20px';
          this.widgetElement.style.left = '20px';
          break;
        case 'top-right':
          this.widgetElement.style.top = '20px';
          this.widgetElement.style.right = '20px';
          break;
        case 'top-left':
          this.widgetElement.style.top = '20px';
          this.widgetElement.style.left = '20px';
          break;
      }
      
      // Create toggle button
      this.toggleButton = document.createElement('button');
      this.toggleButton.className = 'chat-widget-toggle';
      this.toggleButton.style.cssText = `
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: ${this.settings.primary_color};
        color: white;
        border: none;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
      `;
      
      // Create toggle icon
      this.toggleIcon = document.createElement('div');
      this.toggleIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      `;
      this.toggleButton.appendChild(this.toggleIcon);
      
      // Create chat window (hidden initially)
      this.chatWindow = document.createElement('div');
      this.chatWindow.className = 'chat-widget-window';
      this.chatWindow.style.cssText = `
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 320px;
        height: 400px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
      `;
      
      // Create chat header
      this.chatHeader = document.createElement('div');
      this.chatHeader.className = 'chat-widget-header';
      this.chatHeader.style.cssText = `
        background-color: ${this.settings.primary_color};
        color: white;
        padding: 12px 16px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      this.chatHeader.textContent = this.settings.business_name;
      
      // Create close button for chat window
      this.closeButton = document.createElement('button');
      this.closeButton.className = 'chat-widget-close';
      this.closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
      `;
      this.closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      this.chatHeader.appendChild(this.closeButton);
      
      // Create messages container
      this.messagesContainer = document.createElement('div');
      this.messagesContainer.className = 'chat-widget-messages';
      this.messagesContainer.style.cssText = `
        flex: 1;
        padding: 16px;
        overflow-y: auto;
      `;
      
      // Add welcome message
      this.addMessage({
        content: this.settings.welcome_message,
        sender: 'bot'
      });
      
      // Create input area
      this.inputArea = document.createElement('div');
      this.inputArea.className = 'chat-widget-input';
      this.inputArea.style.cssText = `
        padding: 12px;
        border-top: 1px solid #e5e7eb;
        display: flex;
      `;
      
      // Create message input
      this.messageInput = document.createElement('input');
      this.messageInput.className = 'chat-widget-message-input';
      this.messageInput.type = 'text';
      this.messageInput.placeholder = 'Type your message...';
      this.messageInput.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px 0 0 4px;
        outline: none;
      `;
      
      // Create send button
      this.sendButton = document.createElement('button');
      this.sendButton.className = 'chat-widget-send';
      this.sendButton.style.cssText = `
        background-color: ${this.settings.primary_color};
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        padding: 0 12px;
        cursor: pointer;
      `;
      this.sendButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;
      
      // Assemble input area
      this.inputArea.appendChild(this.messageInput);
      this.inputArea.appendChild(this.sendButton);
      
      // Assemble chat window
      this.chatWindow.appendChild(this.chatHeader);
      this.chatWindow.appendChild(this.messagesContainer);
      this.chatWindow.appendChild(this.inputArea);
      
      // Assemble widget
      this.widgetElement.appendChild(this.toggleButton);
      this.widgetElement.appendChild(this.chatWindow);
      
      // Add to document
      document.body.appendChild(this.widgetElement);
    }
    
    addEventListeners() {
      // Toggle chat window
      this.toggleButton.addEventListener('click', () => {
        this.toggleWidget();
      });
      
      // Close chat window
      this.closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWidget();
      });
      
      // Send message
      this.sendButton.addEventListener('click', () => {
        this.sendMessage();
      });
      
      // Send message on Enter key
      this.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
    
    toggleWidget() {
      if (this.isOpen) {
        this.closeWidget();
      } else {
        this.openWidget();
      }
    }
    
    openWidget() {
      this.chatWindow.style.display = 'flex';
      this.toggleIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      this.isOpen = true;
      this.messageInput.focus();
    }
    
    closeWidget() {
      this.chatWindow.style.display = 'none';
      this.toggleIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      `;
      this.isOpen = false;
    }
    
    sendMessage() {
      const message = this.messageInput.value.trim();
      
      if (!message) return;
      
      // Add user message to chat
      this.addMessage({
        content: message,
        sender: 'user'
      });
      
      // Clear input
      this.messageInput.value = '';
      
      // Send to server (in a real implementation)
      this.processMessage(message);
    }
    
    addMessage(message) {
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `chat-widget-message chat-widget-message-${message.sender}`;
      messageElement.style.cssText = `
        margin-bottom: 12px;
        max-width: 80%;
        ${message.sender === 'user' ? 'margin-left: auto;' : 'margin-right: auto;'}
      `;
      
      // Create message bubble
      const bubble = document.createElement('div');
      bubble.className = `chat-widget-bubble chat-widget-bubble-${message.sender}`;
      bubble.style.cssText = `
        padding: 8px 12px;
        border-radius: 12px;
        ${message.sender === 'user' 
          ? `background-color: ${this.settings.secondary_color}; color: #1F2937;` 
          : `background-color: ${this.settings.primary_color}; color: white;`}
      `;
      bubble.textContent = message.content;
      
      // Create timestamp
      const timestamp = document.createElement('div');
      timestamp.className = 'chat-widget-timestamp';
      timestamp.style.cssText = `
        font-size: 10px;
        margin-top: 4px;
        color: #6B7280;
        ${message.sender === 'user' ? 'text-align: right;' : 'text-align: left;'}
      `;
      timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Assemble message
      messageElement.appendChild(bubble);
      messageElement.appendChild(timestamp);
      
      // Add to messages container
      this.messagesContainer.appendChild(messageElement);
      
      // Scroll to bottom
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      
      // Store message
      this.messages.push({
        ...message,
        timestamp: new Date()
      });
    }
    
    async processMessage(message) {
      // Show typing indicator
      this.showTypingIndicator();
      
      try {
        // In a real implementation, this would send the message to your API
        // const response = await fetch(`https://api.example.com/chat/${this.options.uid}`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     message,
        //     visitorId: this.visitorId
        //   })
        // });
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Add bot response
        this.addMessage({
          content: "Thanks for your message! This is a demo response. In a real implementation, this would be handled by your backend.",
          sender: 'bot'
        });
      } catch (error) {
        console.error('Chat Widget: Failed to process message', error);
        
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Add error message
        this.addMessage({
          content: "Sorry, there was an error processing your message. Please try again later.",
          sender: 'bot'
        });
      }
    }
    
    showTypingIndicator() {
      // Create typing indicator
      this.typingIndicator = document.createElement('div');
      this.typingIndicator.className = 'chat-widget-typing';
      this.typingIndicator.style.cssText = `
        margin-bottom: 12px;
        max-width: 80%;
      `;
      
      // Create typing bubble
      const bubble = document.createElement('div');
      bubble.className = 'chat-widget-bubble chat-widget-bubble-typing';
      bubble.style.cssText = `
        padding: 12px;
        border-radius: 12px;
        background-color: ${this.settings.primary_color};
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      // Create dots
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          margin: 0 2px;
          opacity: 0.6;
          animation: chat-widget-typing 1s infinite ${i * 0.2}s;
        `;
        bubble.appendChild(dot);
      }
      
      // Add animation style
      if (!document.getElementById('chat-widget-style')) {
        const style = document.createElement('style');
        style.id = 'chat-widget-style';
        style.textContent = `
          @keyframes chat-widget-typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Assemble typing indicator
      this.typingIndicator.appendChild(bubble);
      
      // Add to messages container
      this.messagesContainer.appendChild(this.typingIndicator);
      
      // Scroll to bottom
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
      if (this.typingIndicator) {
        this.messagesContainer.removeChild(this.typingIndicator);
        this.typingIndicator = null;
      }
    }
  }
  
  // Expose to window
  window.BusinessChatPlugin = BusinessChatPlugin;
})();