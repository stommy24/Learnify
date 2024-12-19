export interface Notification {
  id: string;
  userId: string;
  type: 'assessment' | 'feedback' | 'reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    assessment: boolean;
    feedback: boolean;
    reminder: boolean;
    system: boolean;
  };
} 