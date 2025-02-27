import { io, Socket } from 'socket.io-client';
import { Message, ChatSession } from '../types';

// The base URL for the Socket.io server
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const initializeSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        userId
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Log connection events
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Chat-related socket events
export const subscribeToNewMessages = (chatSessionId: string, callback: (message: Message) => void): void => {
  if (!socket) return;
  
  socket.on(`message:${chatSessionId}`, callback);
};

export const unsubscribeFromNewMessages = (chatSessionId: string): void => {
  if (!socket) return;
  
  socket.off(`message:${chatSessionId}`);
};

export const subscribeToNewChats = (callback: (chatSession: ChatSession) => void): void => {
  if (!socket) return;
  
  socket.on('new_chat', callback);
};

export const unsubscribeFromNewChats = (): void => {
  if (!socket) return;
  
  socket.off('new_chat');
};

export const sendMessage = (message: Omit<Message, 'id' | 'created_at'>): void => {
  if (!socket) return;
  
  socket.emit('send_message', message);
};

export const joinChatRoom = (chatSessionId: string): void => {
  if (!socket) return;
  
  socket.emit('join_room', { chatSessionId });
};

export const leaveChatRoom = (chatSessionId: string): void => {
  if (!socket) return;
  
  socket.emit('leave_room', { chatSessionId });
};

export default {
  initializeSocket,
  disconnectSocket,
  subscribeToNewMessages,
  unsubscribeFromNewMessages,
  subscribeToNewChats,
  unsubscribeFromNewChats,
  sendMessage,
  joinChatRoom,
  leaveChatRoom
};