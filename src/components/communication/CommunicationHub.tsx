import React from 'react';
import { Avatar } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { useCommunication } from '@/hooks/useCommunication';
import type { Message } from '@/types/communication';

export const CommunicationHub: React.FC = () => {
  const { messages, sendMessage } = useCommunication();

  return (
    <div className="space-y-4">
      <div className="messages-container">
        {messages.map((message: Message) => (
          <div key={message.id} className="flex items-start space-x-4 p-4">
            <Avatar 
              src={message.user.avatar}
              alt={message.user.name}
              fallback={message.user.name[0]}
            />
            <div>
              <p className="font-medium">{message.user.name}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <Textarea
        placeholder="Type your message..."
        onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage((e.target as HTMLTextAreaElement).value);
            (e.target as HTMLTextAreaElement).value = '';
          }
        }}
      />
    </div>
  );
}; 
