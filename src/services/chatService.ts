import { ApiClient } from './base/apiClient';
import { ChatResponse } from '../types/common.types';

export class ChatService extends ApiClient {
  // Chat methods
  async sendChatMessage(message: string, userContext: any): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userContext })
    });
  }
}

export const chatService = new ChatService();
