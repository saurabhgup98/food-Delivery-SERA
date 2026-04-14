import { ApiClient } from './base/apiClient';
import { API_CONFIG } from '../config/environment';
import { userStorage } from '../contexts/auth/authStorage';

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
    const currentUser = userStorage.getUser();
    if (!currentUser?.email) {
      throw new Error('User email not found. Please login again.');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/api/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: currentUser.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || data?.message || 'Failed to change password');
    }

    return {
      success: data.success,
      message: data.message || 'Password changed successfully',
    };
  }
}

export const userService = new UserService();
