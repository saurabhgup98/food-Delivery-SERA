import { ApiClient } from './base/apiClient';
import { 
  ContactFormData, 
  ContactSubmissionsResponse 
} from '../types/common.types';

export class ContactService extends ApiClient {
  // Contact form methods
  async submitContactForm(contactData: ContactFormData): Promise<{ success: boolean; message: string; data: { submission: any } }> {
    return this.makeRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  async getContactSubmissions(params?: {
    status?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
  }): Promise<ContactSubmissionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/contact/submissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<ContactSubmissionsResponse>(endpoint);
  }
}

export const contactService = new ContactService();
