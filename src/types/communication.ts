export interface Message {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
}

export interface CommunicationState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
} 