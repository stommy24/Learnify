import React from 'react';
import { Avatar } from '@/components/ui';
import type { Message } from '@/types/communication';

interface MessageThreadProps {
  messages: Message[];
  onReply?: (message: Message) => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ messages, onReply }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-4">
          <Avatar
            src={message.user.avatar}
            alt={message.user.name}
            fallback={message.user.name[0]}
          />
          <div>
            <p className="font-medium">{message.user.name}</p>
            <p className="text-gray-600">{message.content}</p>
            {onReply && (
              <button
                onClick={() => onReply(message)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};