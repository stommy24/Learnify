import { api } from '../interceptors';
import { API_ENDPOINTS } from '../endpoints';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  sentAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

class CommunicationService {
  async getMessages(): Promise<Message[]> {
    const response = await api.get(API_ENDPOINTS.COMMUNICATION.MESSAGES);
    return response.data;
  }

  async sendMessage(recipientId: string, content: string): Promise<Message> {
    const response = await api.post(API_ENDPOINTS.COMMUNICATION.MESSAGES, { recipientId, content });
    return response.data;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    const response = await api.get(API_ENDPOINTS.COMMUNICATION.ANNOUNCEMENTS);
    return response.data;
  }

  async createAnnouncement(title: string, content: string): Promise<Announcement> {
    const response = await api.post(API_ENDPOINTS.COMMUNICATION.ANNOUNCEMENTS, { title, content });
    return response.data;
  }

  async getNotifications(): Promise<Notification[]> {
    const response = await api.get(API_ENDPOINTS.COMMUNICATION.NOTIFICATIONS);
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await api.patch(`${API_ENDPOINTS.COMMUNICATION.NOTIFICATIONS}/${notificationId}`, { read: true });
  }
}

export const communicationService = new CommunicationService(); 