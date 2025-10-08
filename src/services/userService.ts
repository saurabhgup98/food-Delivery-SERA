import { ApiClient } from './base/apiClient';

export class UserService extends ApiClient {
  // Complete user profile
  async completeProfile(profileData: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    preferences?: {
      dietary?: string[];
      allergies?: string[];
      favoriteCuisines?: string[];
      spiceLevel?: 'mild' | 'medium' | 'hot';
    };
  }): Promise<{ success: boolean; message: string; data: { user: any } }> {
    return this.makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Change password
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
  }
}

export const userService = new UserService();
