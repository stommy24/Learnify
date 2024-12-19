import { useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
}

export function useCommunication() {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      user: {
        id: '1',
        name: 'Current User',
        avatar: '/avatars/default.png'
      },
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  return {
    messages,
    sendMessage
  };
} 