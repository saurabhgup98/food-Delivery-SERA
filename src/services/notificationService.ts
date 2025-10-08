import { ApiClient } from './base/apiClient';
import { 
  NotificationsResponse, 
  CreateNotificationRequest 
} from '../types/common.types';

export class NotificationService extends ApiClient {
  // Notification methods
  async getNotifications(userId: string): Promise<NotificationsResponse> {
    return this.makeRequest<NotificationsResponse>(`/notifications?userId=${userId}`);
  }

  async createNotification(notificationData: CreateNotificationRequest): Promise<{ success: boolean; message: string; data: { notification: any } }> {
    return this.makeRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  async updateNotification(notificationId: string, updateData: {
    isRead?: boolean;
  }): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/notifications/${notificationId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }
}

export const notificationService = new NotificationService();
